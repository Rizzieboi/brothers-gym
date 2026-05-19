const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Brothers Gym API Running");
});

// TEST ROUTE
app.post("/api/members", async (req, res) => {
  try {
    console.log(req.body);

    return res.status(200).json({
      success: true,
      message: "Member added successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});