const express = require("express");
const cors = require('cors'); // Import cors
const app = express();
const connectToDatabase = require('./db/mongo');

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Testing backend.");
});

app.use('/testingDB', require('./routes/testingDB'));

connectToDatabase()
  .then(() => {
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("Error connecting to the database:", err);
  });
