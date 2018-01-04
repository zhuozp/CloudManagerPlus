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
import UmInfoInstance from '../UmInfoInstance'
import URLConstances from '../../constances/URLConstances'
import DataManager from '../../manager/DataManager'
import KeyConstances from '../../constances/KeyConstances'
import BaseView from '../../common/widget/BaseView'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

const PASSWORD_INFO = {'oldPwd':'', 'firstPwd':'', "secondPwd":''};
var forge = require('node-forge');

export default class UmResetPwdView extends BaseView {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();

        this.state = {
            loginBtnBg: {backgroundColor: '#3673b7'},
            loginBtnTitleColor: {color: '#f1f1f1'},
            setPwdBtnDisable:true,
        }

        super.navBarTitle('重置密码')
    }

    contentRender() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => this.otherViewPressClick()}>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
                        <View style={{marginTop:50, flex:1}}>
                            <EditView
                                label='旧密码'
                                placeholder='请输入旧密码'
                                onChangeText={(text) => {
                                    // this.setState({phoneNo:text});
                                    PASSWORD_INFO.oldPwd = text;
                                    this.setPwdStateCheck();
                                }}
                                ref='oldPwdInput'
                                secureTextEntry={true}
                            />
    
                            <EditView
                                label='新密码'
                                placeholder='请输入新密码'
                                onChangeText={(text) => {
                                    // this.setState({phoneNo:text});
                                    PASSWORD_INFO.firstPwd = text;
                                    this.setPwdStateCheck();
                                }}
                                ref='firstPwdInput'
                                secureTextEntry={true}
                            />
                            <EditView
                                label='确认密码'
                                placeholder='请再次输入密码'
                                onChangeText={(text) => {
                                    // this.setState({phoneNo:text});
                                    PASSWORD_INFO.secondPwd = text;
                                    this.setPwdStateCheck();
                                }}
                                ref='secondPwdInput'
                                secureTextEntry={true}
                            />
    
                            <TouchableOpacity onPress={()=>this.resetPwdBtnClick()} disabled={this.state.setPwdBtnDisable}>
                                <View ref='registerBtn'
                                      style={[styles.loginBtnStyle,this.state.loginBtnBg]}
                                >
                                    <Text style={[styles.loginBtnTitle,this.state.loginBtnTitleColor]}>重置密码</Text>
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
        this.refs.oldPwdInput.refs.textInput.blur();
        this.refs.firstPwdInput.refs.textInput.blur();
        this.refs.secondPwdInput.refs.textInput.blur();
    }

    onBack() {
        this.otherViewPressClick();
        super.onBack();
    }


    setPwdStateCheck() {
        this.setState({
            loginBtnBg: {backgroundColor: GlobalStyles.nav_bar_backgroundColor},
            loginBtnTitleColor: {color: '#ffffff'},
            setPwdBtnDisable: false,
        });
        // if (RegCheckUtils.pwdCheck(this.refs.toast, PASSWORD_INFO.firstPwd)) {
        //
        // } else {
        //     this.setState({
        //         loginBtnBg: {backgroundColor: '#a49d1e'},
        //         loginBtnTitleColor: {color: '#757575'},
        //         setPwdBtnDisable:true,
        //     });
        // }
    }

    resetPwdBtnClick() {
        this.otherViewPressClick();

        if (PASSWORD_INFO.oldPwd !== UmInfoInstance.getInstance()._password) {
            this.refs.toast.show('输入的旧密码不正确，请重新输入', DURATION.LENGTH_LONG);
            return;
        }

        if (!RegCheckUtils.pwdCheck(this.refs.toast, PASSWORD_INFO.firstPwd)) {
            return;
        }
        
        if (PASSWORD_INFO.oldPwd === PASSWORD_INFO.firstPwd) {
            this.refs.toast.show('输入的密码与旧密码一样，请重新输入', DURATION.LENGTH_LONG);
            return;
        }

        if (PASSWORD_INFO.firstPwd !== PASSWORD_INFO.secondPwd) {
            this.refs.toast.show('两次输入的新密码不一致，请重新输入', DURATION.LENGTH_LONG);
            return;
        }

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
        this.dataManager.fetchDataFromNetwork(URLConstances.phone_pwd_reset_url, false,
            {body:JSON.stringify(JsonProcessUtils.mergeJsonWithParams({
                'userId':UmInfoInstance.getInstance()._userId, 'subUserId':UmInfoInstance.getInstance()._subUserId,
                'token': UmInfoInstance.getInstance()._loginToken, 'pwd': pwd}))})
            .then((data) => {
                console.log(data);
                super.setLoadingView(false);
                if (data) {
                    if (data.code == 0) {
                        if (data.msg == 'ok') {
                            this.dataManager.saveData(KeyConstances.KEY_USER_INFO, '');
                            this.props.navigator.resetTo({
                                component: UmLoginView,
                                name: 'UmLoginView',
                                params: {
                                    from: 'UmResetPwdView',
                                }
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
            ToastUtils.toast(this.refs.toast, '请确认密码是否有效', DURATION.LENGTH_LONG);
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