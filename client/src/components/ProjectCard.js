import React from "react";
import { Card } from "react-bootstrap";
import moment from "moment";
import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <Card
      className="my-3 p-3 rounded"
      style={{ height: "450px", width: "320px" }}
    >
      <Card.Body>
        <Link to={`/project/${project._id}`}>
          <Card.Title as="div">
            <strong>{project.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">Created By: {project.owner.username}</Card.Text>
        <Card.Text as="div">
          Project Description: {project.description}
        </Card.Text>
        <Card.Text as="div">
          Deadline: {moment(project.deadline).format("YYYY-MM-DD")}
        </Card.Text>
        <Card.Text as="div">Status: {project.status}</Card.Text>
        <Card.Text as="div">
          Assigned To:{" "}
          {project.assigned_to.map((user) => (
            <span>{user}; </span>
          ))}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProjectCard;
