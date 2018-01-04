/**
 * Created by zhuozhipeng on 5/9/17.
 */

export default function RenterItem(item) {
    this.lessorId = '';
    this.lessor = '';
    this.lessorName = '';
    this.lessorAddress = '';
    this.lessorMobile = '';
    this.lessorMandator = '';
    this.openBank = '';
    this.acountName = '';
    this.acountNum =  '';

    if (!item) return;
    this.lessorId = !!item.lessorId ? item.lessorId : '';               // id
    this.lessor = !!item.lessor ? item.lessor : '';                   // 出租方
    this.lessorName = !!item.lessorName ? item.lessorName : '';           //法定代表人
    this.lessorAddress = !!item.lessorAddress ? item.lessorAddress : '';     //地址
    this.lessorMobile = !!item.lessorMobile ? item.lessorMobile : '';       //出租方电话
    this.lessorMandator = !!item.lessorMandator ?  item.lessorMandator : '';   //出租方委托人
    this.openBank = !!item.openBank ? item.openBank : '';               //开户行
    this.acountName = !!item.acountName ? item.acountName : '';           //账户名
    this.acountNum = !!item.acountNum ? item.acountNum : '';       //帐号
}