// src/components/TimerForm.jsx
import { useState } from "react";
import socket from "../services/socket";

const TimerForm = ({ sessionId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("createTimer", { sessionId, title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        className="w-full border px-4 py-2 rounded"
        placeholder="Timer Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="w-full border px-4 py-2 rounded"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button className="bg-indigo-600 text-white px-6 py-2 rounded">Add Timer</button>
    </form>
  );
};

export default TimerForm;