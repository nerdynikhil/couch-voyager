// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async function() {
    const locationElement = document.getElementById("location");
    const quirkyMessageElement = document.getElementById("quirky-message");
    const letsGoButton = document.getElementById("lets-go-button");

    let isWalking = false;

    try {
        // Get the current active tab
        const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
        const url = tab.url || "";

        // Check if the URL is for Google Maps
        if (url.includes("google.com/maps")) {
            // Try to get location info from the page
            try {
                const results = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => {
                        const selectors = [
                            'h1.fontHeadlineLarge',
                            '.fontHeadlineSmall',
                            'h1[data-attrid]',
                            '.DUwDvf',
                            'h1'
                        ];
                        for (const selector of selectors) {
                            const el = document.querySelector(selector);
                            if (el && el.textContent && el.textContent.trim()) {
                                return el.textContent.trim();
                            }
                        }
                        return null;
                    }
                });

                const locationName = results?.[0]?.result;
                if (locationName) {
                    locationElement.textContent = "You are viewing: " + locationName;
                } else {
                    locationElement.textContent = "Exploring Google Maps! 🗺️";
                }
            } catch (scriptError) {
                console.log("Could not get location name:", scriptError);
                locationElement.textContent = "Exploring Google Maps! 🗺️";
            }

            quirkyMessageElement.textContent = "Time to explore the couches of the world! 🌍";
            letsGoButton.style.display = "block";
            letsGoButton.textContent = "🚶 Let's go!";
        } else {
            locationElement.textContent = "Your couch is the best seat in the house!";
            quirkyMessageElement.textContent = "Open Google Maps Street View to start your virtual adventure. 🗺️";
            letsGoButton.style.display = "none";
        }
    } catch (error) {
        console.error("Error:", error);
        locationElement.textContent = "Something went wrong!";
        quirkyMessageElement.textContent = "Please try again or open Google Maps.";
    }

    // Add click event listener to the "Let's go" button
    letsGoButton.addEventListener("click", async function() {
        try {
            const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
            
            // Send message to content script to toggle walking
            chrome.tabs.sendMessage(tab.id, { action: "toggleWalk" }, function(response) {
                console.log("Response from content script:", response);
                
                if (response && response.status === "started") {
                    isWalking = true;
                    letsGoButton.textContent = "🛑 Walking... (click to stop)";
                    quirkyMessageElement.textContent = "Enjoying the view! Click again to stop.";
                } else if (response && response.status === "stopped") {
                    isWalking = false;
                    letsGoButton.textContent = "🚶 Let's go!";
                    quirkyMessageElement.textContent = "Time to explore the couches of the world! 🌍";
                } else if (response && response.status === "already_walking") {
                    isWalking = true;
                    letsGoButton.textContent = "🛑 Walking... (click to stop)";
                }
            });
        } catch (error) {
            console.error("Error toggling walk:", error);
            quirkyMessageElement.textContent = "Make sure you're in Street View mode!";
        }
    });
});
