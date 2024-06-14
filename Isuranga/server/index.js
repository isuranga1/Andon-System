const express = require("express");
const app = express();
const mongoose = require("mongoose");
const UserModel = require("./models/Users");
const ConsoleIDModel = require("./models/ConsoleIds");
const CallModel = require("./models/Calls");
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
  // Enables CORS for easy connection with React frontend eg:-(http://localhost:3000)
  cors: {
    origin: "http://localhost:5173",
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

//------------------------- Endpoints for the 1st page--------------------------------------

app.get("/getGraph", async (req, res) => {
  // can be demo by thunderclient

  try {
    const graph = [
      { x: 0, y: 8 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 1 },
      { x: 4, y: 3 },
      { x: 5, y: 1 },
      { x: 6, y: 5 },
    ];
    res.json(graph);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: " error graph" });
  }
});

app.get("/getActiveCalls", async (req, res) => {
  // can be demo by thunderclient

  try {
    const activecalls = [
      {
        consoleidin: 1,
        callhoursin: 3,
        collmintsin: 4,
        departmentin: 2,
        call1in: "Red",
        call2in: "Yellow",
        call3in: "Green",
        oldcallin: "Red",
      },
      {
        consoleidin: 1,
        callhoursin: 3,
        collmintsin: 4,
        departmentin: 2,
        call1in: "Red",
        call2in: "Yellow",
        call3in: "Green",
        oldcallin: "Red",
      },
    ];
    res.json(activecalls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error active calls " });
  }
});
//-------------Endpoints for the machines(2nd)page----------------------------

// get machine numbers and console ID s

app.get("/getMachines", async (req, res) => {
  // can be demo by thunderclient

  try {
    const machine = await ConsoleIDModel.find({});
    res.json(machine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching machines" });
  }
});

// post machine numbers and console ID s to the database
app.post("/createMachine", async (req, res) => {
  // can be demo by thunderclient

  const machine = req.body;
  const newMachine = new ConsoleIDModel(machine);
  await newMachine.save();
  res.json(machine);
});

app.post("/deletemachine", async (req, res) => {
  try {
    const machine = req.body;
    const deletedMachine = await ConsoleIDModel.deleteOne({
      machine: machine.machine,
    });
    if (deletedMachine.deletedCount === 1) {
      res.json({ message: "Machine deleted successfully" });
    } else {
      res.status(404).json({ error: "Machine not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//----------------------------Endpoints for the calls(3rd)page--------------------------------------------------------

app.get("/getCalls", async (req, res) => {
  try {
    const call = await CallModel.find({});
    res.json(call);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching machines" });
  }
});

app.post("/createCall", async (req, res) => {
  const call = req.body;
  const newCall = new CallModel(call);
  await newCall.save();
  res.json(call);
});

app.post("/deletecall", async (req, res) => {
  try {
    const call = req.body;
    console.log(call);
    const deletedCall = await CallModel.deleteOne({ Color: call.Color });
    if (deletedCall.deletedCount === 1) {
      res.json({ message: "Call deleted successfully" });
    } else {
      res.status(404).json({ error: "Call not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//---------------------------------Endpoints for the depts(4th)page----------------------------------------

app.get("/getUsers", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.post("/createUser", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();
  res.json(user);
});

app.post("/deleteuser", async (req, res) => {
  try {
    const user = req.body;
    const deletedUser = await UserModel.deleteOne({ name: user.name });
    if (deletedUser.deletedCount === 1) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//----------------------------------------------------------------------------------------

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
        function sendArrayToFrontend(array) {
          //if (
          // typeof array !== "number" ||
          //!Number.isInteger(array)
          //) {
          //console.error("Invalid argument: Please provide an integer value.");
          //return;
          // }

          io.emit("integer_received", array); // Custom event name
        }

        sendArrayToFrontend(dataArray);

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
