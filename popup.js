// Get the current tab's URL
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var url = tabs[0].url;

    // Check if the URL is for Google Maps
    if (url.startsWith("https://www.google.com/maps/")) {
        // Parse the location from the URL
        var parser = document.createElement("a");
        parser.href = url;
        var location = parser.pathname;

        // Find and display the location name
        chrome.tabs.executeScript(tabs[0].id, {code: 'document.querySelector(".fontBodySmall").textContent'}, function (result) {
            var locationName = result[0];
            var locationElement = document.getElementById("location");
            locationElement.textContent = "You are in " + locationName + " at " + location;
        });

        // Display the quirky message
        var quirkyMessageElement = document.getElementById("quirky-message");
        quirkyMessageElement.textContent = "Time to explore the couches of the world!";
    } else {
        var locationElement = document.getElementById("location");
        locationElement.textContent = "Your couch is the best seat in the house! But to use this extension, you'll need to open Google Maps first";
    }
});
