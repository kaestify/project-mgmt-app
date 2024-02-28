const Project = require("../models/projectModel");

exports.create = (req, res) => {
  console.log("req.payload", req.payload);
  // console.log("ID", req.payload.userObj.userDetails.userId);
  req.body.owner = req.payload.userObj.userDetails.userId;
  const project = new Project(req.body);
  project.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: error,
      });
    }

    res.json(data);
  });
};

exports.getCreatedProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.payload.userObj.userDetails.userId,
    }).populate("owner", "_id, username");
    res.json(projects);
  } catch (err) {
    return res.status(400).json({ error: "Error retrieving projects." });
  }
};

exports.getAssignedProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      assigned_to: req.payload.userObj.userDetails.userName,
    }).populate("owner", "_id, username");

    res.json(projects);
  } catch (err) {
    return res.status(400).json({ error: "Error retrieving projects." });
  }
};

exports.getProjectById = async (req, res) => {
  const projectId = req.params.id;
  try {
    const project = await Project.findById(projectId).populate(
      "owner",
      "_id, username"
    );
    res.json(project);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Error retrieving projects." });
  }
};

exports.addComment = async (req, res) => {
  const projectId = req.params.id;

  const { comment, commentedAt } = req.body;
  try {
    const project = await Project.findById(projectId);

    project.comments.push({
      username: req.payload.userObj.userDetails.userName,
      comment,
    });

    await project.save();
    res.send(project);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Error retrieving projects." });
  }
};

exports.markProjectComplete = async (req, res) => {
  const projectId = req.params.id;
  try {
    const project = await Project.findById(projectId);
    project.status = "Completed";
    await project.save();
    res.send(project);
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ error: "Error updating project as complete." });
  }
};

exports.deleteProject = async (req, res) => {
  const projectId = req.params.id;
  try {
    const project = await Project.deleteOne({ _id: projectId });
    res.send("Project deleted successfully.");
  } catch (error) {
    return res.status(400).json({ error: "Error deleting project." });
  }
};

exports.editProject = async (req, res) => {
  const projectId = req.params.id;
  let project = await Project.findById(projectId);

  const { name, category, deadline, assigned_to, description } = req.body;

  if (project) {
    project.deadline = deadline;
    project.assigned_to = assigned_to;
    project.description = description;
    project.category = category;
    project.name = name;
    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    return res.json({ error: "Error updating project details." });
  }
};

exports.assignedProjectsStats = async (req, res) => {
  try {
    const stats = await Project.aggregate([
      { $unwind: "$assigned_to" },

      {
        $match: {
          assigned_to: { $in: [req.payload.userObj.userDetails.userName] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          projects: { $sum: 1 },
        },
      },
      { $sort: { year: -1, month: -1 } },
    ]);
    res.status(200).send(stats);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
