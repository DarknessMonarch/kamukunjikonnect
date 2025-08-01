"use client";

import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  const { verifyEmail, resendVerificationCode, email, emailVerified, isAuth } = useAuthStore();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!isAuth) {
      router.push("/authentication/login", { scroll: false });
      return;
    }
    
    if (emailVerified) {
      router.push("/", { scroll: false });
    }
  }, [isAuth, emailVerified, router]);

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
    return /^\d{6}$/.test(code);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
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

    if (!verificationCode.trim()) {
      toast.error("Verification code is required");
      return;
    }

    if (!validateVerificationCode(verificationCode)) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }

    if (attempts >= 5) {
      toast.error("Too many failed attempts. Please request a new code.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyEmail(email, verificationCode);

      if (result.success) {
        toast.success(result.message || "Email verified successfully!");
      } else {
        setAttempts(prev => prev + 1);
        toast.error(result.message || "Invalid verification code. Please try again.");
        setVerificationCode("");
        inputRef.current?.focus();
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
    if (resendTimer > 0) {
      toast.error(`Please wait ${resendTimer} seconds before resending.`);
      return;
    }

    setIsResending(true);
    setAttempts(0);

    try {
      const result = await resendVerificationCode(email);

      if (result.success) {
        toast.success(result.message || "Verification code sent successfully!");
        setResendTimer(60);
        setVerificationCode("");
        inputRef.current?.focus();
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

  const maskEmail = (email) => {
    if (!email) return 'your email';
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return email;
    return `${localPart.slice(0, 2)}***@${domain}`;
  };

  // Don't render if not authenticated
  if (!isAuth || emailVerified) {
    return (
      <div className={styles.authWrapper}>
        <div className={styles.formContainer}>
          <Loader />
        </div>
      </div>
    );
  }

  const isFormValid = validateVerificationCode(verificationCode) && attempts < 5;

  return (
    <div className={styles.authWrapper}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h1>Verify your account</h1>
          <p>
            We&apos;ve sent a 6-digit verification code to{" "}
            <strong>{maskEmail(email)}</strong>
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
            width={20}
            height={20}
          />
          <input
            ref={inputRef}
            type="text"
            name="verificationCode"
            id="verificationCode"
            placeholder="Enter 6-digit code"
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

        <div className={styles.authBottomBtn}>
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`${styles.formAuthButton} ${
              isLoading || !isFormValid ? styles.disabled : ""
            }`}
          >
            {isLoading ? <Loader /> : "Verify Account"}
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending || resendTimer > 0}
            className={`${styles.resendButton} ${
              isResending || resendTimer > 0 ? styles.disabled : ""
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

        <div className={styles.helpText}>
          <small>
            Didn&apos;t receive the code? Check your spam folder or try resending.
          </small>
        </div>
      </form>
    </div>
  );
}