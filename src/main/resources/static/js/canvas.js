const canvas = document.getElementById("whiteboard");
const cursorCircle = document.getElementById("cursorCircle");
const penSizeText = document.getElementById("penSizeText");
// import * as signalR from "@microsoft/signalr";

let lastX, lastY;
let penSize = 10;
let buttons = [
    "penButton",
    "eraserButton",
    "fillButton",
    "undoButton",
    "redoButton",
    "circleButton",
    "squareButton",
    "triangleButton",
    "colorPickerButton",
    "textButton"
];
const toolTypes = Object.freeze({
    PEN: 0,
    ERASER: 1,
    FILL: 2,
    CIRCLE: 3,
    SQUARE: 4,
    TRIANGLE: 5,
    TEXT: 6,
    COLOR_PICKER: 7
});
const colors = Object.freeze({
    // 12 Main colors
    BLACK: "black",
    DARKGREY: "#707b7c",
    LIGHTGREY: "#bfc9ca",
    RED: "#FF1010",
    GREEN: "#317140",
    BLUE: "blue",
    YELLOW: "yellow",
    PURPLE: "rebeccapurple",
    ORANGE: "orange",
    PINK: "magenta",
    CYAN: "cyan",
    TEAL: "#58d68d",

    // 12 secondary colors (faded colors??)
    LIGHTBLUE: "#9FBCF8",
    LIGHTGREEN: "#A3F9A0",
    LIGHTYELLOW: "#E5F474",
    BROWN: "#694310",
    LIGHT_BROWN: "#A57638",
    LIGHT_RED: "#F25151",
    NAVY: "#04236B",
    LIGHT_PURPLE: "#B76EEF",
    OFF_RED: "#A12525",

    // Dev colors
    JAXEN_ORANGE: '#F39C12',
    //MERLYN_RED: 'regular red color',
    OWEN_PURPLE: '#642D96',
    ZACH_LIME: '#12E90B'



});
let currentColor = colors.BLACK;
let currentTool = toolTypes.PEN;
let undoStack = [];
let redoStack = [];
/**
 * initializes basic settings when browser loads.
 */
window.onload = function() {
    setColorSetInMenu(0);
    changeColor(currentColor);
    testConnection();
    setSessionCodeText("42069");
};

/**
 * sets the text to the session code
 * @param code session code
 */
function setSessionCodeText(code) {
    const textContainer = document.getElementById("sessionCodeContainer");
    textContainer.innerHTML = "Session code: " + code;
}

