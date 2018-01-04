/**
 * Created by zhuozhipeng on 6/9/17.
 */
import React from 'react'

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    Image,
} from 'react-native'

import BaseView from '../../../common/widget/BaseView'
import LoadingProgressView from '../../../common/widget/LoadingProgressView'
import GlobalStyles from '../../../../res/style/GlobalStyles'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import LessorItem from './model/LessorItem'
import DataManager from '../../../manager/DataManager'
import URLConstances from '../../../constances/URLConstances'
import KeyConstances from '../../../constances/KeyConstances'
import StringUtils from '../../../util/StringUtils'
import JsonProcessUtils from '../../../util/JsonProcessUtils'
import ContactsWrapper from 'react-native-contacts-wrapper'

var dismissKeyboard = require('dismissKeyboard');

export default class LessorEditView extends BaseView {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();
        this.lessorItem = new LessorItem(this.props.item);
        this.tempItem = new LessorItem(this.props.item);
        this.add = !!this.props.add ? this.props.add : false;
        this.state = {
            editableSwitch: this.add,
            item: this.lessorItem,
        };


        super.navBarTitle('出租方信息');

    }

    componentDidMount() {
        super.componentDidMount();
    }

    navBarRightView() {
        let label = this.state.editableSwitch ? '提交' : '修改';
        return (
            <TouchableOpacity
                underlayColor='transparent'
                style={{padding: 8}}
                onPress={() => {
                    this.blurProcess();
                    if (label === '修改') {
                        this.setState({
                            editableSwitch: true,
                        })
                    } else {
                        this.uploadData();
                    }
                }}>
                <Text style={{fontSize: GlobalStyles.nav_bar_fontsize, color: '#ffffff'}}>{label}</Text>
            </TouchableOpacity>
        )
    }

    uploadData() {
        if (!StringUtils.isNotEmpty(this.state.item.lessorName)) {
            super.showToast('法定代表人不能为空');
            return;
        }

        if (!StringUtils.isNotEmpty(this.state.item.lessorMobile)) {
            super.showToast('电话不能为空');
            return;
        }

        if (!StringUtils.isNotEmpty(this.state.item.acountName)) {
            super.showToast('开户名不能为空');
            return;
        }

        if (!StringUtils.isNotEmpty(this.state.item.acountNum)) {
            super.showToast('银行账号不能为空');
            return;
        }

        if (!this.add && JSON.stringify(this.tempItem) === JSON.stringify(this.lessorItem)) {
            super.showToast('没有做任何修改');
            return;
        }

        super.setLoadingView(true);

        if (this.add) {
            this.dataManager.fetchDataFromNetwork(URLConstances.lessor_add_url, false,
                {body:JSON.stringify(JsonProcessUtils.mergeJsonWithLogin(this.state.item))})
                .then((data)=> {
                    super.setLoadingView(false);
                    if (!!data) {
                        if (data.code === 0 && !!data.msg && data.msg === 'ok') {
                            super.showToast('添加成功');
                            if (typeof(this.props.processCallback === 'function')) {
                                this.props.processCallback();
                            }
                            super.onBack();
                        } else {
                            super.showToast(!!data.msg ? data.msg : '添加失败，请重试');
                        }
                    } else {
                        super.showToast('添加失败，请重试');
                    }
                })
                .catch((error)=> {
                    super.setLoadingView(false);
                    super.showToast('添加失败，请重试');
                })
        } else {
            this.dataManager.fetchDataFromNetwork(URLConstances.lessor_modify_url, false,
                {body:JSON.stringify(JsonProcessUtils.mergeJsonWithLogin(this.state.item))})
                .then((data)=> {
                    super.setLoadingView(false);
                    if (!!data) {
                        if (data.code === 0 && !!data.msg && data.msg === 'ok') {
                            super.showToast('修改成功');
                            if (typeof(this.props.processCallback === 'function')) {
                                this.props.processCallback();
                            }
                            super.onBack();
                        } else {
                            super.showToast(!!data.msg ? data.msg : '修改失败，请重试');
                        }
                    } else {
                        super.showToast('修改失败，请重试');
                    }
                })
                .catch((error)=> {
                    super.setLoadingView(false);
                    super.showToast('修改失败，请重试');
                })
        }

    }

    outContainerClick() {
        this.blurProcess();
    }

    blurProcess() {
        // if (!!this.refs.lessorInput) {
        //     this.refs.lessorInput.blur();
        // }
        //
        // if (!!this.refs.lessorNameInput) {
        //     this.refs.lessorNameInput.blur();
        // }
        //
        // if (!!this.refs.lessorAddressInput) {
        //     this.refs.lessorAddressInput.blur();
        // }
        //
        // if (!!this.refs.lessorMobileInput) {
        //     this.refs.lessorMobileInput.blur();
        // }
        //
        // if (!!this.refs.lessorMandatorInput) {
        //     this.refs.lessorMandatorInput.blur();
        // }
        //
        // if (!!this.refs.openBankInput) {
        //     this.refs.openBankInput.blur();
        // }
        //
        // if (!!this.refs.accountNameInput) {
        //     this.refs.accountNameInput.blur();
        // }
        //
        // if (!!this.refs.accountDetailInput) {
        //     this.refs.accountDetailInput.blur();
        // }
        dismissKeyboard();
    }

    contentRender() {
        return (
            <KeyboardAwareScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                <TouchableWithoutFeedback onPress={() => {
                    this.blurProcess();
                }}>
                    <View>
                        <View style={{
                            height: GlobalStyles.scaleSize(64),
                            backgroundColor: GlobalStyles.backgroundColor,
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: GlobalStyles.setSpText(11),
                                color: '#818181',
                                marginTop: GlobalStyles.scaleSize(24),
                                left: GlobalStyles.scaleSize(24),
                                flex: 1
                            }}>添加出租方基本信息</Text>
                        </View>
                        {this.getItem('出租方:', 'lessorInput', '如 易鸟科技有限公司', this.state.item.lessor, false,
                            (text) => {
                                this.lessorItem.lessor = text;
                                this.setState({
                                    item: this.lessorItem,
                                })
                            })}
                        <View style={styles.line_class}/>
                        {this.getItem('法定代表人:', 'lessorNameInput', '如 林生', this.state.item.lessorName, true,
                            (text) => {
                                this.lessorItem.lessorName = text;
                                this.setState({
                                    item: this.lessorItem,
                                })
                            })}
                        <View style={styles.line_class}/>
                        {this.getItem('地址:', 'lessorAddressInput', '出租方地址', this.state.item.lessorAddress, false,
                            (text) => {
                                this.lessorItem.lessorAddress = text;
                                this.setState({
                                    item: this.lessorItem,
                                })
                            })}
                        <View style={styles.line_class}/>

                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <View style={{flex:1}}>
                                {this.getItem('出租方委托人：', 'lessorMandatorInput', '如 林生', this.state.item.lessorMandator, false,
                                    (text)=> {
                                        this.lessorItem.lessorMandator = text;
                                        this.setState({
                                            item: this.lessorItem,
                                        })
                                    })}
                                <View style={[styles.line_class, {right:GlobalStyles.scaleSize(24)}]}/>

                                {this.getItem('电话：', 'lessorMobileInput', '请输入委托人电话', this.state.item.lessorMobile, true,
                                    (text)=> {
                                        this.lessorItem.lessorMobile = text;
                                        this.setState({
                                            item: this.lessorItem,
                                        })
                                    }, 'numeric')}
                            </View>
                            <View style={{height: GlobalStyles.scaleSize(177), width: GlobalStyles.scaleSize(160), justifyContent:'center', alignItems:'center', backgroundColor:'#fff'}}>
                                <TouchableOpacity
                                    disabled={!this.state.editableSwitch}
                                    onPress={()=> {
                                    ContactsWrapper.getContact()
                                        .then((contact) => {
                                            // Replace this code
                                            console.log(contact);

                                            this.lessorItem.lessorMandator = contact.name;
                                            this.lessorItem.lessorMobile = contact.phone;
                                            this.setState({
                                                item: this.lessorItem,
                                            })
                                        })
                                        .catch((error) => {
                                            console.log("ERROR CODE: ", error.code);
                                            console.log("ERROR MESSAGE: ", error.message);
                                        });
                                }}>
                                    <View style={{alignItems:'center'}}>
                                        <Image style={{width: GlobalStyles.scaleSize(40), height : GlobalStyles.scaleSize(40)}} source={require('../../../../res/images/building/ic_add_44.png')}/>
                                        <Text style={{fontSize:GlobalStyles.setSpText(12), color: GlobalStyles.nav_bar_backgroundColor,}}>导入联系人</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.line_class, {left: 0}]}/>

                        <View style={{
                            height: GlobalStyles.scaleSize(64),
                            backgroundColor: GlobalStyles.backgroundColor,
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: GlobalStyles.setSpText(11),
                                color: '#818181',
                                marginTop: GlobalStyles.scaleSize(24),
                                left: GlobalStyles.scaleSize(24),
                                flex: 1
                            }}>添加收款账户信息</Text>
                        </View>
                        {this.getItem('开户行:', 'openBankInput', '请输入开户行', this.state.item.openBank, false,
                            (text) => {
                                this.lessorItem.openBank = text;
                                this.setState({
                                    item: this.lessorItem,
                                })
                            })}
                        <View style={styles.line_class}/>
                        {this.getItem('开户名:', 'accountNameInput', '请输入开户名', this.state.item.acountName, true,
                            (text) => {
                                this.lessorItem.acountName = text;
                                this.setState({
                                    item: this.lessorItem,
                                })
                            })}
                        <View style={styles.line_class}/>
                        {this.getItem('银行帐号:', 'accountDetailInput', '请银行帐号', this.state.item.acountNum, true,
                            (text) => {
                                this.lessorItem.acountNum = text;
                                this.setState({
                                    item: this.lessorItem,
                                })
                            }, 'numeric')}
                        <View style={[styles.line_class, {left: 0}]}/>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        )
    }

    getItem(title, ref, placeholder, defaultValue, needText, onChangeText, keyboardType) {
        let needView = needText ? <Text style={styles.need_text}>*</Text> : null;
        return (
            <View style={styles.view_class}>
                <Text style={styles.text_class}>{title}</Text>
                <TextInput
                    ref={ref}
                    style={styles.input_class}
                    placeholder={placeholder}
                    placeholderTextColor={'#D7DBDC'}
                    underlineColorAndroid='transparent'
                    onChangeText={(text) => {
                        onChangeText(text)
                    }}
                    clearButtonMode={'never'}
                    editable={this.state.editableSwitch}
                    defaultValue={defaultValue}
                    keyboardType={StringUtils.isNotEmpty(keyboardType) ? keyboardType : 'default'}
                />
                {needView}
            </View>
        )
    }

    loadingView() {
        return (
            <View style={{width: GlobalStyles.window_width, height: GlobalStyles.window_height, position: 'absolute'}}>
                <LoadingProgressView ref='loadingView' msg="发送中"/>
            </View>
        )
    }

    onBack() {
        this.blurProcess();
        super.onBack();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.backgroundColor,
    },

    text_class: {
        marginLeft: GlobalStyles.scaleSize(24),
        width: GlobalStyles.scaleSize(140),
        fontSize: GlobalStyles.setSpText(11),
    },

    view_class: {
        width: GlobalStyles.window_width,
        height: GlobalStyles.scaleSize(96),
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
    },

    input_class: {
        height: GlobalStyles.scaleSize(96),
        fontSize: GlobalStyles.setSpText(11),
        flex: 1,
        textAlign: 'left',
        alignSelf: 'center'
    },

    line_class: {
        height: 0.5,
        left: GlobalStyles.scaleSize(24),
        backgroundColor: '#c3c3c3'
    },

    need_text: {
        margin: GlobalStyles.scaleSize(24),
        color: GlobalStyles.startColor,
    }
})