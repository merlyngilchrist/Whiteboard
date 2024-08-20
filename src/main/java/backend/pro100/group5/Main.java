package backend.pro100.group5;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.web.WebApplicationInitializer;

@SpringBootApplication
public class Main extends SpringBootServletInitializer implements WebApplicationInitializer {

    /**
     * Opens Springboot application on port 8080, view it through "http://localhost:8080"
     * @param args Arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}