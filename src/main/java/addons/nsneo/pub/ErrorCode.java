package addons.nsneo.pub;

import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;

public class ErrorCode {
    private String code; //错误码
    private HashMap<String,String> captions;  //错误原因描述,key=区域码(zh-CN,US,....),value="原因"
    public Err to(String location){
        if(StringUtils.isBlank(location)){
            location = "zh-CN";
        }
        String caption = this.captions.get(location);
        if(StringUtils.isBlank(caption)){
            caption = "";
        }
        return  new Err(code,location,caption);
    }

}
