package addons.demo.entity;

import com.nsneo.dao.jpa.IJPAStructureFindObjs;
import com.nsneo.utils.sql.SqlWhereWithParamTools;
import com.nsneo.utils.NumberFormatTools;

import java.util.*;
import javax.persistence.*;
import org.apache.commons.lang3.StringUtils;

/**
 * 脚手架模块实体
 * Created by nsneo
 */
@Entity
@Access(AccessType.FIELD)
@Table(name="Demo_SfTable")
public class SfDemoEntity extends DemoEntityBase<SfDemoEntity>{
    private static final long serialVersionUID = 1L;

    /**
     * 代码
     */
    @Column(length=100)
    private String code;

    /**
     * 名称
     */
    @Column(length=200)
    private String name;

    /**
     * 缺省构造函数
     * */
    public SfDemoEntity(){}


    /**
     * 得到代码
     * @return 代码
     * */
    public String getCode() {
        if (this.code == null) {
            return "";
        }
        return code;
    }
    /**
     * 设置代码
     * @param code 代码
     * */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * 得到名称
     * @return 名称
     * */
    public String getName() {
        if (this.name == null) {
            return "";
        }
        return name;
    }
    /**
     * 设置名称
     * @param name 名称
     * */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 复制对象,深度拷贝,创建一个新的,数值相同的对象
     * @param copyMainKey 是否复制主键
     * @return 类型相同的新的对象
     * */
    public SfDemoEntity copy(boolean copyMainKey) {

        SfDemoEntity obj = new SfDemoEntity();
        obj.code = this.code;
        obj.name = this.name;

        super.entityCopy(this,obj,copyMainKey);
        return obj;
    }

    /**
     * 将目标对象的数值复制到本对象中
     * @param obj 目标对象
     * @param synMainKey 是否同步主键值
     * */
    public void synch(SfDemoEntity obj, boolean synMainKey) {

        if(obj==null){
            return;
        }
        this.code = obj.code;
        this.name = obj.name;

        super.synch(obj, synMainKey);
    }
    
    /**
     * 通过主键编码找到唯一的实体对象
     * @param id 本类的主键
     * @return 找到的实体对象
     * */
    public static SfDemoEntity loadById(Long id){
        return loadObj(SfDemoEntity.class,id);
    }

    /**
     * 通过主键编码找到唯一的实体对象
     * @param id 本类的主键,字符串类型,通过长整型变换得到实际主键
     * @return 找到的实体对象
     * */
    public static SfDemoEntity loadById(String id){
        return loadObj(SfDemoEntity.class,NumberFormatTools.strToLong(id));
    }

    /**
     * 找到符合查找条件的对象集合
     * @param sqw 查找条件 sql query where values
     * @return 符合条件的对象集合
     * */
    public static List<SfDemoEntity> loadLt(IJPAStructureFindObjs sqw){
        return loadFreeJPA().findAllObjs(SfDemoEntity.class,sqw);
    }
    
    /**
     * 创建sqlwhere 构造工具,该工具提供按照 JPQL标准构造的针对本类的 sql语句构造工具
     * @return 基于查询的sql语句构造器
     * */
    public static SqlWhereWithParamTools loadSqlWhere(){
        return SqlWhereWithParamTools.create(SfDemoEntity.class);
    }

    /**
     * 创建sqlwhere 构造工具,该工具提供按照 JPQL标准构造的针对本类的 sql语句构造工具
     * @param sysAppId 应用参数编码
     * @return 基于查询的sql语句构造器
     * */
    public static SqlWhereWithParamTools loadSqlWhere(String sysAppId){
        SqlWhereWithParamTools sqlWhere = loadSqlWhere();
        if(StringUtils.isNotBlank(sysAppId)){
            sqlWhere.and(FieldName_SysAppId,sysAppId);
        }
        return sqlWhere;
    }
}