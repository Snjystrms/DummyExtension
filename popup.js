document.addEventListener("DOMContentLoaded", async () => {
    const checkTwitterButton = document.getElementById("check-twitter");
    const openExtensionButton = document.getElementById("open-extension");
    const messageText = document.getElementById("message");

    async function updateButtonsVisibility() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const isTwitter = tab.url && (tab.url.includes("twitter.com") || tab.url.includes("x.com"));
            
            if (isTwitter) {
                messageText.style.display = "none";
                checkTwitterButton.style.display = "none";
                openExtensionButton.style.display = "block";
            } else {
                messageText.textContent = "X-Alpha is live!! Head to your Twitter & See Xalpha in action!";
                openExtensionButton.style.display = "none";
                checkTwitterButton.style.display = "block";
            }
        } catch (error) {
            console.error("Error updating buttons:", error);
        }
    }

    // Update buttons visibility when popup opens
    await updateButtonsVisibility();

    checkTwitterButton.addEventListener("click", () => {
        chrome.tabs.create({ url: "https://twitter.com" });
    });

    openExtensionButton.addEventListener("click", async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            chrome.tabs.sendMessage(tab.id, { action: "toggleInsights" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error sending message:", chrome.runtime.lastError);
                    return;
                }
                // Close the popup
                window.close();
            });
        } catch (error) {
            console.error("Error in open extension click handler:", error);
        }
    });
});