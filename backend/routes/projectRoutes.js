const express = require("express");
const router = express.Router();
const {
  create,
  getAssignedProjects,
  getCreatedProjects,
  getProjectById,
  addComment,
  markProjectComplete,
  deleteProject,
  editProject,
  assignedProjectsStats,
} = require("../controllers/projectController");

const { verifyAccessToken } = require("../helpers/jwtHelpers");
const { handleProjectAssignments } = require("../controllers/authController");

router.post("/create", verifyAccessToken, handleProjectAssignments, create);
router.get("/getassignedprojects", verifyAccessToken, getAssignedProjects);
router.get("/getcreatedprojects", verifyAccessToken, getCreatedProjects);
router.get("/view/:id", verifyAccessToken, getProjectById);
router.post("/addcomment/:id", verifyAccessToken, addComment);
router.put("/:id/markprojectcomplete", verifyAccessToken, markProjectComplete);
router.delete("/:id/delete", verifyAccessToken, deleteProject);
router.put("/edit/:id", verifyAccessToken, editProject);
router.get("/assigned-project-stats", verifyAccessToken, assignedProjectsStats);
module.exports = router;
