/**
 * Created by Gibbon on 2017/8/20.
 */

import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
    Switch,
    TextInput,
    ToastAndroid,
    TouchableWithoutFeedback,
    Alert,
    InteractionManager,
} from 'react-native'

import BaseCommon from '../common/BaseCommon'
import GlobalStyles from '../../res/style/GlobalStyles'
import ViewUtils from '../util/ViewUtils'
import NavigationBar from '../common/widget/NavigationBar'
import ImagePicker from 'react-native-image-picker'
import ContactsWrapper from 'react-native-contacts-wrapper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PickerManager from '../picker/PickerManager'
import DateUtils from '../util/DateUtils'
import RoomItem from './model/RoomItem'
import UserInfo from '../um/model/UserInfo'
import RoomPicView from './ImagePicView'
import BaseView from '../common/widget/BaseView'
import StringUtils from '../util/StringUtils'
import {RadioGroup, RadioButton,} from 'react-native-flexi-radio-button'
import LessorListView from '../um/relation/lessor/LessorListView'
import JsonProcessUtils from '../util/JsonProcessUtils'
import DataManager from '../manager/DataManager'
import KeyConstances from '../constances/KeyConstances'
import URLConstances from '../constances/URLConstances'
import LoadingProgressView from '../common/widget/LoadingProgressView'
import ImageShowModal from './ImageShowModal'
import ContactDetailView from '../contact/ContactDetailView'
import ImageCropPicker from 'react-native-image-crop-picker'

var dismissKeyboard = require('dismissKeyboard');

export default class RoomDetailView extends BaseView {
    constructor(props) {
        super(props);
        let isAdd = !!this.props.isAdd && this.props.isAdd ? true : false;
        this.add = isAdd;
        this.dataManager = new DataManager();
        this.pickerManager = new PickerManager();
        this.roomItem = new RoomItem(this.props.item);
        this.tempItem = new RoomItem(this.props.item);
        this.roomItem.buildingName = this.props.buildingName;
        this.tempItem.buildingName = this.props.buildingName;
        this.roomItem.buildingId = this.props.buildingId;
        this.tempItem.buildingId = this.props.buildingId;
        this.addImageUrl = [];
        var date = new Date();

        var startDate = [];
        if (isAdd || !this.roomItem.startTime || this.roomItem.startTime.length <= 0) {
            startDate.push(date.getFullYear() + "年");
            startDate.push(date.getMonth() + 1 + "月");
            startDate.push(date.getDate() + "日");
        } else {
            startDate = DateUtils.getDateArrayWithStr(this.roomItem.startTime)
        }
        this.startDate = startDate;

        var agreementDate = [];
        if (isAdd || !this.roomItem.agreementTime || this.roomItem.agreementTime.length <= 0) {
            agreementDate.push(date.getFullYear() + "年");
            agreementDate.push(date.getMonth() + 1 + "月");
            agreementDate.push(date.getDate() + "日");
        } else {
            agreementDate = DateUtils.getDateArrayWithStr(this.roomItem.agreementTime)
        }
        this.agreementDate = agreementDate;

        var endDate = [];
        if (isAdd || !this.roomItem.endTime || this.roomItem.endTime.length <= 0) {
            endDate = DateUtils.getDateArray([date.getFullYear(), date.getMonth(), date.getDate()], 1)
        } else {
            endDate = DateUtils.getDateArrayWithStr(this.roomItem.endTime)
        }
        this.endDate = endDate;

        var statTime = DateUtils.getDataStrWithArray(startDate);
        var endTime = DateUtils.getDataStrWithArray(endDate);
        var agreementTime = DateUtils.getDataStrWithArray(agreementDate);

        this.tempItem.agreementTime = agreementTime;
        this.tempItem.startTime = statTime;
        this.tempItem.endTime = endTime;
        this.state = {
            imageModalVisible:false,
            roomImgUrl:!!this.tempItem.roomImageUrl && this.tempItem.roomImageUrl.length > 0 ? this.tempItem.roomImageUrl[0] : null,
            contactSwitchIsOn: this.tempItem.hasContact,
            switchIsOn: this.roomItem.isLet,
            editableSwitch: isAdd,

            item:this.tempItem,
            // startDate: statTime,
            // endDate:endTime,
            // agreementDate:agreementTime,

            imgCount: (!!this.roomItem.roomImageUrl && this.roomItem.roomImageUrl.length > 0) ? this.roomItem.roomImageUrl.length : 0,

            areaStr: this.tempItem.area + '',
            priceStr: this.tempItem.price + '',
            manageFeeStr: this.tempItem.manageFee + '',
            guaranteeMonthStr: this.tempItem.guaranteeMonth + '',
            electricFeeStr: this.tempItem.electricFee + '',
            freePeriodStr: this.tempItem.freePeriod + '',
            increaseRateStr: this.tempItem.increaseRate + '',
        }

        super.navBarTitle('房间详情');
        if (this.add) {
            super.navBarTitle('添加房间');
        }
    }

