import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add global error handlers to catch unhandled rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  console.error('Stack:', event.reason?.stack);
  // Don't prevent default - let React Error Boundary handle it
});

window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error);
  console.error('Stack:', event.error?.stack);
});

createRoot(document.getElementById("root")!).render(<App />);
