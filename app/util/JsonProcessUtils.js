/**
 * Created by zhuozhipeng on 10/8/17.
 */

import {
    Platform,
} from 'react-native'

import PackageJson from '../../package.json'
import UmInfoInstance from '../um/UmInfoInstance'

const COMMON_PARAMS = {
    os: Platform.OS == 'ios' ? 1 : 2,
    version: PackageJson.version,
}

export default class JsonProcessUtils {
    static mergeJson(jsonObj1, jsonObj2) {
        var resultJsonObject={};
        for(var attr in jsonObj1){
            resultJsonObject[attr]=jsonObj1[attr];
        }
        for(var attr in jsonObj2){
            resultJsonObject[attr]=jsonObj2[attr];
        }

        console.log(JSON.stringify(resultJsonObject));
        return resultJsonObject;
    }

    static mergeJsonWithParams(jsonObj1) {
        var resultJsonObject={};
        for(var attr in jsonObj1){
            resultJsonObject[attr]=jsonObj1[attr];
        }
        for(var attr in COMMON_PARAMS){
            resultJsonObject[attr]=COMMON_PARAMS[attr];
        }

        console.log(JSON.stringify(resultJsonObject));
        return resultJsonObject;
    }

    static mergeJsonWithLogin(jsonObj1) {
        let COMMON_PARAMS_WITH_LOGIN = {
            os: Platform.OS == 'ios' ? 1 : 2,
            version: PackageJson.version,
            userId: UmInfoInstance.getInstance()._userId,
            subUserId: UmInfoInstance.getInstance()._subUserId,
            token: UmInfoInstance.getInstance()._loginToken,
        }

        return this.mergeJson(jsonObj1, COMMON_PARAMS_WITH_LOGIN);
    }
}