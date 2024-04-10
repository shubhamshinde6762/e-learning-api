const express = require("express");
const cors = require("cors");
const expressFileUploader = require("express-fileupload");
const { dbConnect } = require("./config/db.js");
const { cdnConnect } = require("./config/cdn.js");
const courseRoutes = require("./routes/courseRoutes.js");
const superAdmin = require("./routes/superAdmin.js"); 
const userRoutes = require("./routes/userRoutes.js");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  expressFileUploader({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cors());

app.get("/", (req, res) => {
  res.send("welcome to E-Learn_Api");
});

app.use("/api/v1", courseRoutes);
app.use("/api/v1", superAdmin);
app.use("/api/v1", userRoutes);

dbConnect();
cdnConnect();

app.listen(process.env.PORT, () => console.log("Server Started"));
module.exports = app;
