const express = require("express");
const cors = require("cors");
const app = express();
const connectToDatabase = require("./db/mongo");
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Mount testing routes if needed
app.use("/testingDB", require("./routes/testingDB"));

// Mount tasks routes
app.use("/api/tasks", require("./routes/tasks"));

// Mount scheduling routes
app.use("/api/scheduling", require("./routes/scheduling"));
app.use("/api/suggestions", require("./routes/suggestions"));

// Mount profile routes
app.use("/profilePage", require("./routes/profilePage"));

connectToDatabase()
  .then(() => {
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("Error connecting to the database:", err);
  });
  // module.exports = app;