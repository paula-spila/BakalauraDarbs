import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { VariantProvider } from "./context/VariantContext.jsx";
import { CartProviderBridge } from "./context/CartProviderBridge.jsx";
import App from "./App.jsx";
import "./index.css";
import "./variants/rich/theme.css";
import "./variants/rich/rich-extras.css";
import "./variants/rich/rich-chrome.css";
import "./styles/usability-test.css";

const rawBase = import.meta.env.BASE ?? "/";
const basename =
  rawBase === "/" || rawBase === "" || rawBase === "."
    ? undefined
    : String(rawBase).replace(/\/+$/, "") || undefined;

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error('Missing #root element in index.html');
}

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter {...(basename ? { basename } : {})}>
      <VariantProvider>
        <CartProviderBridge>
          <App />
        </CartProviderBridge>
      </VariantProvider>
    </BrowserRouter>
  </StrictMode>,
);
