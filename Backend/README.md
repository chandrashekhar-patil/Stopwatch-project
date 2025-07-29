# Collaborative Timer App

A real-time collaborative timer application that allows multiple users to create, manage, and track timers together in shared sessions. Built with Node.js, Express, Socket.IO, and MongoDB.

## Features

- **Real-time Collaboration**: Multiple users can join the same session and see timer updates in real-time
- **Session Management**: Create and join timer sessions with unique IDs
- **Timer Controls**: Start, pause, and reset timers with instant synchronization
- **Persistent Storage**: Sessions and timers are saved to MongoDB
- **WebSocket Communication**: Real-time updates using Socket.IO

## Tech Stack

- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.IO
- **Database**: MongoDB with Mongoose ODM
- **Environment**: dotenv for configuration
- **CORS**: Enabled for cross-origin requests

## Project Structure

```
├── models/
│   ├── Session.js          # Session model schema
│   └── Timer.js            # Timer model schema
├── routes/
│   └── sessionRoutes.js    # REST API routes for sessions
├── index.js               # Main server file with Socket.IO handlers
└── README.md
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collaborative-timer-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/collaborative-timers
   PORT=10000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## API Endpoints

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Create a new session |
| GET | `/api/sessions/:id` | Get session details with timers |
| POST | `/api/sessions/:id/timers` | Add a new timer to a session |

### Socket.IO Events

#### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `createSession` | - | Creates a new session and joins it |
| `joinSession` | `sessionId` | Joins an existing session |
| `createTimer` | `{sessionId, title, description}` | Creates a new timer in the session |
| `startTimer` | `{sessionId, timerId}` | Starts a specific timer |
| `pauseTimer` | `{sessionId, timerId}` | Pauses a running timer |
| `resetTimer` | `{sessionId, timerId}` | Resets a timer to 0 |

#### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `sessionData` | `{session, timers}` | Session details and associated timers |
| `timerCreated` | `timer` | New timer created notification |
| `timerUpdated` | `timer` | Timer state updated notification |

## Data Models

### Session Model
```javascript
{
  _id: String,              // Custom session ID
  title: String,            // Session title (default: "Untitled Session")
  description: String,      // Session description
  createdAt: Date,          // Creation timestamp
  timers: [ObjectId]        // Array of timer references
}
```

### Timer Model
```javascript
{
  title: String,            // Timer name
  description: String,      // Timer description
  elapsed: Number,          // Elapsed time in seconds
  isRunning: Boolean,       // Timer running state
  startTime: Date,          // When timer was started
  sessionId: String         // Parent session ID
}
```

## Usage Examples

### Creating a Session (REST API)
```javascript
const response = await fetch('/api/sessions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Work Session',
    description: 'Daily standup timers'
  })
});
```

### Socket.IO Client Connection
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:10000');

// Create a new session
socket.emit('createSession');

// Join an existing session
socket.emit('joinSession', 'session-id');

// Listen for session data
socket.on('sessionData', ({ session, timers }) => {
  console.log('Session:', session);
  console.log('Timers:', timers);
});

// Create a timer
socket.emit('createTimer', {
  sessionId: 'session-id',
  title: 'Daily Standup',
  description: 'Team standup timer'
});

// Control timer
socket.emit('startTimer', { sessionId: 'session-id', timerId: 'timer-id' });
socket.emit('pauseTimer', { sessionId: 'session-id', timerId: 'timer-id' });
socket.emit('resetTimer', { sessionId: 'session-id', timerId: 'timer-id' });
```

## Development

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Running in Development
```bash
# Install dependencies
npm install

# Start with nodemon for auto-restart
npm run dev

# Or start normally
npm start
```

### Environment Variables
- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (default: 10000)

## Deployment

The application is configured to work with cloud platforms like Render, Heroku, or Railway:

1. Set environment variables in your platform
2. Ensure MongoDB connection string is valid
3. The server listens on `process.env.PORT || 10000`

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Timer templates and presets
- [ ] Session sharing via links
- [ ] Timer history and analytics
- [ ] Audio notifications
- [ ] Mobile responsive frontend
- [ ] Export session data
- [ ] Timer categories and tags

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions, please open an issue on the GitHub repository.