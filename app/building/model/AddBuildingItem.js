/**
 * Created by Gibbon on 2017/8/27.
 */

export default function AddBuildingItem() {
    this.userId = '';
    this.subUserId = '';
    this.buildingName = '';
    this.city = '';
    this.image = '';
    this.address = '';
    this.location = {
        lat: 0.0,
        lng: 0.0,
    };
    this.streetId = '';
    this.rooms = [];
    this.subUser = {
        mobile:'',
        userName:'',
    };
    this.layout = '';
    this.parkingLot = 0;
    this.manageFee = 0;
}