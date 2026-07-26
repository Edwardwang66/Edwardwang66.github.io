import React from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import Portfolio from "./Portfolio.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Portfolio />
    <Analytics />
  </React.StrictMode>
);
