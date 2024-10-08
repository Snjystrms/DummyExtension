// content.js
const styles = `
#crypto-insights-container {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100vh;
    background-color: #15202B;
    border-left: 1px solid #38444D;
    z-index: 9999;
    overflow-y: auto;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

#crypto-insights {
    padding: 20px;
}

#crypto-insights h1 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
}

#insights-list {
    list-style: none;
    padding: 0;
}

#insights-list li {
    padding: 10px 0;
    border-bottom: 1px solid #38444D;
}

#close-insights {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: #ffffff;
    cursor: pointer;
    font-size: 20px;
    padding: 5px;
    z-index: 10000;
}

#close-insights:hover {
    color: #1DA1F2;
}
`;

function injectCryptoInsights() {
    // Only inject if it doesn't already exist
    if (!document.getElementById('crypto-insights-container')) {
        // Create style element
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        // Create insights container
        const container = document.createElement('div');
        container.id = 'crypto-insights-container';
        container.innerHTML = `
            <div id="crypto-insights">
                <button id="close-insights">✕</button>
                <h1>Crypto Insights</h1>
                <ul id="insights-list">Loading...</ul>
            </div>
        `;
        document.body.appendChild(container);

        // Add event listener to close button
        document.getElementById('close-insights').addEventListener('click', () => {
            container.remove();
        });

        fetchInsights();
    }
}

async function fetchInsights() {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/search/trending");
        const data = await response.json();

        const insightsList = document.getElementById("insights-list");
        insightsList.innerHTML = ''; // Clear the loading text

        data.coins.forEach((coin) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${coin.item.name}: ${coin.item.score} mentions`;
            insightsList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching insights:", error);
        const insightsList = document.getElementById("insights-list");
        insightsList.innerHTML = 'Failed to load insights.';
    }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleInsights") {
        const container = document.getElementById('crypto-insights-container');
        if (container) {
            container.remove();
            sendResponse({status: "removed"});
        } else {
            injectCryptoInsights();
            sendResponse({status: "injected"});
        }
    }
    return true;
});