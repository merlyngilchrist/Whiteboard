const canvas = document.getElementById("whiteboard");
const eraserCircle = document.getElementById("eraserCircle");
const penSizeText = document.getElementById("penSizeText");
// import * as signalR from "@microsoft/signalr";


let penSize = 5;
let addedEraserSize = 5;
let buttons = [
    "penButton",
    "eraserButton",
    "fillButton",
    "undoButton",
    "redoButton",
    "circleButton",
    "squareButton",
    "triangleButton",
    "colorPickerButton"
];
const toolTypes = Object.freeze({
    PEN: 0,
    ERASER: 1,
    FILL: 2,
    CIRCLE: 3,
    SQUARE: 4,
    TRIANGLE: 5
});
const colors = Object.freeze({
    BLACK: "black",
    RED: "red",
    GREEN: "lime",
    BLUE: "blue",
    YELLOW: "yellow",
    PURPLE: "rebeccapurple",
    WHITE: "white",
    ORANGE: "orange",
    PINK: "magenta",
    JAXEN_ORANGE: '#F39C12',
    MERLYN_RED: '#FF0505',
    OWEN_PURPLE: '#642D96',
    ZACH_LIME: '#41FF07'

});
let currentColor = colors.BLACK;
let currentTool = toolTypes.PEN;
let undoStack = [];
let redoStack = [];
/*
//SignalR connection
const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://pentogether-c3amhpatfncscthg.eastus-01.azurewebsites.net")
    .build();

//Turn connection on
connection.on("ReceiveDrawing", (x, y, action) => {
    drawFromServer(x, y, action);
});

//Starts connection
connection.start().then(() => {
    joinSession();
}).catch(err => console.error(err));
*/

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
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('wheel',function(event){ // Smidgen of help from ChatGPT since I didn't know how it worked
        event.preventDefault()
        if (event.deltaY < 0){
            changeSize(++penSize);
        } else {
            changeSize(--penSize);
        }
    });

    changeSize(penSize);
    context.lineCap = "round";
    context.getContextAttributes().willReadFrequently = true

    function startDrawing(event) {
        drawing = true;
        draw(event);
        saveCanvas();
        // sendDrawing(event, "start");
    }
    function stopDrawing() {
        drawing = false;
        context.beginPath();
        if (currentTool === toolTypes.ERASER) {
            disableEraserCursor();
        }
        // sendDrawing({clientX: 0, clientY: 0}, "end");
    }
    function draw(event) {
        if (!drawing) return;

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        context.lineTo(x,y);
        context.stroke();
        context.beginPath();
        context.moveTo(x,y);
        if (currentTool === toolTypes.ERASER) {
            enableEraserCursor(event);
        }

        // sendDrawing(event, "draw");
    }
/*
   //Sends Drawing to Server
    function sendDrawing(event, action){
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        connection.invoke("SendDrawing", sessionId, x, y, action).catch(err => console.error(err));
    }
*/
    // Change color based on parameter
    function changeColor(color) {
        context.strokeStyle = color;
    }

    // Change size of pen based on parameter
    function changeSize(size) {
        if (size < 3){
            size = 3;
        }
        if (size > 20) {
            size = 20;
        }
        if (currentTool !== toolTypes.ERASER) {
            penSize = size;
            context.lineWidth = penSize;
            penSizeText.innerHTML = `${penSize}` + "px";
        } else {
            context.lineWidth = penSize + addedEraserSize;
        }
    }

    function redo() {
        if (redoStack.length > 0){
            undoStack.push(context.getImageData(0,0,canvas.width,canvas.height));
            let nextState = redoStack.pop();
            context.putImageData(nextState,0,0);
        }
    }

    function undo() {
        if (undoStack.length > 0){
            redoStack.push(context.getImageData(0,0,canvas.width,canvas.height));
            let previousState = undoStack.pop();
            context.putImageData(previousState,0,0);
        }
    }

    function saveCanvas() {
        redoStack = [];
        undoStack.push(context.getImageData(0,0,canvas.width,canvas.height));
    }

}

function selectPenTool() {
    selectButton("penButton");
    currentTool = toolTypes.PEN;
}

function selectEraserTool() {
    selectButton("eraserButton");
    changeColor(colors.WHITE);
    currentTool = toolTypes.ERASER;
}

function undoButton() {
    undo();
}

function redoButton() {
    redo();
}

function selectColorPicker() {
    selectButton("colorPickerButton");
}

function selectFillTool() {
    selectButton("fillButton");
    currentTool = toolTypes.FILL;
}

function increasePenSizeButton() {
    changeSize(++penSize);
}

function decreasePenSizeButton() {
    changeSize(--penSize);
}

function selectShapeTool(shape) {
    switch (shape) {
        case "circle":
            selectButton("circleButton");
            currentTool = toolTypes.CIRCLE;
            break;
        case "square":
            selectButton("squareButton");
            currentTool = toolTypes.SQUARE;
            break;
        case "triangle":
            selectButton("triangleButton");
            currentTool = toolTypes.TRIANGLE;
            break;
    }
}

function selectButton(buttonID) {
    buttons.forEach(button => {
        if (buttonID === button) {
            document.getElementById(button).classList.add("selectedTool");
            document.getElementById(button).classList.remove("unselectedTool");
        } else {
            document.getElementById(button).classList.add("unselectedTool");
            document.getElementById(button).classList.remove("selectedTool");
        }
    });
    changeColor(currentColor);
    changeSize(penSize);
}

function enableEraserCursor(event) {
    eraserCircle.style.display = 'block';
    moveEraserCircle(event);
    canvas.addEventListener('mousemove', moveEraserCircle);
}

function disableEraserCursor() {
    eraserCircle.style.display = 'none';
    canvas.removeEventListener('mousemove', moveEraserCircle);
}

function moveEraserCircle(event) {
    eraserCircle.style.width = `${penSize}px`;
    eraserCircle.style.height = `${penSize}px`;
    const x = event.clientX - eraserCircle.offsetWidth / 2;
    const y = event.clientY - eraserCircle.offsetHeight / 2;
    eraserCircle.style.left = `${x}px`;
    eraserCircle.style.top = `${y}px`;
}