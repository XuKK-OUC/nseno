package addons.nsneo.pub;

public class CodeMsg {

    private int code;
    private String msg;
    public int getCode() {
        return code;
    }
    public void setCode(int code) {
        this.code = code;
    }
    public String getMsg() {
        return msg;
    }
    public void setMsg(String msg) {
        this.msg = msg;
    }


    public static CodeMsg SUCCESS = new CodeMsg(200,"SUCCESS");//查询成功
    public static CodeMsg CREATED = new CodeMsg(201,"CREATED");// POST 创建成功
   // public static CodeMsg NO_CONTENT = new CodeMsg(204,"NO CONTENT");//删除成功，无数据返回
    public static CodeMsg CODE_EXPIRED = new CodeMsg(204,"验证码已失效");//验证码已失效
    /*服务端异常*/
    public static CodeMsg BAD_REQUEST = new CodeMsg(400,"BAD REQUEST");//校验请求参数有问题
    public static CodeMsg NOT_AUTHOTIZED = new CodeMsg(401,"NOT AUTHOTIZED 访问被拒绝，客户试图未经授权访问受密码保护的页面");//未认证
    public static CodeMsg PASSWORD_ERROR = new CodeMsg(402,"密码错误");//密码错误
    public static CodeMsg FORBBIDDEN = new CodeMsg(403,"FORBBIDDEN");//用户无权限
    public static CodeMsg NOT_FOUND = new CodeMsg(404,"企业社会信用代码错误");//找不到资源企业社会信用代码错误
    public static CodeMsg REPEAT_ERROR = new CodeMsg(412,"企业信用代码重复,注册失败");//企业信用代码重复,注册失败
    public static CodeMsg CODE_ERROR = new CodeMsg(402,"验证码错误");//企业信用代码重复,注册失败
    public static CodeMsg QCODE_ERROR = new CodeMsg(402,"题号错误");//企业信用代码重复,注册失败

    public static CodeMsg SERVER_ERROR = new CodeMsg(100,"系统异常：%s");
    public static CodeMsg BIND_ERROR = new CodeMsg(101,"(绑定异常)参数校验异常：%s"); /*用占位符 传入一个参数*/
    public static CodeMsg SESSION_ERROR = new CodeMsg(102,"没有SESSION！"); /*用占位符 传入一个参数*/
    public static CodeMsg REQUEST_ERROR = new CodeMsg(103,"非法请求！"); /*用占位符 传入一个参数*/
    public static CodeMsg REQUEST_OVER_LIMIT = new CodeMsg(104,"请求次数过多！"); /*用占位符 传入一个参数*/

    private CodeMsg( ) {
    }
    private CodeMsg( int code,String msg ) {
        this.code = code;
        this.msg = msg;
    }
    //不定参的构造函数
    public CodeMsg fillArgs(Object... args) {
        int code = this.code;
        String message = String.format(this.msg, args);
        return new CodeMsg(code, message);
    }
    @Override
    public String toString() {
        return "CodeMsg [code=" + code + ", msg=" + msg + "]";
    }
}