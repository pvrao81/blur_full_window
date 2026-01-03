# blur_full_window
Chrome Extension - Blur Full Chrome Window

# Window Blur Toggle - Chrome Extension

**Version:** 1.1  
**Author:** Venky:)  

---

## Overview

**Window Blur Toggle** is a lightweight Chrome extension that lets you **blur the entire webpage** with a single click. Click again to remove the blur. It's simple, fast, and works on any website without affecting scrolling or clicking.

---

## Features

- Toggle full-page blur on/off with one click.  
- Works on any website.  
- Lightweight and fast.  
- Minimal interface — only a toolbar button.  

---

## Installation

1. Download or clone this repository.  
2. Open Chrome and go to:  
chrome://extensions/

3. Enable **Developer mode** (top-right).  
4. Click **Load unpacked** and select the extension folder.  
5. Click the toolbar icon to toggle blur on the current page.  

---

## File Structure



blur-window-extension/
│
├── manifest.json # Extension configuration
├── background.js # Toolbar click handler
├── content.js # Blur effect logic
└── icons/
├── icon16.png
├── icon32.png
├── icon48.png
└── icon128.png


---

## Usage

- Click the **extension icon** in the Chrome toolbar → page blurs.  
- Click again → blur removed.  

---

## Notes

- Blur effect uses **CSS `backdrop-filter`**, so it works best in modern browsers.  
- You can customize the blur strength by editing `content.js` (change `blur(8px)` to any value).  
- The extension does **not block page interactions**; scrolling and clicking remain functional.  

---

## License
MIT License

Thankyou,
Key:)
