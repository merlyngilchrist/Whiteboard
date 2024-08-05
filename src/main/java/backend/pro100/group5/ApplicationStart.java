/**
 * @author jsandland
 * @createdOn 8/5/2024 at 10:53 AM
 * @projectName Whiteboard
 * @packageName backend.pro100.group5;
 */
package backend.pro100.group5;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.stereotype.Controller;

@Controller
public class ApplicationStart {

    /**
     * Automatically gets called by Springboot to use index.html as the displayed html file
     * @return The name of .html file that should open
     */
    @GetMapping("/")
    public String index() {
        return "index"; // Connects application to "index.html
    }
}
