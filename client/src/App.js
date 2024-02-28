import React from "react";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import RegisterScreen from "./screens/RegisterScreen";
import SingleProjectScreen from "./screens/SingleProjectScreen";
import ProfileScreen from "./screens/ProfileScreen";
import NewProject from "./screens/NewProject";
import EditProjectScreen from "./screens/EditProjectScreen";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomeScreen />
              </PrivateRoute>
            }
          />

          <Route
            path="/project/edit/:id"
            element={
              <PrivateRoute>
                <EditProjectScreen />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfileScreen />
              </PrivateRoute>
            }
          />

          <Route
            path="/newproject"
            element={
              <PrivateRoute>
                <NewProject />
              </PrivateRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <PrivateRoute>
                <SingleProjectScreen />
              </PrivateRoute>
            }
          />

          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
