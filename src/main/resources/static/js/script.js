src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/6.0.1/signalr.js"
let sessionId = null;

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://pentogether-c3amhpatfncscthg.eastus-01.azurewebsites.net")
    .build();

connection.start().then(() => {
    joinSession();
}).catch(err => console.error(err));

function joinSession(){
    sessionId = prompt("Enter session ID:", "default-session");
}

function displayJoinUIContainer(display) {
    if (display) {
        document.getElementById('joinUIContainer').classList.add('active');
    } else {
        document.getElementById('joinUIContainer').classList.remove('active');
    }

}