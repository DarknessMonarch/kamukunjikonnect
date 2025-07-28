"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/style/auth.module.css";

import { MdOutlineEmail as EmailIcon } from "react-icons/md";

export default function ResetCode() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  
  // Using the store function - already correctly integrated
  const requestPasswordReset = useAuthStore(
    (state) => state.requestPasswordReset
  );

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!validateEmail(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await requestPasswordReset(email.trim());

      if (result.success) {
        toast.success(result.message || "Password reset link sent successfully!");
        // Optionally redirect to a confirmation page or login
        // router.push("/auth/reset-confirmation");
      } else {
        toast.error(result.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("An error occurred while requesting password reset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/auth/login"); // Added /auth/ prefix for better routing
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h1>Forgot Password</h1>
          <p>Enter your email to receive the reset link</p>
        </div>

        <div className={styles.authInput}>
          <EmailIcon
            className={styles.authIcon}
            alt="Email icon"
            width={20}
            height={20}
          />
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your email address"
            disabled={isLoading}
            autoComplete="email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !email.trim()}
          className={`${styles.formAuthButton} ${
            isLoading || !email.trim() ? styles.disabled : ""
          }`}
        >
          {isLoading ? <Loader /> : "Send Reset Link"}
        </button>
        
        <h3>
          Remember your password?{" "}
          <span 
            className={styles.btnLoginContainer} 
            onClick={handleLogin}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleLogin();
              }
            }}
          >
            Login
          </span>
        </h3>
      </form>
    </div>
  );
}