// JavaScript test connection with Java
/**
 * tests connection with java code, if no connection sends error.
 */
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
    // I got this code from the Mozilla developer documents: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas - Owen
    const devicePixelRatio = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    context.scale(devicePixelRatio,devicePixelRatio);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    // end of Mozilla dev code
    let drawing = false;
    canvas.addEventListener('mousemove', moveCursorCircle); // Cursor circle
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', drawPen);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('wheel',function(event){ // Smidgen of help from ChatGPT since I didn't know how it worked
        event.preventDefault()
        if (event.deltaY < 0){
            changeSize(++penSize);
        } else {
            changeSize(--penSize);
        }
    });
    document.addEventListener("keydown", function (event) {
        /*
        * Ctrl + Z - UNDO
        * Ctrl + Y - REDO
        * P        - SELECT PEN
        * E        - SELECT ERASER
        * F        - SELECT FILL
        * S        - SELECT SQUARE
        * C        - SELECT CIRCLE
        * D        - SELECT TRIANGLE
        * I        - SELECT DROPPER
        * T        - SELECT TEXT
        * -        - PEN SIZE DOWN
        * =        - PEN SIZE UP
         */

        if (event.key.toLowerCase() === 'p') {
            selectPenTool();
        }
        else if (event.key.toLowerCase() === 'e') {
            selectEraserTool();
        }
        else if (event.key.toLowerCase() === 'f') {
            selectFillTool();
        }
        else if (event.key.toLowerCase() === 's') {
            selectShapeTool('square');
        }
        else if (event.key.toLowerCase() === 'c') {
            selectShapeTool('circle');
        }
        else if (event.key.toLowerCase() === 'd') {
            selectShapeTool("triangle");
        }
        else if (event.key.toLowerCase() === 'i') {
            selectColorPicker();
        }
        else if (event.key.toLowerCase() === 't') {
            selectTextTool();
        }
        else if (event.key === '-' || event.key === '_') {
            decreasePenSizeButton();
        }
        else if (event.key === '=' || event.key === '+') {
            increasePenSizeButton();
        }
        else if (event.ctrlKey && event.key.toLowerCase() === 'z') {
            undoButton();
        }
        else if (event.ctrlKey && event.key.toLowerCase() === 'y') {
            redoButton();
        }
    });

    changeSize(penSize);
    context.lineCap = "round";
    context.getContextAttributes().willReadFrequently = true;
    selectCursor("penButton");
    checkUndoRedoButtons();

    /**
     * Begins a path when clicked
     * @param event = the 'mousedown' event listener
     */
    function startDrawing(event) {
        drawing = true;
        context.beginPath();
        // The idea to use lastX and lastY in order to fix the undo/redo leaving a singular dot behind was not mine and came from ChatGPT - Owen
        lastX = event.clientX - rect.left;
        lastY = event.clientY - rect.top;
        context.moveTo(lastX, lastY);
        saveCanvas();
        // sendDrawing(event, "start");
    }

    /**
     * stops drawing on the canvas.
     */
    function stopDrawing() {
        drawing = false;
        lastX = null;
        lastY = null;
        // sendDrawing({clientX: 0, clientY: 0}, "end");
    }

    /**
     * Draws on the screen, but only when drawing is set to 'true'
     * @param event = 'mousemove' event listener
     */
    function drawPen(event) {
        if (!drawing) return;

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (x !== lastX || y !== lastY) {
            context.lineTo(x, y);
            context.stroke();
            context.beginPath();
            context.moveTo(x, y);
            lastX = x;
            lastY = y;
        }

        // sendDrawing(event, "draw");
    }

    /**
     * sends drawings to signalR.
     * @param event event from event listener.
     * @param action action being sent.
     */
    function sendDrawing(event, action){
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        connection.invoke("SendDrawing", sessionId, x, y, action).catch(err => console.error(err));
    }

    /**
     * gets id of the color button then calls changeColor.
     * @param button button to get the id of.
     */
    function colorButtonPressed(button) {
        let color = button.id; // "magenta"
        changeColor(color);
    }

    /**
     * This changes the color of the pen to whatever is passed in as a parameter.
     * @param color = any item from the colors enum or any Hex/RGB value
     */
    function changeColor(color) {
        if (currentTool !== toolTypes.ERASER) {
            currentColor = color;
        }
        context.strokeStyle = color;
        selectColorOption(color);
        updateCurrentColorCircle();
    }

    /**
     * changes size of brush unless size is too big(>50) or small(<1), also updates ui to show correct size.
     * @param size size pen is being changed to.
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

    /**
     * checks undo
     */
    function checkUndoRedoButtons() {
        if (undoStack.length === 0) {
            showUndoButton(false);
        } else {
            showUndoButton(true);
        }

        if (redoStack.length === 0) {
            showRedoButton(false);
        } else {
            showRedoButton(true);
        }
    }

    /**
     * redoes an undo and displays it on the screen,
     * puts redo data into undo stack, removes it from redo stack.
     */
    function redo() {
        if (redoStack.length > 0){
            undoStack.push(context.getImageData(0,0,canvas.width,canvas.height));
            let nextState = redoStack.pop();
            context.putImageData(nextState,0,0);
        }
        checkUndoRedoButtons();
    }

    /**
     * undoes a previous draw and displays it on the screen,
     * puts undo data into the redo stack, removes it from undo stack.
     */
    function undo() {
        if (undoStack.length > 0){
            redoStack.push(context.getImageData(0,0,canvas.width,canvas.height));
            let previousState = undoStack.pop();
            context.putImageData(previousState,0,0);
        }
        checkUndoRedoButtons();
    }

    /**
     * saves the canvas to the undo stack, clears the redo stack.
     */
    function saveCanvas() {
        redoStack = [];
        undoStack.push(context.getImageData(0,0,canvas.width,canvas.height));
        checkUndoRedoButtons();
    }
}

/**
 * removes the following: 'pen-cursor','eraser-cursor','fill-cursor','dropper-cursor','shape-cursor' from the screen
 */
