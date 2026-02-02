import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Portfolio from "./pages/Portfolio";
import IrcClient from "./pages/IrcClient";
import CubeRedirect from "./pages/CubeRedirect";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/irc" element={<IrcClient />} />
        <Route path="/cube" element={<CubeRedirect />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);