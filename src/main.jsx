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

function getRouterBasename() {
  const raw = String(import.meta.env.BASE ?? "/").trim();

  if (raw && raw !== "/" && raw !== "" && raw !== "." && raw !== "./") {
    const b = raw.replace(/\/+$/, "");
    return b || undefined;
  }

  if (typeof window === "undefined") return undefined;

  if (!window.location.hostname.endsWith("github.io")) return undefined;

  const seg = window.location.pathname.split("/").filter(Boolean);

  if (seg.length === 0) return undefined;

  return `/${seg[0]}`;
}

const basename = getRouterBasename();

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
