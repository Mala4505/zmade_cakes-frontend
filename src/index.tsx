import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client"; // ✅ React 18 uses react-dom/client
import { App } from "./App";

// Grab the root element
const container = document.getElementById("root");

// Create a root and render
const root = ReactDOM.createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
