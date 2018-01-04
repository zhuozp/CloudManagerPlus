/**
 * Created by Gibbon on 2017/9/13.
 */
export default function BuildingDataItem(item) {
    if (!item) return;
    this.dealMonth = item.dealMonth;
    this.letRate = item.letRate;
    this.totalArea = item.totalArea;
    this.unoccupiedRate = item.unoccupiedRate;
    this.dealTenant = item.dealTenant;
    this.dealArea = item.dealArea;
}