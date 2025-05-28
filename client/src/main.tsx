import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { create } from "zustand";

// More resilient app mounting with error handling
document.addEventListener('DOMContentLoaded', () => {
  try {
    const rootElement = document.getElementById("root");
    
    if (!rootElement) {
      console.error("Root element not found in the DOM");
      return;
    }
    
    const root = createRoot(rootElement);
    root.render(<App />);
    
    console.log("React app successfully mounted");
  } catch (error) {
    console.error("Failed to mount React app:", error);
  }
});
