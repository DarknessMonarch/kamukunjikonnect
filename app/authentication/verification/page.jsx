"use client";

import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/style/auth.module.css";
import { BsQrCode as VerificationIcon } from "react-icons/bs";

export default function Verification() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Using the store functions - already correctly integrated
  const { verifyEmail, resendVerificationCode, email: storeEmail, isAuth } = useAuthStore();
  
  // Get email from URL params or store
  const email = searchParams.get('email') || storeEmail;

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuth) {
      router.push("/", { scroll: false });
    }
  }, [isAuth, router]);

  // Redirect if no email available
  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please register again.");
      router.push("/auth/signup", { scroll: false });
    }
  }, [email, router]);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validateVerificationCode = (code) => {
    // Check if code is exactly 6 digits
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading && validateVerificationCode(verificationCode)) {
      handleSubmit(e);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setVerificationCode(pastedText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please register again.");
      router.push("/auth/signup", { scroll: false });
      return;
    }

    if (!verificationCode.trim()) {
      toast.error("Verification code is required");
      return;
    }

    if (!validateVerificationCode(verificationCode)) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }

    // Limit attempts to prevent abuse
    if (attempts >= 5) {
      toast.error("Too many failed attempts. Please request a new code.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyEmail(email, verificationCode);

      if (result.success) {
        toast.success(result.message || "Email verified successfully!");
        setVerificationCode(""); // Clear the code
        
        // Delay redirect to show success message
        setTimeout(() => {
          router.push("/", { scroll: false });
        }, 1500);
      } else {
        setAttempts(prev => prev + 1);
        toast.error(result.message || "Invalid verification code. Please try again.");
        
        // Clear code on error for better UX
        setVerificationCode("");
        
        // Refocus input
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      setAttempts(prev => prev + 1);
      toast.error("Verification failed. Please try again.");
      setVerificationCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email not found. Please register again.");
      router.push("/auth/signup", { scroll: false });
      return;
    }

    if (resendTimer > 0) {
      toast.error(`Please wait ${resendTimer} seconds before resending.`);
      return;
    }

    setIsResending(true);
    setAttempts(0); // Reset attempts on resend

    try {
      const result = await resendVerificationCode(email);

      if (result.success) {
        toast.success(result.message || "Verification code sent successfully!");
        setResendTimer(60); // 60 second cooldown
        setVerificationCode(""); // Clear current code
        
        // Refocus input
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else {
        toast.error(result.message || "Failed to resend verification code");
      }
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Failed to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    router.push("/auth/signup", { scroll: false });
  };

  const isFormValid = () => {
    return validateVerificationCode(verificationCode) && email && attempts < 5;
  };

  const getPlaceholderText = () => {
    return verificationCode.length === 0 ? "Enter 6-digit code" : "● ".repeat(verificationCode.length) + "○ ".repeat(6 - verificationCode.length);
  };

  return (
    <div className={styles.authWrapper}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h1>Verify your account</h1>
          <p>
            We&apos;ve sent a 6-digit verification code to{" "}
            <strong>{email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 'your email'}</strong>
          </p>
          {attempts > 0 && attempts < 5 && (
            <small style={{ color: 'orange' }}>
              {5 - attempts} attempts remaining
            </small>
          )}
          {attempts >= 5 && (
            <small style={{ color: 'red' }}>
              Too many failed attempts. Please request a new code.
            </small>
          )}
        </div>

        <div className={styles.authInput}>
          <VerificationIcon
            className={styles.authIcon}
            alt="Verification code icon"
            width={20}
            height={20}
          />
          <input
            ref={inputRef}
            type="text"
            name="verificationCode"
            id="verificationCode"
            placeholder={getPlaceholderText()}
            value={verificationCode}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onPaste={handlePaste}
            maxLength={6}
            disabled={isLoading || attempts >= 5}
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="\d{6}"
            title="Enter the 6-digit verification code"
            style={{
              letterSpacing: verificationCode.length > 0 ? '0.5em' : 'normal',
              textAlign: verificationCode.length > 0 ? 'center' : 'left',
              fontSize: verificationCode.length > 0 ? '1.2em' : '1em',
              fontWeight: verificationCode.length > 0 ? 'bold' : 'normal'
            }}
            required
          />
        </div>

        {/* Code length indicator */}
        <div className={styles.codeIndicator}>
          {Array.from({ length: 6 }, (_, index) => (
            <div 
              key={index}
              className={`${styles.codeBox} ${
                index < verificationCode.length ? styles.filled : ''
              }`}
            >
              {verificationCode[index] || ''}
            </div>
          ))}
        </div>

        <div className={styles.authBottomBtn}>
          <button
            type="submit"
            disabled={isLoading || !isFormValid()}
            className={`${styles.formAuthButton} ${
              isLoading || !isFormValid() ? styles.disabled : ""
            }`}
          >
            {isLoading ? <Loader /> : "Verify Account"}
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending || !email || resendTimer > 0}
            className={`${styles.resendButton} ${
              isResending || !email || resendTimer > 0 ? styles.disabled : ""
            }`}
          >
            {isResending ? (
              <>
                <Loader /> Sending...
              </>
            ) : resendTimer > 0 ? (
              `Resend code in ${resendTimer}s`
            ) : (
              "Resend verification code"
            )}
          </button>
        </div>

        {/* Additional options */}
        <div className={styles.verificationOptions}>
          <p>
            Wrong email address?{" "}
            <span 
              className={styles.btnLoginContainer}
              onClick={handleChangeEmail}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleChangeEmail();
                }
              }}
            >
              Change email
            </span>
          </p>
        </div>

        {/* Help text */}
        <div className={styles.helpText}>
          <small>
            Didn&apos;t receive the code? Check your spam folder or try resending.
          </small>
        </div>
      </form>
    </div>
  );
}