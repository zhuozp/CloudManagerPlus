/**
 * Created by Gibbon on 2017/8/12.
 */

module.exports = {
    IOS_APP_STORE_URL : 'itms-apps://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?mt=8&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software&id=1281463157',
    ANDROID_MARKETING: 'market://details?id=com.cmp.onefloors',

    // 百度place api接口
    baidu_place_api:'https://api.map.baidu.com/place/v2/search?',
    baidu_place_suggestion_api:'https://api.map.baidu.com/place/v2/suggestion?',

    // 注册获取验证码
    phone_code_url: 'https://www.1floors.cn/users/getCode?',
    // 注册
    phone_register_url: 'https://www.1floors.cn/users/regist?',

    // 忘记密码获取验证码
    phone_code_retrieve_url:'https://www.1floors.cn/users/retrieve?',
    // 忘记密码之验证码校验
    phone_code_retrieve_code_check: 'https://www.1floors.cn/users/verify?',
    // 忘记密码之重新设置密码
    phone_pwd_retrieve_url: 'https://www.1floors.cn/users/reset?',

    // 重置密码
    phone_pwd_reset_url:'https://www.1floors.cn/users/reset?',

    login_url:'https://www.1floors.cn/users/login?',

    // building详情页面请求
    // building_detail_url:'http://119.23.203.221:12345/building/buildingDetail',

    //首页
    homepage_url: 'https://www.1floors.cn/home/home?',

    //楼宇列表
    building_list_url: 'https://www.1floors.cn/buildings/viewBuilding?',

    //添加楼宇
    building_add_url: 'https://www.1floors.cn/buildings/addBuilding?',

    //删除楼宇
    building_delete_url: 'https://www.1floors.cn/buildings/deleteBuilding?',

    //修改楼宇
    building_modify_url: 'https://www.1floors.cn/buildings/modifyBuilding?',

    //查看房间列表
    rooms_list_url: 'https://www.1floors.cn/buildings/viewRoom?',
    //修改房间
    room_modify_url: 'https://www.1floors.cn/buildings/modifyRoom?',
    //删除房间
    room_delete_url: 'https://www.1floors.cn/buildings/deleteRoom?',
    //添加房间
    room_add_url: 'https://www.1floors.cn/buildings/addRoom?',

    //添加子账号
    sub_user_add_url: 'https://www.1floors.cn/users/addSubUser?',

    //删除子账号
    sub_user_delete_url: 'https://www.1floors.cn/users/deleteSubUser?',

    //刷新子账号请求
    sub_user_refresh_url: 'https://www.1floors.cn/users/refreshSubUser?',

    //合同生成
    contact_gen_url: 'https://www.1floors.cn/contracts/genPdf?',
    //合同列表
    contact_list_url: 'https://www.1floors.cn/contracts/viewContract?',
    // 删除合同
    contact_delete_url: 'https://www.1floors.cn/contracts/deleteContract?',

    //租客列表
    tenant_list_url : 'https://www.1floors.cn/home/tenant?',

    //发送催租消息
    send_payment_msg_url: 'https://www.1floors.cn/home/sendMessage?',

    //忽略催租信息
    ignore_payment_msg_url: 'https://www.1floors.cn/home/ignoreNotice?',

    //修改用户信息
    modify_user_info_url: 'https://www.1floors.cn/users/modify?',

    //数据
    rent_data_url: 'https://www.1floors.cn/home/data?',

    //反馈
    feedback_url: 'https://www.1floors.cn/users/feedback?',

    //消息
    notice_msg_url: 'https://www.1floors.cn/users/news?',

    //添加出粗方
    lessor_add_url: 'https://www.1floors.cn/users/addLessor?',
    //查看出租方列表
    lessor_list_url: 'https://www.1floors.cn/users/viewLessor?',
    //修改出租方
    lessor_modify_url: 'https://www.1floors.cn/users/modifyLessor?',
    //删除出租方
    lessor_delete_url: 'https://www.1floors.cn/users/deleteLessor?',

    //一键招商
    share_building_url: 'https://www.1floors.cn/buildings/share?',

    //数据
    building_data_url: 'https://www.1floors.cn/home/data?',

    //体验账号接口
    experience_account:'https://www.1floors.cn/users/getAccount?',
}