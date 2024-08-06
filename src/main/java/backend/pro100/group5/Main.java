package backend.pro100.group5;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {

    /**
     * Opens Springboot application on port 8080, view it through "http://localhost:8080"
     * @param args Arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}