import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { handleLogout } from "../utils/helpers";
import Cookies from "js-cookie";
import { Modal, Button } from "react-bootstrap";
// Import toastify css file
import "react-toastify/dist/ReactToastify.css"; //you need to import this for notis to work

const ExpirationModal = () => {
  const [show, setShow] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("running");
      const expiryTs = Cookies.get("accessTokenExpiry");
      const expiry = new Date(expiryTs * 1000);
      const now = Date.now();
      const remainingMilliSeconds = Math.floor((expiry - now) / 1000) * 1000;
      const remainingSeconds = remainingMilliSeconds / 1000;
      if (remainingSeconds <= 0) {
        handleLogout();
      } else {
        setCounter(remainingSeconds);
        counter === 10 && setShow(true);
        counter === 1 && setShow(false);
      }
    }, 1000);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [counter]);

  const handleExtend = async () => {
    const data = {
      refreshToken: Cookies.get("refreshToken"),
    };
    try {
      const res = await axios.post("/api/user/refresh-tokens", data, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      console.log("res.data", res.data);
      console.log(Cookies.get("refreshToken"), Cookies.get("accessToken"));

      if (res.data.message === "Unauthorized")
        toast.error("Refresh token invalid");
      else if (res.status === 200) {
        axios
          .post("/api/user/delete-refresh-token", data, {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          })
          .then((response) => {
            console.log(
              "delete-refresh-token response: " + JSON.stringify(response)
            );
          })
          .catch((error) => {
            console.log("delete-refresh-token error: " + error);
          });
      }
      Cookies.set("accessToken", res.data.accessTokenData.token);
      Cookies.set("refreshToken", res.data.refreshTokenData.token);
      Cookies.set("accessTokenExpiry", res.data.accessTokenData.exp);
      toast.success("Session successfully extended.");
      setShow(false);
    } catch (err) {
      console.log("Navbar-handleExtend err: " + err);
      if (err.message === "Request failed with status code 401") {
        toast.error("Access token expired. Please sign out and login again");
      }
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <ToastContainer />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>
          Session Expiring Soon
          <br />
          {counter} {counter === 1 ? "second" : "seconds"} remaining
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleExtend}>
            Extend Session
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ExpirationModal;
