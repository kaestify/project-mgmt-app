import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Select from "react-select";
import Navbar from "../components/Navbar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import ExpirationModal from "../components/ExpirationModal";
import axios from "axios";
const EditProjectScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    deadline: "",
    description: "",
    status: "",
    assigned_to: [],
    category: "",
    error: "",
    success: false,
  });

  const {
    name,
    deadline,
    description,
    status,
    assigned_to,
    error,
    success,
    category,
  } = values;

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  };

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
      await axios.put(`/api/project/edit/${id}`, projectObj, config);

      setValues({
        name: "",
        deadline: "",
        description: "",
        category: "",
        assigned_to: [],
        success: true,
      });
      toast.success("Project updated successfully!");

      return navigate("/");
    } catch (err) {
      setValues({
        ...values,
        error: "Error updating project. Please try again.",
      });
    }
  };

  const loadSingleProject = async () => {
    try {
      const { data } = await axios.get(`/api/project/view/${id}`, config);
      setValues({
        ...values,
        name: data.name,
        deadline: data.deadline,
        description: data.description,
        status: data.status,
        // category: data.category,
        // assigned_to: data.assigned_to,
        success: true,
      });
    } catch (err) {
      setValues({ ...values, error: err.response.data.error });
    }
  };

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  useEffect(() => {
    fetchCategories();
    fetchUsers();
    loadSingleProject();
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

  const handleUserAssignment = (option) => {
    setAssignedUsers(option);
  };

  const editProjectForm = () => (
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
      </div>{" "}
      {status && status}
      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
  return (
    <div>
      <ToastContainer />
      <ExpirationModal />
      <Navbar />
      <h1>Edit Project</h1>
      <div>{editProjectForm()}</div>
    </div>
  );
};

export default EditProjectScreen;
