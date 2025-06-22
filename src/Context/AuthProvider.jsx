import React, { useState } from 'react';
import AuthContext from './AuthContext';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase.config';

const AuthProvider = ({children}) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true)


    // get current user
    onAuthStateChanged(auth, user => {
        if (user) {
            setCurrentUser(user);
        }
        else {
            setCurrentUser(null)
        }
        setLoading(false)
    })

    // logout
    const logout = () => {
        setLoading(false)
        return signOut(auth)
    }


    const info = {
        currentUser,
        loading,
        logout
    }
    return <AuthContext value={info}>{children}</AuthContext>
};

export default AuthProvider;