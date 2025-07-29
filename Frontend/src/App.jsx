import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Session from "./pages/Session";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/session/:id" element={<Session />} />
    </Routes>
  </Router>
);

export default App;
