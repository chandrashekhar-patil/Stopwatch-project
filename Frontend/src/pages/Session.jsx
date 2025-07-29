// src/pages/Session.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../services/socket";
import TimerCard from "../components/TimerCard";
import TimerForm from "../components/TimerForm";

const Session = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    socket.emit("joinSession", id);

    socket.on("sessionData", ({ session, timers }) => {
      setSession(session);
      setTimers(timers);
    });

    socket.on("timerCreated", (timer) => {
      setTimers((prev) => [...prev, timer]);
    });

    socket.on("timerUpdated", (updatedTimer) => {
      setTimers((prev) =>
        prev.map((t) => (t._id === updatedTimer._id ? updatedTimer : t))
      );
    });
  }, [id]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Session: {session?._id}</h2>
      <TimerForm sessionId={id} />
      <div className="grid gap-4 mt-6">
        {timers.map((timer) => (
          <TimerCard key={timer._id} timer={timer} sessionId={id} />
        ))}
      </div>
    </div>
  );
};

export default Session;