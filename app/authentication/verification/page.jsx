"use client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
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
  const router = useRouter();
  const { verifyEmail, resendVerificationCode, email } = useAuthStore();

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyEmail(email, verificationCode);

      if (result.success) {
        toast.success(result.message);
        router.push("/", { scroll: false });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email not found. Please register again.");
      return;
    }

    if (resendTimer > 0) {
      toast.error(`Please wait ${resendTimer} seconds before resending.`);
      return;
    }

    setIsResending(true);

    try {
      const result = await resendVerificationCode(email);

      if (result.success) {
        toast.success(result.message);
        setResendTimer(60); // 60 second cooldown
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h1>Verify your account</h1>
          <p>Check your email for verification code</p>
        </div>

        <div className={styles.authInput}>
          <VerificationIcon
            className={styles.authIcon}
            alt="Verification code icon"
            width={20}
            height={20}
          />
          <input
            type="text"
            name="verificationCode"
            id="verificationCode"
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.trim())}
            maxLength={6}
            required
            pattern=".{6,6}"
            title="Verification code must be exactly 6 characters long"
          />
        </div>

        <div className={styles.authBottomBtn}>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.formAuthButton}
          >
            {isLoading ? <Loader /> : "Verify your account"}
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending || !email || resendTimer > 0}
            className={styles.resendButton}
          >
            {isResending ? (
              <Loader />
            ) : resendTimer > 0 ? (
              `Resend code in ${resendTimer}s`
            ) : (
              "Resend verification code"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
