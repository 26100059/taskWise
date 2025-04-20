// ===== DEPLOYMENT CONFIGURATION =====

const express = require("express");
const cors = require("cors");
const app = express();
const connectToDatabase = require("./db/mongo");
require("dotenv").config();

const allowedOrigins = [
  "https://taskwise-sigma.vercel.app",
  "https://taskwise-lk4iclmb8-anonymouscobra789-gmailcoms-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.use("/testingDB", require("./routes/testingDB"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/scheduling", require("./routes/scheduling"));
app.use("/api/suggestions", require("./routes/suggestions"));
app.use("/profilePage", require("./routes/profilePage"));

connectToDatabase()
  .then(() => {
    const PORT = process.env.PORT || 7000;
    app.listen(PORT);
  })
  .catch(() => {
  });



// ===== LOCALHOST CONFIGURATION =====

// const express = require("express");
// const cors = require("cors");
// const app = express();
// const connectToDatabase = require("./db/mongo");
// require('dotenv').config();

// app.use(cors()); 
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Backend is running (Localhost)...");
// });

// app.use("/testingDB", require("./routes/testingDB"));
// app.use("/api/tasks", require("./routes/tasks"));
// app.use("/api/scheduling", require("./routes/scheduling"));
// app.use("/api/suggestions", require("./routes/suggestions"));
// app.use("/profilePage", require("./routes/profilePage"));

// connectToDatabase()
//   .then(() => {
//     const PORT = process.env.PORT || 7000;
//     app.listen(PORT);
//   })
//   .catch(() => {
//   });
