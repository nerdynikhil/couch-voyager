// Couch Voyager Content Script
// This script is injected into Google Maps pages

console.log("🛋️ Couch Voyager loaded!");

// Find the forward arrow and click it
function moveForward() {
    console.log("🛋️ Attempting to move forward...");
    
    // Get the viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // The forward arrow in Street View is typically in the center-lower area
    // Try clicking at the center of the screen, slightly above middle
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    // Try multiple positions where arrows typically appear
    const positions = [
        { x: centerX, y: centerY - 100 },      // Above center (main forward arrow)
        { x: centerX, y: centerY - 50 },       // Slightly above center
        { x: centerX, y: centerY },            // Center
        { x: centerX, y: centerY + 50 },       // Slightly below center
    ];
    
    for (const pos of positions) {
        const element = document.elementFromPoint(pos.x, pos.y);
        if (element) {
            console.log(`🛋️ Element at (${pos.x}, ${pos.y}):`, element.tagName, element.className, element);
            
            // Check if it's a canvas or interactive element
            if (element.tagName === 'CANVAS' || 
                element.tagName === 'A' || 
                element.tagName === 'BUTTON' ||
                element.classList.contains('widget-scene-canvas') ||
                element.style.cursor === 'pointer') {
                
                console.log(`🛋️ Found interactive element, clicking at (${pos.x}, ${pos.y})`);
                
                // Simulate a complete mouse event sequence
                const eventOptions = {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: pos.x,
                    clientY: pos.y,
                    screenX: pos.x,
                    screenY: pos.y,
                    button: 0,
                    buttons: 1
                };
                
                // Dispatch mouse events in order
                element.dispatchEvent(new MouseEvent('mousedown', eventOptions));
                element.dispatchEvent(new MouseEvent('mouseup', eventOptions));
                element.dispatchEvent(new MouseEvent('click', eventOptions));
                
                console.log("🛋️ Click dispatched!");
                return true;
            }
        }
    }
    
    // Fallback: try to find the canvas directly and click it
    const canvas = document.querySelector('canvas.widget-scene-canvas');
    if (canvas) {
        console.log("🛋️ Found canvas, clicking center-forward position");
        const rect = canvas.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2 - 100; // Above center for forward direction
        
        const eventOptions = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
            screenX: x,
            screenY: y,
            button: 0,
            buttons: 1
        };
        
        canvas.dispatchEvent(new MouseEvent('mousedown', eventOptions));
        canvas.dispatchEvent(new MouseEvent('mouseup', eventOptions));
        canvas.dispatchEvent(new MouseEvent('click', eventOptions));
        
        return true;
    }
    
    console.log("🛋️ Could not find element to click");
    return false;
}

// Start auto-walking
function startAutoWalk() {
    if (window.couchVoyagerInterval) {
        console.log("🛋️ Already walking!");
        return "already_walking";
    }
    
    console.log("🛋️ Starting auto-walk...");
    window.couchVoyagerInterval = setInterval(moveForward, 4000);
    moveForward(); // Move once immediately
    return "started";
}

// Stop auto-walking
function stopAutoWalk() {
    if (window.couchVoyagerInterval) {
        clearInterval(window.couchVoyagerInterval);
        window.couchVoyagerInterval = null;
        console.log("🛋️ Stopped auto-walk");
        return "stopped";
    }
    return "not_walking";
}

// Toggle walking state
function toggleWalk() {
    if (window.couchVoyagerInterval) {
        return stopAutoWalk();
    } else {
        return startAutoWalk();
    }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("🛋️ Received message:", message);
    
    if (message.action === "toggleWalk") {
        const result = toggleWalk();
        sendResponse({ status: result });
    } else if (message.action === "startWalk") {
        const result = startAutoWalk();
        sendResponse({ status: result });
    } else if (message.action === "stopWalk") {
        const result = stopAutoWalk();
        sendResponse({ status: result });
    } else if (message.action === "debug") {
        moveForward();
        sendResponse({ status: "debug_done" });
    }
    return true;
});
