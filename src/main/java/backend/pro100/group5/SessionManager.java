package backend.pro100.group5;

import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class SessionManager {

    private static final ConcurrentMap<String , WebSocketSession> sessions = new ConcurrentHashMap<>();

    public static void addSession(String sessionId, WebSocketSession session){
        sessions.put(sessionId,session);
    }

    public static void removeSession(String sessionId){
        sessions.remove(sessionId);
    }

    public static Set<WebSocketSession> getSessions(){
        return Set.copyOf(sessions.values());
    }


}
