const canvas = document.getElementById("whiteboard");

let penSize = 5;
let penColor;
let addedEraserSize = 5;

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
    canvas.addEventListener('mousemove',draw);
    canvas.addEventListener('wheel',function(event){
        event.preventDefault()
        if (event.deltaY < 0){
            changeSize(++penSize);
        } else {
            changeSize(--penSize);
        }
    });
    changeSize(penSize);
    context.lineCap = "round";

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

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        context.lineTo(x,y);
        context.stroke();
        context.beginPath();
        context.moveTo(x,y);
    }

    // Change color based on parameter
    function changeColor(color) {
        penColor = color;
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
        penSize = size;
        context.lineWidth = size;
    }
}

function selectPenTool() {
    select("penButton", true);
    select("eraserButton", false);
    changeColor("black");
}


function selectEraserTool() {
    select("eraserButton", true);
    select("penButton", false);
    changeColor("white");
}

function selectUndo() {

}

function selectRedo() {

}

function selectColorPicker() {
    select("",true)
}

function selectFillTool() {
    select("",true)
}

function selectPenSizeUp() {

}

function selectPenSizeDown() {

}

function select(buttonID, selected) {
    if (selected) {
        document.getElementById(buttonID).classList.add("selectedTool");
        document.getElementById(buttonID).classList.remove("unselectedTool");
    } else {
        document.getElementById(buttonID).classList.add("unselectedTool");
        document.getElementById(buttonID).classList.remove("selectedTool");
    }

}

