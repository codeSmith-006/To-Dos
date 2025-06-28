import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import Loading from "../Component/Loading/Loading";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
