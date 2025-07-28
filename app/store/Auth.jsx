import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Core auth state
      isAuth: false,
      userId: "",
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      profileImage: "",
      isAdmin: false,
      isAuthorized: false,
      emailVerified: false,
      isActive: true,
      lastLogin: null,
      addresses: [],
      preferences: {},
      
      // Token management
      accessToken: "",
      refreshToken: "",
      tokenExpirationTime: null,
      refreshTimeoutId: null,
      isInitialized: false,

      initializeAuth: async () => {
        const state = get();

        if (state.isInitialized) return;
        set({ isInitialized: true });

        if (!state.isAuth || !state.accessToken || !state.refreshToken) {
          return;
        }

        const now = Date.now();
        const tokenExpired =
          !state.tokenExpirationTime || state.tokenExpirationTime <= now;
        const tokenExpiringSoon =
          state.tokenExpirationTime && state.tokenExpirationTime - now < 300000; // 5 minutes

        if (tokenExpired || tokenExpiringSoon) {
          console.log("Token expired or expiring soon, attempting refresh...");
          const refreshSuccess = await get().refreshAccessToken();

          if (!refreshSuccess) {
            console.log("Token refresh failed, clearing user data");
            get().clearUser();
            return;
          }
        }

        try {
          const isValid = await get().validateAuthState();
          if (!isValid) {
            console.log("Auth state validation failed, clearing user data");
            get().clearUser();
            return;
          }

          console.log("Auth state validated successfully");
          get().scheduleTokenRefresh();
        } catch (error) {
          get().clearUser();
        }
      },

      validateAuthState: async () => {
        try {
          const { accessToken } = get();
          if (!accessToken) return false;

          const response = await fetch(`${SERVER_API}/auth/validate`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.status === 401) {
            return await get().refreshAccessToken();
          }

          const data = await response.json();
          if (data.status === "success") {
            if (data.data.user) {
              get().updateUser(data.data.user);
            }
            return true;
          }

          return false;
        } catch (error) {
          console.error("Auth validation error:", error);
          return false;
        }
      },

      resetInitialization: () => {
        set({ isInitialized: false });
      },

      setUser: (userData) => {
        const tokenExpirationTime = Date.now() + TOKEN_REFRESH_INTERVAL;

        set({
          isAuth: true,
          userId: userData.id,
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          phone: userData.phone || "",
          profileImage: userData.profileImage || "",
          isAdmin: userData.isAdmin || false,
          isAuthorized: userData.isAuthorized || false,
          emailVerified: userData.emailVerified || false,
          isActive: userData.isActive !== false,
          addresses: userData.addresses || [],
          preferences: userData.preferences || {},
          accessToken: userData.tokens.accessToken,
          refreshToken: userData.tokens.refreshToken,
          lastLogin: userData.lastLogin || new Date().toISOString(),
          tokenExpirationTime,
          isInitialized: true,
        });

        get().scheduleTokenRefresh();
      },

      updateUser: (userData) => {
        set((state) => ({
          ...state,
          ...userData,
        }));
      },

      clearUser: () => {
        get().cancelTokenRefresh();

        set({
          isAuth: false,
          userId: "",
          username: "",
          email: "",
          firstName: "",
          lastName: "",
          phone: "",
          profileImage: "",
          isAdmin: false,
          isAuthorized: false,
          emailVerified: false,
          isActive: true,
          addresses: [],
          preferences: {},
          accessToken: "",
          refreshToken: "",
          lastLogin: null,
          tokenExpirationTime: null,
          isInitialized: false,
        });
      },

      register: async (userData) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (data.status === "success") {
            const userWithTokens = {
              ...data.data.user,
              tokens: data.data.tokens,
            };

            get().setUser(userWithTokens);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Registration failed" };
        }
      },

      login: async (email, password) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (data.data?.user?.emailVerified === false) {
            return {
              success: false,
              message: "Please verify your email to log in. Check your inbox.",
              requiresVerification: true,
              email: data.data.user.email,
              username: data.data.user.username,
            };
          }

          if (
            data.status === "success" &&
            data.data?.user &&
            data.data?.tokens
          ) {
            const userWithTokens = {
              ...data.data.user,
              tokens: data.data.tokens,
            };

            get().setUser(userWithTokens);

            return {
              success: true,
              message: data.message,
              isAdmin: data.data.user.isAdmin,
            };
          }

          return {
            success: false,
            message: data.message || "Login failed",
          };
        } catch (error) {
          return {
            success: false,
            message: "Login failed",
          };
        }
      },

      logout: async () => {
        try {
          const { accessToken } = get();

          get().clearUser();

          if (accessToken) {
            try {
              await fetch(`${SERVER_API}/auth/logout`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });
            } catch (error) {
              console.warn("Server logout notification failed:", error);
            }
          }

          return { success: true, message: "Logout successful" };
        } catch (error) {
          get().clearUser();
          return { success: true, message: "Logged out" };
        }
      },

      verifyEmail: async (email, verificationCode) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/verify-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, verificationCode }),
          });

          const data = await response.json();
          if (data.status === "success") {
            set({ emailVerified: true });
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Email verification failed" };
        }
      },

      resendVerificationCode: async (email) => {
        try {
          const response = await fetch(
            `${SERVER_API}/auth/resend-verification`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }),
            }
          );

          const data = await response.json();
          return {
            success: data.status === "success",
            message: data.message,
          };
        } catch (error) {
          return {
            success: false,
            message: "Failed to resend verification code",
          };
        }
      },

      updateProfile: async (updateData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/update-profile`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updateData),
          });

          const data = await response.json();
          if (data.status === "success") {
            get().updateUser(data.data.user);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Profile update failed" };
        }
      },

      updatePassword: async (passwordData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/update-password`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(passwordData),
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Password update failed" };
        }
      },

      updateProfileImage: async (imageData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(
            `${SERVER_API}/auth/update-profile-image`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ image: imageData }),
            }
          );

          const data = await response.json();
          if (data.status === "success") {
            set({ profileImage: data.data.profileImage });
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Profile image update failed" };
        }
      },

      requestPasswordReset: async (email) => {
        try {
          const response = await fetch(
            `${SERVER_API}/auth/reset-password-request`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            }
          );

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Password reset request failed" };
        }
      },

      resetPassword: async (token, newPassword) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, newPassword }),
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Password reset failed" };
        }
      },

      deleteAccount: async () => {
        try {
          const { accessToken } = get();

          if (!accessToken) {
            return { success: false, message: "Not authenticated" };
          }

          const response = await fetch(`${SERVER_API}/auth/delete-account`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();
          if (data.status === "success") {
            get().clearUser();
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to delete account" };
        }
      },

      // Address management
      addAddress: async (addressData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/addresses`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(addressData),
          });

          const data = await response.json();
          if (data.status === "success") {
            // Refresh user data to get updated addresses
            await get().validateAuthState();
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to add address" };
        }
      },

      updateAddress: async (addressId, addressData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/addresses/${addressId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(addressData),
          });

          const data = await response.json();
          if (data.status === "success") {
            // Refresh user data to get updated addresses
            await get().validateAuthState();
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to update address" };
        }
      },

      deleteAddress: async (addressId) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/addresses/${addressId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();
          if (data.status === "success") {
            // Refresh user data to get updated addresses
            await get().validateAuthState();
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to delete address" };
        }
      },

      refreshAccessToken: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            get().clearUser();
            return false;
          }

          const response = await fetch(`${SERVER_API}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          const data = await response.json();
          if (data.status === "success") {
            set({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              tokenExpirationTime: Date.now() + TOKEN_REFRESH_INTERVAL,
            });

            if (data.data.user) {
              get().updateUser(data.data.user);
            }

            get().scheduleTokenRefresh();
            return true;
          }
          get().clearUser();
          return false;
        } catch (error) {
          get().clearUser();
          return false;
        }
      },

      scheduleTokenRefresh: () => {
        const { tokenExpirationTime, refreshTimeoutId } = get();
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
        }

        const timeUntilRefresh = Math.max(
          0,
          tokenExpirationTime - Date.now() - 60000
        );
        const newTimeoutId = setTimeout(() => {
          get().refreshAccessToken();
        }, timeUntilRefresh);

        set({ refreshTimeoutId: newTimeoutId });
      },

      cancelTokenRefresh: () => {
        const { refreshTimeoutId } = get();
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
          set({ refreshTimeoutId: null });
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuth: state.isAuth,
        userId: state.userId,
        username: state.username,
        email: state.email,
        firstName: state.firstName,
        lastName: state.lastName,
        phone: state.phone,
        profileImage: state.profileImage,
        isAdmin: state.isAdmin,
        isAuthorized: state.isAuthorized,
        emailVerified: state.emailVerified,
        isActive: state.isActive,
        addresses: state.addresses,
        preferences: state.preferences,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        lastLogin: state.lastLogin,
        tokenExpirationTime: state.tokenExpirationTime,
      }),
    }
  )
);