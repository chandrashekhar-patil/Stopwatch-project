import { io } from "socket.io-client";

const socket = io("https://stop-nvm1.onrender.com"); // use your Render backend URL in production
export default socket;
