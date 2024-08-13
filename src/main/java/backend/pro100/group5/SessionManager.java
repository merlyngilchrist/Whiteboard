package backend.pro100.group5;

import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class SessionManager {

    private final Map<String, Session> sessions = new HashMap<>();

    public String createSession(){
        String sessionId = UUID.randomUUID().toString();
        sessions.put(sessionId, new Session(sessionId));
        return sessionId;
    }

    public Session joinSession(String sessionId){
        return sessions.get(sessionId);
    }

    public void leaveSession(String sessionId, String userId){
        Session session = sessions.get(sessionId);
        if (session != null){
            session.removeUser(userId);
            if (session.isEmpty()){
                sessions.remove(sessionId);
            }
        }
    }

//    private static final ConcurrentMap<String , WebSocketSession> sessions = new ConcurrentHashMap<>();

//    public static void addSession(String sessionId, WebSocketSession session){
//        sessions.put(sessionId,session);
//    }
//
//    public static void removeSession(String sessionId){
//        sessions.remove(sessionId);
//    }
//
//    public static Set<WebSocketSession> getSessions(){
//        return Set.copyOf(sessions.values());
//    }

}
