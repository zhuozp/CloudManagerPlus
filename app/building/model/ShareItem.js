/**
 * Created by zhuozhipeng on 13/9/17.
 */
import ShareRoomDetailItem from './ShareRoomDetailItem'

export default function ShareItem(item) {
    if (!item) return;

    this.hasSelect = false;
    this.buildingName = item.buildingName;
    this.city = item.city;
    this.layout = item.layout;
    this.manageFee = item.manageFee;
    this.parkingLot = item.parkingLot;


    this.roomsDetail = [];
    if (!!item.roomsDetail) {
        for (let i = 0; i < item.roomsDetail.length; i++) {
            this.roomsDetail.push(new ShareRoomDetailItem(item.roomsDetail[i]))
        }
    }
}