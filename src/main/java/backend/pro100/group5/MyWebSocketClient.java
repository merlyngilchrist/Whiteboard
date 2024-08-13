package backend.pro100.group5;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;

public class MyWebSocketClient extends WebSocketClient {

    public MyWebSocketClient(URI serverUri){
        super(serverUri);
    }

    @Override
    public void onOpen(ServerHandshake handshakedata){
        System.out.println("Connected to SignalR hub");
    }

    @Override
    public void onMessage(String message){
        System.out.println("Receive message: " + message);
    }

    @Override
    public void onClose(int code, String reason, boolean remote){
        System.out.println("Connection closed: " + reason);
    }

    public void onError(Exception ex){
        ex.printStackTrace();
    }

    public void sendMessage(String message){
        this.send(message);
    }

}
