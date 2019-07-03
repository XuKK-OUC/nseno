package addons.nsneo.web.api;

import addons.common.utils.SimpleJPABuilderPkg;
import addons.common.web.springController.ControllerReturnJson;
import addons.common.web.springController.SpringControllerBase;
import addons.nsneo.entity.Company;
import addons.nsneo.pub.*;
//import addons.nsneo.service.CompanyService;
import addons.nsneo.service.CompanyService;
import com.alibaba.fastjson.JSONObject;
import com.nsneo.utils.container.Pair;
import com.nsneo.utils.sql.SqlWhereWithParamTools;
import org.checkerframework.checker.units.qual.C;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import redis.clients.jedis.Jedis;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
//@RequestMapping("/api/myCheckCode")
@RequestMapping("/api/usermodule")
public class UserController extends SpringControllerBase {
    @Autowired
    private CompanyService companyService;

    /**
     * 获取验证码的base64字符串
     * 1.上次请求验证码时间,是否是第一次访问,判断是否可以生成验证码
     * 2.生成验证码及图片,返回验证码的base64字符串
     * */


    @GetMapping(value = "/createcheckcode",produces = {"application/json;charset=utf-8"})
    public String create(HttpServletRequest request) throws Exception {
        UserCheckInfo userCheckInfo = new UserCheckInfo(request);  //验证用户信息
        if(true){  //请求间隔为一分钟,一分钟之外可以再次请求验证码userCheckInfo.canProduceCode(2*1000*60L)
            //可以请求验证码,则产生验证码及其图片
            Pair<String, BufferedImage> pair = getCheckCodeAndImage();
            //将验证码对象信息存入到session中
            String code = pair.getHeadKey();
            saveUserCheckCode(code,request);
            //将验证码对应的base64字符串返回到前台
            String imageToBase64 = imageToBase64String(pair.getBodyKey());
            return ControllerReturnJson.builder().setDatas(imageToBase64).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();
        }
        return ControllerReturnJson.builderFail("非法访问").setStatusCode(String.valueOf(CodeMsg.NOT_AUTHOTIZED.getCode())).setStatusMsg(CodeMsg.NOT_AUTHOTIZED.getMsg()).toJson();
    }

    public static class UserCheckInfo{
        private Date preDate;  //上次请求验证码时间
        private boolean firstVisit=true; //是否为第一次访问

        public UserCheckInfo() {
        }
        public UserCheckInfo(HttpServletRequest request) {
            String key = CommonUtil.getClientId(request)+CommonUtil.SessionKey_CheckCode;//用户sessionId
            UserCheckCode userCheckCode = (UserCheckCode) request.getSession().getAttribute(key);
            Date date = new Date();
            //已经请求过验证码且验证码未失效
            // && userCheckCode.getCreateDateTime().getTime()+userCheckCode.getExpireTime()>date.getTime()
            if(userCheckCode!=null){
                this.preDate = userCheckCode.getCreateDateTime();
                setFirstVisit(false);
            }
        }

        /**
         * 是否可以产生验证码
         * @param interval
         * @return
         */
        public boolean canProduceCode(long interval){
            return canProduceCode(null,interval);
        }
        public boolean canProduceCode(Date curDate, long interval){
            if(curDate==null){
                curDate = new Date();
            }
            if(firstVisit){
                return true;
            }
            if(preDate==null){
                return true;
            }
            System.out.println("cur----"+curDate.getTime());
            System.out.println("pre----"+preDate.getTime());
            if((curDate.getTime()-preDate.getTime())>interval){ //请求时间大于间隔时间
                return  true;
            }
            return false;
        }
        public Date getPreDate() {
            return preDate;
        }

        public void setPreDate(Date preDate) {
            this.preDate = preDate;
        }

        public boolean isFirstVisit() {
            return firstVisit;
        }

        public void setFirstVisit(boolean firstVisit) {
            this.firstVisit = firstVisit;
        }

    }

    /**
     * 保存在session中的校验码对象信息
     */
    public static class UserCheckCode{
        private String code; //保存的验证码 xk48
        private long expireTime; //失效的时间
        private String key; //用户sessionId
        private Date createDateTime; //验证码创建的时间

        public UserCheckCode() {
        }

        public UserCheckCode(String code, long expireTime, String key) {
            this.code = code;
            this.expireTime = expireTime;
            this.key = key;
            this.createDateTime = new Date();
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public long getExpireTime() {
            return expireTime;
        }

        public void setExpireTime(long expireTime) {
            this.expireTime = expireTime;
        }

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }

