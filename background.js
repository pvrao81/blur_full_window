// Key under which we store per-tab blur state
const STORAGE_KEY = 'blurEnabledTabs';

// Listen for icon clicks → toggle state for current tab
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.id) return;

  // Get current map of tabId → boolean
  const data = await chrome.storage.local.get(STORAGE_KEY);
  const blurTabs = data[STORAGE_KEY] || {};

  // Toggle
  blurTabs[tab.id] = !blurTabs[tab.id];

  // Save back
  await chrome.storage.local.set({ [STORAGE_KEY]: blurTabs });

  // Immediately apply/remove on current tab
  await toggleBlurOnTab(tab.id, blurTabs[tab.id]);
});

// When a tab updates (load, refresh, navigation), re-apply blur if needed
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only act when the document has finished loading
  if (changeInfo.status !== 'complete') return;
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('about:')) return;

  const data = await chrome.storage.local.get(STORAGE_KEY);
  const blurTabs = data[STORAGE_KEY] || {};

  const shouldBeBlurred = !!blurTabs[tabId];

  await toggleBlurOnTab(tabId, shouldBeBlurred);
});

// Helper: inject content script to apply/remove blur
async function toggleBlurOnTab(tabId, enable) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: setBlurState,
      args: [enable]
    });
  } catch (err) {
    console.log(`Could not inject blur script: ${err.message}`);
  }
}

// This function will be serialized and run in content script context
function setBlurState(shouldEnable) {
  const BLUR_ID = "___page_blur_overlay___";

  // Remove existing overlay (regardless)
  const existing = document.getElementById(BLUR_ID);
  if (existing) existing.remove();

  if (!shouldEnable) return;

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
}
