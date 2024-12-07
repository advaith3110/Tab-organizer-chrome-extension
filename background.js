// Dynamic categories using keywords
const categories = {
  work: ["docs", "drive", "github", "trello", "slack", "notion"],
  entertainment: ["youtube", "netflix", "spotify", "hulu"],
  learning: ["wikipedia", "khanacademy", "coursera", "edx", "udemy"],
};

function categorizeTabs(tabs) {
  const groupedTabs = { work: [], entertainment: [], learning: [], others: [] };

  tabs.forEach((tab) => {
    let isCategorized = false;
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => tab.url.includes(keyword) || tab.title.toLowerCase().includes(keyword))) {
        groupedTabs[category].push(tab);
        isCategorized = true;
        break;
      }
    }
    if (!isCategorized) {
      groupedTabs.others.push(tab);
    }
  });

  return groupedTabs;
}

// Handle popup requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_TABS") {
    chrome.tabs.query({}, (tabs) => {
      const groupedTabs = categorizeTabs(tabs);
      sendResponse({ groupedTabs });
    });
    return true; // Keep message channel open for async response
  }
});
