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
        setCurrentUser(user);
        const token = await user.getIdToken();
        // console.log("token: ", token)
        if (token) {
            getToken(token)
        } else {
            getToken(null)
        }
        setLoading(false)
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  // logout
  const logout = () => {
    setLoading(false);
    return signOut(auth);
  };

  const info = {
    currentUser,
    loading,
    logout,
  };
  return <AuthContext value={info}>{!loading && children}</AuthContext>;
};

export default AuthProvider;
