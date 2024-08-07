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

    private static final String SIGNALR_URL = "whiteboard.service.signalr.net";
    private static final String HUB_NAME = "whiteboard";
    private static final String ACCESS_KEY = "Ydl/+I+T5Q8PJDW8HN5CIQvHVX43UCjy4j1S6kS3d4U=";
    private static final OkHttpClient client = new OkHttpClient();

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
        String url = SIGNALR_URL + "/api/v1/hubs/" + HUB_NAME + "/messages";
        String token = SignalRTokenGenerator.generateAccessToken(SIGNALR_URL, ACCESS_KEY);

        MediaType JSON = MediaType.get("application/json; charset=utf-8");
        okhttp3.RequestBody body = okhttp3.RequestBody.create(message, JSON);
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Authorization", "Bearer " + token)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NotNull Call call, @NotNull IOException e) {
                e.printStackTrace();
            }

            @Override
            public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                if (!response.isSuccessful()){
                    throw new IOException("Unexpected code" + response);
                }
                System.out.println("Message sent to SignalR: " + message);
            }
        });
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
