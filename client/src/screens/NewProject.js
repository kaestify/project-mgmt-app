import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import ExpirationModal from "../components/ExpirationModal";
import { ToastContainer, toast } from "react-toastify";

const NewProject = () => {
  const [values, setValues] = useState({
    name: "",
    deadline: "",
    description: "",
    category: "",
    assigned_to: [],
    error: "",
    success: false,
  });

  useEffect(() => {
    fetchCategories();
    fetchUsers();
  }, []);

  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  useEffect(() => {
    if (users) {
      const options = users.map((user) => {
        return { value: user, label: user.username };
      });
      setUserOptions(options);
    }
  }, [users]);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  };

  const { name, deadline, description, category, assigned_to, error, success } =
    values;

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        "/api/category/getallcategories",
        config
      );
      setCategories(data);
    } catch (err) {
      setValues({ ...values, error: "Error fetching categories..." });
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/user/getallusers", config);
      setUsers(data);
    } catch (err) {
      setValues({ ...values, error: "Error fetching users..." });
    }
  };

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const handleUserAssignment = (option) => {
    setAssignedUsers(option);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let assigned = [];
    assignedUsers &&
      assignedUsers.forEach((user) => assigned.push(user.value.username));

    const projectObj = {
      name,
      description,
      deadline,
      category,
      assigned_to: assigned,
    };
    try {
      await axios.post(`/api/project/create`, projectObj, config);

      setValues({
        name: "",
        deadline: "",
        description: "",
        category: "",
        assigned_to: [],
        success: true,
      });
      toast.success("Project added successfully!");
    } catch (err) {
      setValues({
        ...values,
        error: "Error creating project. Please try again.",
      });
    }
  };
  const addNewProjectForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Project Title</label>
        <input
          required
          type="text"
          onChange={handleChange("name")}
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Project Description</label>
        <textarea
          required
          type="text"
          onChange={handleChange("description")}
          className="form-control"
          value={description}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Deadline</label>
        <input
          required
          type="date"
          onChange={handleChange("deadline")}
          className="form-control"
          value={deadline}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Category</label>
        <select onChange={handleChange("category")} className="form-control">
          <option>Please select</option>
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Assign To</label>
        <Select options={userOptions} onChange={handleUserAssignment} isMulti />
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <ExpirationModal />
      {addNewProjectForm()}
    </div>
  );
};

export default NewProject;
