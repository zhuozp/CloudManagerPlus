/**
 * Created by zhuozhipeng on 4/9/17.
 */

import PaymentMsgItem from '../../payment/model/PaymentMsgItem'

export default function HomeDataItem(item) {
    this.letRate = item.letRate;               // 出租率
    this.availableRate = item.availableRate;  // 可招商率
    this.unoccupiedRate = item.unoccupiedRate; // 空置率
    this.totalLet = item.totalLet;             // 出租面积
    this.totalAvailable = item.totalAvailable;  // 可出租面积
    this.totalUnoccupied = item.totalUnoccupied; // 空置面积
    this.totalArea = item.totalArea;
    this.notice = [];
    if (!!item.notice) {
        for (let i = 0; i < item.notice.length; i++) {
            this.notice.push(new PaymentMsgItem(item.notice[i]));
        }
    }
}