        public Date getCreateDateTime() {
            return createDateTime;
        }

        public void setCreateDateTime(Date createDateTime) {
            this.createDateTime = createDateTime;
        }

        public boolean isValid(){
            return isValid(null);
        }
        /**验证码是否还有效
         * @param date
         * @return
         */
        public boolean isValid(Date date){
            if(date == null){
                date = new Date();
            }
            if(date.getTime()-this.getCreateDateTime().getTime()>this.getExpireTime()){
                return false;
            }
            return true;

        }
    }
    /**
     * 保存校验码对象信息存入session
     */
    public void saveUserCheckCode(String code, HttpServletRequest request){
        String key = CommonUtil.getClientId(request)+CommonUtil.SessionKey_CheckCode;//用户sessionId
        long expireTime = 2*1000*60L;
        UserCheckCode userCheckCode = new UserCheckCode(code,expireTime,key);

        request.getSession().setAttribute(key,userCheckCode);
    }

    /**
     * 得到session中保存的校验码对象
     * @param request
     * @return
     */
    public UserCheckCode getUerCheckCode(HttpServletRequest request){
        String key = CommonUtil.getClientId(request)+CommonUtil.SessionKey_CheckCode;
        System.out.println( CommonUtil.getClientId(request));
        UserCheckCode userCheckCode = (UserCheckCode) request.getSession().getAttribute(key);
        return userCheckCode;
    }
    /**
     * 产生验证码及其图片
     */
    public Pair<String, BufferedImage> getCheckCodeAndImage() throws Exception {
        //1.随机生成4位数字或字母
        //2.存入数组转为字符串绘制到图片中
        //3.返回code及图片
        String code= RandomCodeUtil.getStringRandom(4);  //验证码对应的code 如xk48
        System.out.println("生成的验证码为:"+code);
        BufferedImage image= RandomCodeUtil.createCodeImage(120,40,code); //验证码对应的图片
        return new Pair<String, BufferedImage>(code,image);
    }
    /**
     * 将校验码图片转成base64字符串
     * @param
     * @return
     */
    private String imageToBase64String(BufferedImage image) throws IOException {
        System.out.println("返回的base64字符串为"+RandomCodeUtil.imageToBase64(image));
//        RandomCodeUtil.base64ToImage(RandomCodeUtil.imageToBase64(image));
        return  RandomCodeUtil.imageToBase64(image);
    }

