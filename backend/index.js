// const express = require("express");
// const cors = require("cors");
// const app = express();
// const connectToDatabase = require("./db/mongo");
// require('dotenv').config();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Backend is running...");
// });

// // Mount testing routes if needed
// app.use("/testingDB", require("./routes/testingDB"));

// // Mount tasks routes
// app.use("/api/tasks", require("./routes/tasks"));

// // Mount scheduling routes
// app.use("/api/scheduling", require("./routes/scheduling"));
// app.use("/api/suggestions", require("./routes/suggestions"));

// // Mount profile routes
// app.use("/profilePage", require("./routes/profilePage"));

// connectToDatabase()
//   .then(() => {
//     const PORT = process.env.PORT || 7000;
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch(err => {
//     console.error("Error connecting to the database:", err);
//   });
//   // module.exports = app;




const express = require("express");
const cors = require("cors");
const app = express();
const connectToDatabase = require("./db/mongo");
require("dotenv").config();

// Configure CORS to allow requests only from your frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://taskwise-sigma.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // Only needed if you're sending cookies or auth headers
}));

// require("dotenv").config();
// console.log("Allowed frontend URL:", process.env.FRONTEND_URL);

// app.use(cors());

// app.get("/test-cors", (req, res) => {
//   res.json({ origin: req.headers.origin });
// });


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
