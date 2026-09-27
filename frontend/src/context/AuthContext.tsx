"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ref, get, set, child } from "firebase/database";
import { auth, db } from "@/lib/firebase";

export type UserRole = "STUDENT" | "ADMIN";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  category?: string;
  tribeName?: string;
  annualIncome?: number | string;
  institutionName?: string;
  course?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  loginWithEmail: (
    email: string,
    password: string,
    preferredRole?: UserRole
  ) => Promise<{ user: User; role: UserRole }>;
  registerWithEmail: (
    email: string,
    password: string,
    profileData: Partial<UserProfile>
  ) => Promise<{ user: User; role: UserRole }>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  role: "STUDENT",
  loading: true,
  loginWithEmail: async () => {
    throw new Error("AuthProvider missing");
  },
  registerWithEmail: async () => {
    throw new Error("AuthProvider missing");
  },
  sendPasswordReset: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [loading, setLoading] = useState(true);

  // Sync user profile from Firebase RTDB
  const syncUserProfile = async (currentUser: User) => {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `users/${currentUser.uid}`));
      let currentRole: UserRole = currentUser.email?.includes("admin") ? "ADMIN" : "STUDENT";
      let profile: UserProfile;

      if (snapshot.exists()) {
        profile = snapshot.val() as UserProfile;
        currentRole = profile.role || currentRole;
      } else {
        // Create initial profile in RTDB
        profile = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName:
            currentUser.displayName ||
            (currentRole === "ADMIN" ? "Ministry Officer" : "Tribal Student"),
          role: currentRole,
          category: "ST",
          tribeName: "Santhal",
        };
        await set(ref(db, `users/${currentUser.uid}`), profile);
      }

      setUserProfile(profile);
      setRole(currentRole);
    } catch (err) {
      console.error("Failed to sync user profile from RTDB:", err);
      const fallbackRole: UserRole = currentUser.email?.includes("admin") ? "ADMIN" : "STUDENT";
      setRole(fallbackRole);
      setUserProfile({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        role: fallbackRole,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else {
        setUserProfile(null);
        setRole("STUDENT");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (
    email: string,
    password: string,
    preferredRole?: UserRole
  ) => {
    let authUser: User;
    const determinedRole: UserRole =
      preferredRole || (email.toLowerCase().includes("admin") ? "ADMIN" : "STUDENT");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      authUser = userCredential.user;
    } catch (error: any) {
      // Auto-provision demo account if not created yet in Firebase
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        try {
          const newCredential = await createUserWithEmailAndPassword(auth, email, password);
          authUser = newCredential.user;
          const defaultName =
            determinedRole === "ADMIN" ? "Ministry Officer (Tribal Affairs)" : "Birsa Soren";
          await updateProfile(authUser, { displayName: defaultName });
        } catch {
          throw error;
        }
      } else {
        throw error;
      }
    }

    // Ensure role is correctly registered in RTDB
    const initialProfile: UserProfile = {
      uid: authUser.uid,
      email: authUser.email,
      displayName:
        authUser.displayName || (determinedRole === "ADMIN" ? "Ministry Officer" : "Birsa Soren"),
      role: determinedRole,
      category: "ST",
      tribeName: determinedRole === "ADMIN" ? "N/A" : "Santhal",
    };
    await set(ref(db, `users/${authUser.uid}`), initialProfile);

    setUser(authUser);
    setUserProfile(initialProfile);
    setRole(determinedRole);

    return { user: authUser, role: determinedRole };
  };

  const registerWithEmail = async (
    email: string,
    password: string,
    profileData: Partial<UserProfile>
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const authUser = userCredential.user;
    const assignedRole: UserRole =
      profileData.role || (email.includes("admin") ? "ADMIN" : "STUDENT");

    if (profileData.displayName) {
      await updateProfile(authUser, { displayName: profileData.displayName });
    }

    const newProfile: UserProfile = {
      uid: authUser.uid,
      email: authUser.email,
      displayName: profileData.displayName || authUser.displayName,
      role: assignedRole,
      category: profileData.category || "ST",
      tribeName: profileData.tribeName || "Santhal",
      annualIncome: profileData.annualIncome || "120000",
      institutionName: profileData.institutionName || "NIT Jamshedpur",
      course: profileData.course || "B.Tech Computer Science",
    };

    await set(ref(db, `users/${authUser.uid}`), newProfile);
    setUser(authUser);
    setUserProfile(newProfile);
    setRole(assignedRole);

    return { user: authUser, role: assignedRole };
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setRole("STUDENT");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        role,
        loading,
        loginWithEmail,
        registerWithEmail,
        sendPasswordReset,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
