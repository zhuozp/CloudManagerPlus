/**
 * Created by Gibbon on 2017/8/26.
 */

import StringUtils from '../util/StringUtils'
import ToastUtils from '../util/ToastUtils'

const NOT_BUILDING_NAME = "请输入楼宇名称";
const NOT_BUILDING_ADDRESS = "请输入楼宇所在地址";

export default class BuildingRegCheckUtils {
    static buildingAddCanSave(toastObj, item) {
        if (!StringUtils.isNotEmpty(item.buildingName)) {
            ToastUtils.toast(toastObj, NOT_BUILDING_NAME);
            return false;
        }

        if (!StringUtils.isNotEmpty(item.address)) {
            ToastUtils.toast(toastObj, NOT_BUILDING_ADDRESS);
            return false;
        }

        return true;
    }
    
    static buildingAddCanNext(toastObj, item) {
        if (!StringUtils.isNotEmpty(item.buildingName)) {
            ToastUtils.toast(toastObj, NOT_BUILDING_NAME);
            return false;
        }

        if (!StringUtils.isNotEmpty(item.address)) {
            ToastUtils.toast(toastObj, NOT_BUILDING_ADDRESS);
            return false;
        }

        return true;
    }


}