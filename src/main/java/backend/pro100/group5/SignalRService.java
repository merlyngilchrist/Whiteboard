package backend.pro100.group5;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;



@Service
public class SignalRService {

    @Value("${azure.signalr.url}")
    private String signalUrl;
    @Value("${azure.signalr.access-key}")
    private String accessKey;
    private final RestTemplate restTemplate = new RestTemplate();

    public void sendMessage(String hubName, String target, Object message){
        String url = String.format("%s/api/v1/hubs/%s", signalUrl, hubName);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + accessKey);

        HttpEntity<Object> request = new HttpEntity<>(message, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url + "/send?target" + target, request, String.class);
            System.out.println("SignalR Response: " + response.getBody());
        }catch (Exception e){
            e.printStackTrace();
            System.out.println("Error sending SignalR message: " + e.getMessage());
        }
    }


}
