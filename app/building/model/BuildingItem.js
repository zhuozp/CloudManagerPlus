/**
 * Created by Gibbon on 2017/8/27.
 */
import UserInfo from '../../um/model/UserInfo'

export default function BuildingItem(item) {
    this.buildingId = item.buildingId;  // 分配的楼宇id
    this.buildingName = item.buildingName; // 楼宇名称
    this.address = item.address;        // 楼宇地址
    this.buildingImageUrl = [];
    for (let i = 0; !!item.buildingImageUrl && i < item.buildingImageUrl.length; i++) {
        this.buildingImageUrl.push(item.buildingImageUrl[i]); // 数组，楼宇图片
    }
    this.location = new Location(item.location);
    this.createTime = item.createTime;
    this.streetId = item.streetId;
    this.totalRooms = item.totalRooms;
    this.idleRooms = item.idleRooms;
    this.totalArea = item.totalArea;
    this.lettedArea = item.lettedArea;
    this.averagePrice = item.averagePrice;
    this.totalTenant = item.totalTenant;
    this.city = item.city;

    this.layout = item.layout;
    this.parkingLot = item.parkingLot;
    this.manageFee = item.manageFee;

    if (!!item.subUser) {
        this.subUser = new UserInfo(item.subUser);
    }
}

export function Location(location) {
    this.lat = location.lat;
    this.lng = location.lng;
}
