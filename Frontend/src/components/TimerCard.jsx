// src/components/TimerCard.jsx
import socket from "../services/socket";

const getDisplayTime = (timer) => {
  if (timer.isRunning) {
    return timer.elapsed + Math.floor((Date.now() - new Date(timer.startTime)) / 1000);
  }
  return timer.elapsed;
};

const TimerCard = ({ timer, sessionId }) => {
  const time = getDisplayTime(timer);

  return (
    <div className="border p-4 rounded shadow bg-white">
      <h3 className="text-lg font-semibold">{timer.title}</h3>
      <p className="text-sm text-gray-600">{timer.description}</p>
      <p className="text-2xl my-2">{time}s</p>
      <div className="flex gap-2">
        {!timer.isRunning && (
          <button
            className="bg-green-600 text-white px-4 py-1 rounded"
            onClick={() => socket.emit("startTimer", { sessionId, timerId: timer._id })}
          >
            Start
          </button>
        )}
        {timer.isRunning && (
          <button
            className="bg-yellow-500 text-white px-4 py-1 rounded"
            onClick={() => socket.emit("pauseTimer", { sessionId, timerId: timer._id })}
          >
            Pause
          </button>
        )}
        <button
          className="bg-red-600 text-white px-4 py-1 rounded"
          onClick={() => socket.emit("resetTimer", { sessionId, timerId: timer._id })}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default TimerCard;