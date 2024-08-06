/**
 * Hate sent button has been clicked, calls the "hateButtonClicked" in the WhiteboardController class
 */
function hateSent() {
    fetch('/hate-Button-Clicked', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {})
        .catch(error => console.error('Error:', error));
}