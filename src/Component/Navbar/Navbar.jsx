import React, { use } from "react";
import AuthContext from "../../Context/AuthContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../Firebase/firebase.config";
import Loading from "../Loading/Loading";
import Tooltip from "@mui/material/Tooltip";
const Navbar = () => {
  // getting current user
  const { currentUser, loading, logout } = use(AuthContext);

  console.log("Photo: ", currentUser?.photoURL)

  // handle google sign in button
  const handleGoogleSignIn = async () => {
    // google provider

    const provider = new GoogleAuthProvider();

    try {
      const response = await signInWithPopup(auth, provider);
    } catch (error) {
      console.log("Error while create account with google: ", error);
    }
  };

  // handling handleLogOut
  const handleLogOut = async () => {
    try {
      const response = await logout();
      console.log(response);
    } catch (error) {
      console.log("Error in logout: ", error);
    }
  };
  return (
    <nav className="bg-[#191919] text-[#D4D4D4] py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left side: Logo + Name */}
        <div className="flex items-center space-x-2">
          {/* Tick mark icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 text-2xl w-8 text-[#838383]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-2xl font-bold select-none">To-Dos</span>
        </div>

        {/* show login or user based on current user */}
        {loading ? (
          <Loading></Loading>
        ) : currentUser ? (
          <div className="flex gap-2 items-center">
            {/* User dropdown */}
            <div className="dropdown dropdown-end">
              <Tooltip title={`${currentUser?.displayName}`}>
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full border-2 border-[#838383]">
                    <img alt="User avatar" src={`${currentUser?.photoURL}`} />
                  </div>
                </div>
              </Tooltip>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-[#2F2F2F] rounded-box z-50 mt-3 w-52 p-2 shadow text-[#D4D4D4]"
              >
                <li onClick={handleLogOut}>
                  <a className="hover:bg-[#838383] hover:text-[#191919]">
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button
            onClick={handleGoogleSignIn}
            className="btn bg-[#2F2F2F] border border-[#838383] text-[#D4D4D4] hover:bg-[#383838] hover:border-[#D4D4D4] px-3 md:px-6 w-auto"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google icon"
              className="w-5 h-5"
            />
            <span className="hidden md:inline">Sign in with Google</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
