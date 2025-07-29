import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import sessionRoutes from "./routes/sessionRoutes.js";
import { Session } from "./models/Session.js";
import { Timer } from "./models/Timer.js";
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/api/sessions", sessionRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT || 10000, () =>
      console.log(`Server on ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB error:", err.message);
  });

io.on("connection", (socket) => {
  socket.on("createSession", async () => {
    const session = new Session({
      _id: Math.random().toString(36).substring(2, 10),
    });
    await session.save();
    socket.join(session._id);
    socket.emit("sessionData", { session, timers: [] });
  });

  socket.on("joinSession", async (id) => {
    const session = await Session.findById(id).populate("timers");
    if (session) {
      socket.join(id);
      socket.emit("sessionData", { session, timers: session.timers });
    }
  });

  socket.on("createTimer", async ({ sessionId, title, description }) => {
    const timer = await new Timer({ title, description, sessionId }).save();
    await Session.findByIdAndUpdate(sessionId, {
      $push: { timers: timer._id },
    });
    io.to(sessionId).emit("timerCreated", timer);
  });

  socket.on("startTimer", async ({ sessionId, timerId }) => {
    const timer = await Timer.findById(timerId);
    if (timer && !timer.isRunning) {
      Object.assign(timer, { isRunning: true, startTime: new Date() });
      await timer.save();
      io.to(sessionId).emit("timerUpdated", timer);
    }
  });

  socket.on("pauseTimer", async ({ sessionId, timerId }) => {
    const timer = await Timer.findById(timerId);
    if (timer?.isRunning) {
      timer.isRunning = false;
      timer.elapsed += Math.floor(
        (Date.now() - new Date(timer.startTime)) / 1000
      );
      timer.startTime = null;
      await timer.save();
      io.to(sessionId).emit("timerUpdated", timer);
    }
  });

  socket.on("resetTimer", async ({ sessionId, timerId }) => {
    const timer = await Timer.findById(timerId);
    if (timer) {
      Object.assign(timer, { isRunning: false, elapsed: 0, startTime: null });
      await timer.save();
      io.to(sessionId).emit("timerUpdated", timer);
    }
  });
});
