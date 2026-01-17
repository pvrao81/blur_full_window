// content.js
// This file is now mostly a placeholder / safety net.
// The main blur logic is injected via executeScript → setBlurState function.
// But we keep this file in case you want to add more features later.

(function () {
  const BLUR_ID = "___page_blur_overlay___";

  // Optional: Listen for messages from background/popup if you add more features later
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggle-blur") {
      toggleBlur(!!message.enabled);
      sendResponse({ success: true });
    }
    // Always return true if you want to send async response
    return true;
  });

  // Helper function (can be called from message listener or directly)
  function toggleBlur(enable) {
    // Remove any existing overlay first
    const existing = document.getElementById(BLUR_ID);
    if (existing) {
      existing.remove();
    }

    if (!enable) {
      return;
    }

    // Create and append blur overlay
    const overlay = document.createElement("div");
    overlay.id = BLUR_ID;

    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)", // Safari support
      backgroundColor: "rgba(255, 255, 255, 0.08)", // very light tint
      zIndex: "2147483646", // just below highest possible
      pointerEvents: "none",
      willChange: "backdrop-filter", // better performance on some devices
    });

    // Append to body (or documentElement if body is not yet ready — rare)
    (document.body || document.documentElement).appendChild(overlay);
  }

  // Optional: Try to apply blur on script injection if state is already on
  // (this is a fallback — main control is now in background.js)
  try {
    chrome.storage.local.get('blurEnabledTabs', (data) => {
      const blurTabs = data.blurEnabledTabs || {};
      const tabId = /* unfortunately content script doesn't know its own tabId easily */
                    // so this part usually won't work reliably → that's why we moved logic to background
                    // but left here as example
      // You can remove or comment out the block below
      // if (blurTabs[/*tabId*/]) toggleBlur(true);
    });
  } catch (e) {
    // silent fail — storage access might be blocked in some contexts
  }

  console.log("[Window Blur Toggle] Content script loaded");
})();
