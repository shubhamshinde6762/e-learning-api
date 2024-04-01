const express = require("express");
const cors = require("cors");
const expressFileUploader = require("express-fileupload");
const { dbConnect } = require("./db/db.js");
const { cdnConnect } = require("./db/cdn.js");

const fetchChatData = require("./routes/ChatHandler/fetchChatData.js");
const sendMessage = require("./routes/ChatHandler/sendMessage.js");

const editProject = require("./routes/ProjectFunctions/editProject.js");
const fetchProject = require("./routes/ProjectFunctions/fetchProject.js");
const invite = require("./routes/ProjectFunctions/invite.js");

const taskHandler = require("./routes/TaskFunctions/taskHandler.js");
const authentication = require("./routes/User/authentication.js");
const updateUser = require("./routes/User/updateUser.js");
const note = require("./routes/User/notes.js");

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

dbConnect();
cdnConnect();

app.listen(process.env.PORT, () => console.log("Server Started"));
module.exports = app;
