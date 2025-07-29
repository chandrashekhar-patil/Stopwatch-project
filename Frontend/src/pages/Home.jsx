// src/pages/Home.jsx
import { useState } from "react";
import socket from "../services/socket";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    socket.emit("createSession");
    socket.on("sessionData", ({ session }) => {
      navigate(`/session/${session._id}`);
    });
  };

  const handleJoin = () => {
    if (sessionId.trim()) navigate(`/session/${sessionId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-gray-50">
      <h1 className="text-3xl font-bold">CollabTime</h1>
      <button className="bg-blue-600 text-white px-6 py-2 rounded" onClick={handleCreate}>
        Create Session
      </button>
      <input
        className="border px-4 py-2 rounded"
        placeholder="Enter Session ID"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
      />
      <button className="bg-green-600 text-white px-6 py-2 rounded" onClick={handleJoin}>
        Join Session
      </button>
    </div>
  );
};

export default Home;