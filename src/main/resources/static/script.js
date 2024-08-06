async function getSignalRInfo(){
    const response = await fetch('/api/whiteboard/negotiate');
    return await response.json();
}

getSignalRInfo().then(info => {
    const connection = new signalR.HubConnectionBuilder()
        .withurl(info.url, {accessTokenFactory: () => info.accessToken})
        .build();

    connection.on("ReceiveMessage", function (message) {
        const data = JSON.parse(message);
        drawOnCanvas(data);
    });

    connection.start().catch(function (err){
        return console.error(err.toString());
    });

    const canvas = document.getElementById('whiteboard');
    const ctx = canvas.getContext('2d');
    let drawing = false;

    canvas.addEventListener("mousedown", function (event){
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    });

    canvas.addEventListener("mousemove", function (event){
        if(drawing){
            const x = event.clientX - canvas.offsetLeft;
            const y = event.clientY - canvas.offsetTop;
            ctx.lineTo(x, y);
            ctx.stroke();
            const message = JSON.stringify({x, y, type: 'draw'});
            fetch('/api/whiteboard/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: message
            });
        }
    });

    canvas.addEventListener("mouseup", function (){
        drawing = false;
    });

    canvas.addEventListener('mouseout', function (){
        drawing = false;
    });

    function drawOnCanvas(data){
        if (data.type === 'draw'){
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
        }
    }
});