"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app, db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

interface UserDetails {
  persona: string;
  outgoing_stats_tab_enabled: boolean;
  incoming_stats_tab_enabled: boolean;
  calls_tab_enabled: boolean;
  access_control_list: string[];
}

interface AuthContextType {
  isAuthenticated: boolean | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  user: null,
  userDetails: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({
  children,
  initialAuth,
}: {
  children: ReactNode;
  initialAuth: boolean;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
    initialAuth
  );
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthenticated(!!user);
      setUser(user);

      if (user) {
        try {
          const userDoc = await getDoc(
            doc(
              db,
              process.env.NEXT_PUBLIC_USERS_COLLECTION_NAME || "",
              user.uid
            )
          );
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserDetails({
              ...userData,
              access_control_list: userData.access_control_list || [],
            } as UserDetails);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        setUserDetails(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, userDetails, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Function to check if a user has access to a location
export const hasAccessToLocation = (
  userACL: string[],
  locationACL: string[]
): boolean => {
  return userACL.some((userItem) => locationACL.includes(userItem));
};
