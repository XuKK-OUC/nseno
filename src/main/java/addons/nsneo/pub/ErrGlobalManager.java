package addons.nsneo.pub;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashMap;
//@Component
public class ErrGlobalManager {
    private HashMap<Class,HashMap<String,ErrorCode>> hashMap;
    public HashMap<String,ErrorCode> load(Class type){
       return this.hashMap.get(type);

    }
    public ErrorCode load(Class type,String code){
        HashMap<String,ErrorCode> errorCode = this.load(type);
        return  errorCode.get(code);
    }
}
