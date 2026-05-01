import Popup from "@/src/Popup.tsx";
import "@/src/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const element = document.getElementById("root")!;

const root = createRoot(element);

root.render(
    <StrictMode>
        <Popup />
    </StrictMode>
);
