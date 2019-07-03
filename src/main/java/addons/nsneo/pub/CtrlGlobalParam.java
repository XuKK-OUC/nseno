package addons.nsneo.pub;

import addons.demo.pub.CommonSampleWebCtrlOut;
import com.common.utils.IWebInvokeParam;
import com.nsneo.pub.logger.LoggerFactory;
import com.nsneo.utils.beans.ObjectFormatOutAndWrite;
import com.nsneo.utils.container.Idnm;
import com.nsneo.utils.regexPattern.placeholder.imp.HtmlReplaceTool;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * 全局参数输出类
 * @author 周志明
 * 创建时间：19/1/13 18:21
 */
public class CtrlGlobalParam extends CommonSampleWebCtrlOut {
    private static final long serialVersionUID = 1L;

    /**
     * 遇到数据数据的占位符调用此函数进行输出
     * 该输出为一个字符串输出,不涉及二进制流.
     * */
    public String createDataOut(IWebInvokeParam webInvokeParam) {
        LoggerFactory.getInstance().createLogger(this).info("全局参数输出控件:占位符内容为:" + webInvokeParam.getCtContext().getControlId());
        String outTemplateStr = this.getCtrlParamContent(webInvokeParam.getCtContext().getControlId());
        String dataType = this.findLoadFirstParamValue("DataType");

        if(StringUtils.equalsIgnoreCase(dataType,"sample")){
            return idNameOut(loadSampleIdnmList(webInvokeParam),outTemplateStr);
        }

        return "";
    }

    public static List<Idnm> loadSampleIdnmList(IWebInvokeParam webInvokeParam){
        List<Idnm> lt = new ArrayList<>();

        lt.add(new Idnm("001","下拉选项一"));
        lt.add(new Idnm("002","下拉选项二"));

        return lt;
    }

    /**
     * 基于Idnm 数据类型的数据输出
     * */
    public String idNameOut(List<Idnm> idNameDataList, String outTemplateStr){
        HtmlReplaceTool htmlTool = HtmlReplaceTool.builder();
        StringBuilder sb = new StringBuilder();
        for(Idnm entity:idNameDataList){
            sb.append(
                    htmlTool.excuteReplace(outTemplateStr,(int index,String placeholder,String ph)->{
                        return ObjectFormatOutAndWrite.getInstance().getPropertyString(entity,ph);
                    })
            );
        }
        return sb.toString();
    }
}
