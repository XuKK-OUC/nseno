package addons.nsneo.pub;

public class EndBean {
    private double score;  //自评得分
    private String maturelevel; //成熟度等级
    private LevelScoreBean[] levelScoreBeans;

    public EndBean() {
    }

    public EndBean(double score, String maturelevel, LevelScoreBean[] levelScoreBeans) {
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
        private TradeScoreBean[] tradeScoreBeans;

        public TradeScoreBean[] getTradeScoreBeans() {
            return tradeScoreBeans;
        }

        public void setTradeScoreBeans(TradeScoreBean[] tradeScoreBeans) {
            this.tradeScoreBeans = tradeScoreBeans;
        }

        public LevelScoreBean() {
        }

        public LevelScoreBean(String level, double levelScore) {
            this.level = level;
            this.levelScore = levelScore;
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

        @Override
        public String toString() {
            return "LevelScoreBean{" +
                    "level='" + level + '\'' +
                    ", levelScore=" + levelScore +
                    '}';
        }
    }
    public static class TradeScoreBean{
        private String tradeName;  //行业子标签名字 如工艺设计
        private double avgScore;    //平均分

        public TradeScoreBean() {
        }

        public TradeScoreBean(String tradeName, double avgScore) {
            this.tradeName = tradeName;
            this.avgScore = avgScore;
        }

        @Override
        public String toString() {
            return "TradeScoreBean{" +
                    "tradeName='" + tradeName + '\'' +
                    ", avgScore=" + avgScore +
                    '}';
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
    }

}
