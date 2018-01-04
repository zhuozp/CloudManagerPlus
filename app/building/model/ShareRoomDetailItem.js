/**
 * Created by zhuozhipeng on 13/9/17.
 */
export default function ShareRoomDetailItem(item) {
    if (!item) return;
    this.hasSelect = false;
    this.area = item.area;
    this.manageFee = item.manageFee;
    this.price = item.price;
    this.roomName = item.roomName;
    this.roomNo = item.roomNo;
}