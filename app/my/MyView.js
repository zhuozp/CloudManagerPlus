/**
 * Created by zhuozhipeng on 10/8/17.
 */
import React, {
    Component
} from 'react';

import {
    View,
    StyleSheet,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
    Modal,
} from 'react-native'

import GlobalStyles from '../../res/style/GlobalStyles'
import ShareView from '../share/ShareView'
import DataManager from '../manager/DataManager'
import KeyConstances from '../constances/KeyConstances'
import UmLoginView from '../um/login/UmLoginView'
import UmInfoInstance from '../um/UmInfoInstance'
import UmResetPwdView from '../um/forget/UmResetPwdView'
import AboutOneFloorsView from './AboutOneFloorsView'
import NoticeMessageView from './NoticeMessageView'
import FeedbackView from './FeedbackView'
import BaseView from '../common/widget/BaseView'
import UserInfoView from '../um/info/UserInfoView'

export default class MyView extends BaseView {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();
        this.state = {
            showShareView: false,
        }

        super.navBarTitle('我');
        super.navBarLeftViewExist(false);
        super.needProcessHardwareBackPress(false);
    }

    contentRender() {
        return (
        <ScrollView>
            <View style={styles.container}
            >
                {/*<Image style={styles.header_img} source={require('../../res/images/tab_self_header.png')}/>*/}
                {/*<Image style={styles.my_logo} source={require('../../res/images/my_logo.png')}/>*/}
                {/*<Text style={styles.title_vip}>{!!UmInfoInstance.getInstance()._name ? UmInfoInstance.getInstance()._name :*/}
                    {/*UmInfoInstance.getInstance()._mobile ? UmInfoInstance.getInstance()._mobile : '铂金用户'}</Text>*/}

                <View style={styles.content}>
                    <View style={{height: 12, backgroundColor:GlobalStyles.backgroundColor}}/>

                    <TouchableOpacity onPress={()=> {
                        this.gotoUserInfo();
                    }}>
                        <View style={{height:GlobalStyles.scaleSize(176), flexDirection:'row', justifyContent:'center', alignItems:'center', backgroundColor:'#fff'}}>
                            <Image style={styles.my_logo} source={require('../../res/images/my/ic_my_headsculpture.png')}/>
                            <Text style={{flex:1}}>{!!UmInfoInstance.getInstance()._name ? UmInfoInstance.getInstance()._name :
                                UmInfoInstance.getInstance()._mobile ? UmInfoInstance.getInstance()._mobile + '用户': '铂金用户'}</Text>
                            <Image style={{marginRight:14, width: GlobalStyles.scaleSize(44), height: GlobalStyles.scaleSize(44)}} source={require('../../res/images/common/ic_forword.png')}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{height: 12, backgroundColor:GlobalStyles.backgroundColor}}/>

                    {this.getItem(require('../../res/images/my/ic_my_notification.png'), '通知信息')}
                    <View style={styles.left_line}/>
                    {this.getItem(require('../../res/images/my/ic_my_key.png'), '修改密码')}
                    <View style={styles.left_line}/>
                    {this.getItem(require('../../res/images/my/ic_my_feedback.png'), '意见反馈')}
                    <View style={{height: 12, backgroundColor:GlobalStyles.backgroundColor}}/>

                    {this.getItem(require('../../res/images/my/ic_my_share.png'), '分享一下')}
                    <View style={{height: 12, backgroundColor:GlobalStyles.backgroundColor}}/>

                    {this.getItem(require('../../res/images/my/ic_my_about_us.png'), '关于我们')}

                    <View style={{height: 48, backgroundColor:GlobalStyles.backgroundColor}}/>

                    {/*<TouchableOpacity*/}
                        {/*onPress={() => {*/}
                            {/*this.dataManager.saveData(KeyConstances.KEY_USER_INFO, '');*/}
                            {/*this.dataManager.saveData(KeyConstances.KEY_SUB_USER_LIST, '');*/}
                            {/*this.props.navigator.resetTo({*/}
                                {/*component: UmLoginView,*/}
                                {/*name: 'UmLoginView',*/}
                            {/*});*/}
                        {/*}}*/}
                    {/*>*/}
                        {/*<View style={{width:GlobalStyles.window_width-28, borderRadius:4, height:48, backgroundColor:'#ff4f48', justifyContent:'center', position:'relative', left:14, right:14}}>*/}
                            {/*<Text style={[styles.title, {alignSelf:'center',textAlign:'center', color:'#ffffff'}]}>退出登录</Text>*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                </View>
            </View>
        </ScrollView>
        )
    }

    gotoUserInfo() {
        this.props.navigator.push({
            name:'UserInfoView',
            component:UserInfoView,
        })
    }

    shareCallback() {
        this.setState({
            showShareView: false,
        })
    }

    itemClick(title) {
        if (title === '通知信息') {
            this.props.navigator.push({
                name:'NoticeMessageView',
                component:NoticeMessageView,
            })
        } else if (title === '意见反馈') {
            this.props.navigator.push({
                name:'FeedbackView',
                component:FeedbackView,
            })
        } else if (title === '分享一下') {
            // ToastAndroid.show(title, ToastAndroid.SHORT);
            this.setState({
                showShareView: true,
            })

            if (!!this.refs.share) {
                this.refs.share.setVisible(true);
            }
        } else if (title === '修改密码') {
            this.props.navigator.push({
                name:'UmResetPwdView',
                component:UmResetPwdView,
            })
        } else if (title === '关于我们') {
            this.props.navigator.push({
                name:'',
                component:AboutOneFloorsView,
            })
        }
    }

    getItem(icon, title) {
        return (
        <TouchableOpacity
            onPress={
                this.itemClick.bind(this, title)
            }
        >
            <View style={styles.line_view}>
                <Image style={styles.icon} source={icon}/>
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
        )
    }

    shareClickCallback(title) {
        if (!!this.refs.share) {
            this.refs.share.urlShare(title, {imgUrl:'', url: 'https://www.1floors.cn/app/download?',
                content: '壹楼，旨在让业主们的物业增值保值，提高物业出租率，提供出租管理等服务', shareTitle:'【壹楼】给你带来惊喜'},
                (text)=> {
                    super.showToast(text);
                });
            // this.refs.share.share(title, 'dedededed')
        }
    }
}

const headerHeight = Math.ceil(GlobalStyles.window_width * 300 / 720);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.backgroundColor,
    },

    header_img: {
        width: GlobalStyles.window_width,
        height: headerHeight,
    },

    my_logo: {
        width:GlobalStyles.scaleSize(98),
        height:GlobalStyles.scaleSize(98),
        // position:'absolute',
        // alignSelf:'center',
        // marginTop: Math.ceil(headerHeight / 2) - 40,
        marginLeft:14,
        marginRight:14,
    },

    title_vip: {
        fontSize:17,
        color:'#ffffff',
        position:'absolute',
        alignSelf:'center',
        marginTop: Math.ceil(headerHeight / 2) + 30,
        backgroundColor:'transparent'
    },

    content: {
        position:'relative',
        width: GlobalStyles.window_width,
        flex:1,
        backgroundColor: GlobalStyles.backgroundColor
    },

    line_view: {
        height: 48,
        width:GlobalStyles.window_width,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#ffffff'
    },

    icon: {
        width:GlobalStyles.scaleSize(54),
        height:GlobalStyles.scaleSize(54),
        marginLeft:14,
        marginRight:14,
    },

    title: {
        fontSize:14,
        color:'#000000'
    },

    left_line: {
        height:0.5,
        backgroundColor:'#c3c3c3',
        left:14,
    }
})
