import React, { use } from "react";
import AuthContext from "../../Context/AuthContext";
import { browserLocalPersistence, GoogleAuthProvider, setPersistence, signInWithPopup } from "firebase/auth";
import { auth } from "../../Firebase/firebase.config";
import Loading from "../Loading/Loading";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import toast from "react-hot-toast";

const Navbar = () => {
  const { currentUser, loading, logout, setCurrentUser } = use(AuthContext);

  const navigate = useNavigate();

  // full name
  const fullName = currentUser?.displayName || "User";

const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();

  try {
    await setPersistence(auth, browserLocalPersistence); // 👈 Ensures session persists across tabs/reloads
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.log("Error while signing in with Google: ", error);
  }
};

const handleLogOut = async () => {
  try {
    await logout();
    setCurrentUser(null)

    // Optional: clear localStorage preferences (like view mode)
    localStorage.removeItem("preferredView");
    

    // Optional: toast
    toast.success("Logged out successfully!");

    // Navigate to login or home
    navigate("/");
  } catch (error) {
    console.log("Error in logout:", error);
    toast.error("Failed to log out.");
  }
};


  return (
    <nav className="bg-[#191919] text-[#D4D4D4] py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-[#838383]"
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
          <span className="text-sm md:text-2xl font-bold select-none block">
            <Typewriter
              words={["To-Dos"]}
              loop={1}
              cursor
              cursorStyle="|"
              typeSpeed={100}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </span>
        </div>

        {/* Right: Auth */}
        {loading ? (
          <Loading />
        ) : currentUser ? (
          <div className="flex items-center gap-3">
            {/* Greeting */}
            <p className="sm:inline text-sm md:text-base">
              Hey, 
              <Typewriter
                words={[`${fullName}`]}
                loop={Infinity}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </p>

            {/* User avatar */}
            <div className="dropdown dropdown-end">
              <Tooltip title={currentUser.displayName || "Profile"}>
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full border-2 border-[#838383]">
                    <img
                      src={currentUser.photoURL}
                      alt="User Avatar"
                      referrerPolicy="no-referrer"
                    />
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
