/**
 * Created by zhuozhipeng on 28/8/17.
 */

export default function UserInfo(info) {
    if (!info) {
        return;
    }
    this.mobile = info.mobile;
    this.userName = info.userName;
    this.idCard = info.ifCard;
}