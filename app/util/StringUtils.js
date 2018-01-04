/**
 * Created by Gibbon on 2017/8/12.
 */
export  default class StringUtils {
    static isMatch(str) {
        var reg = new RegExp(/^\w+$/);
        if (reg.test(str)) {
            return true;
        }

        return false;
    }

    static pad(num, n) {
        var len = num.toString().length;
        while(len < n) {
            num = "0" + num;
            len++;
        }
        return num.toString();
    }

    static isNotEmpty(str) {
        if (!str) return false;
        
        if (str.length <= 0) return false;

        return true;
    }

    static numOrDot(obj) {
        obj = obj.replace(/[^\d.]/g, "");
        //必须保证第一位为数字而不是.
        obj = obj.replace(/^\./g, "");
        //保证只有出现一个.而没有多个.
        obj = obj.replace(/\.{2,}/g, ".");
        //保证.只出现一次，而不能出现两次以上
        obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        return obj;
    }

    static onlyNum(obj) {
        obj = obj.replace(/[^\d]/g,'')
        return obj;
    }
}