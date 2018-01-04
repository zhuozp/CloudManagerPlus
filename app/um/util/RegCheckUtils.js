/**
 * Created by Gibbon on 2017/8/12.
 */
import StringUtils from '../../util/StringUtils'

import {
    ToastAndroid,
} from 'react-native'

import ToastUtils from '../../util/ToastUtils'
import {DURATION} from 'react-native-easy-toast'

export default class RegCheckUtils {
    static phoneCheck(obj, phoneNo) {
        if (!phoneNo || phoneNo.length === 0) {
            console.log('请输入手机号码');
            ToastUtils.toast(obj, '请输入手机号码', DURATION.LENGTH_LONG);
            return false;
        }

        if (phoneNo.length < 11) {
            console.log('手机号码不能小于11位');
            ToastUtils.toast(obj, '手机号码不能小于11位', DURATION.LENGTH_LONG);
            return false;
        }

        return true;
    }

    static msgCheck(obj, msgCode) {
        if (!msgCode || msgCode.length === 0) {
            console.log('证码为空');
            ToastUtils.toast(obj, '验证码为空', DURATION.LENGTH_LONG);
            return false;
        }
        if (msgCode.length < 6) {
            console.log('输入验证码不能小于6位');
            ToastUtils.toast(obj, '输入验证码不能小于6位', DURATION.LENGTH_LONG);
            return false;
        }

        return true;
    }

    static pwdCheck(obj, pwd) {
        if (!pwd) {
            ToastUtils.toast(obj, '请输入6~15位密码', DURATION.LENGTH_LONG);
            return false;
        }

        if (pwd.length === 0) {
            console.log('请输入密码');
            ToastUtils.toast(obj, '请输入6~15位密码', DURATION.LENGTH_LONG);
            return false;
        }

        if (pwd.length < 6) {
            console.log('密码不能少于6位');
            ToastUtils.toast(obj, '密码不能少于6位', DURATION.LENGTH_LONG);
            return false;
        }

        if (pwd.length > 15) {
            console.log('密码不能大于15位');
            ToastUtils.toast(obj, '密码不能大于15位', DURATION.LENGTH_LONG);
            return false;
        }

        if (!StringUtils.isMatch(pwd)) {
            console.log('密码必须由数字，大小写字母或者下划线组成');
            ToastUtils.toast(obj, '密码必须由数字，大小写字母或者下划线组成', DURATION.LENGTH_LONG);
            return false;
        }

        return true;
    }
}