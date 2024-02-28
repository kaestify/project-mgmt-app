import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/Navbar";
import "./SingleProject.css";
import ExpirationModal from "../components/ExpirationModal";

const SingleProjectScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [singleProject, setSingleProject] = useState([]);
  const [singleProjectError, setSingleProjectError] = useState(null);
  const [markCompleteError, setMarkCompleteError] = useState(null);
  const [markCompleteSuccess, setMarkCompleteSuccess] = useState(false);
  const [deleteProjectSuccess, setDeleteProjectSuccess] = useState(false);
  const [deleteProjectError, setDeleteProjectError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    loadSingleProject();
  }, [submitSuccess, markCompleteSuccess, deleteProjectSuccess]);
  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  };
  const loadSingleProject = async () => {
    try {
      const { data } = await axios.get(`/api/project/view/${id}`, config);
      setSingleProject(data);
    } catch (err) {
      setSingleProjectError("Error loading project details..");
    }
  };

  const handleMarkComplete = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/project/${id}/markprojectcomplete`, {}, config);
      setMarkCompleteSuccess(true);
    } catch (err) {
      console.log(err);
      setMarkCompleteError(err.response.data.error);
    }
  };

  const handleDeleteProject = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`/api/project/${id}/delete`, config);
      setDeleteProjectSuccess(true);
    } catch (err) {
      console.log(err);
      setDeleteProjectError(err.response.data.error);
    }
  };

  const handleEdit = () => {
    return navigate(`/project/edit/${id}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);
    try {
      await axios.post(`/api/project/addcomment/${id}`, { comment }, config);
      setSubmitSuccess(true);
      setComment("");
      toast.success("Comment added successfully!");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="row">
      <ToastContainer />
      <ExpirationModal />
      <Navbar />
      {singleProjectError && (
        <div className="alert alert-light" role="alert">
          {singleProjectError}
        </div>
      )}

      {markCompleteError && (
        <div className="alert alert-light" role="alert">
          {markCompleteError}
        </div>
      )}

      {deleteProjectError && (
        <div className="alert alert-light" role="alert">
          {deleteProjectError}
        </div>
      )}
      <div className="col-4">
        {singleProject && (
          <Card style={{ position: "relative" }}>
            {" "}
            <Card.Body>
              <Link to={`/project/${singleProject._id}`}>
                <Card.Title as="div">
                  <strong>{singleProject.name}</strong>
                </Card.Title>
              </Link>

              <Card.Text as="div">
                Deadline: {moment(singleProject.deadline).format("YYYY-MM-DD")}
              </Card.Text>
              <Card.Text as="div">Status: {singleProject.status}</Card.Text>
              <Card.Text as="div">
                Created By:{" "}
                {singleProject.owner && singleProject.owner.username}
              </Card.Text>
              <Card.Text as="div">
                Assigned To:{" "}
                {singleProject.assigned_to &&
                  singleProject.assigned_to.map((user) => (
                    <span>{user}; </span>
                  ))}
              </Card.Text>

              <Card.Text as="div">
                Project Description: {singleProject.description}
              </Card.Text>

              {singleProject && singleProject.status === "Not complete" && (
                <button
                  onClick={handleMarkComplete}
                  style={{ position: "absolute", bottom: 5, right: 5 }}
                  className="btn btn-dark mt-2"
                >
                  Mark As Complete
                </button>
              )}

              {singleProject && singleProject.status === "Completed" && (
                <button
                  onClick={handleMarkComplete}
                  style={{ position: "absolute", bottom: 5, right: 5 }}
                  className="btn btn-dark mt-2"
                  disabled
                >
                  Mark As Complete
                </button>
              )}
              <div
                className="buttons-box"
                style={{ position: "absolute", top: 0, right: 0 }}
              >
                {" "}
                <i
                  onClick={handleDeleteProject}
                  style={{ margin: 2 }}
                  className="fa-solid fa-ban indiv-button fa-2x"
                ></i>
                <i
                  onClick={handleEdit}
                  style={{ margin: 2 }}
                  className="fa-solid fa-square-pen indiv-button fa-2x"
                ></i>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
      <div className="col-4">
        <h4>Comments</h4>
        {!singleProject && <p>No comments yet</p>}
        {singleProject &&
          singleProject.comments &&
          singleProject.comments.length == 0 && <p>No comments yet</p>}

        {singleProject &&
          singleProject.comments &&
          singleProject.comments.map((c) => (
            <div style={{ backgroundColor: "lightgray" }}>
              <p>
                Written by {c.username} on {c.createdAt}{" "}
              </p>
              <p style={{ backgroundColor: "lightblue" }}>
                Comment: {c.comment}
              </p>
            </div>
          ))}
      </div>

      <div className="col-4">
        {" "}
        <h4>Leave a comment</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              required
              type="text"
              className="form-control"
              value={comment}
              onChange={handleChange}
            />
          </div>
          <button className="btn btn-dark mt-2">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SingleProjectScreen;
