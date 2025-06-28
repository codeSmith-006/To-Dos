import React, { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase.config";
import { getToken } from "../Auth/AxiosX/AxiosX";

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // getting current user
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    try {
      if (user) {
        setCurrentUser(user);

        // Fetch and store ID token
        const token = await user.getIdToken();
        getToken(token); // token is never null if user exists
      } else {
        setCurrentUser(null);
        getToken(null);
      }
    } catch (error) {
      console.error("Error during auth state change:", error);
      setCurrentUser(null);
      getToken(null);
    } finally {
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);



  // logout
  // Inside AuthContext
  const logout = () => {
    setLoading(true); // Set loading before sign out
    return signOut(auth).finally(() => setLoading(false));
  };

  const info = {
    currentUser,
    loading,
    logout,
    setCurrentUser
  };
  return <AuthContext value={info}>{!loading && children}</AuthContext>;
};

export default AuthProvider;
