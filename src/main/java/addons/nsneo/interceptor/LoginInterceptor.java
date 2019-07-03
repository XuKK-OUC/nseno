package addons.nsneo.interceptor;

import addons.common.web.springController.ControllerReturnJson;

import addons.nsneo.pub.JWT;
import addons.nsneo.pub.LoginBean;
import addons.nsneo.pub.RedisBean;
import addons.nsneo.pub.RedisUtil;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import redis.clients.jedis.Jedis;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

/**
 * @Author: Yang Liu
 * @Date: 2019/4/23 22:07
 */
public class LoginInterceptor implements HandlerInterceptor {
    public void afterCompletion(HttpServletRequest request,
                                HttpServletResponse response, Object handler, Exception arg3)
            throws Exception {
    }

    public void postHandle(HttpServletRequest request, HttpServletResponse response,
                           Object handler, ModelAndView model) throws Exception {
    }

    //拦截每个请求
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws Exception {
        response.setCharacterEncoding("utf-8");
//        String token = request.getParameter("token");
        String token = request.getHeader("token");
        String[] pathInfoArr = request.getPathInfo().split("/");
        System.out.println("preHandle PathInfo=>" + request.getPathInfo());
        Jedis jedis = RedisUtil.getJedis();
        System.out.println("==========preHandle==========");
        if (null != token) {//token存在
            RedisBean redisBean = JWT.unsign(token, RedisBean.class);//通过token解析出来bean
            String redisId = jedis.get(token);
            Long ttl = jedis.ttl(token);//获取剩余过期时间

            System.out.println("还有多少时间过期========" + jedis.ttl(token));
//            String loginId = request.getParameter("id");//获取前端传入的企业id


            if (null != redisId && null != redisBean) {
                System.out.println(pathInfoArr[2]+ pathInfoArr.length);
                if (redisId.equals("role-admin")) {//管理员请求
                    jedis.expire(token, 60 * 60);
                    System.out.println("管理员续期后还有多少时间过期========" + jedis.ttl(token));
                    jedis.close();
                    return true;//管理验证成功
                } else if (pathInfoArr.length > 2 && pathInfoArr[2].equals("admin")!=true ){//用户请求

                    if (redisId.equals(redisBean.getEnterpriseNumber())||(Integer.parseInt(redisId) == Integer.parseInt(redisBean.getEnterpriseNumber()))) {
                        //续期   && ttl < 60*5       && ttl < 60*60*24
                        if (redisBean.getSystemtype().equals("pc")) {
                            jedis.expire(token, 60 * 60);
                        } else if (redisBean.getSystemtype().equals("app")) {
                            jedis.expire(token, 60 * 60 * 24 * 7);
                        }

                        System.out.println("用户续期后还有多少时间过期========" + jedis.ttl(token));
                        jedis.close();
                        return true;//用户验证成功
                    }
                }
            } else {
                responseMessage(response, response.getWriter());
                //验证失败
                return false;
            }
        } else {
            responseMessage(response, response.getWriter());
            //验证失败
            return false;
        }

        responseMessage(response, response.getWriter());
        return false;
    }

    //请求不通过，返回错误信息给客户端
    private void responseMessage(HttpServletResponse response, PrintWriter out) {
        response.setContentType("application/json; charset=utf-8");
        out.print(ControllerReturnJson.builder().setStatusCode("401").setStatusMsg("token无效").toJson());
        out.flush();
        out.close();
    }

}

