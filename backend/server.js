require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// IMPORT ROUTES
const memberRoutes = require("./routes/memberRoutes");

// API ROUTES
app.use("/api/members", memberRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Brothers Gym API Running");
});

// PORT
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});