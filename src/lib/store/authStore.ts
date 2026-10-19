import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  avatar?: string;
  provider: "email" | "google";
  createdAt: string;
}

export interface ApiKeyConfig {
  googleClientId: string;
  googleClientSecret: string;
  stripeSecretKey: string;
  stripePublishableKey: string;
  cryptoBtcAddress: string;
  cryptoEthAddress: string;
  cryptoUsdtAddress: string;
  smtpHost: string;
  smtpUser: string;
  smtpPass: string;
  openAiApiKey?: string;
}

interface AuthStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  apiKeys: ApiKeyConfig;

  // Actions
  loginWithEmail: (email: string, pass: string, name?: string) => Promise<boolean>;
  loginWithGoogle: (customEmail?: string, customName?: string) => Promise<boolean>;
  loginAdminDemo: () => void;
  logout: () => void;
  updateApiKeys: (keys: Partial<ApiKeyConfig>) => void;
}

const DEFAULT_API_KEYS: ApiKeyConfig = {
  googleClientId: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
  googleClientSecret: "GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx",
  stripeSecretKey: "sk_test_51Pxxxxxxxxxxxxxxxxxxxxxx",
  stripePublishableKey: "pk_test_51Pxxxxxxxxxxxxxxxxxxxxxx",
  cryptoBtcAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  cryptoEthAddress: "0x71C...84920E",
  cryptoUsdtAddress: "0x71C...84920E (Polygon USDT)",
  smtpHost: "smtp.mailgun.org",
  smtpUser: "postmaster@nexusdigital.io",
  smtpPass: "••••••••••••••••",
  openAiApiKey: "sk-proj-xxxxxxxxxxxxxxxxxxxx",
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      apiKeys: DEFAULT_API_KEYS,

      loginWithEmail: async (email: string, pass: string, name?: string) => {
        // Check if admin credentials
        const trimmedEmail = email.trim().toLowerCase();
        const isAdminUser =
          trimmedEmail === "admin@nexusdigital.io" ||
          trimmedEmail === "admin@nexus.io" ||
          trimmedEmail.startsWith("admin@");

        const userProfile: UserProfile = {
          id: `usr-${Date.now()}`,
          email: trimmedEmail,
          name: name?.trim() || trimmedEmail.split("@")[0],
          role: isAdminUser ? "ADMIN" : "USER",
          provider: "email",
          createdAt: new Date().toISOString(),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${trimmedEmail}`,
        };

        set({
          user: userProfile,
          isAuthenticated: true,
          isAdmin: isAdminUser,
        });

        // Also sync with live chat user email in localStorage
        try {
          localStorage.setItem(
            "nexus_livechat_user",
            JSON.stringify({ name: userProfile.name, email: userProfile.email })
          );
        } catch {
          // ignore
        }

        return true;
      },

      loginWithGoogle: async (customEmail?: string, customName?: string) => {
        // Realistic Google SSO flow simulation
        const email = customEmail || "alex.mercer@gmail.com";
        const name = customName || "Alex Mercer";
        const trimmedEmail = email.trim().toLowerCase();
        const isAdminUser = trimmedEmail.includes("admin");

        const userProfile: UserProfile = {
          id: `usr-google-${Date.now()}`,
          email: trimmedEmail,
          name,
          role: isAdminUser ? "ADMIN" : "USER",
          provider: "google",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          createdAt: new Date().toISOString(),
        };

        set({
          user: userProfile,
          isAuthenticated: true,
          isAdmin: isAdminUser,
        });

        try {
          localStorage.setItem(
            "nexus_livechat_user",
            JSON.stringify({ name: userProfile.name, email: userProfile.email })
          );
        } catch {
          // ignore
        }

        return true;
      },

      loginAdminDemo: () => {
        const adminProfile: UserProfile = {
          id: "usr-admin-master",
          email: "admin@nexusdigital.io",
          name: "Master Administrator",
          role: "ADMIN",
          provider: "email",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
          createdAt: new Date().toISOString(),
        };

        set({
          user: adminProfile,
          isAuthenticated: true,
          isAdmin: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      updateApiKeys: (newKeys) => {
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            ...newKeys,
          },
        }));
      },
    }),
    {
      name: "nexus-auth-storage",
    }
  )
);