function removeCursors() {
    document.body.classList.remove('pen-cursor','eraser-cursor','fill-cursor','dropper-cursor','shape-cursor');
}

/**
 * removes existing cursor, then adds the new cursor.
 * @param button button representing what cursor being selected.
 */
function selectCursor(button) {
    removeCursors()
    if (button.localeCompare("penButton") === 0) {
        document.body.classList.add('pen-cursor');
    }
    if (button.localeCompare("eraserButton") === 0) {
        document.body.classList.add('eraser-cursor');
    }
    if (button.localeCompare("fillButton") === 0) {
        document.body.classList.add('fill-cursor');
    }
    if (button.localeCompare("colorPickerButton") === 0) {
        document.body.classList.add('dropper-cursor');
    }
    if (button.localeCompare("circleButton") === 0 || button.localeCompare("squareButton") === 0 || button.localeCompare("triangleButton") === 0) {
        document.body.classList.add('shape-cursor');
    }
}

/**
 * sets current tool to pen, calls selectButton, and selectCursor.
 */
function selectPenTool() {
    currentTool = toolTypes.PEN;
    selectButton("penButton");
    selectCursor("penButton");
}
/**
 * sets current tool to eraser, sets color to white, calls selectButton, and selectCursor.
 */
function selectEraserTool() {
    currentTool = toolTypes.ERASER;
    selectButton("eraserButton");
    changeColor('white');
    selectCursor("eraserButton");
}

/**
 * calls undo.
 */
function undoButton() {
    undo();
}

/**
 * calls redo.
 */
function redoButton() {
    redo();
}

/**
 * calls selectButton and selectCursor.
 */
function selectColorPicker() {
    currentTool = toolTypes.COLOR_PICKER;
    selectButton("colorPickerButton");
    selectCursor("colorPickerButton");
}
/**
 * sets current tool to fill, calls selectButton, and selectCursor.
 */
function selectFillTool() {
    currentTool = toolTypes.FILL;
    selectButton("fillButton");
    selectCursor("fillButton");
}
/**
 * sets current tool to text, calls selectButton, and selectCursor.
 */
function selectTextTool() {
    currentTool = toolTypes.TEXT;
    selectButton("textButton");
    //selectCursor("fillButton")
}

/**
 * calls changeSize and adds 1 to penSize.
 */
function increasePenSizeButton() {
    changeSize(++penSize);
}

/**
 * calls changeSize and subtracts 1 to penSize.
 */
function decreasePenSizeButton() {
    changeSize(--penSize);
}

/**
 * sets current tool to selected shape, calls selectButton, and selectCursor.
 * @param shape shape being selected
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
 * loops through all buttons and sets the passed in button to the selectedTool and deselects the rest.
 * Selects the passed in button.
 * Changes size and color of the selected tool to current color and size.
 * if the currentTool is the eraser, hides the color options, if it's not the eraser shows color options.
 * @param buttonID id of button being selected.
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

    if (currentTool === toolTypes.ERASER) {
        displayColorOptions('hide');
    } else {
        displayColorOptions('false');
    }

    // Hide penSizeMenu and cursorCicle with the use of the color picker or fill
    let currentToolIsFillOrColorPicker = currentTool === toolTypes.FILL || currentTool === toolTypes.COLOR_PICKER;
    hideElementByID("penSizeMenu", currentToolIsFillOrColorPicker);
    hideElementByID("cursorCircle", currentToolIsFillOrColorPicker);

}

/**
 * loops through colors, if the button is the currentColor, adds selectedColor token.
 * Otherwise, removes selectedColorToken.
 */
function selectColorOption() {
    document.querySelectorAll('.colorCircle').forEach(circle => {
        const buttonColor = circle.id;
        if (buttonColor.localeCompare(currentColor) === 0) {
            circle.parentElement.classList.add("selectedColor");
        } else {
            circle.parentElement.classList.remove("selectedColor");
        }
    });
}

/**
 * updates currentColorCircle background color to the currentColor.
 */
function updateCurrentColorCircle() {
    const currentColorCircle = document.getElementById("currentColorCircle");
    currentColorCircle.style.backgroundColor = currentColor;
}

/**
 * moves the cursor circle to the mouse x, y.
 * @param event event from event listener.
 */
