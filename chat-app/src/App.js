import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PublicChat from "./components/PublicChat";
import RoomChat from "./components/RoomChat";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicChat />} />
        <Route path="/room/:roomId/:username" element={<RoomChat />} />
      </Routes>
    </Router>
  );
};

export default App;