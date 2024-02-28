const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

app.use(express.json());
app.use(cors());
app.use("/api/user", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/category", categoryRoutes);
connectDB();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.resolve("client", "build", "index.html"));
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`API is running on ${port}`);
});
