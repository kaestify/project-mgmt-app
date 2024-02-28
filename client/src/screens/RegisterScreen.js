import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "react-spinners/SyncLoader";

const RegisterScreen = () => {
  const navigate = useNavigate();

  // defining states -
  const [values, setValues] = useState({
    username: "",
    email: "",

    password: "",
    confirmPassword: "",
    buttonText: "Submit",
    error: "",
    success: false,
    loading: false,
  });

  //destructure values
  const {
    username,
    email,
    password,
    confirmPassword,
    buttonText,
    error,
    success,
    loading,
  } = values;
  useEffect(() => {
    if (success) {
      return navigate("/");
      //   window.location.reload();
    }
  }, [success, navigate]);
  //on key change handling
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  //handle submit form
  const submitForm = async (e) => {
    e.preventDefault();
    setValues({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      buttonText: "Submitting",
      error: "",
      success: false,
      loading: true,
    });

    if (
      username.trim().length == 0 ||
      email.trim().length == 0 ||
      password.trim().length == 0 ||
      confirmPassword.trim().length == 0
    ) {
      return setValues({
        ...values,
        buttonText: "Submit",
        error: "One or more missing fields. Please try again.",
      });
    }

    if (password.trim().length < 6) {
      return setValues({
        ...values,
        buttonText: "Submit",
        error: "Password should be at least 6 characters long.",
      });
    }

    if (password.trim() !== confirmPassword.trim()) {
      return setValues({
        ...values,
        buttonText: "Submit",
        error: "Passwords do not match.",
      });
    }

    try {
      const res = await axios.post("/api/user/register", {
        username,
        email,
        password,
      });

      setValues({
        ...values,
        success: true,
        buttonText: "Submit",
        error: null,
        success: true,
        loading: false,
      });
    } catch (err) {
      console.log("hit error", err);

      setValues({
        ...values,
        buttonText: "Submit",
        error: err.response.data.error,
        loading: false,
      });
    }
  };

  const signupForm = () => (
    <form onSubmit={submitForm}>
      <h1>Register</h1>
      {error && (
        <div class="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="text-muted">Username</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange("username")}
          value={username}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange("email")}
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          className="form-control"
          onChange={handleChange("password")}
          value={password}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Confirm Password</label>
        <input
          type="password"
          className="form-control"
          onChange={handleChange("confirmPassword")}
          value={confirmPassword}
        />
      </div>

      <div>
        <button className="btn btn-dark mt-3">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <>
      <Navbar />
      <div> {loading && <Loader />} </div>
      <div className="flex-container container shadow p-5 mb-5 mt-3 rounded">
        {signupForm()}
      </div>
    </>
  );
};

export default RegisterScreen;
