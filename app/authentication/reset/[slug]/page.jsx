"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/Auth";
import Loader from "@/app/components/Loader";
import styles from "@/app/style/auth.module.css";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";

import { MdOutlineVpnKey as PasswordIcon } from "react-icons/md";

export default function Reset({ params }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  
  // Using the store function - already correctly integrated
  const { resetPassword } = useAuthStore();

  const validatePassword = (password) => {
    // Basic password validation - adjust requirements as needed
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = () => {
    router.push("/authentication/login", { scroll: false });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      onSubmit(e);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.password.trim()) {
      return toast.error("Password is required");
    }

    if (!formData.confirmPassword.trim()) {
      return toast.error("Please confirm your password");
    }

    // Password strength validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      return toast.error(passwordError);
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (!params?.slug) {
      return toast.error("Reset token is missing or invalid");
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(params.slug, formData.password);

      if (result.success) {
        toast.success(result.message || "Password reset successful! You can now login with your new password.");
        // Clear form data
        setFormData({ password: "", confirmPassword: "" });
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/authentication/login", { scroll: false });
        }, 1500);
      } else {
        toast.error(result.message || "Password reset failed. Please try again or request a new reset link.");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("An error occurred while resetting your password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      formData.password === formData.confirmPassword &&
      formData.password.length >= 8
    );
  };

  return (
    <div className={styles.authWrapper}>
      <form onSubmit={onSubmit} className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h1>Reset Password</h1>
          <p>Enter your new password</p>
        </div>

        <div className={styles.authInput}>
          <PasswordIcon className={styles.authIcon} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="New Password (min. 8 characters)"
            value={formData.password}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            autoComplete="new-password"
            required
            minLength={8}
          />
          <button
            type="button"
            className={styles.showBtn}
            onClick={toggleShowPassword}
            disabled={isLoading}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <ShowPasswordIcon className={styles.authIcon} />
            ) : (
              <HidePasswordIcon className={styles.authIcon} />
            )}
          </button>
        </div>

        <div className={styles.authInput}>
          <PasswordIcon className={styles.authIcon} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            autoComplete="new-password"
            required
            minLength={8}
          />
          <button
            type="button"
            className={styles.showBtn}
            onClick={toggleConfirmPassword}
            disabled={isLoading}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? (
              <ShowPasswordIcon className={styles.authIcon} />
            ) : (
              <HidePasswordIcon className={styles.authIcon} />
            )}
          </button>
        </div>

        {/* Password strength indicator */}
        {formData.password && (
          <div className={styles.passwordHints}>
            <small style={{ color: formData.password.length >= 8 ? 'green' : 'red' }}>
              ✓ At least 8 characters
            </small>
            <small style={{ color: /(?=.*[a-z])/.test(formData.password) ? 'green' : 'red' }}>
              ✓ One lowercase letter
            </small>
            <small style={{ color: /(?=.*[A-Z])/.test(formData.password) ? 'green' : 'red' }}>
              ✓ One uppercase letter
            </small>
            <small style={{ color: /(?=.*\d)/.test(formData.password) ? 'green' : 'red' }}>
              ✓ One number
            </small>
          </div>
        )}

        {/* Password match indicator */}
        {formData.confirmPassword && (
          <div className={styles.passwordMatch}>
            <small style={{ 
              color: formData.password === formData.confirmPassword ? 'green' : 'red' 
            }}>
              {formData.password === formData.confirmPassword 
                ? '✓ Passwords match' 
                : '✗ Passwords do not match'
              }
            </small>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !isFormValid()}
          className={`${styles.formAuthButton} ${
            isLoading || !isFormValid() ? styles.disabled : ""
          }`}
        >
          {isLoading ? <Loader /> : "Reset Password"}
        </button>

        <h3>
          Remember your password?{" "}
          <span 
            className={styles.btnLoginContainer} 
            onClick={handleLogin}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
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