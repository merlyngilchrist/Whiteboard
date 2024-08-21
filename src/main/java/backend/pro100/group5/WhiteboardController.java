package backend.pro100.group5;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class WhiteboardController {

    //Test Connection between the Java files and JavaScript files
    @GetMapping("/test-connection")
    @ResponseBody
    public String testConnection(){
        System.out.println("Java files have received the request for JavaScript");
        return "Connection Successful!";
    }


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
        System.out.println("Canvas started!");
        return new ModelAndView("canvas");
    }


    @PostMapping("/hateButtonClicked")
    public Map<String, String> handleButtonClick() {
        // Logic to handle button click
        System.out.println("Hate has been sent!");

        // Return a JSON response
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hate was sent!");
        return response;
    }
}
