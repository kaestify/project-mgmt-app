import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import BarChart from "../charts/BarChart";
import Cookies from "js-cookie";
import ExpirationModal from "../components/ExpirationModal";

const ProfileScreen = () => {
  const [assignedProjects, setAssignedProjects] = useState([]);

  useEffect(() => {
    fetchAssignedProjects();
  }, []);

  const fetchAssignedProjects = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    };

    try {
      const { data } = await axios.get(
        "/api/project/assigned-project-stats",
        config
      );
      setAssignedProjects(data);
    } catch (err) {
      console.log(err);
    }
  };

  //MANIPULATE DATA FOR ASSIGNED PROJECTS
  let projectSorted =
    assignedProjects &&
    assignedProjects.sort((a, b) => {
      if (a._id.year === b._id.year) {
        return a._id.month < b._id.month ? -1 : 1;
      } else {
        return a._id.year < b._id.year ? -1 : 1;
      }
    });

  let projects = projectSorted && projectSorted.map((a) => a.projects);
  let labels = [];

  assignedProjects &&
    assignedProjects.forEach((e) => {
      const labelName = e._id.year.toString() + "-" + e._id.month.toString();
      labels.push(labelName);
      console.log(labels, "LABELS");
    });

  const dataForBarChart = {
    labels: labels,
    datasets: [
      {
        label: "Total projects assigned to you",
        data: projects,
        backgroundColor: "pink",
      },
    ],
  };

  return (
    <div>
      <ExpirationModal />
      <Navbar />
      <h2>Total projects assigned to you by year & month</h2>
      {assignedProjects.length > 0 && <BarChart chartData={dataForBarChart} />}
    </div>
  );
};

export default ProfileScreen;
