function clickForwardButton() {
    var forwardButton = document.getElementsByClassName("widget-scene-navigation-next")[0];
    if (forwardButton) {
      var rect = forwardButton.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      var event = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
      });
      forwardButton.dispatchEvent(event);
    }
  }
  
  setInterval(clickForwardButton, 5000);
  