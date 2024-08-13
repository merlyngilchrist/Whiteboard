package backend.pro100.group5;

import java.util.HashMap;
import java.util.Map;

public class Session {

    private String id;
    private Map<String, String> users = new HashMap<>();

    public Session(String id){
        this.id = id;
    }

    public void addUser(String userId, String userName){
        users.put(userId, userName);
    }

    public void removeUser(String userId){
        users.remove(userId);
    }

    public boolean isEmpty(){
        return users.isEmpty();
    }

}
