src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/6.0.1/signalr.js"
const canvas = document.getElementById('canvas');
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
    connection.invoke("Draw", event.offsetX, event.offsetY, "start").catch(err => console.error(err));
});

canvas.addEventListener("mousedown", (event) =>{
    if (drawing){
        connection.invoke("Draw", event.offsetX, event.offsetY, "draw").catch(err => console.error(err));
    }
});

canvas.addEventListener("mouseup", () =>{
    if (drawing){
        drawing = false;
        connection.invoke("Draw", 0, 0, "end").catch(err => console.error(err));
    }
});

function sendDrawing(x, y, action){
    connection.invoke("Draw", x, y, action).catch(err => console.error(err));
}