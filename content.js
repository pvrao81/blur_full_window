(() => {
  const BLUR_ID = "___page_blur_overlay___";

  // If blur already exists, remove it
  const existing = document.getElementById(BLUR_ID);
  if (existing) {
    existing.remove();
    return;
  }

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = BLUR_ID;

  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    zIndex: "2147483647",
    pointerEvents: "none"
  });

  document.body.appendChild(overlay);
})();
	