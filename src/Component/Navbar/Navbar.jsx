import React from "react";

const Navbar = () => {
return (
  <nav className="bg-[#191919] text-[#D4D4D4] py-4">
    <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-2xl font-bold select-none">To-Dos</span>
      </div>

      {/* Right side: user avatar dropdown */}
      <div className="flex gap-2 items-center">

        {/* User dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full border-2 border-[#838383]">
              <img
                alt="User avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-[#2F2F2F] rounded-box z-50 mt-3 w-52 p-2 shadow text-[#D4D4D4]"
          >
            <li>
              <a className="justify-between hover:bg-[#838383] hover:text-[#191919]">
                Profile
                <span className="badge bg-[#838383] text-[#191919]">New</span>
              </a>
            </li>
            <li>
              <a className="hover:bg-[#838383] hover:text-[#191919]">Settings</a>
            </li>
            <li>
              <a className="hover:bg-[#838383] hover:text-[#191919]">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
);


};

export default Navbar;
