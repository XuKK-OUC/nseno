package addons.nsneo.pub;

public class EndLevelAndScoreBean {
    private String level; //达到的级别
    private double score; //此级别达到的分数

    public EndLevelAndScoreBean() {
    }

    public EndLevelAndScoreBean(String level, double score) {
        this.level = level;
        this.score = score;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    @Override
    public String toString() {
        return "EndLevelAndScoreBean{" +
                "level='" + level + '\'' +
                ", score=" + score +
                '}';
    }
}
