package addons.nsneo.pub;

import javax.servlet.http.HttpServletRequest;

public class CommonUtil {
    public static  final String SessionKey_CheckCode = "nsneo_serviceplatform_checkcode";

    //从request获取客户id
    public static String getClientId(HttpServletRequest request){
        //两种选择
        // 1.sessionId存在cookie中
        //2.在request中的header  jwt
        return request.getSession().getId();
    }

    //从token中获取企业id
    public static String getEnterpriseIdByToken(String token){
        RedisBean redisBean = JWT.unsign(token, RedisBean.class);

        return redisBean.getEnterpriseNumber();
    }
}

