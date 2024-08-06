package backend.pro100.group5;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.azure.messaging.webpubsub.WebPubSubServiceClient;
import com.azure.messaging.webpubsub.WebPubSubServiceClientBuilder;

@Configuration
public class SignalRConfig {

    private static final String CONNECTION_STRING = "Endpoint=https://whiteboard.service.signalr.net;AccessKey=Ydl/+I+T5Q8PJDW8HN5CIQvHVX43UCjy4j1S6kS3d4U=;Version=1.0;";
    private static final String HUB_NAME = "whiteboard";

    @Bean
    public WebPubSubServiceClient webPubSubServiceClient(){
        return new WebPubSubServiceClientBuilder()
                .connectionString(CONNECTION_STRING)
                .hub(HUB_NAME)
                .buildClient();
    }

}
