const STORAGE_KEY = 'blurredDomains';

// Helper to get domain from URL
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return null;
  }
}

// Listen for icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.url || tab.url.startsWith('chrome://') || tab.url.startsWith('about:')) return;

  const domain = getDomain(tab.url);
  if (!domain) return;

  const data = await chrome.storage.local.get(STORAGE_KEY);
  let blurredDomains = data[STORAGE_KEY];

  // FIX: If blurredDomains is an object (old version) or undefined, reset to empty array
  if (!Array.isArray(blurredDomains)) {
    blurredDomains = [];
  }

  if (blurredDomains.includes(domain)) {
    // Remove domain (Toggle Off)
    blurredDomains = blurredDomains.filter(d => d !== domain);
  } else {
    // Add domain (Toggle On)
    blurredDomains.push(domain);
  }

  await chrome.storage.local.set({ [STORAGE_KEY]: blurredDomains });

  // Update ALL tabs that match this domain immediately
  const allTabs = await chrome.tabs.query({});
  for (const t of allTabs) {
    const tDomain = getDomain(t.url);
    if (tDomain === domain) {
      toggleBlurOnTab(t.id, blurredDomains.includes(domain));
    }
  }
});

// Re-apply when a tab refreshes or navigates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;
  
  const domain = getDomain(tab.url);
  const data = await chrome.storage.local.get(STORAGE_KEY);
  let blurredDomains = data[STORAGE_KEY];

  // FIX: Ensure it's an array here too
  if (!Array.isArray(blurredDomains)) return;

  if (blurredDomains.includes(domain)) {
    await toggleBlurOnTab(tabId, true);
  }
});

async function toggleBlurOnTab(tabId, enable) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: setBlurState,
      args: [enable]
    });
  } catch (err) {
    // Silent fail for settings pages or internal chrome pages
  }
}

function setBlurState(shouldEnable) {
  const BLUR_ID = "___page_blur_overlay___";
  const existing = document.getElementById(BLUR_ID);
  if (existing) existing.remove();

  if (!shouldEnable) return;

  const overlay = document.createElement("div");
  overlay.id = BLUR_ID;
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    zIndex: "2147483647",
    pointerEvents: "none"
  });
  document.body.appendChild(overlay);
}
