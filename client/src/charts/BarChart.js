import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import React from "react";

const BarChart = ({ chartData }) => {
  const options = {
    responsive: true,
    legend: {
      display: true,
    },
    type: "bar",
  };

  return <Bar data={chartData} options={options} height="100px" />;
};

export default BarChart;
