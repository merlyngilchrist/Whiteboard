package backend.pro100.group5;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WhiteboardController {

    /**
     * Automatically gets called by Springboot to use index.html as the displayed html file
     * @return The name of .html file that should open
     */
    @GetMapping("/")
    public String index() {
        return "index"; // Connects application to "index.html
    }
}
