// Get the current tab's URL
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var url = tabs[0].url;

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
});
