import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuth } from "../utils/helpers";
const PrivateRoute = ({ children }) => {
  return isAuth() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
