/**
 * Created by Gibbon on 2017/8/12.
 */

import {
    ToastAndroid,
} from 'react-native'


export default class ToastUtils {
    // static toast(obj, str) {
    //     // ToastAndroid.show(str, ToastAndroid.SHORT);
    //     console.log(str)
    //     obj.show(str);
    // }

    static toast(obj, str, duration) {
        console.log(str)
        obj.show(str, duration);
    }
}