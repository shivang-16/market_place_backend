import express from "express";
import userRouter from "./Routes/userRoutes.js";
import itemRouter from "./Routes/itemRoutes.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

export const app = express();

config({
  path: "./Data/config.env",
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", itemRouter);

app.get("/", (req, res) => {
  res.send("Server is working fine");
});

export const server = createServer(app);
const users = [{}];
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user is connected");

  socket.on("joined", ({ user }, callback) => {
    console.log(`${user} has joined`);
    users[socket.id] = user; // Store the user's name by socket.id
    callback(socket.id);
    // Send a "user joined" message to all other connected users
    socket.broadcast.emit("userJoined", {
      user: "Admin:",
      message: `${user} joined the chat`,
    });
  });

  socket.on("bid", (payload) => {
    console.log(payload);
    io.emit("bid", payload);
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      delete users[socket.id];
      // Send a "user left" message to all other connected users
      socket.broadcast.emit("leave", {
        user: "Admin:",
        message: `${user} left the chat`,
      });
    }
  });
});
