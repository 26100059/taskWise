const express = require("express");
const app = express()

app.get(
    "/",
    (req, res) => {
        res.send("Testing backend.")
    }
)
app.listen(
    7000,
    ()=> console.log("Backend is running.")
)