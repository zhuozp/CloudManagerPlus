/**
 * Created by zhuozhipeng on 9/8/17.
 */

import React, {
    Component,
} from 'react'

import {
    StyleSheet,
    ToastAndroid,
    View,
    TouchableOpacity,
    Text,
    AlertIOS,
    Image,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native'

import EditView from '../../common/widget/EditView';
import NavigationBar from "../../common/widget/NavigationBar";
import GlobalStyles from "../../../res/style/GlobalStyles";
import UmRegisterFirstView from "../register/UmRegisterFirstView";
import RegCheckUtils from '../util/RegCheckUtils'
import URLConstances from '../../constances/URLConstances'
import DataManager from '../../manager/DataManager'
import ToastUtils from '../../util/ToastUtils'
import BaseCommon from '../../common/BaseCommon'
import ViewUtils from '../../util/ViewUtils'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import KeyConstances from '../../constances/KeyConstances'
import JsonProcessUtils from '../../util/JsonProcessUtils'
import MainView from '../../main/MainView'
import UmInfoInstance from '../UmInfoInstance'
import UmForgetPwdView from '../forget/UmForgetPwdView'
import BaseView from '../../common/widget/BaseView'

import Toast, {
    DURATION
} from 'react-native-easy-toast'

var forge = require('node-forge');

const UM_INFO = {'phoneNo':'', 'password':''};

export default class UmLoginView extends BaseView {

    constructor(props) {
        super(props);
        // this.common = new BaseCommon({...props, backPress: (e) => this.onBackPress(e)});
        this.state = {
            // phoneNo: '',
            // password:'',
            loginBtnBg: {backgroundColor: '#3673b7'},
            loginBtnTitleColor: {color: '#f1f1f1'},
            loginBtnDisable: true,
            isChild:false,
        }

        this.phoneNo = '';
        this.password = '';
        this.dataManager = new DataManager();

        super.navBarTitle('登录');
        super.navBarLeftViewExist(false);
        super.needProcessHardwareBackPress(false);
    }

    componentDidMount() {
        // this.common.componentDidMount();
        super.componentDidMount();
        if (!!this.props.from) {
            if ('UmRegisterFirstView' === this.props.from) {
                ToastUtils.toast(this.refs.toast, '注册成功,请用注册账号登录', DURATION.LENGTH_LONG);
            } else if ('UmResetPwdView' === this.props.from) {
                ToastUtils.toast(this.refs.toast, '重置密码成功,请重新登录', DURATION.LENGTH_LONG);
            }
        }
    }
    //
    // componentWillUnmount() {
    //     this.common.componentWillUnmount();
    // }
    //
    // onBack() {
    //     this.otherViewPressClick();
    //     this.props.navigator.pop();
    // }
    //
    // onBackPress(e) {
    //     this.onBack();
    //     return true;
    // }

    otherViewPressClick() {
        this.refs.phoneInput.refs.textInput.blur();
        this.refs.pwdInput.refs.textInput.blur();
    }

    contentRender() {
        // var navigationBar =
        //     <NavigationBar
        //         // leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
        //         style={{backgroundColor: GlobalStyles.nav_bar_backgroundColor}}
        //         title='登录'/>;
        // let childImage = this.state.isChild ?
        //     <Image style={styles.child_img} source={require('../../../res/images/btn_check_on.png')}/> :
        //     <Image style={styles.child_img} source={require('../../../res/images/btn_check_off.png')}/>
        return (
            <View style={{flex:1, width:GlobalStyles.window_width}}>
                {/*{navigationBar}*/}
                <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
                    <View style={{flex:1}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.otherViewPressClick()}
                            >
                            <View style={{marginTop:50, flex:1}}>
                                <EditView
                                    label='手机号'
                                    placeholder='请输入手机号码'
                                    onChangeText={(text) => {
                                        // this.setState({phoneNo:text});
                                        UM_INFO.phoneNo = text;
                                        this.loginStateCheck();
                                    }}
                                    inputLength={11}
                                    keyboardType={'numeric'}
                                    ref='phoneInput'
                                    hasRightView ={false}
                                />
                                <EditView
                                    label='密码'
                                    placeholder='请输入密码'
                                    onChangeText={(text) => {
                                        // this.setState({password:text});  // 这里用state不生效，读出来的字符串大小总是少了一个，后续得查问题
                                        UM_INFO.password = text;
                                        this.loginStateCheck();
                                    }}
                                    secureTextEntry={true}
                                    ref='pwdInput'
                                    hasRightView ={false}
                                />


                                {/*<View style={{flexDirection:'row', alignItems:'center', marginTop: 8}}>*/}
                                    {/*<TouchableOpacity onPress={()=> {*/}
                                        {/*this.setState({*/}
                                            {/*isChild: !this.state.isChild,*/}
                                        {/*})*/}
                                    {/*}}>*/}
                                        {/*{childImage}*/}
                                    {/*</TouchableOpacity>*/}
                                    {/*<Text style={{textAlign:'center',color: '#aaadae', fontSize: 14,}}>子账号登录</Text>*/}
                                {/*</View>*/}

                                <TouchableOpacity
                                    disabled={this.state.loginBtnDisable}
                                    onPress={()=>this.loginBtnOnClick()}>
                                    <View ref='loginBtn'
                                          style={[styles.loginBtnStyle,this.state.loginBtnBg]}
                                    >
                                        <Text style={[styles.loginBtnTitle,this.state.loginBtnTitleColor]}>登 录</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                                    <TouchableOpacity onPress={()=>this.forgetPwd()}>
                                        <Text style={{padding:12, marginRight:8, color:GlobalStyles.nav_bar_backgroundColor}}>忘记密码</Text>
                                    </TouchableOpacity>
                                </View>


                                <View style={{justifyContent:'center', alignItems:'center', marginTop: 100, flexDirection:'row'}}>
                                    <View style={{justifyContent:'center', alignItems:'center'}}>
                                        <TouchableOpacity onPress={()=>this.registerBtnOnClick()}>
                                            <Image style={{width : 48, height: 48}}
                                                   source={require('../../../res/images/um/ic_register_88.png')}
                                            />
                                            <Text style={{fontSize:10, color:'#aaadae', marginTop: 10, alignSelf:'center'}}>手机注册</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{justifyContent:'center', alignItems:'center', marginLeft:GlobalStyles.scaleSize(150)}}>
                                        <TouchableOpacity onPress={()=>this.experienceAccount()}>
                                            <Image style={{width : 48, height: 48}}
                                                   source={require('../../../res/images/um/ic_experience_88.png')}
                                            />
                                            <Text style={{fontSize:10, color:'#aaadae', marginTop: 10, alignSelf:'center'}}>体验账号</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                        </TouchableWithoutFeedback>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }

    experienceAccount() {
        super.setLoadingView(true);
        this.dataManager.fetchDataFromNetwork(URLConstances.experience_account, false, {body:JSON.stringify(JsonProcessUtils.mergeJsonWithParams({}))})
            .then((data)=> {
                super.setLoadingView(false);
                if (!!data && data.code === 0) {
                    var data = data.msg;
                    if (!!data.token && data.token.length > 0) {
                        UmInfoInstance.getInstance().setInfo(JsonProcessUtils.mergeJson(data, {'phoneNo':this.phoneNo, 'password': this.password, experienceAccount:true}));
                        this.dataManager.saveData(KeyConstances.KEY_USER_INFO,
                            JSON.stringify(JsonProcessUtils.mergeJson(data, {'phoneNo':this.phoneNo, 'password': this.password, experienceAccount:true})));
                        this.props.navigator.resetTo({
                            component: MainView,
                            name: 'MainView',
                        });
                    } else {
                        super.showToast(!!data && !!data.msg ? data.msg : '使用体验账号登录失败，请稍后再试')
                    }
                } else {
                    super.showToast(!!data && !!data.msg ? data.msg : '使用体验账号登录失败，请稍后再试')
                }
            })
            .catch((error)=> {
                super.setLoadingView(false);
                super.showToast('使用体验账号登录失败，请稍后再试')
            })
    }

    outContainerClick() {
        this.otherViewPressClick();
    }

    forgetPwd() {
        this.props.navigator.push({
            name:'UmForgetPwdView',
            component: UmForgetPwdView,
        })
    }

    loginBtnOnClick() {
        this.otherViewPressClick();
        // ToastAndroid.show('PhoneNo is: ' + UM_INFO.phoneNo + " PassWord is " + UM_INFO.password, ToastAndroid.SHORT);
        // ToastUtils.toast(this.refs.toast, 'PhoneNo is: ' + UM_INFO.phoneNo + " PassWord is " + UM_INFO.password)
        if (!RegCheckUtils.pwdCheck(this.refs.toast, UM_INFO.password) || !RegCheckUtils.phoneCheck(this.refs.toast, UM_INFO.phoneNo)) {
            return;
        }

        var md5 = forge.md.md5.create();
        md5.update(UM_INFO.password);
        let pwd = md5.digest().toHex();

        this.phoneNo = UM_INFO.phoneNo;
        this.password = UM_INFO.password;

        this.setState({
            loginBtnDisable:true,
        })
        super.setLoadingView(true);
        this.dataManager.fetchDataFromNetwork(URLConstances.login_url, false,
            {body:JSON.stringify(JsonProcessUtils.mergeJsonWithParams({'mobile':UM_INFO.phoneNo,
                'pwd':pwd, 'isChild': this.state.isChild}))})
            .then((data) => {
                super.setLoadingView(false);
                this.setState({
                    loginBtnDisable:false,
                })
                console.log(data);

                if (data) {
                    if (data.code == 0) {
                        var data = data.msg;
                        if (!!data.token && data.token.length > 0) {
                            UmInfoInstance.getInstance().setInfo(JsonProcessUtils.mergeJson(data, {'phoneNo':this.phoneNo, 'password': this.password, experienceAccount:false}));
                            this.dataManager.saveData(KeyConstances.KEY_USER_INFO,
                                JSON.stringify(JsonProcessUtils.mergeJson(data, {'phoneNo':this.phoneNo, 'password': this.password, experienceAccount:false})));
                            this.props.navigator.resetTo({
                                component: MainView,
                                name: 'MainView',
                            });
                        } else {
                            ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '手机号或者密码错误')
                        }
                    } else {
                        ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '手机号或者密码错误')
                    }
                } else {
                    ToastUtils.toast(this.refs.toast, '网络异常，请稍后再试')
                }
            }).catch((error) => {
            super.setLoadingView(false);
            console.log(error);
            this.setState({
                disable:false,
                loginBtnDisable:false,
            })
            ToastUtils.toast(this.refs.toast,"登录失败，请重新登录")
        })
    }

    registerBtnOnClick() {
        this.props.navigator.push({
            title: 'UmRegisterFirstView',
            component: UmRegisterFirstView,
        });
    }

    loginStateCheck() {
        if (UM_INFO.phoneNo.length === 11 && UM_INFO.password.length > 5) {
            this.setState({
                loginBtnBg: {backgroundColor: GlobalStyles.nav_bar_backgroundColor},
                loginBtnTitleColor: {color: '#ffffff'},
                loginBtnDisable: false,
            });
        } else {
            this.setState({
                loginBtnBg: {backgroundColor: '#3673b7'},
                loginBtnTitleColor: {color: '#f1f1f1'},
                loginBtnDisable:true,
            });
        }
    }
}

const styles = StyleSheet.create({
    //登录按钮
    loginBtnStyle: {
        height: 44,
        borderRadius: 8,
        marginLeft: 20,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: GlobalStyles.scaleSize(96)
    },
    //登录按钮,可用状态
    loginBtnTitle: {
        fontSize: 18,
    },

    child_img: {
        padding:8,
        width:32,
        height:32,
        marginLeft: 12,
    }
})