import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ProjectCard from "../components/ProjectCard";
import Navbar from "../components/Navbar";
import { isAuth } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import ExpirationModal from "../components/ExpirationModal";

const HomeScreen = () => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log(isAuth());
    if (!isAuth()) {
      navigate("/login");
    }
  }, [isAuth(), navigate]);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  };

  const [createdProjects, setCreatedProjects] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [createdProjectsError, setCreatedProjectsError] = useState(null);
  const [assignedProjectsError, setAssignedProjectsError] = useState(null);

  const fetchCreatedProjects = async () => {
    try {
      const { data } = await axios.get(
        "/api/project/getcreatedprojects",
        config
      );
      setCreatedProjects(data);
    } catch (err) {
      setCreatedProjectsError(err.response.data.error);
    }
  };

  const fetchAssignedProjects = async () => {
    try {
      const { data } = await axios.get(
        "/api/project/getassignedprojects",
        config
      );
      console.log("ASSIGNED", data);
      setAssignedProjects(data);
    } catch (err) {
      setAssignedProjectsError(err.response.data.error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchCreatedProjects();
    fetchAssignedProjects();

    return () => {
      // cancel the request before component unmounts
      controller.abort();
    };
  }, []);
  return (
    <>
      {" "}
      <Navbar />
      <ExpirationModal />
      <div className="row">
        <div
          className="col-5"
          style={{ borderRight: "2px solid black", height: "100vh" }}
        >
          <h3>Created Projects</h3>
          {/* {JSON.stringify(createdProjects)} */}
          {createdProjects.length === 0 && <p>No projects created yet.</p>}
          {createdProjects &&
            createdProjects.map((p) => <ProjectCard project={p} />)}
        </div>
        <div className="col-5">
          <h3>Assigned Projects</h3>
          {/* {JSON.stringify(assignedProjects)} */}
          {assignedProjects.length === 0 && (
            <p>No projects assigned to you yet.</p>
          )}
          {assignedProjects &&
            assignedProjects.map((p) => <ProjectCard project={p} />)}
        </div>
      </div>
    </>
  );
};

export default HomeScreen;
