// background.js
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ insightsPanelOpen: false });
  });
  
  // Enable extension for all tabs initially
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      if (tab.url && (tab.url.includes("twitter.com") || tab.url.includes("x.com"))) {
        chrome.action.enable(tab.id);
      }
    });
  });
  
  // Listen for tab updates
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && (tab.url.includes("twitter.com") || tab.url.includes("x.com"))) {
      chrome.action.enable(tabId);
    } else {
      chrome.action.disable(tabId);
    }
  });