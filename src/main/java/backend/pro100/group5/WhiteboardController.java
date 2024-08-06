package backend.pro100.group5;

import com.azure.messaging.webpubsub.WebPubSubServiceClient;
import com.azure.messaging.webpubsub.models.GetClientAccessTokenOptions;
import com.azure.messaging.webpubsub.models.WebPubSubClientAccessToken;
import com.azure.messaging.webpubsub.models.WebPubSubContentType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

@Controller
//@RestController
//@RequestMapping("/api/whiteboard")
public class WhiteboardController {

    /*
    @Autowired
    private WebPubSubServiceClient webPubSubServiceClient;

    @PostMapping("/send")
    public void sendMessage(@RequestBody String message){
        webPubSubServiceClient.sendToAll(message, WebPubSubContentType.TEXT_PLAIN);
    }

    @GetMapping("/negotiate")
    public Map<String, String> negotiate(){
        GetClientAccessTokenOptions options = new GetClientAccessTokenOptions()
                .setRoles(Collections.singletonList("webpubsub.joinLeaveGroup"));
        WebPubSubClientAccessToken token = webPubSubServiceClient.getClientAccessToken(options);
        Map<String, String> response = new HashMap<>();
        response.put("url", token.getUrl());
        response.put("accessToken", token.getToken());
        return response;
    }

     */



    /**
     * Automatically gets called by Springboot to use index.html as the displayed html file
     * @return The name of .html file that should open
     */
    @GetMapping("/")
    public String index() {
        return "index"; // Connects application to "index.html
    }

    /**
     * Automatically called when a button/form with that action tag
     * is clicked.
     * @return Redirects the user back to the index page
     */
    @PostMapping("/canvas")
    public ModelAndView goToCanvasButtonClicked() {
        System.out.println("Button was clicked!");
        return new ModelAndView("canvas");
    }


    @PostMapping("/hate-Button-Clicked")
    @ResponseBody
    public Map<String, String> handleButtonClicked() {
        // Logic to handle button click
        System.out.println("Hate has been sent!");

        // Return a JSON response
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hate was sent!");
        return response;
    }
}
