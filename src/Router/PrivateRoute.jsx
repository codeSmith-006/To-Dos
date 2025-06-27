import React, { use } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import Loading from "../Component/Loading/Loading";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = use(AuthContext);
  // console.log("Current user: ", currentUser)
  if (loading) {
    return <Loading></Loading>
  }
  if (!currentUser) {
    return <Navigate to="/login"></Navigate>;
  }
  return children;
};

export default PrivateRoute;
