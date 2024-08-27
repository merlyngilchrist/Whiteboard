package backend.pro100.group5;

import org.springframework.web.socket.WebSocketSession;


import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;


public class SessionManager {

    private static final ConcurrentMap<String , Set<WebSocketSession>> sessions = new ConcurrentHashMap<>();

    public static void createSession(String sessionId){

    }

    public static void joinSession(String sessionId, WebSocketSession session){
        sessions.getOrDefault(sessionId, ConcurrentHashMap.newKeySet()).add(session);
    }

    public static void removeSession(String sessionId, WebSocketSession session){
        Set<WebSocketSession> socketSessions = sessions.get(sessionId);
        if (sessions != null){
            sessions.remove(session);
            if (sessions.isEmpty()){
                sessions.remove(sessionId);
            }
        }
    }

    public static boolean sessionExists(String sessionId){
        return sessions.containsKey(sessionId);
    }

    public static Set<WebSocketSession> getSessions(String sessionId){
        return sessions.getOrDefault(sessionId, ConcurrentHashMap.newKeySet());
    }


}
