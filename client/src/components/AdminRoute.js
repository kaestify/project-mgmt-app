import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuth, isUserAdmin } from "../utils/helpers";
const AdminRoute = ({ children }) => {
  return isAuth() && isUserAdmin() ? children : <Navigate to="/login" />;
};

export default AdminRoute;
