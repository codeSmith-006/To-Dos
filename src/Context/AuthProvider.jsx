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
  const unSubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        setCurrentUser(user);
        const token = await user.getIdToken();
        getToken(token || null);
      } catch (err) {
        console.error("Error fetching token:", err);
        getToken(null);
      }
    } else {
      setCurrentUser(null);
      getToken(null);
    }
    setLoading(false);
  });

  return () => unSubscribe();
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
