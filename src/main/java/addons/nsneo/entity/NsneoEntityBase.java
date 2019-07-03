package addons.nsneo.entity;

import addons.common.entity.AddonsCommonEntityBase;

import javax.persistence.MappedSuperclass;

/**
 * 基础实体对象
 * Created by zzm on 16/6/21.
 */
@MappedSuperclass
public class NsneoEntityBase<T extends NsneoEntityBase> extends AddonsCommonEntityBase<T> {
    private static final long serialVersionUID = 1L;
}
