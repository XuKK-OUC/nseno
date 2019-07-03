package addons.nsneo.pub;

import java.util.Arrays;

public class EndQuestionaireBean {
    private double score;  //自评得分
    private String maturelevel; //成熟度等级
    private LevelScoreBean[] levelScoreBeans;

    public EndQuestionaireBean() {
    }

    public EndQuestionaireBean(double score, String maturelevel, LevelScoreBean[] levelScoreBeans) {
        this.score = score;
        this.maturelevel = maturelevel;
        this.levelScoreBeans = levelScoreBeans;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public String getMaturelevel() {
        return maturelevel;
    }

    public void setMaturelevel(String maturelevel) {
        this.maturelevel = maturelevel;
    }

    public LevelScoreBean[] getLevelScoreBeans() {
        return levelScoreBeans;
    }

    public void setLevelScoreBeans(LevelScoreBean[] levelScoreBeans) {
        this.levelScoreBeans = levelScoreBeans;
    }

    public static class LevelScoreBean{
        private String level;  //级别
        private double levelScore; //级别的平均分
        //新加的
        private TradeTempBean[]tradeTempBeans;

        public LevelScoreBean() {
        }

        @Override
        public String toString() {
            return "LevelScoreBean{" +
                    "level='" + level + '\'' +
                    ", levelScore=" + levelScore +
                    ", tradeTempBeans=" + Arrays.toString(tradeTempBeans) +
                    '}';
        }

        public String getLevel() {
            return level;
        }

        public void setLevel(String level) {
            this.level = level;
        }

        public double getLevelScore() {
            return levelScore;
        }

        public void setLevelScore(double levelScore) {
            this.levelScore = levelScore;
        }

        public TradeTempBean[] getTradeTempBeans() {
            return tradeTempBeans;
        }

        public void setTradeTempBeans(TradeTempBean[] tradeTempBeans) {
            this.tradeTempBeans = tradeTempBeans;
        }

        public LevelScoreBean(String level, double levelScore, TradeTempBean[] tradeTempBeans) {
            this.level = level;
            this.levelScore = levelScore;
            this.tradeTempBeans = tradeTempBeans;
        }
    }
    public static class TradeScoreBean{
        private  String level; //所属级别
        private String tradeName;  //行业子标签名字 如工艺设计
        private double avgScore;    //平均分

        public TradeScoreBean() {
        }

        public String getLevel() {
            return level;
        }

        public void setLevel(String level) {
            this.level = level;
        }

        public String getTradeName() {
            return tradeName;
        }

        public void setTradeName(String tradeName) {
            this.tradeName = tradeName;
        }

        public double getAvgScore() {
            return avgScore;
        }

        public void setAvgScore(double avgScore) {
            this.avgScore = avgScore;
        }

        public TradeScoreBean(String level, String tradeName, double avgScore) {
            this.level = level;
            this.tradeName = tradeName;
            this.avgScore = avgScore;
        }

        @Override
        public String toString() {
            return "TradeScoreBean{" +
                    "level='" + level + '\'' +
                    ", tradeName='" + tradeName + '\'' +
                    ", avgScore=" + avgScore +
                    '}';
        }
    }

}
