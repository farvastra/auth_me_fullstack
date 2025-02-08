import React from "react";
import { createRoot } from "react-dom/client"; 
import { Provider } from "react-redux";
import "./index.css";
import store from "./store/store"; 
import App from "./App";

console.log("Redux Store:", store); 
console.log("Store getState method:", store.getState); 
const rootElement = document.getElementById("root");

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
