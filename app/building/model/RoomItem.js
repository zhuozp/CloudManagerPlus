/**
 * Created by zhuozhipeng on 28/8/17.
 */

import UserInfo from '../../um/model/UserInfo'
import StringUtils from '../../util/StringUtils'
export default function RoomItem(item) {
    this.lessee = '0';
    this.payDay = 5;
    this.freePeriod = 3;
    this.increaseRate = 0;
    this.usagePurple = '办公';
    this.isLet = false;
    this.hasContact = false;
    this.area = 100.00;
    this.roomName = '';
    this.startTime = '';
    this.endTime = '';
    this.agreementTime = '';
    this.electricFee = 0;
    this.guaranteeMonth = 0;

    this.tenant = '';
    this.tenantName = '';
    this.tenantAddress = '';
    this.tenantMobile = '';
    this.tenantMandator = '';

    this.lessor = '';
    this.lessorName = '';
    this.lessorAddress = '';
    this.lessorMobile = '';
    this.lessorMandator = '';
    this.openBank = '';
    this.acountName = '';
    this.acountNum = '';
    this.manageFee = 0;
    this.price = 0;
    if (!item) {
        return;
    }
    this.buildingId = item.buildingId;
    this.buildingName = item.buildingName;
    this.roomId = item.roomId;
    this.area = item.area;
    if (!this.area) {
        this.area = 100.00;
    }

    this.editLevel = item.editLevel;            // 编辑权限

    this.isLet = item.isLet;
    if (!this.isLet) {
        this.isLet = false;                       // 出租情况
    }

    this.price = item.price;
    this.roomImageUrl = [];
    for (let i = 0; !!item.roomImageUrl && i < item.roomImageUrl.length; i++) {  // 数组，房间图片
        this.roomImageUrl.push(item.roomImageUrl[i])
    }
    this.roomName = item.roomName;           // 房间名
    if (!this.roomName) {
        this.roomName = '';
    }
    this.roomNo = item.roomNo;              // 房间号
    this.manageFee = !!item.manageFee ? item.manageFee : 0;
    // if (!!item.subUser) {
    //     this.subUser = new UserInfo(item.subUser);  // 子账号
    // }
    // if (!!item.tenant) {
    //     this.tenant = new UserInfo(item.tenant);    // 租客
    // }
    this.createTime = item.createTime;

    this.share = item.share;  // 分享出去，别处标记，服务器不需要该字段
    if (!item.share) {
        this.share = false;  // 分享出去
    }

    this.lessor = !!item.lessor ? item.lessor : '';                   // 出租方
    this.lessorName = !!item.lessorName ? item.lessorName : '';           //法定代表人
    this.lessorAddress = !!item.lessorAddress ? item.lessorAddress : '';     //地址
    this.lessorMobile = !!item.lessorMobile ? item.lessorMobile : '';       //出租方电话
    this.lessorMandator = !!item.lessorMandator ? item.lessorMandator : '';   //出租方委托人
    this.openBank = !!item.openBank ? item.openBank : '';               //开户行
    this.acountName = !!item.acountName ? item.acountName : '';           //账户名
    this.acountNum = !!item.acountNum ? item.acountNum : '';            //帐号

    this.lessee = item.lessee;                   // 承租方性质，公司或个人
    if (typeof(item.lessee) == "undefined") {
        this.lessee = '0';                         // 默认为公司
    }
    this.tenant = !!item.tenant ? item.tenant : '';                   // 承租方
    this.tenantName = !!item.tenantName ? item.tenantName : '';           // 法定代表
    this.tenantAddress = !!item.tenantAddress ? item.tenantAddress : '';     // 地址
    this.tenantMobile = !!item.tenantMobile ? item.tenantMobile : '';       // 电话
    this.tenantMandator = !!item.tenantMandator ? item.tenantMandator : '';    // 承租方委托人


    this.freePeriod = item.freePeriod;            // 免租期
    if (!this.freePeriod) {
        this.freePeriod = 3;
    }

    this.usagePurple = item.usagePurple;           //租赁目的
    if (!this.usagePurple) {
        this.usagePurple = '办公';
    }

    this.increaseRate = item.increaseRate;         // 租金递增
    if (!this.increaseRate) {
        this.increaseRate = 0;
    }
    this.guaranteeMonth = item.guaranteeMonth;      //保证金
    if (!this.guaranteeMonth) {
        this.guaranteeMonth = 0;
    }

    this.electricFee = item.electricFee;            //首月水电押金
    if (!this.electricFee) {
        this.electricFee = 0;
    }

    this.payDay = item.payDay;                      //每月还租日期
    if (!this.payDay) {
        this.payDay = 5;
    }

    this.startTime = item.startTime;            // 租金开始时间
    this.endTime = item.endTime;                // 租金结束时间
    this.agreementTime = item.agreementTime;    // 签订日期

    if (!this.startTime) {
        this.startTime = '';
    }

    if (!this.endTime) {
        this.endTime = '';
    }

    if (!this.agreementTime) {
        this.agreementTime = '';
    }


    this.contractUrl = item.contractUrl;

    this.hasContact = false;
    if (StringUtils.isNotEmpty(this.contractUrl)) {
        this.hasContact = true;
    }
    this.contactId = item.contactId;            // 合同ID
}