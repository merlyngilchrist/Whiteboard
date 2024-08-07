const canvas = document.getElementById("whiteboard");
if (canvas.getContext) {
    const context = canvas.getContext("2d");
    let drawing = false;
    canvas.addEventListener('mousedown',startDrawing);
    canvas.addEventListener('mouseup',stopDrawing);
    canvas.addEventListener('mousemove',draw)

    function startDrawing(event) {
        drawing = true;
        draw(event);
    }
    function stopDrawing() {
        drawing = false;
        context.beginPath();
    }
    function draw(event) {
        if (!drawing) return;
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.strokeStyle = 'black';

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        context.lineTo(x,y);
        context.stroke();
        context.beginPath();
        context.moveTo(x,y);
    }
}
/*
    Sends hate to us lowly developers
 */
function hateSent() {
    fetch('/hateButtonClicked', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
        })
        .catch(error => console.error('Error:', error));
}