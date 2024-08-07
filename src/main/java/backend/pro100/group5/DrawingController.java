package backend.pro100.group5;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@RestController
public class DrawingController {

    @PostMapping("/draw")
    public void draw(@RequestBody DrawingData drawingData){
        String message = convertDrawingDataToMessage(drawingData);
        forwardToSignalR(message);
        forwardToWebSocketClients(message);
    }

    private String convertDrawingDataToMessage(DrawingData drawingData){
        return "{ \"x\": " + drawingData.getX() + ", \"y\": " + drawingData.getY() + ", \"action\": \"" + drawingData.getAction() + "\" }";
    }

    private void forwardToSignalR(String message){
        //Implement the logic to send the message to Azure SignalR Service
    }

    private void forwardToWebSocketClients(String message){
        for (WebSocketSession session : SessionManager.getSessions()){
            try {
                session.sendMessage(new TextMessage(message));
            } catch (IOException e){
                e.printStackTrace();
            }
        }
    }

}
