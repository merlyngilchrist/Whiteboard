/**
 * @author jsandland
 * @createdOn 8/7/2024 at 10:32 AM
 * @projectName Whiteboard
 * @packageName backend.pro100.group5;
 */
package backend.pro100.group5;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry){
        registry.addHandler(new MyWebSocketHandler(), "/canvas").setAllowedOrigins("*");
    }

}

