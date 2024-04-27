const express = require("express");
const app = express();
const mongoose = require("mongoose");
const UserModel = require("./models/users");
const http = require("http"); // this is used for socket.io
const { Server } = require("socket.io");

const cors = require("cors"); // connects to react
const server = http.createServer(app); // for sockets

//connect esp32 using websockets
var WebSocketServer = require("websocket").server;
const port = 443;

var serverforEsp = http.createServer(function (request, response) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});
//

app.use(express.json()); // this parses json which gives by frontend to objects used in backend
app.use(cors()); //import the library

const io = new Server(server, {
  // Enables CORS for easy connection with React frontend (http://localhost:3000)
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//database connection initilaisation
mongoose
  .connect(
    "mongodb+srv://isuranga1:Nevira2001@cluster0.gkszxqj.mongodb.net/andondb?retryWrites=true&w=majority&appName=Cluster0"
  ) //Change this to the according database
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

//get request from frontend
app.get("/getUsers", async (req, res) => {
  // demo by thunderclient
  try {
    const machines = await UserModel.find({});
    res.json(machines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching machines" });
  }
});

//post request from front end
app.post("/createUser", async (req, res) => {
  // demo by thunderclient

  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();
  res.json(user);
});

server.listen(3001, () => {
  //listening for websocket server

  console.log("websocket server is running");
});
app.listen(3002, () => {
  console.log("server runs");
});

//code for esp32

serverforEsp.listen(port, function () {
  console.log(new Date() + " ESPServer is listening on port 443");
});
wsServer = new WebSocketServer({
  httpServer: serverforEsp,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false,
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on("request", function (request) {
  console.log(request);
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected."
    );
    return;
  }

  var connection = request.accept(null, request.origin);
  console.log(new Date() + " Connection accepted.");

  connection.on("message", function (message) {
    if (message.type === "utf8") {
      // console.log('Received Message: ' + message.utf8Data);
      //connection.sendUTF(message.utf8Data); this resend the reseived message, instead of it i will send a custom message. hello from nodejs
      const dataArray = JSON.parse(message.utf8Data);
      const espID = dataArray[0];
      const espstatus = dataArray[1];
      const espDowntime = dataArray[2];
      console.log(
        "Received Status: " +
          espstatus +
          " from:Esp " +
          espID +
          " at " +
          new Date()
      );

      io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // Function to emit an event with the integer value
        function sendIntegerToFrontend(integerValue) {
          if (
            typeof integerValue !== "number" ||
            !Number.isInteger(integerValue)
          ) {
            console.error("Invalid argument: Please provide an integer value.");
            return;
          }

          socket.emit("integer_received", integerValue); // Custom event name
        }

        sendIntegerToFrontend(espstatus);

        // Listen for potential disconnections
        socket.on("disconnect", () => {
          console.log("User disconnected:", socket.id);
        });
      });

      connection.sendUTF("Hello from node.js");
    } else if (message.type === "binary") {
      //console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
      connection.sendBytes(message.binaryData);
    }
  });
  //

  connection.on("close", function (reasonCode, description) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
  });
});
// endcode for esp 32
