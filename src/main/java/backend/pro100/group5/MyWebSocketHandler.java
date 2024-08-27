package backend.pro100.group5;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

public class MyWebSocketHandler extends TextWebSocketHandler {

    private Map<String, List<WebSocketSession>> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception{

        String sessionId = getSessionIdFromSession(session);

        sessions.putIfAbsent(sessionId, new CopyOnWriteArrayList<>());
        sessions.get(sessionId).add(session);

    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception{

        String sessionId = getSessionIdFromSession(session);

        for (WebSocketSession s : sessions.get(sessionId)){
            if (s.isOpen() && !s.getId().equals(session.getId())){
                s.sendMessage(message);
            }
        }

    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception{

        String sessionId = getSessionIdFromSession(session);

        if (sessions.get(sessionId).isEmpty()){
            sessions.remove(sessionId);
        }

    }

    private String getSessionIdFromSession(WebSocketSession session){
        return session.getUri().getQuery().split("=")[1];
    }

}
