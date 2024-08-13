package backend.pro100.group5;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.net.URI;

@Configuration
public class SignalRConfig {

    @Value("${azure.signalr.url}")
    private String signalrUrl;
    @Value("${azure.signalr.access-key}")
    private String accessKey;
    @Value("${azure.signalr.hub-name}")
    private String hubName;

    @Bean
    public MyWebSocketClient webSocketClient(){
        try {
            URI uri = new URI(signalrUrl + "/client/?hub" + hubName);
            MyWebSocketClient client = new MyWebSocketClient(uri);
            client.connect();
            return client;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }



//    @Override
//    public void afterConnectionEstablished(WebSocketSession session) throws Exception{
//        SessionManager.addSession(session.getId(), session);
//        System.out.println("WebSocket connection established: " + session.getId());
//    }
//
//    @Override
//    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception{
//        SessionManager.removeSession(session.getId());
//        System.out.println("WebSocket connection closed: " + session.getId());
//    }

//    public void start(){
//        Request request = new Request.Builder().url(CONNECTION_STRING).build();
//        WebSocketListener listener = new WebSocketListener() {
//
//            @Override
//            public void onOpen(WebSocket webSocket, Response response){
//                System.out.println("WebSocket opened.");
//            }
//
//            @Override
//            public void onMessage(WebSocket webSocket, String text){
//                System.out.println("Recieved message: " + text);
//                //Forward the received message to all connected clients
//                for (WebSocketSession session : SessionManager.getSessions()){
//                    try {
//                        session.sendMessage(new TextMessage(text));
//                    }catch (IOException e){
//                        e.printStackTrace();
//                    }
//                }
//            }
//
//            @Override
//            public void onFailure(WebSocket webSocket, Throwable t, Response response){
//                System.err.println("WebSocket failure: " + t.getMessage());
//            }
//
//        };
//
//        client.newWebSocket(request, listener);
//        client.dispatcher().executorService().shutdown();
//    }



}
