document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const categoriesContainer = document.getElementById("categories");

  // Fetch and display grouped tabs
  function loadTabs() {
    chrome.runtime.sendMessage({ type: "GET_TABS" }, (response) => {
      renderTabs(response.groupedTabs);
    });
  }

  // Render grouped tabs in the popup
  function renderTabs(groupedTabs) {
    categoriesContainer.innerHTML = ""; // Clear existing content
    for (const [category, tabs] of Object.entries(groupedTabs)) {
      if (tabs.length > 0) {
        const categorySection = document.createElement("section");
        categorySection.classList.add("category");
        categorySection.innerHTML = `<h2>${capitalize(category)} (${tabs.length})</h2>`;

        const tabList = document.createElement("ul");
        tabs.forEach((tab) => {
          const tabItem = document.createElement("li");
          tabItem.textContent = tab.title || tab.url;
          tabItem.onclick = () => chrome.tabs.update(tab.id, { active: true });
          tabList.appendChild(tabItem);
        });

        categorySection.appendChild(tabList);
        categoriesContainer.appendChild(categorySection);
      }
    }
  }

  // Filter tabs based on search input
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    chrome.runtime.sendMessage({ type: "GET_TABS" }, (response) => {
      const filteredTabs = {};
      for (const [category, tabs] of Object.entries(response.groupedTabs)) {
        filteredTabs[category] = tabs.filter(
          (tab) =>
            tab.title.toLowerCase().includes(query) || tab.url.toLowerCase().includes(query)
        );
      }
      renderTabs(filteredTabs);
    });
  });

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  // Initial load
  loadTabs();
});
