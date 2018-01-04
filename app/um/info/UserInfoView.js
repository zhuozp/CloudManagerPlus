/**
 * Created by Gibbon on 2017/9/2.
 */

import React from 'react'

import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity
} from 'react-native'

import BaseView from '../../common/widget/BaseView'
import GlobalStyles from '../../../res/style/GlobalStyles'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import UmInfoInstance from '../../um/UmInfoInstance'
import StringUtils from '../../util/StringUtils'
import KeyConstances from '../../constances/KeyConstances'
import UmLoginView from '../login/UmLoginView'
import DataManager from '../../manager/DataManager'
import ModifyUserInfoView from './ModifyUserInfoView'

export default class UserInfoView extends BaseView {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();
        this.state = {
            userName: (StringUtils.isNotEmpty(UmInfoInstance.getInstance()._name) ? UmInfoInstance.getInstance()._name : '点击填写姓名'),
            address: (StringUtils.isNotEmpty(UmInfoInstance.getInstance()._address) ? UmInfoInstance.getInstance()._address : '点击填写地址'),
        }
        super.navBarTitle('用户信息');
    }

    contentRender() {
        return (
            <KeyboardAwareScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                <View style={{height:GlobalStyles.scaleSize(24), backgroundColor:GlobalStyles.backgroundColor}}/>
                <View style={[styles.item_content, {justifyContent:'space-between'}]}>
                    <Text style={styles.item_title}>头像</Text>
                    <Image style={{width: GlobalStyles.scaleSize(72), height:GlobalStyles.scaleSize(72), marginRight:GlobalStyles.scaleSize(16)}} source={require('../../../res/images/my/ic_my_headsculpture.png')}/>
                </View>
                {this.getItem('手机号码', UmInfoInstance.getInstance()._mobile)}
                {this.getItem('用户名称', this.state.userName)}
                {this.getItem('联系地址', this.state.address)}

                <View style={{height:GlobalStyles.scaleSize(48), backgroundColor:GlobalStyles.backgroundColor}}/>
                <TouchableOpacity
                    onPress={() => {
                        this.dataManager.saveData(KeyConstances.KEY_USER_INFO, '');
                        this.props.navigator.resetTo({
                            component: UmLoginView,
                            name: 'UmLoginView',
                        });
                    }}
                >
                    <View style={{width:GlobalStyles.window_width, borderRadius:4, height:GlobalStyles.scaleSize(88), backgroundColor:'#fff', justifyContent:'center', position:'relative'}}>
                        <Text style={[styles.title, {alignSelf:'center',textAlign:'center'}]}>退出登录</Text>
                    </View>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        )
    }


    getItem(title, detail) {
        return (
            <TouchableOpacity onPress={this.itemClick.bind(this, title)}>
                <View style={styles.item_content}>
                    <Text style={styles.item_title}>{title}</Text>
                    <TextInput
                        style={styles.item_detail}
                        placeholder={detail}
                        placeholderTextColor={'#D7DBDC'}
                        underlineColorAndroid='transparent'
                        clearButtonMode={'never'}
                        editable={false}
                    />
                    <Image style={styles.item_img} source={require('../../../res/images/common/ic_forword.png')}/>
                </View>
            </TouchableOpacity>
        )
    }

    itemClick(title) {
        if ('手机号码' === title) {
            super.showToast('暂时不支持修改手机号');
        } else if ('用户名称' === title) {
            this.props.navigator.push({
                name:'ModifyUserInfoView',
                component:ModifyUserInfoView,
                params: {
                    title:'修改姓名',
                    placeholder: '请输入姓名',
                    detail: UmInfoInstance.getInstance()._name,
                    modifyCallback: ()=> {
                        this.setState({
                            userName: (StringUtils.isNotEmpty(UmInfoInstance.getInstance()._name) ? UmInfoInstance.getInstance()._name : '点击填写姓名'),
                            address: (StringUtils.isNotEmpty(UmInfoInstance.getInstance()._address) ? UmInfoInstance.getInstance()._address : '点击填写地址'),
                        })
                    }
                }
            })
        } else if ('联系地址' === title) {
            this.props.navigator.push({
                name:'ModifyUserInfoView',
                component:ModifyUserInfoView,
                params: {
                    title:'修改地址',
                    placeholder: '请输入填写地址',
                    detail: UmInfoInstance.getInstance()._address,
                    modifyCallback: ()=> {
                        this.setState({
                            userName: (StringUtils.isNotEmpty(UmInfoInstance.getInstance()._name) ? UmInfoInstance.getInstance()._name : '点击填写姓名'),
                            address: (StringUtils.isNotEmpty(UmInfoInstance.getInstance()._address) ? UmInfoInstance.getInstance()._address : '点击填写地址'),
                        })
                    }
                }
            })
        }
    }
}

const margin = GlobalStyles.scaleSize(24);
const imgSize = GlobalStyles.scaleSize(32);
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:GlobalStyles.backgroundColor,
    },

    item_content: {
        flexDirection:'row',
        alignItems:'center',
        height: GlobalStyles.scaleSize(96),
        width:GlobalStyles.window_width,
        backgroundColor:'#fff',
        borderBottomColor:GlobalStyles.lineColor,
        borderBottomWidth:0.5,
    },

    item_title: {
        marginLeft: margin,
        marginRight: margin,
        color:GlobalStyles.selectedColor,
        fontSize:GlobalStyles.setSpText(14),
    },

    item_detail: {
        flex:1,
        color:GlobalStyles.normalColor,
        textAlign:'right',
        fontSize:GlobalStyles.setSpText(14),
    },

    item_img: {
        width:imgSize,
        height:imgSize,
        margin:GlobalStyles.scaleSize(16),
        marginRight:GlobalStyles.scaleSize(8),
    },
})