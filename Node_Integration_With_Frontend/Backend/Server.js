const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"]
  }
});
app.use(cors());
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/TOPS_DB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error", err));


const chatSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});
const Chat = mongoose.model("Chat", chatSchema);


io.on("connection", async (socket) => {
  console.log("New client connected...!");

  
  const messages = await Chat.find();
  socket.emit("loadMessages", messages);

  
  socket.on("chatMessage", async (msg) => {
    console.log("Message received:", msg);
    const saved = await Chat.create(msg); 
    io.emit("chatMessage", saved);        
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Server is running...");
});


server.listen(10000, () => {
  console.log("Server running on http://localhost:10000 🚀");
});
