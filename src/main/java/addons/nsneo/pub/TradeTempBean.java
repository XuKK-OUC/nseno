package addons.nsneo.pub;

public class TradeTempBean {
    private String tradeLableName;
    private double Score;

    public TradeTempBean() {
    }

    public TradeTempBean(String tradeLableName, double score) {
        this.tradeLableName = tradeLableName;
        Score = score;
    }

    @Override
    public String toString() {
        return "TradeTempBean{" +
                "tradeLableName='" + tradeLableName + '\'' +
                ", Score=" + Score +
                '}';
    }

    public String getTradeLableName() {
        return tradeLableName;
    }

    public void setTradeLableName(String tradeLableName) {
        this.tradeLableName = tradeLableName;
    }

    public double getScore() {
        return Score;
    }

    public void setScore(double score) {
        Score = score;
    }
}
