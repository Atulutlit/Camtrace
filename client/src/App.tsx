import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Camtrace from "./features/Camtrace";
import IpFetch from "./features/IPFetch";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Camtrace />} />

        {/* Topics route */}
        <Route path="/topics" element={<IpFetch />} />
      </Routes>
    </Router>
  );
}