    /**
     * 校验验证码与用户输入是否正确
     * @param code
     * @param request
     * @return
     */
    /*@RequestMapping(value = "/check",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public String check2(@RequestParam String code, HttpServletRequest request){
        UserCheckCode userCheckCode = getUerCheckCode(request);
        System.out.println("用户输入的验证码为"+code);
        System.out.println("验证码为:"+userCheckCode.getCode());
        if(userCheckCode.isValid()){ //验证码未失效
            if(code.equals(userCheckCode.getCode())){  //验证码与用户输入相同,成功
                return ControllerReturnJson.builder().setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg("验证码校验成功").toJson();
            }
            else{
                return ControllerReturnJson.builderFail("no access").setStatusCode("400").setStatusMsg("验证码错误").toJson();
            }
        }
        return ControllerReturnJson.builderFail("no access").setStatusCode("401").setStatusMsg("验证码已失效").toJson();
    }*/
    /**
     * 用户登录
//     * @param enterpriseNumber
//     * @param password
//     * @param code
     * @return true/false
     */
    @RequestMapping(value = "/login",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public String login(@RequestBody LoginBean loginBean, HttpServletRequest request){
        System.out.println("loginBean==="+loginBean);
        String code = loginBean.getCode();
        String enterpriseNumber = loginBean.getEnterprise_number();
        String password = loginBean.getPassword();
        String systemType = loginBean.getSystemType(); //pc/app

        Jedis jedis = RedisUtil.getJedis();
        String clientId = CommonUtil.getClientId(request);
        String valueByClientId  = jedis.get(clientId);

        if (systemType.equals("pc")){
            if (valueByClientId == null || valueByClientId.equals("1")!=true) return ControllerReturnJson.builder().setStatusCode(String.valueOf(CodeMsg.CODE_EXPIRED.getCode())).setStatusMsg(CodeMsg.CODE_EXPIRED.getMsg()).toJson();
            jedis.del(clientId);//已经校验成功了，把clientId从redis删掉
        }

        //查库
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Company.class);
        sqlWhere.and("enterprise_number",enterpriseNumber);
        Company company = SimpleJPABuilderPkg.builder(Company.class).findFirstEntity(sqlWhere);
        if(company==null||company.getStatus()==1){  //企业不存在,说明未注册或者用户填写错误
            return ControllerReturnJson.builderFail("企业社会信用代码错误").setStatusCode(String.valueOf(CodeMsg.NOT_FOUND.getCode())).setStatusMsg(CodeMsg.NOT_FOUND.getMsg()).toJson();
        }
        else{  //企业存在,再进行检验密码
            if(password.equals(company.getPassword())){  //密码正确
                String enterpriseName = companyService.getEnterpriseNameFromNumber(enterpriseNumber);
                loginBean.setEnterprise_name(enterpriseName);
                RedisBean redisBean = new RedisBean(enterpriseNumber, password,systemType);
                //给用户jwt加密生成token
                String token = JWT.sign(redisBean, 60L* 1000L* 30L);
                Map<String,Object> result =new HashMap<String,Object>();
                result.put("token", token);
                result.put("id", enterpriseNumber);
                System.out.println("得到的token=================="+token);

                jedis.set(token, enterpriseNumber);
                if (redisBean.getSystemtype() .equals( "pc")){
                    jedis.expire(token,60*60);
                }else if (redisBean.getSystemtype().equals("app")){
                    jedis.expire(token,60*60*24*7);
                }
//                jedis.expire(token, 60*60);//超时时间 pc  1小时   app 7天

                //用完关闭
                jedis.close();
                loginBean.setToken(token);
                return  ControllerReturnJson.builder().setDatas(loginBean).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();
            }
            else{
                return ControllerReturnJson.builderFail("密码错误").setStatusCode(String.valueOf(CodeMsg.PASSWORD_ERROR.getCode())).setStatusMsg(CodeMsg.PASSWORD_ERROR.getMsg()).toJson();
            }
        }

    }
    /**
     * 用户注册
     * //@param enterprise_number
     * //@param enterprise_name
     * //@param password
     *
     * @return true/false
     */
    @RequestMapping(value = "/register",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public String register(@RequestBody Company company,HttpServletRequest request){
        System.out.println(company);
        //验证数据库中是否有企业信用代码重复的
       if(companyService.isUniqueSocialNumber(company.getEnterprise_number())){
           //默认用户状态为0 表示可用
           company.setStatus(0);
            //没有重复的话可以向数据库插入
            companyService.save(company);
           return ControllerReturnJson.builder().setDatas(company.getEnterprise_number()).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();
       }
        return ControllerReturnJson.builderFail("企业信用代码重复,请重新输入").setStatusCode(String.valueOf(CodeMsg.REPEAT_ERROR.getCode())).setStatusMsg(CodeMsg.REPEAT_ERROR.getMsg()).toJson();

    }

    /**
     * 修改用户信息
     * //@param enterprise_number
     * //@param enterprise_name
     * //@param password
     *
     * @return true/false
     */
    @RequestMapping(value = "/edituserinfo",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public String edituserinfo(@RequestBody Company company,HttpServletRequest request){
        System.out.println(company);
            //得到传过来的企业信用代码
            String enterpriseNumber = company.getEnterprise_number();
            //根据企业信用代码查库找到原数据
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Company.class);
        sqlWhere.and("enterprise_number",enterpriseNumber);
        Company c = SimpleJPABuilderPkg.builder(Company.class).findFirstEntity(sqlWhere);
        //更新数据
        c.setEnterprise_name(company.getEnterprise_name());
        c.setAnnual_income(company.getAnnual_income());
        c.setProvince(company.getProvince());
        c.setArea(company.getArea());
        c.setBusinessType(company.getBusinessType());
        c.setCity(company.getCity());
        c.setEmail(company.getEmail());
        c.setEnterprise_scale(company.getEnterprise_scale());
        c.setEnterprise_type(company.getEnterprise_type());
        c.setIndustry_big(company.getIndustry_big());
        c.setIndustry_small(company.getIndustry_small());
        c.setPhone(company.getPhone());
        c.setDetailAddress(company.getDetailAddress());
        c.setPostcode(company.getPostcode());
        c.setWebSite(company.getWebSite());
        SimpleJPABuilderPkg.builder().update(c);

            return ControllerReturnJson.builder().setDatas(company.getEnterprise_number()).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();
        }






    @RequestMapping(value = "/login2", method = RequestMethod.POST)
    public String login(@RequestBody JSONObject json, HttpServletRequest request){
        Jedis jedis = RedisUtil.getJedis();
        String clientId = CommonUtil.getClientId(request);
        String tag  = jedis.get(clientId);
        if (tag == null || tag.equals("1")!=true) return ControllerReturnJson.builder().setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();
        jedis.del(clientId);//已经校验成功了，把clientId从redis删掉

        String id = json.getString("id");
        String password = json.getString("password");
        String systemtype = json.getString("systemtype");

        //查数据库 验证用户名密码 ==========

        RedisBean redisBean = new RedisBean(id, password,systemtype);
        //给用户jwt加密生成token
        String token = JWT.sign(redisBean, 60L* 1000L* 30L);
        Map<String,Object> result =new HashMap<String,Object>();
        result.put("token", token);
        result.put("id", id);
        System.out.println("得到的token=================="+token);

        jedis.set(token, id);
        jedis.expire(token, 60*60);//超时时间 pc  1小时   app 7天

        //用完关闭
        jedis.close();
        return ControllerReturnJson.builder().setDatas(result).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();


    }

    /**
     * 校验验证码
     * @param verifycode
     * @param request
     * @return
     */
    @RequestMapping(value = "/checkcodeverify/{verifycode}",method = RequestMethod.GET)
    public  String verify(@PathVariable String verifycode, HttpServletRequest request, HttpServletResponse response){
        UserCheckCode userCheckCode = getUerCheckCode(request);
//        if (userCheckCode == null) System.out.println("user CheckCode is null"+ request.get);
        System.out.println("用户输入的验证码为"+verifycode);
        System.out.println("验证码为:"+userCheckCode.getCode());
        String clientId = CommonUtil.getClientId(request);
        System.out.println(clientId+"==========clientId verif1");
        if(userCheckCode.isValid()){ //验证码未失效
            if(verifycode.toLowerCase().equals(userCheckCode.getCode().toLowerCase())){  //验证码与用户输入相同,验证成功
                //存入uuid
//                String clientId = CommonUtil.getClientId(request);
//                System.out.println(clientId+"==========clientId verif");
                Jedis jedis = RedisUtil.getJedis();
                jedis.set(clientId, "1");//存储clientId 用于登录时校验
                System.out.println("set redis======");
                jedis.expire(clientId, 60*2);//超时时间  2分钟
                jedis.close();
//                System.out.println("XXXXXXXXXXXXXXX"+response.toString());
                return ControllerReturnJson.builder().setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();
            }else{
                return ControllerReturnJson.builderFail("no access").setStatusCode(String.valueOf(CodeMsg.CODE_ERROR.getCode())).setStatusMsg(CodeMsg.CODE_ERROR.getMsg()).toJson();
            }
        }


        return ControllerReturnJson.builderFail("no access").setStatusCode(String.valueOf(CodeMsg.CODE_EXPIRED.getCode())).setStatusMsg(CodeMsg.CODE_EXPIRED.getMsg()).toJson();

    }

    /**
     * 根据用户id和token得到用户的注册信息
     */
    @RequestMapping(value = "/getUserInfo",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public String getUserInfo(@RequestBody JSONObject jsonObject){
        JSONObject object = jsonObject;
        System.out.println(object);
        String s = object.getString("enterpriseNumber");
        System.out.println("企业信用代码"+s);
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Company.class);
        sqlWhere.and("enterprise_number",s);
        Company company = SimpleJPABuilderPkg.builder(Company.class).findFirstEntity(sqlWhere);
        //System.out.println(company);
        CompanyInfoBean companyInfoBean = new CompanyInfoBean(company.getEnterprise_number(),company.getEnterprise_name(),company.getPassword(),company.getPhone(),company.getEmail(),company.getEnterprise_type(),company.getIndustry_big(),company.getIndustry_small(),company.getEnterprise_scale(),company.getAnnual_income(),company.getProvince(),company.getCity(),company.getArea(),company.getBusinessType(),company.getDetailAddress(),company.getPostcode(),company.getWebSite());
        return ControllerReturnJson.builder().setDatas(companyInfoBean).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();
    }

    /**
     * 用户修改密码
     */
    @RequestMapping(value = "/updatePassword",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public String updatePassword(@RequestBody JSONObject jsonObject){
        String enterpriseNumber = jsonObject.getString("enterpriseNumber");
        String password = jsonObject.getString("password");
        return companyService.updatePassword(enterpriseNumber,password);
    }

}
