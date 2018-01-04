/**
 * Created by zhuozhipeng on 5/9/17.
 */

export default function TenantItem(item) {
    this.tenant = item.tenant;                   //承租方
    this.tenantName = item.tenantName;           //承租方法定代表人
    this.tenantAddress = item.tenantAddress;     //承租方地址
    this.tenantMobile = item.tenantMobile;       //承租方电话
    this.tenantMandato = item.tenantMandato;     //承租方委托人
    this.roomNo = item.roomNo;
    this.buildingName = item.buildingName;
    this.contractUrl = item.contractUrl;

    this.startTime = item.startTime;
    this.endTime = item.endTime;
}