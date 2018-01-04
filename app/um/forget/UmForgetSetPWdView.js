/**
 * Created by Gibbon on 2017/8/23.
 */
import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
    ToastAndroid,
} from 'react-native'

import NavigationBar from '../../../app/common/widget/NavigationBar'
import GlobalStyles from '../../../res/style/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'
import EditView from '../../common/widget/EditView'
import BaseCommon from '../../common/BaseCommon'
import UmLoginView from '../login/UmLoginView'
import RegCheckUtils from '../util/RegCheckUtils'
import Toast, {DURATION} from 'react-native-easy-toast'
import ToastUtils from '../../util/ToastUtils'
import {FORGET_INFO} from './UmForgetPwdView'
import JsonProcessUtils from '../../util/JsonProcessUtils'
import DataManager from '../../manager/DataManager'
import URLConstances from '../../constances/URLConstances'
import BaseView from '../../common/widget/BaseView'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

const PASSWORD_INFO = {'firstPwd':'', "secondPwd":''};
var forge = require('node-forge');

export default class UmForgetSetPWdView extends BaseView {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();

        this.state = {
            loginBtnBg: {backgroundColor: '#3673b7'},
            loginBtnTitleColor: {color: '#f1f1f1'},
            setPwdBtnDisable:true,
        }

        super.navBarTitle('设置新密码');
    }

    contentRender() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => this.otherViewPressClick()}>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
                        <View style={{marginTop:50, flex:1}}>
                            <EditView
                                label='输入密码'
                                placeholder='由数字，大小写字母或下划线组成'
                                onChangeText={(text) => {
                                    // this.setState({phoneNo:text});
                                    PASSWORD_INFO.firstPwd = text;
                                    this.setPwdStateCheck();
                                }}
                                ref='firstPwdInput'
                                secureTextEntry={true}
                            />


                            <TouchableOpacity onPress={()=>this.setPwdBtnClick()} disabled={this.state.setPwdBtnDisable}>
                                <View ref='registerBtn'
                                      style={[styles.loginBtnStyle,this.state.loginBtnBg]}
                                >
                                    <Text style={[styles.loginBtnTitle,this.state.loginBtnTitleColor]}>设置新密码</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    outContainerClick() {
        this.otherViewPressClick();
    }

    otherViewPressClick() {
        this.refs.firstPwdInput.refs.textInput.blur();
    }

    onBack() {
        this.otherViewPressClick();
        super.onBack();
    }


    setPwdStateCheck() {
        if (RegCheckUtils.pwdCheck(this.refs.toast, PASSWORD_INFO.firstPwd)) {
            this.setState({
                loginBtnBg: {backgroundColor: GlobalStyles.nav_bar_backgroundColor},
                loginBtnTitleColor: {color: '#ffffff'},
                setPwdBtnDisable: false,
            });
        } else {
            this.setState({
                loginBtnBg: {backgroundColor: '#3673b7'},
                loginBtnTitleColor: {color: '#f1f1f1'},
                setPwdBtnDisable:true,
            });
        }
    }

    setPwdBtnClick() {
        this.otherViewPressClick();
        // const routes = this.props.navigator.state.routeStack;
        // let destinationRoute = '';
        // for (let i = routes.length - 1; i >= 0; i--) {
        //     if(routes[i].name === 'UmLoginView'){
        //         destinationRoute = this.props.navigator.getCurrentRoutes()[i]
        //         break;
        //     }
        // }
        // this.props.navigator.popToRoute(destinationRoute);
        var md5 = forge.md.md5.create();
        md5.update(PASSWORD_INFO.firstPwd);
        let pwd = md5.digest().toHex();

        super.setLoadingView(true);
        this.dataManager.fetchDataFromNetwork(URLConstances.phone_pwd_retrieve_url, false,
            {body:JSON.stringify(JsonProcessUtils.mergeJsonWithParams({
                'mobile':this.props.phoneNo, 'userId':this.props.userId, 'subUserId': this.props.subUserId,
                'token': this.props.token, 'pwd': pwd}))})
            .then((data) => {
                super.setLoadingView(false);
                console.log(data);
                if (data) {
                    if (data.code == 0) {
                        if (data.msg == 'ok') {
                            this.otherViewPressClick();
                            this.props.navigator.resetTo({
                                component: UmLoginView,
                                name: 'UmLoginView',
                            });
                        } else {
                            ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '请确认密码是否有效', DURATION.LENGTH_LONG)
                        }
                    } else {
                        ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '请确认密码是否有效', DURATION.LENGTH_LONG)
                    }
                }
            }).catch((error) => {
            super.setLoadingView(false);
            console.log(error);
            ToastUtils.toast(this.refs.toast, '请确认手机号和验证码无误', DURATION.LENGTH_LONG);
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.backgroundColor,
        width:GlobalStyles.window_width,
    },

    loginBtnStyle: {
        height: 44,
        borderRadius: 8,
        marginLeft: 20,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32
    },
    //登录按钮,可用状态
    loginBtnTitle: {
        fontSize: 18,
    },
})