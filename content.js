function clickCenterOfPage() {
  var x = window.innerWidth / 2;
  var y = window.innerHeight / 2;

  var event = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y
  });

  document.dispatchEvent(event);
}

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
  } else {
      clickCenterOfPage();
  }
}

setInterval(clickForwardButton, 5000);  // Click every 5 seconds
