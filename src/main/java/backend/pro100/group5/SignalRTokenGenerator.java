package backend.pro100.group5;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class SignalRTokenGenerator {

    public static String generateAccessToken(String endpoint, String accessKey){
        String audience = endpoint + "/api/v1/hubs/whiteboard";
        String token = audience + "\n" + System.currentTimeMillis() / 1000L + "\n" + accessKey;
        byte[] hmacSha256 = hmacSha256(accessKey, token);
        String sigature = Base64.getEncoder().encodeToString(hmacSha256);
        return "Endpoint=" + endpoint + ";AccessKey=" + accessKey + ";Version=1.0;Token=" + sigature;
    }

    private static byte[] hmacSha256(String key, String data){
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec secretKeySpec = new javax.crypto.spec.SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        }catch (Exception e){
            throw new RuntimeException("Failed to generate HMAC SHA256", e);
        }
    }

}
