package backend.pro100.group5;

import okhttp3.*;
import org.jetbrains.annotations.NotNull;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@RestController
public class DrawingController {


    private static final OkHttpClient client = new OkHttpClient();

    @PostMapping("/draw")
    public void draw(@RequestBody DrawingData drawingData){
        String message = convertDrawingDataToMessage(drawingData);
        try {
        forwardToSignalR(message);
        }catch (Exception e){
            System.err.println("Error forwarding message: " + e.getMessage());
        }
        forwardToWebSocketClients(message);
    }

    private String convertDrawingDataToMessage(DrawingData drawingData){
        return "{ \"x\": " + drawingData.getX() + ", \"y\": " + drawingData.getY() + ", \"action\": \"" + drawingData.getAction() + "\" }";
    }

    private void forwardToSignalR(String message){

        MediaType JSON = MediaType.get("application/json; charset=utf-8");
        okhttp3.RequestBody body = okhttp3.RequestBody.create(message, JSON);
        Request request = new Request.Builder()
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()){
            if (!response.isSuccessful()){
                throw new IOException("Unexpected code " + response);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
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
