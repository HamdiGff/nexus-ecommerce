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

export interface RegisteredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string; // Plain/Base64 for client-side storage
  role: "USER" | "ADMIN";
  provider: "email" | "google";
  avatar?: string;
  createdAt: string;
}

interface AuthStore {
  user: UserProfile | null;
  registeredUsers: RegisteredUser[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  apiKeys: ApiKeyConfig;

  // Actions
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<{ success: boolean; message?: string }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: (email: string, name: string, avatar?: string) => Promise<boolean>;
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

// Initial default registered user so admin or demo users exist
const INITIAL_USERS: RegisteredUser[] = [
  {
    id: "usr-admin-master",
    email: "admin@nexusdigital.io",
    name: "Master Administrator",
    passwordHash: "admin123",
    role: "ADMIN",
    provider: "email",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date().toISOString(),
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      registeredUsers: INITIAL_USERS,
      isAuthenticated: false,
      isAdmin: false,
      apiKeys: DEFAULT_API_KEYS,

      signUpWithEmail: async (email: string, pass: string, name: string) => {
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPass = pass.trim();
        const trimmedName = name.trim();

        if (!trimmedEmail || !trimmedPass || !trimmedName) {
          return { success: false, message: "Please fill in all fields (Name, Email, and Password)." };
        }

        if (trimmedPass.length < 6) {
          return { success: false, message: "Password must be at least 6 characters long." };
        }

        const existing = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === trimmedEmail
        );

        if (existing) {
          return {
            success: false,
            message: "An account with this email already exists. Please sign in instead.",
          };
        }

        const isAdminUser =
          trimmedEmail === "admin@nexusdigital.io" ||
          trimmedEmail === "admin@nexus.io" ||
          trimmedEmail.startsWith("admin@");

        const newUser: RegisteredUser = {
          id: `usr-${Date.now()}`,
          email: trimmedEmail,
          name: trimmedName,
          passwordHash: trimmedPass,
          role: isAdminUser ? "ADMIN" : "USER",
          provider: "email",
          createdAt: new Date().toISOString(),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedName)}`,
        };

        const updatedUsers = [...get().registeredUsers, newUser];

        const userProfile: UserProfile = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          provider: "email",
          avatar: newUser.avatar,
          createdAt: newUser.createdAt,
        };

        set({
          registeredUsers: updatedUsers,
          user: userProfile,
          isAuthenticated: true,
          isAdmin: newUser.role === "ADMIN",
        });

        try {
          localStorage.setItem(
            "nexus_livechat_user",
            JSON.stringify({ name: userProfile.name, email: userProfile.email })
          );
        } catch {
          // ignore
        }

        return { success: true };
      },

      loginWithEmail: async (email: string, pass: string) => {
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPass = pass.trim();

        if (!trimmedEmail || !trimmedPass) {
          return { success: false, message: "Please enter your email and password." };
        }

        const foundUser = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === trimmedEmail
        );

        // Account doesn't exist
        if (!foundUser) {
          return {
            success: false,
            message: "No account found with this email. Please click 'Sign up' to create an account first.",
          };
        }

        // Check password
        if (foundUser.passwordHash !== trimmedPass) {
          return {
            success: false,
            message: "Incorrect password. Please verify and try again.",
          };
        }

        const userProfile: UserProfile = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
          provider: foundUser.provider,
          avatar: foundUser.avatar,
          createdAt: foundUser.createdAt,
        };

        set({
          user: userProfile,
          isAuthenticated: true,
          isAdmin: foundUser.role === "ADMIN",
        });

        try {
          localStorage.setItem(
            "nexus_livechat_user",
            JSON.stringify({ name: userProfile.name, email: userProfile.email })
          );
        } catch {
          // ignore
        }

        return { success: true };
      },

      loginWithGoogle: async (email: string, name: string, avatar?: string) => {
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedName = name.trim();
        const isAdminUser = trimmedEmail.includes("admin");

        // Check if user already registered or create on the fly
        let existing = get().registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

        if (!existing) {
          existing = {
            id: `usr-google-${Date.now()}`,
            email: trimmedEmail,
            name: trimmedName,
            passwordHash: "oauth-google-session",
            role: isAdminUser ? "ADMIN" : "USER",
            provider: "google",
            avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedName)}`,
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            registeredUsers: [...state.registeredUsers, existing!],
          }));
        }

        const userProfile: UserProfile = {
          id: existing.id,
          email: existing.email,
          name: existing.name,
          role: existing.role,
          provider: "google",
          avatar: existing.avatar,
          createdAt: existing.createdAt,
        };

        set({
          user: userProfile,
          isAuthenticated: true,
          isAdmin: existing.role === "ADMIN",
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
