import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth, signInWithGoogle } from "../lib/firebase";

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  uid?: string;
}

interface ProfileContextType {
  profile: UserProfile;
  user: User | null;
  updateProfile: (updates: Partial<UserProfile>) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (isOpen: boolean) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const defaultProfile: UserProfile = {
  name: "",
  phone: "",
  email: "",
  address: "",
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("manchai_profile");
    if (saved) {
      try {
        return { ...defaultProfile, ...JSON.parse(saved) };
      } catch (e) {
        return defaultProfile;
      }
    }
    return defaultProfile;
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setProfile(prev => ({
          ...prev,
          name: prev.name || currentUser.displayName || "",
          email: prev.email || currentUser.email || "",
          uid: currentUser.uid
        }));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("manchai_profile", JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const login = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      if (error.code !== "auth/cancelled-popup-request" && error.code !== "auth/popup-closed-by-user") {
        console.error("Login Error:", error);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(defaultProfile);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <ProfileContext.Provider value={{ 
      profile, 
      user, 
      updateProfile, 
      isProfileOpen, 
      setIsProfileOpen, 
      login, 
      logout,
      loading 
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
