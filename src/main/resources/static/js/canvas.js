const canvas = document.getElementById("whiteboard");

// This checks if we have a canvas to work with; if we do it executes the code within the if that sets up the canvas resolution and canvas event listeners.
if (canvas.getContext) {
    const context = canvas.getContext("2d");
    // I got this code from the Mozilla developer documents: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
    const devicePixelRatio = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    context.scale(devicePixelRatio,devicePixelRatio);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    // end of Mozilla dev code
    let drawing = false;
    canvas.addEventListener('mousedown',startDrawing);
    canvas.addEventListener('mouseup',stopDrawing);
    canvas.addEventListener('mousemove',draw)

    // Sets the state of the page to drawing when a mouse is clicked and held down.
    function startDrawing(event) {
        drawing = true;
        draw(event);
    }

    // Once the hold mouse has been released, this makes sure it stops drawing
    function stopDrawing() {
        drawing = false;
        context.beginPath();
    }

    // The default pen settings as well as following the user's mouse when drawing
    function draw(event) {
        if (!drawing) return;
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.strokeStyle = 'black';

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        context.lineTo(x,y);
        context.stroke();
        context.beginPath();
        context.moveTo(x,y);
    }
}