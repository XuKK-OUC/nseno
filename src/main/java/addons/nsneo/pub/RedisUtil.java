package addons.nsneo.pub;

import redis.clients.jedis.Jedis;

/**
 * @Author: Yang Liu
 * @Date: 2019/4/24 16:03
 */
public class RedisUtil {
    private static String redisAddr = "211.64.154.111";
    private static int port = 6379;
    private static Jedis jedis = null;
    private static RedisUtil redisUtil = null;
    private RedisUtil(){
    }

    public static Jedis getJedis(){
//        if (jedis == null){
//            jedis = new Jedis(redisAddr,port);
//            jedis.connect();
//        }
        return new Jedis(redisAddr,port);
    }
}