function moveCursorCircle(event) {
    cursorCircle.style.width = `${penSize}px`;
    cursorCircle.style.height = `${penSize}px`;
    const x = event.clientX - cursorCircle.offsetWidth / 2;
    const y = event.clientY - cursorCircle.offsetHeight / 2;
    cursorCircle.style.left = `${x}px`;
    cursorCircle.style.top = `${y}px`;
}

/**
 * adds each color to the display
 */
function setColorSetInMenu(set) {
    let colorNum = set * 12;
    const keys = Object.keys(colors);

    let colorSet = document.getElementById("colorSet");
    for (let r = 0; r < colorSet.children.length; r++) { //Each row of colorSet1

        let row = colorSet.children.item(r);

        for (let m = 0; m < row.children.length; m++, colorNum++) { //Each menuItem in row, adds to colorNum each time
            let colorCircle = row.children.item(m).children.item(0);
            const key = keys[colorNum];
            const color = colors[key];
            colorCircle.style.backgroundColor = color;
            colorCircle.id = color;
        }

    }

    let changeColorSetButton1 = document.getElementById("colorMenuSetOne")
    let changeColorSetButton2 = document.getElementById("colorMenuSetTwo")

    if (set === 0) {
        changeColorSetButton1.classList.add("selectedButton");
        changeColorSetButton2.classList.remove("selectedButton");

        changeColorSetButton1.classList.remove("unselectedTool");
        changeColorSetButton2.classList.add("unselectedTool");
    } else {
        changeColorSetButton1.classList.remove("selectedButton");
        changeColorSetButton2.classList.add("selectedButton");

        changeColorSetButton1.classList.add("unselectedTool");
        changeColorSetButton2.classList.remove("unselectedTool");
    }

    selectColorOption(currentColor);
}

/**
 * Hides/displays color select menu and color menu
 * @param display "false" = hide select menu, "true" = show select menu, "hide" = hide all color menus (for eraser)
 */
function displayColorOptions(display) {
    const colorContainer = document.getElementById("colorButtonsContainer");
    const currentColorButton = document.getElementById("currentColorCircle").parentElement;
    let colorSelectIsShown;
    if (display.localeCompare("true") === 0) { //Display color select elements
        colorSelectIsShown = (colorContainer.style.display.localeCompare('') === 0);
        if (colorContainer.classList.contains("disabled")) colorSelectIsShown = false;
        if (colorSelectIsShown) {
            hideElementByHTMLObject(colorContainer, true);
        } else {
            hideElementByHTMLObject(colorContainer, false);
        }
        hideElementByHTMLObject(currentColorButton, false);
    } else if (display.localeCompare("hide") === 0) { //Hide all color stuff
        hideElementByHTMLObject(colorContainer, true);
        hideElementByHTMLObject(currentColorButton, true);

    } else if (display.localeCompare("false") === 0) { //Don't display select menu but display current color button
        hideElementByHTMLObject(colorContainer, true);
        hideElementByHTMLObject(currentColorButton, false);
    }
}

/**
 * hides element by id.
 * @param id id of element.
 * @param hide 'true' or 'false' if object should be hidden.
 */
function hideElementByID(id, hide) {
    const element = document.getElementById(id);
    hideElementByHTMLObject(element, hide);
}

/**
 * hides element by object.
 * @param object object element.
 * @param hide 'true' or 'false' if object should be hidden.
 */
function hideElementByHTMLObject(object, hide) {
    if (hide) {
        object.style.display = "none";
    } else {
        object.style.display = "";
        object.classList.remove("disabled");
    }
}

/**
 * shows or hides redo button.
 * @param show 'true' or 'false' if object should be hidden.
 */
function showRedoButton(show) {
    if (show) {
        hideElementByID("redoButton",false);
        document.getElementById("undoButton").style.borderTopRightRadius = '0%';
    } else {
        hideElementByID("redoButton",true);
        document.getElementById("undoButton").style.borderTopRightRadius = '30%';
    }
}
/**
 * shows or hides undo button.
 * @param show 'true' or 'false' if object should be hidden.
 */
function showUndoButton(show) {
    if (show) {
        hideElementByID("undoButton",false);
        document.getElementById("redoButton").style.borderTopLeftRadius = '0%';
    } else {
        hideElementByID("undoButton",true);
        document.getElementById("redoButton").style.borderTopLeftRadius = '30%';
    }
}