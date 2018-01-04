/**
 * Created by Gibbon on 2017/8/23.
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

import NavigationBar from '../../common/widget/NavigationBar'
import GlobalStyles from '../../../res/style/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'
import EditView from '../../common/widget/EditView'
import BaseCommon from '../../common/BaseCommon'
import DataManager from '../../manager/DataManager'
import URLConstances from '../../constances/URLConstances'
import UmLoginView from '../login/UmLoginView'
import RegCheckUtils from '../util/RegCheckUtils'
import JsonProcessUtils from '../../util/JsonProcessUtils'
import UmForgetSetPWdView from './UmForgetSetPWdView'
import Toast, {
    DURATION
} from 'react-native-easy-toast'
import ToastUtils from '../../util/ToastUtils'
import BaseView from '../../common/widget/BaseView'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

const FORGET_INFO = {'phoneNo':'','token':'', "msgCode": ''};

export default class UmForgetPwdView extends BaseView {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();
        this.phoneNo = '';
        this.token = '';
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

        super.navBarTitle('忘记密码');
    }

    componentWillUnmount() {
        super.componentWillUnmount();
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
                                FORGET_INFO.phoneNo = text;
                                this.codeMsgStateCheck();
                                this.registerStateCheck();
                            }}
                            inputLength={11}
                            keyboardType={'numeric'}
                            ref='phoneInput'
                        />

                        <EditView
                            label='验证码'
                            placeholder='请输入验证码'
                            onChangeText={(text) => {
                                // this.setState({phoneNo:text});
                                FORGET_INFO.msgCode = text;
                                this.registerStateCheck();
                            }}
                            inputLength={6}
                            keyboardType={'numeric'}
                            rightView = {this.msgCodeBtn()}
                            ref='codeInput'
                        />

                        <TouchableOpacity
                            onPress={()=>this.nextBtnOnClick()}
                            disabled={this.state.registerBtnDisable}>
                            <View ref='registerBtn'
                                  style={[styles.loginBtnStyle,this.state.registerBtnBg]}
                            >
                                <Text style={[styles.loginBtnTitle,this.state.registerBtnTitleColor]}>下一步</Text>
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
        this.refs.phoneInput.refs.textInput.blur();
        this.refs.codeInput.refs.textInput.blur();
    }

    nextBtnOnClick() {


        this.otherViewPressClick();

        if (!RegCheckUtils.phoneCheck(this.refs.toast, FORGET_INFO.phoneNo)) {
            return;
        }

        if (!RegCheckUtils.msgCheck(this.refs.toast, FORGET_INFO.msgCode)) {
            return;
        }

        this.setState({
            registerBtnDisable: true,
            disable:true,
        })

        this.phoneNo = FORGET_INFO.phoneNo;

        super.setLoadingView(true);
        this.dataManager.fetchDataFromNetwork(URLConstances.phone_code_retrieve_code_check, false,
            {body:JSON.stringify(JsonProcessUtils.mergeJsonWithParams({
                'mobile':FORGET_INFO.phoneNo, 'code': FORGET_INFO.msgCode}))})
            .then((data) => {
                super.setLoadingView(false);
                console.log(data);
                if (data) {
                    if (data.code == 0) {
                        console.log('go to ok function');
                        if (!!data.token && data.token.length > 0) {
                            console.log('go to ok function');
                            FORGET_INFO.token = data.token;
                            this.token = data.token;
                            this.props.navigator.push({
                                name: 'UmForgetSetPWdView',
                                component: UmForgetSetPWdView,
                                params: {
                                    phoneNo: this.phoneNo,
                                    token: this.token,
                                    userId: data.userId,
                                    subUserId:data.subUserId,
                                }
                            });
                        } else {
                            ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '请确认手机号和验证码无误', DURATION.LENGTH_LONG)
                        }
                    } else {
                        ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '请确认手机号和验证码无误', DURATION.LENGTH_LONG)
                    }
                }
                this.setState({
                    registerBtnDisable: false,
                    disable:false,
                })
            }).catch((error) => {
            console.log(error);
            super.setLoadingView(false);
            this.setState({
                registerBtnDisable: false,
                disable:false,
            })
            ToastUtils.toast(this.refs.toast, '请确认手机号和验证码无误', DURATION.LENGTH_LONG);
        })

        // this.props.navigator.push({
        //     title: 'UmRegisterSecondView',
        //     component: UmRegisterSecondView,
        // })
    }

    codeMsgStateCheck() {
        if (FORGET_INFO.phoneNo.length === 11 && !this.state.isCounting) {
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
        if (FORGET_INFO.phoneNo.length === 11) {
            this.setState({
                disable:true,
            })
            super.setLoadingView(true);
            this.dataManager.fetchDataFromNetwork(URLConstances.phone_code_retrieve_url , false,
                {body:JSON.stringify(JsonProcessUtils.mergeJsonWithParams({'mobile':FORGET_INFO.phoneNo}))})
                .then((data) => {
                    super.setLoadingView(false);
                    console.log(data);
                    if (data) {
                        if (data.code == 0) {
                            if (data.msg === '手机未注册') {
                                ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '发送验证码失败，请重新获取验证码');
                            } else {
                                this.msgCodeBtnChange();
                            }
                        } else {
                            ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '发送验证码失败，请重新获取验证码');
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
                if (FORGET_INFO.phoneNo.length === 11) {
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
        if (FORGET_INFO.phoneNo.length === 11) {
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
        super.onBack();
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
