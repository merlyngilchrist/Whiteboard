src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/6.0.1/signalr.js"
const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
let drawing = false;
let sessionId = null;
let debounceTimeout;

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://pentogether-c3amhpatfncscthg.eastus-01.azurewebsites.net")
    .build();

connection.on("ReceiveDrawing", (x, y, action) => {
    drawFromServer(x, y, action);
});

connection.start().then(() => {
    joinSession();
}).catch(err => console.error(err));

function joinSession(){
    sessionId = prompt("Enter session ID:", "default-session");
}

canvas.addEventListener("mousedown", (event) =>{
    drawing = true;
    draw(event.offsetX, event.offsetY, "start");
});

canvas.addEventListener("mousemove", (event) => {
    if (drawing){
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            draw(event.offsetX, event.offsetY, "draw");
        }, 20);
    }
})


canvas.addEventListener("mouseup", () =>{
    if (drawing){
        drawing = false;
        draw(0,0, "end");
    }
});

function draw(x, y, action){
    const message = JSON.stringify({sessionId: sessionId, x: x, y: y, action: action});
    connection.invoke("SendDrawing", sessionId, x, y, action).catch(err => console.error(err));
    drawFromServer(x, y, action);
}

function drawFromServer(x, y, action){
    if (action === "start"){
        ctx.beginPath();
        ctx.moveTo(x, y);
    }else if (action === "draw"){
        ctx.lineTo(x, y);
        ctx.stroke();
    }else if (action === "end"){
        ctx.closePath();
    }
}
