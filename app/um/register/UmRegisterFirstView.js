/**
 * Created by zhuozhipeng on 9/8/17.
 */

import React, {
    Component,
} from 'react'

import {
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    TouchableWithoutFeedback,
    Text,
} from 'react-native'

import NavigationBar from '../../../app/common/widget/NavigationBar'
import GlobalStyles from '../../../res/style/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'
import EditView from '../../common/widget/EditView'
import BaseCommon from '../../common/BaseCommon'
import UmRegisterSecondView from '../register/UmRegisterSecondView'
import DataManager from '../../manager/DataManager'
import URLConstances from '../../constances/URLConstances'
import UmLoginView from '../login/UmLoginView'
import RegCheckUtils from '../util/RegCheckUtils'
import JsonProcessUtils from '../../util/JsonProcessUtils'
import Toast, {
    DURATION
} from 'react-native-easy-toast'
import ToastUtils from '../../util/ToastUtils'
import BaseView from '../../common/widget/BaseView'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

var forge = require('node-forge');

const REGISTER_INFO = {'phoneNo':'','pwd':'', "msgCode": ''};

export default class UmRegisterFirstView extends BaseView {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();
        this.state = {
            msgCodeBg: {backgroundColor: '#757575'},
            msgCodeTitleColor: {color: '#f4f4f4'},
            msgCode: '获取验证码',
            disable: true,
            timerCount: 60,
            isCounting: false,
            registerBtnBg: {backgroundColor: '#3673b7'},
            registerBtnTitleColor: {color: '#f1f1f1'},
            registerBtnDisable: true,
        }