    navBarRightView() {
        let label = this.state.editableSwitch ? '完成' : '编辑';
        return (
            <TouchableOpacity
                underlayColor='transparent'
                style={{padding: 8}}
                onPress={() => {
                    this.hiddenPicker();
                    if ('编辑' === label) {
                        this.setState({
                            editableSwitch:true,
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
        if (!StringUtils.isNotEmpty(this.tempItem.roomNo)) {
            super.showToast('房间号不能为空');
            return;
        }

        if (!this.tempItem.area || this.tempItem.area === 0) {
            super.showToast('面积不能为空');
            return;
        }

        if (typeof (this.tempItem.price) === 'undefined') {
            super.showToast('租金不能为空');
            return;
        }


        if (this.state.contactSwitchIsOn) {
            if (this.tempItem.lessee === 0 && !StringUtils.isNotEmpty(this.tempItem.tenant)) {
                super.showToast('承租方公司不能为空');
                return;
            }

            if (!StringUtils.isNotEmpty(this.tempItem.tenantName)) {
                super.showToast(this.tempItem.lessee === 0 ? '承租方法人代表不能为空' : '个人代表不能为空');
                return;
            }

            if (!StringUtils.isNotEmpty(this.tempItem.tenantAddress)) {
                super.showToast('承租方地址不能为空');
                return;
            }

            if (!StringUtils.isNotEmpty(this.tempItem.tenantMandator)) {
                super.showToast('承租方委托人不能为空');
                return;
            }

            if (!StringUtils.isNotEmpty(this.tempItem.tenantMobile)) {
                super.showToast('承租方委托人电话不能为空');
                return;
            }

            if (typeof (this.tempItem.guaranteeMonth) === 'undefined') {
                super.showToast('租赁保证金月数不能为空');
                return;
            }

            if (typeof (this.tempItem.electricFee) === 'undefined') {
                super.showToast('首页水电保证金不能为空');
                return;
            }

            if (!StringUtils.isNotEmpty(this.state.item.lessorName)) {
                super.showToast('出租方法定代表人不能为空');
                return;
            }

            if (!StringUtils.isNotEmpty(this.state.item.lessorMobile)) {
                super.showToast('出租方电话不能为空');
                return;
            }

            if (!StringUtils.isNotEmpty(this.state.item.acountName)) {
                super.showToast('出租方开户名不能为空');
                return;
            }

            if (!StringUtils.isNotEmpty(this.state.item.acountNum)) {
                super.showToast('出租方银行账号不能为空');
                return;
            }
        }



        var url = URLConstances.room_modify_url;

        if (!this.add) {
            if (JSON.stringify(this.tempItem) === JSON.stringify(this.roomItem) && this.addImageUrl.length <= 0) {
                super.showToast('没做任何修改');
                return;
            }
        } else {
            if (JSON.stringify(this.tempItem) === JSON.stringify(this.roomItem)) {
                super.showToast('没做任何修改');
                return;
            }
            url = URLConstances.room_add_url;
        }

        let imgary = [];
        if (!!this.addImageUrl && this.addImageUrl.length > 0) {
            for (let i = 0; i < this.addImageUrl.length; i++) {
                if (StringUtils.isNotEmpty(this.addImageUrl[i])) {
                    imgary.push(this.addImageUrl[i]);
                }
            }

        }

        super.setLoadingView(true);
        this.dataManager.uploadDataWithFromData(url,
            {body: this.dataManager.fromData(imgary, JsonProcessUtils.mergeJsonWithLogin(this.tempItem))})
            .then((data) => {
                super.setLoadingView(false);
                console.log(data);
                if (!!data) {
                    if (data.code === 0) {
                        if (!this.state.contactSwitchIsOn) {
                            super.onBack();
                        } else {
                            this.genContact(data.msg);
                        }
                        InteractionManager.runAfterInteractions(()=> {
                            if (typeof (this.props.successCallback) === 'function') {
                                this.props.successCallback();
                            }
                        })
                    } else {
                        super.showToast(data.msg ? data.msg : '提交失败，请重试');
                    }
                } else {
                    super.showToast('提交失败，请重试')
                }
            })
            .catch((error) => {
                super.setLoadingView(false);
                console.log(error);
                super.showToast('提交失败，请重试')
            })
    }

    genContact(msg) {
        if (!!msg && StringUtils.isNotEmpty(msg.buildingId) && StringUtils.isNotEmpty(msg.roomId)) {
            super.setLoadingView(true);
            this.dataManager.fetchDataFromNetwork(URLConstances.contact_gen_url, false, {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin(msg))})
                .then((data)=> {
                    super.setLoadingView(false);
                    if (!!data && data.code === 0) {
                        super.onBack();
                        InteractionManager.runAfterInteractions(()=> {
                            if (typeof (this.props.successCallback) === 'function') {
                                this.props.successCallback();
                            }
                        })
                    } else {
                        super.showToast(!!data && !!data.msg ? data.msg : '合同创建失败，请重新提交创建');
                    }
                })
                .catch((error)=> {
                    super.showToast('合同创建失败，请重新提交创建');
                    super.setLoadingView(false);
                })
        } else {
            super.showToast('合同创建失败，请重新提交创建');
        }
    }


    callback() {
        this.setState({
            imageModalVisible:false,
        })
    }

    contentRender() {
        let imageView = this.state.imageModalVisible ?
            <ImageShowModal
                ref='imageShowModal'
                callback={this.callback.bind(this)}
                imagesUrls = {this.roomItem.roomImageUrl}
            /> : null;

        let image = StringUtils.isNotEmpty(this.state.roomImgUrl) ?
            <Image style={styles.img_class} source={{uri: this.state.roomImgUrl}}/> :
            <Image style={styles.img_class} source={require('../../res/images/building/ic_picture_96.png')}/>

        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView>
                    <TouchableWithoutFeedback onPress={()=>{
                        this.hiddenPicker();
                        this.blurProcess();
                    }}>
                    <View style={{backgroundColor:GlobalStyles.backgroundColor, width:GlobalStyles.window_width}}>
                        {/*<View style={[styles.view_class, {justifyContent: 'space-between', height:42, borderBottomColor: '#c3c3c3',*/}
                            {/*borderBottomWidth: 0.5}]}>*/}
                            {/*<Text style={[styles.text_class, {width: 180}]}>打开右侧开关可进行编辑</Text>*/}
                            {/*<Switch*/}
                                {/*style={styles.switch_class}*/}
                                {/*onValueChange={(value) => {*/}

                                    {/*this.setState({editableSwitch: value});*/}
                                {/*}}*/}
                                {/*value={this.state.editableSwitch} />*/}
                        {/*</View>*/}

                        <View style={{height: GlobalStyles.scaleSize(64), backgroundColor:GlobalStyles.backgroundColor, justifyContent:'center'}}>
                            <Text style={{fontSize:GlobalStyles.setSpText(12), color:'#818181', marginTop:GlobalStyles.scaleSize(24), left:GlobalStyles.scaleSize(24), flex:1}}>基本信息</Text>
                        </View>

                        {this.getItem('房号：', 'labelInput', '请输入房号', this.state.item.roomNo, true, null,
                            (text)=> {
                                this.tempItem.roomNo = text;
                                this.setState({
                                    item: this.tempItem,
                                })
                            })}
                        <View style={styles.line_class}/>

                        {this.getItem('房间名：', 'aliasInput', '请输入房间名', this.state.item.roomName, false, null,
                            (text)=> {
                                this.tempItem.roomName = text;
                                this.setState({
                                    item: this.tempItem,
                                })
                            })}
                        <View style={styles.line_class}/>

                        {this.getItem('面积：', 'areaInput', '请输入面积', this.state.areaStr, true, 'm²',
                            (text)=> {
                                var result = StringUtils.numOrDot(text);

                                this.setState({
                                    areaStr: result,
                                })
                                if (StringUtils.isNotEmpty(result)) {
                                    this.tempItem.area = parseFloat(result);
                                } else {
                                    this.tempItem.area = 0;
                                }
                            }, 'numeric')}
                        <View style={styles.line_class}/>

                        {this.getItem('租金：', 'priceInput', '请输入租金', this.state.priceStr + '', true, '元/m²',
                            (text)=> {
                                var result = StringUtils.numOrDot(text);

                                this.setState({
                                    priceStr: result,
                                })
                                if (StringUtils.isNotEmpty(result)) {
                                    this.tempItem.price = parseFloat(result);
                                } else {
                                    this.tempItem.price = 0;
                                }
                            }, 'numeric')}
                        <View style={styles.line_class}/>

                        {this.getItem('管理费：', 'manageFeeInput', '请输入管理费', this.state.manageFeeStr, false, '元/m²',
                            (text)=> {
                                var result = StringUtils.numOrDot(text);

                                this.setState({
                                    manageFeeStr: result,
                                })
                                if (StringUtils.isNotEmpty(result)) {
                                    this.tempItem.manageFee = parseFloat(result);
                                } else {
                                    this.tempItem.manageFee = 0;
                                }
                            }, 'numeric')}
                        <View style={styles.line_class}/>

                        <TouchableOpacity
                            onPress={() => this.imageBtnClick()}
                            underlayColor='transparent'
                        >
                            <View style={[styles.view_class,
                                {
                                    height: GlobalStyles.scaleSize(140), justifyContent: 'space-between',
                                }]}>
                                <Text style={styles.text_class}>房间照片：</Text>
                                <View>
                                    {image}
                                    {
                                        this.state.imgCount !== 0 ?
                                        <View style={{position:'absolute', top: GlobalStyles.scaleSize(66),right:GlobalStyles.scaleSize(16),
                                            height:GlobalStyles.scaleSize(42),borderBottomLeftRadius:GlobalStyles.scaleSize(8), borderBottomRightRadius:GlobalStyles.scaleSize(8),
                                            width:GlobalStyles.scaleSize(108), alignItems:'center', justifyContent:'center',
                                            backgroundColor:'rgba(0,0,0,0.5)'}}>
                                            <Text style={{fontSize: GlobalStyles.setSpText(11), color:'#fff'}}>{'共' + this.state.imgCount + '张'}</Text>
                                        </View> : null
                                    }

                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.line_class, {left:0}]}/>


                        <View style={{height: GlobalStyles.scaleSize(64), backgroundColor:GlobalStyles.backgroundColor, justifyContent:'center'}}>
                            <Text style={{fontSize:GlobalStyles.setSpText(12), color:'#818181', marginTop:GlobalStyles.scaleSize(24), left:GlobalStyles.scaleSize(24), flex:1}}>出租信息</Text>
                        </View>
                        <View style={[styles.view_class, {justifyContent: 'space-between', height:GlobalStyles.scaleSize(84),}]}>
                            <Text style={[styles.text_class, {width: GlobalStyles.scaleSize(250)}]}>是否已出租：</Text>
                            <Switch
                                disabled={!this.state.editableSwitch}
                                style={styles.switch_class}
                                onValueChange={(value) => {
                                    this.hiddenPicker();
                                    this.blurProcess();

                                    if (this.roomItem.isLet) {
                                        Alert.alert(
                                            '',
                                            '该房间目前为出租状态，是否设置为未出租',
                                            [
                                                {text: '取消', onPress: () => {
                                                    this.setState({switchIsOn: true});
                                                }},
                                                {text: '确认', onPress: () => {
                                                    this.tempItem.isLet = value;
                                                    this.setState({switchIsOn: value});
                                                }},
                                            ]
                                        )
                                    } else {
                                        this.tempItem.isLet = value;
                                        this.setState({switchIsOn: value});
                                    }
                                }}
                                value={this.state.switchIsOn} />
                        </View>

                        {this.state.switchIsOn ? this.normalTenantContent() : null}
                        {this.state.switchIsOn ? this.tenantContent() : null}

                        {this.state.switchIsOn ?
                            <View>
                                <View style={{height: GlobalStyles.scaleSize(64), backgroundColor:GlobalStyles.backgroundColor, justifyContent:'center'}}>
                                    <Text style={{fontSize:GlobalStyles.setSpText(12), color:'#818181', marginTop:GlobalStyles.scaleSize(24), left:GlobalStyles.scaleSize(24), flex:1}}>合同需额外信息</Text>
                                </View>
                                <View style={[styles.view_class, {
                                    justifyContent: 'space-between',
                                    height: GlobalStyles.scaleSize(84),
                                }]}>
                                    <Text style={[styles.text_class, {width: GlobalStyles.scaleSize(250)}]}>是否创建合同：</Text>
                                    <Switch
                                        disabled={!this.state.editableSwitch}
                                        style={styles.switch_class}
                                        onValueChange={(value) => {
                                            this.hiddenPicker();
                                            this.blurProcess();
                                            this.tempItem.isLet = value;
                                            this.setState({contactSwitchIsOn: value});
                                        }}
                                        value={this.state.contactSwitchIsOn}/>
                                </View>
                                <View style={{backgroundColor:GlobalStyles.backgroundColor, height:GlobalStyles.scaleSize(24)}}/>
                            </View> : null}
                        {this.state.contactSwitchIsOn ? this.lessorContent() : null}
                        {this.state.contactSwitchIsOn && this.roomItem.hasContact ?
                            <View style={{width:GlobalStyles.window_width}}>
                                <TouchableOpacity onPress={()=> {
                                    this.props.navigator.push({
                                        name:'ContactDetailView',
                                        component:ContactDetailView,
                                        params: {
                                            url: this.roomItem.contractUrl,
                                            item: this.roomItem,
                                        }
                                    })
                                }}>
                                    <Text style={{padding: GlobalStyles.scaleSize(8),
                                        paddingLeft:GlobalStyles.scaleSize(24), color:GlobalStyles.nav_bar_backgroundColor, fontSize:GlobalStyles.setSpText(12)}}>点击查看合同</Text>
                                </TouchableOpacity>

                                <View style={{backgroundColor:GlobalStyles.backgroundColor, height:GlobalStyles.scaleSize(24)}}/>
                            </View> : null}
                    </View>
                    </TouchableWithoutFeedback>
                </KeyboardAwareScrollView>
                {imageView}
            </View>
        )
    }

    getItem(title, ref, placeholder, stateValue, needText, rightText, onChangeText, keyboardType) {
        let rightView = StringUtils.isNotEmpty(rightText) ? <Text style={styles.right_txt}>{rightText}</Text> : null;
        let needView = needText ? this.getStarView() : null;
        return (
            <View style={styles.view_class}>
                <Text style={styles.text_class}>{title}</Text>
                <TextInput
                    ref={ref}
                    style={styles.input_class}
                    placeholder={placeholder}
                    placeholderTextColor={'#D7DBDC'}
                    underlineColorAndroid='transparent'
                    onChangeText={onChangeText}
                    clearButtonMode={'never'}
                    editable={this.state.editableSwitch}
                    value={stateValue}
                    onFocus={() => {
                        this.hiddenPicker();
                    }}
                    keyboardType={StringUtils.isNotEmpty(keyboardType) ? keyboardType : 'default'}
                />
                {needView}
                {rightView}
            </View>
        )
    }

    getStarView() {
        let content = this.state.editableSwitch ? <Text style={styles.need_start_txt}>*</Text> : null;
        return content;
    }

    normalTenantContent() {
        return (
            <View>
                <View style={{backgroundColor:GlobalStyles.backgroundColor, height:GlobalStyles.scaleSize(24)}}/>
                <View style={[styles.view_class, {justifyContent: 'space-between'}]}>
                    <Text style={[styles.text_class,{width:GlobalStyles.scaleSize(160)}]}>签约时间:</Text>
                    <TouchableOpacity
                        onPress={this.selectDateClick.bind(this, '签约')}
                        underlayColor='transparent'
                        style={{flex: 1}}
                        disabled = {!this.state.editableSwitch}
                    >
                        <View style={{flexDirection:'row', justifyContent:'flex-end', alignItems:'center', right: GlobalStyles.scaleSize(8)}}>
                            <Text style={{fontSize: GlobalStyles.setSpText(12), marginRight:GlobalStyles.scaleSize(16)}}>{this.state.item.agreementTime}</Text>
                            {this.state.editableSwitch ? <Image style={{width: GlobalStyles.scaleSize(32), height:GlobalStyles.scaleSize(32),
                                margin: GlobalStyles.scaleSize(16), marginLeft:0}} source={require('../../res/images/common/ic_forword.png')}/> : null}
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.line_class}/>
                <View style={[styles.view_class, {justifyContent: 'space-between'}]}>
                    <Text style={[styles.text_class,{width:GlobalStyles.scaleSize(160)}]}>起租时间:</Text>
                    <TouchableOpacity
                        onPress={this.selectDateClick.bind(this, '起租')}
                        underlayColor='transparent'
                        style={{flex: 1}}
                        disabled = {!this.state.editableSwitch}
                    >
                        <View style={{flexDirection:'row', justifyContent:'flex-end', alignItems:'center', right: GlobalStyles.scaleSize(8)}}>
                            <Text style={{fontSize: GlobalStyles.setSpText(12), marginRight:GlobalStyles.scaleSize(16)}}>{this.state.item.startTime}</Text>
                            {this.state.editableSwitch ? <Image style={{width: GlobalStyles.scaleSize(32), height:GlobalStyles.scaleSize(32),
                                margin: GlobalStyles.scaleSize(16), marginLeft:0}} source={require('../../res/images/common/ic_forword.png')}/> : null}
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.line_class}/>
                <View style={[styles.view_class, {justifyContent: 'space-between'}]}>
                    <Text style={[styles.text_class,{width:GlobalStyles.scaleSize(160)}]}>到租时间：</Text>
                    <TouchableOpacity
                        onPress={this.selectDateClick.bind(this, '到租')}
                        underlayColor='transparent'
                        style={{flex: 1}}
                        disabled = {!this.state.editableSwitch}
                    >
                        <View style={{flexDirection:'row', justifyContent:'flex-end', alignItems:'center', right: GlobalStyles.scaleSize(8)}}>
                            <Text style={{fontSize: GlobalStyles.setSpText(12), marginRight:GlobalStyles.scaleSize(16)}}>{this.state.item.endTime}</Text>
                            {this.state.editableSwitch ? <Image style={{width: GlobalStyles.scaleSize(32), height:GlobalStyles.scaleSize(32),
                                margin: GlobalStyles.scaleSize(16), marginLeft:0}} source={require('../../res/images/common/ic_forword.png')}/> : null}
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.line_class}/>
                {this.getItem('租赁保证金：', 'guaranteeMonthInput', '请输入保证金(月数)', this.state.guaranteeMonthStr, this.state.contactSwitchIsOn && true, '月',
                    (text)=> {
                        var result = StringUtils.onlyNum(text);

                        this.setState({
                            guaranteeMonthStr: result,
                        })
                        if (StringUtils.isNotEmpty(result)) {
                            this.tempItem.guaranteeMonth = parseInt(result);
                        } else {
                            this.tempItem.guaranteeMonth = 0;
                        }
                    }, 'numeric')}
                <View style={styles.line_class}/>
                {this.getItem('首月水电费押金：', 'electricFeeInput', '请输入首月水电费押金', this.state.electricFeeStr, this.state.contactSwitchIsOn && true, '元',
                    (text)=> {

                        var result = StringUtils.numOrDot(text);

                        this.setState({
                            electricFeeStr: result,
                        })
                        if (StringUtils.isNotEmpty(result)) {
                            this.tempItem.electricFee = parseFloat(result);
                        } else {
                            this.tempItem.electricFee = 0;
                        }
                    }, 'numeric')}
                <View style={styles.line_class}/>
                {this.getItem('免租期：', 'freePeriodInput', '请输入免租期(月数)', this.state.freePeriodStr, this.state.contactSwitchIsOn && true, '月',
                    (text)=> {
                        var result = StringUtils.onlyNum(text);

                        this.setState({
                            freePeriodStr: result,
                        })
                        if (StringUtils.isNotEmpty(result)) {
                            this.tempItem.freePeriod = parseInt(result);
                        } else {
                            this.tempItem.freePeriod = 0;
                        }
                    }, 'numeric')}
                <View style={styles.line_class}/>
                {this.getItem('租金递增：', 'increaseRateInput', '请输入租金递增', this.state.increaseRateStr, this.state.contactSwitchIsOn && true, '%（百分比）',
                    (text)=> {

                        var result = StringUtils.numOrDot(text);

                        this.setState({
                            increaseRateStr: result,
                        })
                        if (StringUtils.isNotEmpty(result)) {
                            this.tempItem.increaseRate = parseFloat(result);
                        } else {
                            this.tempItem.increaseRate = 0;
                        }
                    }, 'numeric')}
                <View style={styles.line_class}/>
                <View style={[styles.view_class, {justifyContent: 'space-between'}]}>
                    <Text style={[styles.text_class, {width: GlobalStyles.scaleSize(200)}]}>每月还租日</Text>
                    <TouchableOpacity
                        onPress={() => this.selectPayDay()}
                        underlayColor='transparent'
                        style={{flex: 1}}
                        disabled = {!this.state.editableSwitch}
                    >
                        <View
                            style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', right: GlobalStyles.scaleSize(8)}}>
                            <Text style={{fontSize: GlobalStyles.setSpText(12)}}>{!!this.state.item.payDay ? this.state.item.payDay: '5'}</Text>
                            <Text style={{fontSize: GlobalStyles.setSpText(12), margin: GlobalStyles.scaleSize(16)}}>号</Text>
                            {this.state.editableSwitch ? <Image style={{width: GlobalStyles.scaleSize(32), height: GlobalStyles.scaleSize(32),
                                margin: GlobalStyles.scaleSize(16), marginLeft:0}} source={require('../../res/images/common/ic_forword.png')}/> : null}
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.line_class, {left:0}]}/>
            </View>
        )
    }

    tenantContent() {
        return (
            <View>
                <View style={{height: GlobalStyles.scaleSize(64), backgroundColor:GlobalStyles.backgroundColor, justifyContent:'center'}}>
                    <Text style={{fontSize:GlobalStyles.setSpText(12), color:'#818181', marginTop:GlobalStyles.scaleSize(24), left:GlobalStyles.scaleSize(24), flex:1}}>租赁方信息</Text>
                </View>
                <View style={{height:GlobalStyles.scaleSize(88), backgroundColor:'#fff', width:GlobalStyles.window_width, flexDirection:'row',alignItems:'center'}}>
                    <Text style={styles.text_class}>租赁方：</Text>
                    <RadioGroup
                        size={12}
                        onSelect = {(index, value) => {
                            this.tempItem.lessee = index + '';
                            this.setState({
                                item: this.tempItem,
                            })
                        }}
                        activeColor = {GlobalStyles.nav_bar_backgroundColor}
                        style={{flexDirection:'row', }}
                        selectedIndex = {(!!this.state.item && this.state.item.lessee === '1') ? 1 : 0}
                    >
                        <RadioButton value={'item1'} >
                            <Text style={{fontSize:GlobalStyles.setSpText(12)}}>公司租赁</Text>
                        </RadioButton>

                        <RadioButton value={'item2'}>
                            <Text style={{fontSize:GlobalStyles.setSpText(12)}}>个人租赁</Text>
                        </RadioButton>
                    </RadioGroup>
                </View>
                <View style={styles.line_class}/>

                {this.tempItem.lessee === '0' ?
                    <View>
                        {this.getItem('公司：', 'tenantInput', '请输入公司名', this.state.item.tenant, this.state.contactSwitchIsOn && true, null,
                            (text)=> {
                                this.tempItem.tenant = text;
                                this.setState({
                                    item: this.tempItem,
                                })
                            })}
                        <View style={styles.line_class}/>
                    </View> : null}
                {this.getItem(this.tempItem.lessee === '0' ?  '法人代表：' : '个人代表：', 'tenantNameInput',
                    this.tempItem.lessee === '0' ? '请输入法人代表' : '请输入个人代表', this.state.item.tenantName,
                    this.state.contactSwitchIsOn && true, null,
                    (text)=> {
                        this.tempItem.tenantName = text;
                        this.setState({
                            item: this.tempItem,
                        })
                    })}
                <View style={styles.line_class}/>
                {this.getItem('地址：', 'tenantAddressInput', '请输入地址', this.state.item.tenantAddress, this.state.contactSwitchIsOn && true, null,
                    (text)=> {
                        this.tempItem.tenantAddress = text;
                        this.setState({
                            item: this.tempItem,
                        })
                    })}
                <View style={styles.line_class}/>

                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <View style={{flex:1}}>
                        {this.getItem('委托人：', 'tenantMandatorInput', '请输入委托人', this.state.item.tenantMandator, this.state.contactSwitchIsOn && true, null,
                            (text)=> {
                                this.tempItem.tenantMandator = text;
                                this.setState({
                                    item: this.tempItem,
                                })
                            })}
                        <View style={[styles.line_class, {right:GlobalStyles.scaleSize(24)}]}/>

                        {this.getItem('电话：', 'tenantMobileInput', '请输入委托人电话', this.state.item.tenantMobile, this.state.contactSwitchIsOn && true, null,
                            (text)=> {
                                this.tempItem.tenantMobile = text;
                                this.setState({
                                    item: this.tempItem,
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

                                    this.tempItem.tenantMandator = contact.name;
                                    this.tempItem.tenantMobile = contact.phone;
                                    this.setState({
                                        item: this.tempItem,
                                    })
                                })
                                .catch((error) => {
                                    console.log("ERROR CODE: ", error.code);
                                    console.log("ERROR MESSAGE: ", error.message);
                                });
                        }}>
                            <View style={{alignItems:'center'}}>
                                <Image style={{width: GlobalStyles.scaleSize(40), height : GlobalStyles.scaleSize(40)}} source={require('../../res/images/building/ic_add_44.png')}/>
                                <Text style={{fontSize:GlobalStyles.setSpText(12), color: GlobalStyles.nav_bar_backgroundColor,}}>导入联系人</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.line_class, {left:0}]}/>
            </View>
        )
    }

    selectPayDay() {
        this.pickerManager._isPickerShow((status) => {
            if (status) {
                this.pickerManager._toggle()
            } else {
                let num = !!this.state.item.payDay ? this.state.item.payDay: 5;
                this.pickerManager._showNumPicker(31, num, (value) => {
                    this.tempItem.payDay = parseInt(value);
                    this.setState({
                        item: this.tempItem,
                    })
                }, () => {

                })
            }
        })
    }

    lessItemSelect(item) {
        this.tempItem = JsonProcessUtils.mergeJson(this.tempItem, item);
        this.setState({
            item: this.tempItem,
        })
    }

    lessorContent() {
        return (
            <View>
                <View style={{height: GlobalStyles.scaleSize(64), backgroundColor:GlobalStyles.backgroundColor, justifyContent:'space-between', flexDirection: 'row'}}>
                    <Text style={{fontSize:GlobalStyles.setSpText(12), color:'#818181', marginTop:GlobalStyles.scaleSize(24), left:GlobalStyles.scaleSize(24), flex:1}}>出租方信息</Text>
                    <TouchableOpacity
                        disabled = {!this.state.editableSwitch}
                        onPress={()=> {
                        this.hiddenPicker();
                        this.props.navigator.push({
                            name:'LessorListView',
                            component:LessorListView,
                            params: {
                                lessItemSelect: (item)=> {
                                    this.lessItemSelect(item);
                                }
                            }
                        })
                    }}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Image style={{width: GlobalStyles.scaleSize(40), height : GlobalStyles.scaleSize(40)}} source={require('../../res/images/building/ic_add_44.png')}/>
                            <Text style={{margin:GlobalStyles.scaleSize(24), marginLeft: GlobalStyles.scaleSize(12),
                                color: GlobalStyles.nav_bar_backgroundColor, fontSize:GlobalStyles.setSpText(12)}}>选择添加</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {this.getItem('出租方:', 'lessorInput', '如 易鸟科技有限公司', this.state.item.lessor, false, null,
                    (text)=> {
                        this.lessorItem.lessor = text;
                        this.setState({
                            item: this.lessorItem,
                        })})}
                <View style={styles.line_class}/>
                {this.getItem('法定代表人:', 'lessorNameInput', '如 林生', this.state.item.lessorName,this.state.contactSwitchIsOn && true, null,
                    (text)=> {
                        this.lessorItem.lessorName = text;
                        this.setState({
                            item: this.lessorItem,
                        })})}
                <View style={styles.line_class}/>
                {this.getItem('地址:', 'lessorAddressInput', '出租方地址', this.state.item.lessorAddress, false, null,
                    (text)=> {
                        this.lessorItem.lessorAddress = text;
                        this.setState({
                            item: this.lessorItem,
                        })})}
                <View style={styles.line_class}/>

                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <View style={{flex:1}}>
                        {this.getItem('出租方委托人：', 'lessorMandatorInput', '如 林生', this.state.item.lessorMandator, this.state.contactSwitchIsOn && true, null,
                            (text)=> {
                                this.tempItem.lessorMandator = text;
                                this.setState({
                                    item: this.tempItem,
                                })
                            })}
                        <View style={[styles.line_class, {right:GlobalStyles.scaleSize(24)}]}/>

                        {this.getItem('电话：', 'lessorMobileInput', '请输入委托人电话', this.state.item.lessorMobile, this.state.contactSwitchIsOn && true, null,
                            (text)=> {
                                this.tempItem.lessorMobile = text;
                                this.setState({
                                    item: this.tempItem,
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

                                    this.tempItem.lessorMandator = contact.name;
                                    this.tempItem.lessorMobile = contact.phone;
                                    this.setState({
                                        item: this.tempItem,
                                    })
                                })
                                .catch((error) => {
                                    console.log("ERROR CODE: ", error.code);
                                    console.log("ERROR MESSAGE: ", error.message);
                                });
                        }}>
                            <View style={{alignItems:'center'}}>
                                <Image style={{width: GlobalStyles.scaleSize(40), height : GlobalStyles.scaleSize(40)}} source={require('../../res/images/building/ic_add_44.png')}/>
                                <Text style={{fontSize:GlobalStyles.setSpText(12), color: GlobalStyles.nav_bar_backgroundColor,}}>导入联系人</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.line_class]}/>

                {/*<View style={{*/}
                    {/*height: GlobalStyles.scaleSize(64),*/}
                    {/*backgroundColor: GlobalStyles.backgroundColor,*/}
                    {/*justifyContent: 'center'*/}
                {/*}}>*/}
                    {/*<Text style={{*/}
                        {/*fontSize: GlobalStyles.setSpText(11),*/}
                        {/*color: '#818181',*/}
                        {/*marginTop: GlobalStyles.scaleSize(24),*/}
                        {/*left: GlobalStyles.scaleSize(24),*/}
                        {/*flex: 1*/}
                    {/*}}>添加收款账户信息</Text>*/}
                {/*</View>*/}
                {this.getItem('开户行:', 'openBankInput', '请输入开户行', this.state.item.openBank, false, null,
                    (text)=> {
                        this.lessorItem.openBank = text;
                        this.setState({
                            item: this.lessorItem,
                        })})}
                <View style={styles.line_class}/>
                {this.getItem('开户名:', 'accountNameInput', '请输入开户名', this.state.item.acountName, this.state.contactSwitchIsOn && true, null,
                    (text)=> {
                        this.lessorItem.acountName = text;
                        this.setState({
                            item: this.lessorItem,
                        })})}
                <View style={styles.line_class}/>
                {this.getItem('银行帐号:', 'accountDetailInput', '请银行帐号', this.state.item.acountNum, this.state.contactSwitchIsOn && true, null,
                    (text)=> {
                        this.lessorItem.acountNum = text;
                        this.setState({
                            item: this.lessorItem,
                        })}, 'numeric')}
                <View style={[styles.line_class, {left:0}]}/>
                <View style={{backgroundColor:GlobalStyles.backgroundColor, height:GlobalStyles.scaleSize(24)}}/>
            </View>
        )
    }

    hiddenPicker() {
        this.pickerManager._isPickerShow((status) => {
            if (status) {
                this.pickerManager._toggle()
            }
        })
    }

    outContainerClick() {
        this.hiddenPicker();
        this.blurProcess();
    }

    blurProcess() {
        dismissKeyboard();
    }

    selectDateClick(title) {


        // var date = new Date();
        // var dateStr = date.Format("yyyy-MM-dd");
        //
        // var array;
        //
        // if (!start) {
        //     array = DateUtils.getDateArray([date.getFullYear(), date.getMonth(), date.getDate(), 1])
        // } else {
        //     array = [];
        //     array.push(date.getFullYear() + "年");
        //     array.push(date.getMonth() + 1 + "月");
        //     array.push(date.getDate() + "日");
        // }
        var array;
        if ('签约' === title) {
            array = this.agreementDate;
        } else if ('起租' === title) {
            array = this.startDate;
        } else {
            array = this.endDate;
        }

        this.pickerManager._showDatePicker(array, (pickedValue)=> {
            if ('签约' === title) {
                this.endDate = pickedValue;
                this.tempItem.agreementTime = DateUtils.getDataStrWithArray(pickedValue);
            } else if ('起租' === title) {
                this.startDate = pickedValue;
                this.tempItem.startTime = DateUtils.getDataStrWithArray(pickedValue)
            } else {
                this.endDate = pickedValue;
                this.tempItem.endTime = DateUtils.getDataStrWithArray(pickedValue)
            }

            this.setState({
                item: this.tempItem,
            })
        }, () => {

        })
    }

    onBack() {
        dismissKeyboard();
        this.hiddenPicker();
        super.onBack();
    }

    imageBtnClick() {
        // this.selectPhotoTapped();
        this.hiddenPicker();
        this.blurProcess();

        if (!this.state.editableSwitch) {
            if (!this.roomItem || !this.roomItem.roomImageUrl || this.roomItem.roomImageUrl.length <= 0) return;
            if (!!this.refs.imageShowModal) {
                this.refs.imageShowModal.setVisible(true);
            }
            this.setState({
                imageModalVisible:true,
            })

            return;
        }


        var tempImg = [];
        var i = 0;
        for (i = 0; !!this.tempItem.roomImageUrl && i < this.tempItem.roomImageUrl.length; i++) {
            tempImg.push(this.tempItem.roomImageUrl[i]);
        }

        for (i = 0; i < this.addImageUrl.length; i++) {
            tempImg.push(this.addImageUrl[i]);
        }
        this.props.navigator.push({
            component: RoomPicView,
            name: 'RoomPicView',
            params: {
                imageUrl: tempImg,
                from:'RoomPicView',
                addImgCallback: (imgurl)=>{
                    this.addImageUrl.push(imgurl);
                    let currentImg = !!this.tempItem.roomImageUrl && this.tempItem.roomImageUrl.length > 0 ? this.tempItem.roomImageUrl[0] :
                        !!this.addImageUrl && this.addImageUrl.length > 0 ? this.addImageUrl[0] : null;
                    this.setState({
                        imgCount: (!!this.tempItem.roomImageUrl ? this.tempItem.roomImageUrl.length : 0) + this.addImageUrl.length,
                        roomImgUrl:currentImg,
                    })
                },
                deleteImgUrl: (imgurl)=> {
                    var item;
                    if (imgurl.startsWith('http')) {
                        item = this.tempItem.roomImageUrl;
                    } else {
                        item = this.addImageUrl;
                    }

                    var i = 0;
                    for (; i < item.length; i++) {
                        if (imgurl === item[i]) {
                            break;
                        }
                    }

                    if (i >= 0 && i < item.length) {
                        item.splice(i, 1);
                    }

                    let currentImg = !!this.tempItem.roomImageUrl && this.tempItem.roomImageUrl.length > 0 ? this.tempItem.roomImageUrl[0] :
                        !!this.addImageUrl && this.addImageUrl.length > 0 ? this.addImageUrl[0] : null;
                    this.setState({
                        imgCount: (!!this.tempItem.roomImageUrl ? this.tempItem.roomImageUrl.length : 0) + this.addImageUrl.length,
                        roomImgUrl:currentImg,
                    })
                }
            }
        })

        // this.props.navigator.push({
        //     component: RoomPicView,
        //     name: 'RoomPicView',
        //     params: {
        //         imageUrl: this.roomItem.roomImageUrl,
        //     }
        // })
    }

    loadingView() {
        return (
            <View style={{width: GlobalStyles.window_width, height: GlobalStyles.window_height, position: 'absolute'}}>
                <LoadingProgressView ref='loadingView' msg="发送中"/>
            </View>
        )
    }

    selectPhotoTapped() {
        const options = {
            title:'选择图片',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'从手机相册选择',
            cancelButtonTitle:'取消',
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true,
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    roomImgUrl: response.uri
                });
            }
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        ImageCropPicker.clean().then(() => {
            console.log('removed tmp images from tmp directory');
        }).catch(e => {

        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: GlobalStyles.backgroundColor,
    },

    txt_info_cls: {
        flex:1,
    },

    text_class: {
        marginLeft: GlobalStyles.scaleSize(24),
        width: GlobalStyles.scaleSize(140),
        fontSize: GlobalStyles.setSpText(11),
        color:GlobalStyles.titleColor,
    },

    view_class: {
        // width: GlobalStyles.window_width,
        flex:1,
        height: GlobalStyles.scaleSize(88),
        backgroundColor:'#ffffff',
        flexDirection:'row',
        alignItems:'center'
    },

    line_class: {
        height: 0.5,
        left:GlobalStyles.scaleSize(24),
        backgroundColor:'#c3c3c3'
    },

    img_class: {
        width: GlobalStyles.scaleSize(108),
        height: GlobalStyles.scaleSize(108),
        borderRadius: GlobalStyles.scaleSize(8),
        right: GlobalStyles.scaleSize(16),

        // marginTop:8,
        // marginBottom:8,
        // marginLeft:8,
        // marginRight:8,
    },

    switch_class: {
        marginRight:GlobalStyles.scaleSize(16),
    },

    input_class: {
        height: GlobalStyles.scaleSize(88),
        fontSize: GlobalStyles.setSpText(12),
        flex:1,
        textAlign:'left',
        alignSelf:'center',
        color:'#000'
    },

    right_txt: {
        padding:GlobalStyles.scaleSize(24),
        fontSize: GlobalStyles.setSpText(11),
    },

    need_start_txt: {
        padding:GlobalStyles.scaleSize(24),
        fontSize: GlobalStyles.setSpText(11),
        color: GlobalStyles.startColor,
    }
})