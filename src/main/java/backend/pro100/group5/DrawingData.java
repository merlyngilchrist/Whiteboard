package backend.pro100.group5;

public class DrawingData {

    private int x;
    private int y;
    private String action;
    private String color;
    private int tool;
    private int size;

    private String sessionId;

    public void setX(int x) {
        this.x = x;
    }

    public void setY(int y) {
        this.y = y;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public void setTool(int tool) {
        this.tool = tool;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public String getAction() {
        return action;
    }

    public String getColor() {
        return color;
    }

    public int getTool() {
        return tool;
    }

    public int getSize() {
        return size;
    }

}
