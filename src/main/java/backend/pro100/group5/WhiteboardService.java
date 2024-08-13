package backend.pro100.group5;

import org.springframework.stereotype.Component;

@Component
public class WhiteboardService {

    private final SignalRService signalRService;

    public WhiteboardService(SignalRService signalRService){
        this.signalRService = signalRService;
    }

    public void broadcastMessage(String target, Object message){
        signalRService.sendMessage("whiteboard", target, message);
    }

}
