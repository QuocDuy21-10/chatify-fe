import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./routes";
import { SocketConnectionHandler } from "./components/socket-connection-handler";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketConnectionHandler />
    <RouterProvider router={router} />
  </StrictMode>
);
