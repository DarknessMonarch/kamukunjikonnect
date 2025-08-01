"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/style/auth.module.css";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";

import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import { MdOutlineVpnKey as PasswordIcon } from "react-icons/md";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuth } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuth) {
      router.push("/", { scroll: false });
    }
  }, [isAuth, router]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    router.push("/authentication/resetcode", { scroll: false });
  };

  const handleSignUp = () => {
    router.push("/authentication/signup", { scroll: false });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      onSubmit(e);
    }
  };

  const isFormValid = () => {
    return (
      formData.email.trim() &&
      formData.password.trim() &&
      validateEmail(formData.email.trim())
    );
  };

  async function onSubmit(e) {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!validateEmail(formData.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.email.trim(), formData.password);

      if (result.success) {
        toast.success(result.message || "Welcome back!");

        setFormData({ email: "", password: "" });

        router.push("/", { scroll: false });
            toast.success("Welcome back!");
        
      } else {
        if (result.requiresVerification) {
          toast.error(result.message);
          router.push(`/authentication/verification`, { scroll: false });
        } else {
          toast.error(result.message || "Login failed. Please check your credentials.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.authWrapper}>
      <form
        onSubmit={onSubmit}
        className={styles.formContainer}
        autoComplete="on"
      >
        <div className={styles.formHeader}>
          <h1>Welcome back</h1>
          <p>Enter your account details</p>
        </div>

        {/* Email */}
        <div className={styles.authInput}>
          <UserNameIcon
            className={styles.authIcon}
            alt="Email icon"
            width={20}
            height={20}
          />
          <input 
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter your email"
            autoComplete="username"
            disabled={isLoading}
            required
          />
        </div>

        {/* Password */}
        <div className={styles.authInput}>
          <PasswordIcon
            className={styles.authIcon}
            alt="password icon"
            width={20}
            height={20}
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isLoading}
            required
          />
          <button
            type="button"
            className={styles.showBtn}
            onClick={toggleShowPassword}
            disabled={isLoading}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <ShowPasswordIcon
                className={styles.authIcon}
                width={20}
                height={20}
              />
            ) : (
              <HidePasswordIcon
                className={styles.authIcon}
                width={20}
                height={20}
              />
            )}
          </button>
        </div>

          <span 
            className={styles.forgotpasswordspan}
            onClick={handleForgotPassword}
            role="button"
            tabIndex={0}
          >
            Forgot Password?
          </span>

        <button
          type="submit"
          disabled={isLoading || !isFormValid()}
          className={`${styles.formAuthButton} ${
            isLoading || !isFormValid() ? styles.disabled : ""
          }`}
        >
          {isLoading ? <Loader /> : "Sign In"}
        </button>



        <h3>
          Don&apos;t have an account?{" "}
          <span 
            className={styles.btnLoginContainer} 
            onClick={handleSignUp}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSignUp();
              }
            }}
          >
            Sign up
          </span>
        </h3>
      </form>
    </div>
  );
}