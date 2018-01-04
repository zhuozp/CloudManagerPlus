/**
 * Created by zhuozhipeng on 5/9/17.
 */
import LessorItem from '../../um/relation/lessor/model/LessorItem'
import TenantItem from '../../um/relation/tenant/model/TenantItem'


export default function GenContactItem(item) {
    this.buildingId = item.buildingId;
    this.roomId = item.roomId;
    this.rentalPeriod = item.rentalPeriod;           //房屋租赁期
    this.startTime = item.startTime;                 //起始时间
    this.endTime = item.endTime;                     //结束时间
    this.freePeriod = item.freePeriod;               //免租期
    this.usagePurple = item.usagePurple;             //租赁目的
    this.guaranteeMonth = item.guaranteeMonth;       //保证金
    this.electricFee = item.electricFee;             //首月水电费押金
    this.increaseRate = item.increaseRate;           //租金递增
    this.payDay = item.payDay;                      //每月还租日
    this.lessor = {

    };

    this.tenant = {

    }
}