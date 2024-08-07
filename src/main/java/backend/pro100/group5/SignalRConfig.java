package backend.pro100.group5;

import okhttp3.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.azure.messaging.webpubsub.WebPubSubServiceClient;
import com.azure.messaging.webpubsub.WebPubSubServiceClientBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;

@Component
public class SignalRConfig extends TextWebSocketHandler {

    private static final String CONNECTION_STRING = "Endpoint=https://whiteboard.service.signalr.net;AccessKey=Ydl/+I+T5Q8PJDW8HN5CIQvHVX43UCjy4j1S6kS3d4U=;Version=1.0;";
    private final OkHttpClient client = new OkHttpClient();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception{
        SessionManager.addSession(session.getId(), session);
        System.out.println("WebSocket connection established: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception{
        SessionManager.removeSession(session.getId());
        System.out.println("WebSocket connection closed: " + session.getId());
    }

    public void start(){
        Request request = new Request.Builder().url(CONNECTION_STRING).build();
        WebSocketListener listener = new WebSocketListener() {

            @Override
            public void onOpen(WebSocket webSocket, Response response){
                System.out.println("WebSocket opened.");
            }

            @Override
            public void onMessage(WebSocket webSocket, String text){
                System.out.println("Recieved message: " + text);
                //Forward the received message to all connected clients
                for (WebSocketSession session : SessionManager.getSessions()){
                    try {
                        session.sendMessage(new TextMessage(text));
                    }catch (IOException e){
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void onFailure(WebSocket webSocket, Throwable t, Response response){
                System.err.println("WebSocket failure: " + t.getMessage());
            }

        };

        client.newWebSocket(request, listener);
        client.dispatcher().executorService().shutdown();
    }



}
