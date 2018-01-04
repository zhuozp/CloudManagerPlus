/**
 * Created by zhuozhipeng on 21/8/17.
 */
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export default class DateUtils {
    static getDateArray(startDate, interval) {
        var year = startDate[0];
        var month = startDate[1];
        var day = startDate[2];

        var endDate = [];
        if (month === 1 && day === 1) {
            endDate.push(year + interval - 1 + '年');
            endDate.push(12 + '月');
            endDate.push(31 + '日');

            return endDate;
        }

        if (day === 1) {
            endDate.push(year + interval + '年');
            endDate.push(month - 1 + '月');
            if ((month - 1) in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}) {
                endDate.push(31 + '日')
            } else if ((month - 1) === 2) {
                if(((year + interval)%4 === 0 && (year + interval)%100 !== 0) || (year + interval)%400 === 0){
                    day.push(29 + '日');
                } else {
                    day.push(28 + '日')
                }
            } else {
                day.push(30 + '日');
            }

            return endDate;
        }

        endDate.push(year + interval + '年');
        endDate.push(month + '月');
        endDate.push(day - 1 + '日');

        return endDate;
    }

    static getDateArrayWithStr(dateStr) {
        var array = dateStr.split('-');
        var returnArray = [];

        returnArray.push(parseInt(array[0]) + '年')
        returnArray.push(parseInt(array[1]) + '月')
        returnArray.push(parseInt(array[2]) + '日')
        return returnArray;
    }

    static getDataStrWithArray(dateArray) {
        var year = dateArray[0].substring(0, dateArray[0].length-1);;
        var month = dateArray[1].substring(0, dateArray[1].length-1);
        if (month.length == 1) {
            month = '0' + month;
        }
        var day = dateArray[2].substring(0, dateArray[2].length-1);
        if (day.length == 1) {
            day = '0' + day;
        }

        return (year + '-' + month + '-' + day);
    }
}