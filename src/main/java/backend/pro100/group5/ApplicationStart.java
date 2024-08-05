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
    @GetMapping("/")
    public String index() {
        return "index"; // This should correspond to the name of your HTML file without the extension
    }
}
