import { io } from "socket.io-client";

const socket = io("http://localhost:10000"); // use your Render backend URL in production
export default socket;
