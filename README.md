# Collaborative Timer App

A real-time collaborative timer application that allows multiple users to create, manage, and track timers together in shared sessions. Built with React frontend and Node.js backend, featuring real-time synchronization via Socket.IO.

## Features

- **Real-time Collaboration**: Multiple users can join the same session and see timer updates in real-time
- **Session Management**: Create and join timer sessions with unique IDs
- **Timer Controls**: Start, pause, and reset timers with instant synchronization
- **Persistent Storage**: Sessions and timers are saved to MongoDB
- **WebSocket Communication**: Real-time updates using Socket.IO
- **Responsive UI**: Clean, modern interface built with React and Tailwind CSS
- **Live Timer Display**: Real-time timer updates without page refresh

## Tech Stack

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Real-time**: Socket.IO Client
- **Build Tool**: Vite (recommended)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.IO
- **Database**: MongoDB with Mongoose ODM
- **Environment**: dotenv for configuration
- **CORS**: Enabled for cross-origin requests

## Project Structure

```
├── backend/
│   ├── models/
│   │   ├── Session.js          # Session model schema
│   │   └── Timer.js            # Timer model schema
│   ├── routes/
│   │   └── sessionRoutes.js    # REST API routes for sessions
│   ├── index.js               # Main server file with Socket.IO handlers
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TimerCard.jsx   # Individual timer component
│   │   │   └── TimerForm.jsx   # Timer creation form
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing page
│   │   │   └── Session.jsx     # Session management page
│   │   ├── services/
│   │   │   └── socket.js       # Socket.IO client configuration
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # React entry point
│   └── package.json
└── README.md
```

## Installation

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/chandrashekhar-patil/Stopwatch-project
   cd Stopwatch-project
   ```

2. **Install backend dependencies**
   ```bash
   npm install express socket.io mongoose cors dotenv
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb:URL
   PORT=10000
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install frontend dependencies**
   ```bash
   npm install react react-dom react-router-dom socket.io-client
   npm install -D @vitejs/plugin-react vite tailwindcss postcss autoprefixer
   ```

3. **Initialize Tailwind CSS**
   ```bash
   npx tailwindcss init -p
   ```

4. **Configure Tailwind (tailwind.config.js)**
   ```javascript
   export default {
     content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
     theme: { extend: {} },
     plugins: [],
   }
   ```

5. **Add Tailwind to CSS (src/index.css)**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

6. **Update socket service for production**
   In `src/services/socket.js`, change the URL for production:
   ```javascript
   const socket = io(process.env.NODE_ENV === 'production' 
     ? 'your-backend-url' 
     : 'http://localhost:10000'
   );
   ```

7. **Start the frontend development server**
   ```bash
   npm run dev
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

### Frontend User Flow

1. **Home Page**: Users can create a new session or join an existing one
2. **Session Page**: View and manage timers in real-time with other participants

### Creating a Session (Frontend)
```javascript
// In Home.jsx
const handleCreate = () => {
  socket.emit("createSession");
  socket.on("sessionData", ({ session }) => {
    navigate(`/session/${session._id}`);
  });
};
```

### Timer Management (Frontend)
```javascript
// TimerCard component handles timer controls
const TimerCard = ({ timer, sessionId }) => {
  return (
    <div className="border p-4 rounded shadow bg-white">
      <h3>{timer.title}</h3>
      <p>{getDisplayTime(timer)}s</p>
      <button onClick={() => 
        socket.emit("startTimer", { sessionId, timerId: timer._id })
      }>
        Start
      </button>
    </div>
  );
};
```

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

#### Backend
```bash
cd backend
npm install
npm run dev  # with nodemon for auto-restart
# or
npm start    # normal start
```

#### Frontend
```bash
cd frontend
npm install
npm run dev  # Vite development server
```

### Environment Variables

#### Backend (.env)
- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (default: 10000)

#### Frontend
Update the socket service URL in `src/services/socket.js` for different environments:
```javascript
const socket = io(
  process.env.NODE_ENV === 'production' 
    ? 'https://stop-nvm1.onrender.com' 
    : 'http://localhost:10000'
);
```

### Package.json Scripts

#### Backend
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

#### Frontend
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Deployment

### Backend Deployment
The backend is configured to work with cloud platforms like Render, Heroku, or Railway:

1. Set environment variables in your platform:
   - `MONGO_URI`: Your MongoDB connection string
   - `PORT`: Will use platform's assigned port
2. Ensure CORS is configured for your frontend domain
3. The server listens on `process.env.PORT || 10000`

### Frontend Deployment
For platforms like Vercel, Netlify, or similar:

1. Build the frontend:
   ```bash
   npm run build
   ```
2. Update the socket URL in production:
   ```javascript
   const socket = io('https://stop-nvm1.onrender.com');
   ```
3. Deploy the `dist` folder

### Full Stack Deployment Example

#### Backend on Render
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables

#### Frontend on Vercel
1. Connect your GitHub repository (frontend folder)
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Update socket URL to point to your Render backend

## Component Documentation

### TimerCard Component
Displays individual timer with real-time updates and control buttons.

**Props:**
- `timer`: Timer object with title, description, elapsed time, and running state
- `sessionId`: Current session ID for socket events

**Features:**
- Real-time display calculation
- Start/Pause/Reset controls
- Responsive design with Tailwind CSS

### TimerForm Component
Form for creating new timers in a session.

**Props:**
- `sessionId`: Session ID to associate the new timer

**Features:**
- Controlled form inputs
- Socket emission for timer creation
- Form reset after submission

### Home Page
Landing page for creating or joining sessions.

**Features:**
- Create new session button
- Join existing session input
- Navigation to session pages

### Session Page
Main collaborative interface for timer management.

**Features:**
- Real-time session data loading
- Timer creation form
- Grid layout of timer cards
- Socket event handling for real-time updates

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Timer templates and presets
- [ ] Session sharing via QR codes
- [ ] Timer history and analytics
- [ ] Audio notifications and alerts
- [ ] Dark mode toggle
- [ ] Timer categories and color coding
- [ ] Export session data (CSV, JSON)
- [ ] Mobile app (React Native)
- [ ] Voice commands for timer control
- [ ] Integration with calendar apps
- [ ] Team productivity insights
- [ ] Custom timer intervals (Pomodoro technique)
- [ ] Session recording and playback

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
