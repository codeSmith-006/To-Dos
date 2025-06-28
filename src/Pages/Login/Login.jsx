import React, { useContext, useEffect } from "react";
import {
  browserLocalPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../Firebase/firebase.config";
import { Typewriter } from "react-simple-typewriter";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";
import Loading from "../../Component/Loading/Loading";

const Login = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useContext(AuthContext);

  // 🔁 Prevent showing login page if already logged in
  useEffect(() => {
    if (!loading && currentUser) {
      navigate("/");
    }
  }, [currentUser, loading, navigate]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, provider);

      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#191919] text-[#D4D4D4] flex flex-col justify-center items-center px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 select-none">
        <Typewriter
          words={["To-Dos"]}
          loop={1}
          cursor
          cursorStyle="|"
          typeSpeed={100}
          deleteSpeed={50}
          delaySpeed={1500}
        />
      </h1>
      <p className="text-center text-sm md:text-base mb-6 max-w-md">
        To start managing your tasks, please log in with your Google account.
      </p>

      <button
        onClick={handleGoogleSignIn}
        className="btn bg-[#2F2F2F] border border-[#838383] text-[#D4D4D4] hover:bg-[#383838] hover:border-[#D4D4D4] px-4 py-2 flex items-center gap-2"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google icon"
          className="w-5 h-5"
        />
        <span>Sign in with Google</span>
      </button>
    </div>
  );
};

export default Login;
