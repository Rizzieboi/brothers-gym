const express = require("express");
const cors = require("cors");

const memberRoutes = require("./routes/memberRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/members", memberRoutes);

app.get("/", (req, res) => {
  res.send("Brothers Gym API Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});