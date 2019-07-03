package addons.nsneo.entity;

import addons.common.utils.SimpleJPABuilderPkg;

public class Login {
    /**
     * 用户注册方法
     * @param u
     */
    public static void add(Company u){
        if(u != null) {
            //判断用户的唯一性
            if(SimpleJPABuilderPkg.builder().findEntity(u)==null) {
                SimpleJPABuilderPkg.builder().update(u);
            }
        }
    }

    /**
     * 用户登录时验证身份
     * @param u
     * @return
     */
    public static boolean existUser(Company u){
        if(u != null) {
            Object entity = SimpleJPABuilderPkg.builder().findEntity(u);
            if(entity != null){
                return  true;
            }
        }
       return  false;
    }
}
