const canvas = document.getElementById("whiteboard");
const cursorCircle = document.getElementById("cursorCircle");
const penSizeText = document.getElementById("penSizeText");
// import * as signalR from "@microsoft/signalr";

let penSize = 5;
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
    GREEN: "green",
    BLUE: "blue",
    YELLOW: "yellow",
    PURPLE: "rebeccapurple",
    WHITE: "white",
    PINK: "magenta",
    JAXEN_ORANGE: '#F39C12',
    MERLYN_RED: '#FF0000',
    OWEN_PURPLE: '#642D96',
    ZACH_LIME: '#41FF07'
});
let currentColor = colors.BLACK;
let currentTool = toolTypes.PEN;
let undoStack = [];
let redoStack = [];

window.onload = function() {
    createColorDisplaysInColorCircles();
    changeColor(currentColor);
    testConnection();
};

// JavaScript test connection with Java
function testConnection(){
    fetch("/test-connection")
        .then(response => response.text())
        .then(data => {
            console.log("Response from Java: " + data);
        })
        .catch(error => {
            console.error("Error connecting to Java: " + error);
        });
}




//SignalR connection
// const connection = new signalR.HubConnectionBuilder()
//     .withUrl("https://pentogether-c3amhpatfncscthg.eastus-01.azurewebsites.net")
//     .build();

//Turn connection on
// connection.on("ReceiveDrawing", (x, y, action) => {
//     drawFromServer(x, y, action);
// });

//Starts connection
// connection.start().then(() => {
//     joinSession();
// }).catch(err => console.error(err));


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
    context.getContextAttributes().willReadFrequently = true;
    enableCursorCircle();
    selectCursor("penButton");

    /**
     *
     * @param event
     */
    function startDrawing(event) {
        drawing = true;
        draw(event);
        saveCanvas();
        // sendDrawing(event, "start");
    }

    function stopDrawing() {
        drawing = false;
        context.beginPath();
        // sendDrawing({clientX: 0, clientY: 0}, "end");
    }

    /**
     *
     * @param event
     */
    function draw(event) {
        if (!drawing) return;

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        context.lineTo(x,y);
        context.stroke();
        context.beginPath();
        context.moveTo(x,y);
        enableCursorCircle();

        // sendDrawing(event, "draw");
    }

   //Sends Drawing to Server
    /**
     *
     * @param event
     * @param action
     */
    function sendDrawing(event, action){
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        connection.invoke("SendDrawing", sessionId, x, y, action).catch(err => console.error(err));
    }

    // Change color based on parameter
    /**
     *
     * @param color
     */
    function changeColor(color) {
        if (currentTool !== toolTypes.ERASER) {
            currentColor = color;
        }
        context.strokeStyle = color;
        selectColorOption(color);
    }

    // Change size of pen based on parameter
    /**
     *
     * @param size
     */
    function changeSize(size) {
        if (size < 1){
            size = 1;
        }
        if (size > 50) {
            size = 50;
        }
        penSize = size;
        context.lineWidth = penSize;
        penSizeText.innerHTML = `${penSize}` + "px";
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

function removeCursors() {
    document.body.classList.remove('pen-cursor','eraser-cursor','fill-cursor','dropper-cursor','shape-cursor');
}

/**
 *
 * @param button
 */
function selectCursor(button) {
    removeCursors()
    if (button.localeCompare("penButton") === 0) {
        document.body.classList.add('pen-cursor');
    }
    if (button.localeCompare("eraserButton") === 0) {
        document.body.classList.add('eraser-cursor');
    }
    if (button.localeCompare("fillButton")===0) {
        document.body.classList.add('fill-cursor');
    }
    if (button.localeCompare("colorPickerButton") === 0) {
        document.body.classList.add('dropper-cursor');
    }
    if (button.localeCompare("circleButton") === 0 || button.localeCompare("squareButton") === 0 || button.localeCompare("triangleButton") === 0) {
        document.body.classList.add('shape-cursor');
    }
}

function selectPenTool() {
    currentTool = toolTypes.PEN;
    selectButton("penButton");
    selectCursor("penButton");
}

function selectEraserTool() {
    currentTool = toolTypes.ERASER;
    selectButton("eraserButton");
    changeColor(colors.WHITE);
    selectCursor("eraserButton");
}

function undoButton() {
    undo();
}

function redoButton() {
    redo();
}

function selectColorPicker() {
    selectButton("colorPickerButton");
    selectCursor("colorPickerButton");
}

function selectFillTool() {
    currentTool = toolTypes.FILL;
    selectButton("fillButton");
    selectCursor("fillButton");
}

function increasePenSizeButton() {
    changeSize(++penSize);
}

function decreasePenSizeButton() {
    changeSize(--penSize);
}

/**
 *
 * @param shape
 */
function selectShapeTool(shape) {
    switch (shape) {
        case "circle":
            currentTool = toolTypes.CIRCLE;
            selectButton("circleButton");
            selectCursor("circleButton");
            break;
        case "square":
            currentTool = toolTypes.SQUARE;
            selectButton("squareButton");
            selectCursor("squareButton");
            break;
        case "triangle":
            currentTool = toolTypes.TRIANGLE;
            selectButton("triangleButton");
            selectCursor("triangleButton");
            break;
    }
}

/**
 *
 * @param buttonID
 */
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
    selectCursor(buttonID);
    changeColor(currentColor);
    changeSize(penSize);
    displayColorOptions((buttonID !== "eraserButton"));
}

/**
 *
 * @param color
 */
function selectColorOption(color) {
    document.querySelectorAll('.colorCircle').forEach(circle => {
        const colorOnCircle = circle.getAttribute('data-color');
        if (colorOnCircle.localeCompare(color) === 0) {
            circle.parentElement.classList.add("selectedColor");
        } else {
            circle.parentElement.classList.remove("selectedColor");
        }
    });
}

function enableCursorCircle() {
    cursorCircle.style.display = 'block';
    canvas.addEventListener('mousemove', moveCursorCircle);
}

/**
 *
 * @param event
 */
function moveCursorCircle(event) {
    cursorCircle.style.width = `${penSize}px`;
    cursorCircle.style.height = `${penSize}px`;
    const x = event.clientX - cursorCircle.offsetWidth / 2;
    const y = event.clientY - cursorCircle.offsetHeight / 2;
    cursorCircle.style.left = `${x}px`;
    cursorCircle.style.top = `${y}px`;
}

function createColorDisplaysInColorCircles() {
    document.querySelectorAll('.colorCircle').forEach(circle => {
        if (circle.parentElement.id.localeCompare("colorMenuButton") === 0 ) { //Menu button
            circle.style.backgroundColor = currentColor;
        } else {
            circle.style.backgroundColor = circle.getAttribute('data-color');
        }
    });
}

/**
 *
 * @param display
 */
function displayColorOptions(display) {
    const colorContainer = document.getElementById("colorButtonsContainer");
    if (display) {
        colorContainer.style.display = "";
    } else {
        colorContainer.style.display = "none";
    }
}