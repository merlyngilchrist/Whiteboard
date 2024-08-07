src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/6.0.1/signalr.js"
const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
let drawing = false;

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://placeholdername.azurewebsites.net/hubs/whiteboard")
    .build();

connection.on("ReceiveDrawing", (x, y, action) => {
    if (action === "start"){
        ctx.beginPath();
        ctx.moveTo(x, y);
    }else if (action === "draw"){
        ctx.lineTo(x, y);
        ctx.stroke();
    }else if (action === "end"){
        ctx.closePath()
    }
});

connection.start().catch(err => console.error(err));

canvas.addEventListener("mousedown", (event) =>{
    drawing = true;
    sendDrawing(event.offsetX, event.offsetY, "start");
});

canvas.addEventListener("mousedown", (event) =>{
    if (drawing){
        sendDrawing(event.offsetX, event.offsetY, 'draw');
    }
});

canvas.addEventListener("mouseup", () =>{
    if (drawing){
        drawing = false;
        sendDrawing(0,0, "end");
    }
});

function sendDrawing(x, y, action){
    fetch("/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({x, y, action: ""})
    }).catch(err => console.error("Error sending drawing data:", err));
}