import express from "express";
import { Session } from "../models/Session.js";
import { Timer } from "../models/Timer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const session = await new Session(req.body).save();
  res.status(201).json(session);
});

router.get("/:id", async (req, res) => {
  const session = await Session.findById(req.params.id).populate("timers");
  session ? res.json(session) : res.status(404).json({ error: "Session not found" });
});

router.post("/:id/timers", async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const timer = await new Timer({ ...req.body, sessionId: req.params.id }).save();
  session.timers.push(timer._id);
  await session.save();

  res.status(201).json(timer);
});

export default router;