        super.navBarTitle('注册');
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        clearInterval(this.interval)
    }

    contentRender() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => this.otherViewPressClick()}>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
                    <View style={{marginTop:50, flex:1}}>
                        <EditView
                            label='手机号'
                            placeholder='请输入手机号码'
                            onChangeText={(text) => {
                                // this.setState({phoneNo:text});
                                REGISTER_INFO.phoneNo = text;
                                this.codeMsgStateCheck();
                                this.registerStateCheck();
                            }}
                            inputLength={11}
                            keyboardType={'numeric'}
                            ref='phoneInput'
                        />
                        <EditView
                            label='密码'
                            placeholder='请输入密码'
                            onChangeText={(text) => {
                                // this.setState({phoneNo:text});
                                REGISTER_INFO.pwd = text;
                            }}
                            ref='pwdInput'
                            secureTextEntry={true}
                        />
                        <EditView
                            label='验证码'
                            placeholder='请输入验证码'
                            onChangeText={(text) => {
                                // this.setState({phoneNo:text});
                                REGISTER_INFO.msgCode = text;
                                this.registerStateCheck();
                            }}
                            inputLength={6}
                            keyboardType={'numeric'}
                            rightView = {this.msgCodeBtn()}
                            ref='codeInput'
                        />

                        <TouchableOpacity
                            onPress={()=>this.registerBtnOnClick()}
                            disabled={this.state.registerBtnDisable}>
                            <View ref='registerBtn'
                                  style={[styles.loginBtnStyle,this.state.registerBtnBg]}
                            >
                                <Text style={[styles.loginBtnTitle,this.state.registerBtnTitleColor]}>注 册</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    </KeyboardAwareScrollView>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    otherViewPressClick() {
        this.refs.phoneInput.refs.textInput.blur();
        this.refs.codeInput.refs.textInput.blur();
        this.refs.pwdInput.refs.textInput.blur();
    }

    registerBtnOnClick() {
        // ToastAndroid.show('register phoneNo is ' + REGISTER_INFO.phoneNo + " And Code is " + REGISTER_INFO.msgCode, ToastAndroid.SHORT)

        this.otherViewPressClick();

        if (!RegCheckUtils.phoneCheck(this.refs.toast, REGISTER_INFO.phoneNo)) {
            return;
        }

        if (!RegCheckUtils.msgCheck(this.refs.toast, REGISTER_INFO.msgCode)) {
            return;
        }

        if (!RegCheckUtils.pwdCheck(this.refs.toast, REGISTER_INFO.pwd)) {
            return;
        }

        var md5 = forge.md.md5.create();
        md5.update(REGISTER_INFO.pwd);
        let pwd = md5.digest().toHex();


        super.setLoadingView(true);
        this.dataManager.fetchDataFromNetwork(URLConstances.phone_register_url, false,
            {body:JSON.stringify(JsonProcessUtils.mergeJsonWithParams({
                'mobile':REGISTER_INFO.phoneNo, 'code': REGISTER_INFO.msgCode, 'pwd': pwd}))})
            .then((data) => {
                console.log(data);
                super.setLoadingView(false);
                if (data) {
                    if (data.code == 0) {
                        console.log('go to ok function');
                        if (data.msg == 'ok') {
                            // this.msgCodeBtnChange();

                            this.props.navigator.resetTo({
                                component: UmLoginView,
                                name: 'UmLoginView',
                                params: {
                                    from: 'UmRegisterFirstView',
                                }
                            });
                        } else {
                            ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '注册失败，请重新操作', DURATION.LENGTH_LONG)
                        }
                    } else {
                        ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '注册失败，请重新操作', DURATION.LENGTH_LONG)
                    }
                }
            }).catch((error) => {
            console.log(error);
            super.setLoadingView(false);
            this.setState({
                disable:false,
            })
            ToastUtils.toast(this.refs.toast, '注册失败，请重新操作', DURATION.LENGTH_LONG);
        })

        // this.props.navigator.push({
        //     title: 'UmRegisterSecondView',
        //     component: UmRegisterSecondView,
        // })
    }

    outContainerClick() {
        this.otherViewPressClick();
    }

    codeMsgStateCheck() {
        if (REGISTER_INFO.phoneNo.length === 11 && !this.state.isCounting) {
            this.setState({
                disable: false,
                msgCodeBg: {backgroundColor:GlobalStyles.nav_bar_backgroundColor},
                msgCodeTitleColor: {color:'#ffffff'},
                msgCode:'获取验证码'
            })
        }
    }

    msgCodeBtn() {
        return (
        <TouchableOpacity
            onPress={()=>this.msgCodeBtnOnClick()}
            disabled={this.state.disable}
        >
            <View ref='loginBtn'
                  style={[styles.msgCode_class,this.state.msgCodeBg]}
            >
                <Text style={[styles.msgCodeTitle,this.state.msgCodeTitleColor]}>{this.state.msgCode}</Text>
            </View>
        </TouchableOpacity>
        )
    }

    msgCodeBtnOnClick() {
        this.otherViewPressClick();
        if (REGISTER_INFO.phoneNo.length === 11) {
            this.setState({
                disable:true,
                // registerBtnBg: {backgroundColor: '#a49d1e'},
                // registerBtnTitleColor: {color: '#757575'},
                // registerBtnDisable:true,
            })
            super.setLoadingView(true);
            this.dataManager.fetchDataFromNetwork(URLConstances.phone_code_url , false,
                {body:JSON.stringify(JsonProcessUtils.mergeJsonWithParams({'mobile':REGISTER_INFO.phoneNo}))})
                .then((data) => {
                    super.setLoadingView(false);
                console.log(data);
                if (data) {
                    if (data.code == 0) {
                        if (data.msg == 'ok') {
                            console.log('go to ok function');
                            this.msgCodeBtnChange();
                        } else {
                            ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '发送验证码失败，请重新获取验证码');
                        }
                    } else {
                        ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '发送验证码失败，请重新获取验证码');
                        this.setState({
                            disable:false,
                        })
                    }
                }
            }).catch((error) => {
                super.setLoadingView(false);
                console.log(error);
                this.setState({
                    disable:false,
                })
                ToastUtils.toast(this.refs.toast, '发送验证码失败，请重新获取验证码');
            })


        } else {
            this.setState({
                msgCodeBg: {backgroundColor: '#757575'},
                msgCodeTitleColor: {color: '#f4f4f4'},
                disable:true,
            })
            ToastUtils.toast(this.refs.toast, '请输入11位手机号');
        }
    }

    msgCodeBtnChange() {
        this.setState({
            msgCodeBg: {backgroundColor: '#757575'},
            msgCodeTitleColor: {color: '#f4f4f4'},
            msgCode: '60s',
            disable:true,
        })

        this.interval = setInterval(() => {
            const  timer = this.state.timerCount - 1;
            if (timer === 0) {
                this.setState({
                    timerCount: 60,
                    isCounting: false,
                    registerBtnBg: {backgroundColor: '#3673b7'},
                    registerBtnTitleColor: {color: '#f1f1f1'},
                    registerBtnDisable:true,
                })
                this.interval && clearInterval(this.interval);
                if (REGISTER_INFO.phoneNo.length === 11) {
                    this.setState({
                        msgCodeBg: {backgroundColor:GlobalStyles.nav_bar_backgroundColor},
                        msgCodeTitleColor: {color:'#ffffff'},
                        msgCode: '重新获取',
                        disable:false,
                    })
                } else {
                    this.setState({
                        msgCodeBg: {backgroundColor: '#757575'},
                        msgCodeTitleColor: {color: '#f4f4f4'},
                        msgCode: '获取验证码',
                        disable:true,
                    })
                }
            } else {
                this.setState({
                    isCounting: true,
                    timerCount: timer,
                    msgCodeBg: {backgroundColor: '#757575'},
                    msgCodeTitleColor: {color: '#f4f4f4'},
                    msgCode: timer + 's',
                    disable:true,
                })
            }
        }, 1000)
    }

    registerStateCheck() {
        if (REGISTER_INFO.phoneNo.length === 11) {
            this.setState({
                registerBtnBg: {backgroundColor: GlobalStyles.nav_bar_backgroundColor},
                registerBtnTitleColor: {color: '#ffffff'},
                registerBtnDisable: false,
            });
        } else {
            this.setState({
                registerBtnBg: {backgroundColor: '#3673b7'},
                registerBtnTitleColor: {color: '#f1f1f1'},
                registerBtnDisable:true,
            });
        }
    }

    onBack() {
        this.otherViewPressClick();
        super.onBack()
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.backgroundColor,
        width:GlobalStyles.window_width,
    },

    //登录按钮,可用状态
    msgCodeTitle: {
        fontSize: 14,
    },

    msgCode_class: {
        height: 32,
        width: 88,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    //登录按钮
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
