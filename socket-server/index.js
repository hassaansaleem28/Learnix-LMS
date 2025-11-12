import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "https://lms-frontend-plum-three.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("notification", (data) => {
    io.emit("newNotification", data);
  });

  socket.on("disconnect", () => {
    console.log(" Socket disconnected:", socket.id);
  });
} );

app.get( "/", ( req, res ) => {
  res.send({success: true, message: "Socket Server is Live!"})
} )

const PORT = process.env.PORT || 5050;

httpServer.listen(PORT, () => {
  console.log(" Socket.IO server running on port 5050");
});
