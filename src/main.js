import { jsx as _jsx } from "react/jsx-runtime";
// src/main.tsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./styles.css";
createRoot(document.getElementById("root")).render(_jsx(BrowserRouter, { children: _jsx(App, {}) }));
