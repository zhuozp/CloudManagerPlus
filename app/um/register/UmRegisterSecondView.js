/**
 * Created by zhuozhipeng on 9/8/17.
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

const PASSWORD_INFO = {'firstPwd':'', "secondPwd":''};

export default class UmRegisterSecondView extends Component {
    constructor(props) {
        super(props);
        this.common = new BaseCommon({...props, backPress: (e) => this.onBackPress(e)});

        this.state = {
            loginBtnBg: {backgroundColor: '#a49d1e'},
            loginBtnTitleColor: {color: '#757575'},
            setPwdBtnDisable:true,
        }
    }

    componentDidMount() {
        this.common.componentDidMount();
    }

    componentWillUnmount() {
        this.common.componentWillUnmount();
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    navigator={this.props.navigator}
                    leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                    style={{backgroundColor: GlobalStyles.nav_bar_backgroundColor}}
                    popEnabled={true}
                    title='注册 (2/2)'
                />

                <TouchableWithoutFeedback onPress={() => this.otherViewPressClick()}>
                    <View style={{marginTop:50, flex:1}}>
                        <EditView
                            label='输入密码'
                            placeholder='请输入密码'
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

                        <TouchableOpacity onPress={()=>this.setPwdBtnClick()} disabled={this.state.setPwdBtnDisable}>
                            <View ref='registerBtn'
                                  style={[styles.loginBtnStyle,this.state.registerBtnBg]}
                            >
                                <Text style={[styles.loginBtnTitle,this.state.registerBtnTitleColor]}>设置密码</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    otherViewPressClick() {
        this.refs.firstPwdInput.refs.textInput.blur();
        this.refs.secondPwdInput.refs.textInput.blur();
    }

    onBack() {
        this.otherViewPressClick();
        this.props.navigator.pop();
    }

    onBackPress(e) {
        this.onBack();
        return true;
    }

    setPwdStateCheck() {
        if (PASSWORD_INFO.firstPwd.valueOf() ===  PASSWORD_INFO.secondPwd.valueOf()) {
            this.setState({
                loginBtnBg: {backgroundColor: '#fff729'},
                loginBtnTitleColor: {color: '#ffffff'},
                setPwdBtnDisable: false,
            });
        } else {
            // ToastAndroid.show('请确保两次密码一致', ToastAndroid.SHORT)
            this.setState({
                loginBtnBg: {backgroundColor: '#a49d1e'},
                loginBtnTitleColor: {color: '#757575'},
                setPwdBtnDisable:true,
            });
        }
    }

    setPwdBtnClick() {
        this.otherViewPressClick();
        const routes = this.props.navigator.state.routeStack;
        let destinationRoute = '';
        for (let i = routes.length - 1; i >= 0; i--) {
            if(routes[i].name === 'UmLoginView'){
                destinationRoute = this.props.navigator.getCurrentRoutes()[i]
                break;
            }
        }
        this.props.navigator.popToRoute(destinationRoute);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.backgroundColor,
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