/**
 * Created by zhuozhipeng on 15/8/17.
 */


import React, {
    Component
} from 'react'

import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TextInput,
    Image,
    TouchableHighlight,
    Switch,
    TouchableOpacity,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native'

import GlobalStyles from '../../res/style/GlobalStyles'
import BaseCommon from '../common/BaseCommon'
import NavigationBar from '../common/widget/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import ImagePicker from 'react-native-image-picker'
import PickerManager from '../picker/PickerManager'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import BatchRoomsEditView from './BatchRoomsEditView'
import EditView from "../common/widget/EditView";
import DataManager from '../manager/DataManager'
import URLConstances from '../constances/URLConstances'
import KeyConstances from '../constances/KeyConstances'
import ToastUtils from '../util/ToastUtils'
import Toast, {DURATION} from 'react-native-easy-toast'
import BuildingSearchWithBaiduApiView from './BuildingSearchWithBaiduApiView'
import BuildingSearchWithBaiduApiModal from './BuildingSearchWithBaiduApiModal'
import BuildingSearchView from './BuildingSearchView'
import StringUtils from '../util/StringUtils'
import ContactsWrapper from 'react-native-contacts-wrapper'
import BuildingRegCheckUtils from './BuildingRegCheckUtils'
import buildingRequestItem from './BuildingRequestItem.json'
import JsonProcessUtils from '../util/JsonProcessUtils'
import LoadingProgressView from '../common/widget/LoadingProgressView'
import AddBuildingItem from './model/AddBuildingItem'
import BaseView from '../common/widget/BaseView'
import SubUserListView from '../um/subuser/SubUserListView'
import UmInfoInstance from '../um/UmInfoInstance'
import ImageCropPicker from 'react-native-image-crop-picker'
import ImagePickerView from '../picker/image/ImagePickerView'

var dismissKeyboard = require('dismissKeyboard');

export default class AddBuildingControlView extends BaseView {
    constructor(props) {
        super(props)
        this.dataManager = new DataManager();
        this.pickerManager = new PickerManager();
        this.positionReact = {};
        this.item = new AddBuildingItem();
        this.roomPref = '';
        this.state = {
            buildingImgUrl: '',
            switchIsOn: false,
            subIdSwitchIsOn: false,
            customFloor: false,
            totalFloor: 15,
            totalRoom: 8,
            searchDisable: false,
            city: '',
            searchPlace: '',
            address: '',
            citySelectColor: {color: '#D7DBDC'},
            isVisible: false,
            nameEditableInput: true,
            addressEditableInput: true,
            phone: '',
            name: '',
            isLoading:false,
            showImagePicker: false,
            tmpImage:null,
        }

        super.navBarTitle('添加楼宇');
        console.log(this.item);
    }

    navBarRightView() {
        return this.getRightNavBtn();
    }

    contentRender() {
        let image = (!!this.state.buildingImgUrl && this.state.buildingImgUrl.length > 0) ?
            <Image style={styles.img_class} source={{uri: this.state.buildingImgUrl}}/> :
            <Image style={styles.img_class} source={require('../../res/images/building/ic_add_building_picture_96.png')}/>

        let batchFloorContent = this.state.switchIsOn ?
            <View style={{
                borderBottomColor: '#c3c3c3',
                borderBottomWidth: 0.5
            }}>
                {/*{this.getBatchAddRoomView()}*/}
                <View style={{height: GlobalStyles.scaleSize(32), backgroundColor: GlobalStyles.backgroundColor}}/>
                <View style={[styles.view_class, {justifyContent: 'space-between'}]}>
                    <Text style={[styles.text_class, {width: GlobalStyles.scaleSize(160)}]}>总楼层</Text>
                    <TouchableOpacity
                        onPress={() => this.selectFloorClick()}
                        underlayColor='transparent'
                        style={{flex: 1}}
                    >
                        <View
                            style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', right: GlobalStyles.scaleSize(8)}}>
                            <Text style={{fontSize: GlobalStyles.setSpText(12)}}>{this.state.totalFloor}</Text>
                            <Image style={{width: GlobalStyles.scaleSize(32), height: GlobalStyles.scaleSize(32), margin: GlobalStyles.scaleSize(16)}}
                                   source={require('../../res/images/common/ic_forword.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.line_class}/>
                <View style={[styles.view_class, {justifyContent: 'space-between'}]}>
                    <Text style={[styles.text_class, {width: GlobalStyles.scaleSize(160)}]}>每层房间数</Text>
                    <TouchableOpacity
                        onPress={() => this.selectRoomClick()}
                        underlayColor='transparent'
                        style={{flex: 1}}
                    >
                        <View
                            style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', right: GlobalStyles.scaleSize(8)}}>
                            <Text style={{fontSize: GlobalStyles.setSpText(12)}}>{this.state.totalRoom}</Text>
                            <Image style={{width: GlobalStyles.scaleSize(32), height: GlobalStyles.scaleSize(32), margin: GlobalStyles.scaleSize(16)}}
                                   source={require('../../res/images/common/ic_forword.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.line_class}/>
                <View style={styles.view_class}>
                    <Text style={styles.text_class}>房号前缀</Text>
                    <TextInput
                        ref='roomPrefInput'
                        style={styles.input_class}
                        placeholder={'如 A'}
                        placeholderTextColor={'#D7DBDC'}
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => {
                            this.roomPref = text;
                        }}
                        onFocus={() => {
                            this.hiddenPicker();
                        }}
                        clearButtonMode={'never'}
                    />
                </View>
            </View> : null;

        // let subIdContent = this.state.subIdSwitchIsOn ?
        //     <View>
        //         <View style={{
        //             height: GlobalStyles.scaleSize(184), backgroundColor: '#ffffff',
        //             flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        //             borderBottomWidth: 0.5, borderBottomColor: '#c3c3c3'
        //         }}>
        //             <View style={{width: GlobalStyles.scaleSize(156), justifyContent: 'center', alignItems: 'center'}}>
        //                 <Image style={{width: GlobalStyles.scaleSize(84), height: GlobalStyles.scaleSize(84)}}
        //                        source={require('../../res/images/icon_contact.png')}/>
        //             </View>
        //             <View style={{flex: 1}}>
        //                 <View style={{flexDirection: 'row', height: GlobalStyles.scaleSize(90), alignItems: 'center'}}>
        //                     <Text style={styles.text_class}>姓名</Text>
        //                     <TextInput
        //                         ref='nameInput'
        //                         style={styles.input_class}
        //                         placeholder='请输入姓名'
        //                         placeholderTextColor={'#D7DBDC'}
        //                         underlineColorAndroid='transparent'
        //                         onChangeText={(text) => {
        //                             this.item.subUser.userName = text;
        //                             this.setState({
        //                                 name: text,
        //                             })
        //                         }}
        //                         onFocus={() => {
        //                             this.hiddenPicker();
        //                         }}
        //                         value={this.state.name}
        //                         clearButtonMode={'never'}
        //                         editable={false}
        //                     />
        //                 </View>
        //                 <View style={[styles.line_class, {height: 0.5}]}/>
        //                 <View style={{flexDirection: 'row', height: GlobalStyles.scaleSize(90), alignItems: 'center'}}>
        //                     <Text style={styles.text_class}>电话</Text>
        //                     <TextInput
        //                         ref='phoneInput'
        //                         style={styles.input_class}
        //                         placeholder='请输入电话'
        //                         placeholderTextColor={'#D7DBDC'}
        //                         underlineColorAndroid='transparent'
        //                         onChangeText={(text) => {
        //                             this.item.subUser.mobile = text;
        //                             this.setState({
        //                                 phone: text,
        //                             })
        //                         }}
        //                         onFocus={() => {
        //                             this.hiddenPicker();
        //                         }}
        //                         value={this.state.phone}
        //                         clearButtonMode={'never'}
        //                         editable={false}
        //                     />
        //                 </View>
        //             </View>
        //         </View>
        //         <View style={{height: GlobalStyles.scaleSize(32), backgroundColor: GlobalStyles.backgroundColor}}/>
        //     </View>
        //
        //     : null;
        {/*<BuildingSearchWithBaiduApiView*/
        }
        {/*ref='search'*/
        }
        {/*selectSearchResult={(item) => this.selectSearchResult.bind(this, item)}*/
        }
        {/*city={this.state.city}*/
        }
        {/*searchPlace={this.searchPlace}*/
        }
        {/*anchorView = {this.refs.buildingName}*/
        }
        {/*/>*/
        }

        // this.computeReact();
        // let popoSearchView = this.state.isVisible ?
        //     <BuildingSearchWithBaiduApiModal anchorView = {this.refs.buildingName}/>
        //     : null;
        return (
                <KeyboardAwareScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                    <TouchableWithoutFeedback onPress={()=> {
                        dismissKeyboard();
                    }}>
                        <View>
                            {this.state.tmpImage}
                            <View style={{height: GlobalStyles.scaleSize(24), backgroundColor: GlobalStyles.backgroundColor}}/>
                            <View style={styles.view_class}>
                                <Text style={styles.text_class}>所在城市</Text>
                                <TouchableOpacity onPress={() => this.showCity()}>
                                    <View style={{
                                        height: GlobalStyles.scaleSize(96),
                                        width: GlobalStyles.window_width - GlobalStyles.scaleSize(140),
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={[this.state.citySelectColor]}>
                                            {(!!this.state.city && this.state.city.length > 0) ? this.state.city : '如 深圳'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.line_class}/>
                            <View ref='buildingName' style={styles.view_class}>
                                <Text style={styles.text_class}>楼宇名</Text>
                                <TextInput
                                    ref='buildInput'
                                    style={styles.input_class}
                                    placeholder={'如 科兴科学院B座'}
                                    placeholderTextColor={'#D7DBDC'}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => {
                                        this.item.buildingName = text;
                                        this.item.location.lat = 0;
                                        this.item.location.lng = 0;
                                        this.setState({
                                            searchPlace: text,
                                        })
                                    }}
                                    onFocus={() => {
                                        this.hiddenPicker();
                                    }}
                                    clearButtonMode={'never'}
                                    editable={this.state.nameEditableInput}
                                    value={this.state.searchPlace}
                                />
                                {this.rightSearchView()}
                            </View>
                            <View style={styles.line_class}/>
                            <View style={styles.view_class}>
                                <Text style={styles.text_class}>地址</Text>
                                <TextInput
                                    ref='addressInput'
                                    style={styles.input_class}
                                    placeholder={'如 科技园科兴科学院B座'}
                                    placeholderTextColor={'#D7DBDC'}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => {
                                        this.item.address = text;
                                        this.setState({
                                            address: text,
                                        })
                                    }}
                                    onFocus={() => {
                                        this.hiddenPicker();
                                    }}
                                    clearButtonMode={'never'}
                                    multiline={true}
                                    editable={this.state.addressEditableInput}
                                    value={this.state.address}
                                    textAlignVertical='center'
                                />
                            </View>
                            <View style={styles.line_class}/>
                            <View style={[styles.view_class,
                                {
                                    height: GlobalStyles.scaleSize(140), justifyContent: 'space-between', borderBottomColor: '#c3c3c3',
                                    borderBottomWidth: 0.5,
                                }]}>
                                <Text style={styles.text_class}>楼宇照片</Text>
                                <TouchableOpacity
                                    onPress={() => this.imageBtnClick()}
                                    underlayColor='transparent'
                                >
                                    {image}
                                </TouchableOpacity>
                            </View>

                            <View style={{
                                height: 32,
                                backgroundColor: GlobalStyles.backgroundColor,
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    fontSize: 13,
                                    color: '#818181',
                                    marginTop: 12,
                                    left: 12,
                                    flex: 1
                                }}>添加额外信息(非必填项)</Text>
                            </View>
                            <View style={styles.view_class}>
                                <Text style={styles.text_class}>管理费</Text>
                                <TextInput
                                    ref='manageFeeInput'
                                    style={[styles.input_class, {flex:1}]}
                                    placeholder={'如 50'}
                                    placeholderTextColor={'#D7DBDC'}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => {
                                        var result = StringUtils.numOrDot(text);
                                        this.setState({
                                            manageFee: result,
                                        })
                                        this.item.manageFee = parseFloat(result);
                                    }}
                                    onFocus={() => {
                                        this.hiddenPicker();
                                    }}
                                    keyboardType='numeric'
                                    value={this.state.manageFee}
                                    clearButtonMode={'never'}
                                />
                                <Text style={styles.right_txt}>元/m²</Text>
                            </View>
                            <View style={styles.line_class}/>
                            <View style={styles.view_class}>
                                <Text style={styles.text_class}>停车位</Text>
                                <TextInput
                                    ref='parkingLotInput'
                                    style={styles.input_class}
                                    placeholder={'如 1200'}
                                    placeholderTextColor={'#D7DBDC'}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => {
                                        var result = StringUtils.onlyNum(text);
                                        this.setState({
                                            parkingLot:result,
                                        })
                                        if (StringUtils.isNotEmpty(result)) {
                                            this.item.parkingLot = parseInt(result);
                                        }
                                    }}
                                    keyboardType='numeric'
                                    onFocus={() => {
                                        this.hiddenPicker();
                                    }}
                                    clearButtonMode={'never'}
                                    value={this.state.parkingLot}
                                />
                                <Text style={styles.right_txt}>个</Text>
                            </View>
                            <View style={styles.line_class}/>
                            <View style={styles.view_class}>
                                <Text style={styles.text_class}>标准层</Text>
                                <TextInput
                                    ref='layoutInput'
                                    style={styles.input_class}
                                    placeholder={'如 4.5'}
                                    placeholderTextColor={'#D7DBDC'}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => {
                                        var result = StringUtils.numOrDot(text);

                                        this.setState({
                                            layout: result,
                                        })

                                        if (StringUtils.isNotEmpty(result)) {
                                            this.item.layout = parseFloat(result);
                                        }
                                    }}
                                    keyboardType='numeric'
                                    onFocus={() => {
                                        this.hiddenPicker();
                                    }}
                                    clearButtonMode={'never'}
                                    value={this.state.layout}
                                />
                                <Text style={styles.right_txt}>m</Text>
                            </View>
                            <View style={[styles.line_class, {left:0}]}/>

                            <View style={{
                                height: 32,
                                backgroundColor: GlobalStyles.backgroundColor,
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    fontSize: 13,
                                    color: '#818181',
                                    marginTop: 12,
                                    left: 12,
                                    flex: 1
                                }}>可以快速批量添加房号</Text>
                            </View>
                            <View style={[styles.view_class, {
                                justifyContent: 'space-between', height: GlobalStyles.scaleSize(84), borderBottomColor: '#c3c3c3',
                                borderBottomWidth: 0.5
                            }]}>
                                <Text style={[styles.text_class, {width: GlobalStyles.scaleSize(300)}]}>批量添加房号</Text>
                                <Switch
                                    style={styles.switch_class}
                                    onValueChange={(value) => {
                                        this.hiddenPicker();
                                        this.setState({switchIsOn: value});
                                    }}
                                    value={this.state.switchIsOn}/>
                            </View>
                            {batchFloorContent}
                            <View style={{height: 16, backgroundColor: GlobalStyles.backgroundColor}}/>
                            {/*<TouchableOpacity onPress={()=>{*/}
                            {/*this.selectSubId();*/}
                            {/*}}>*/}
                            {/*<View style={[styles.view_class, {*/}
                            {/*justifyContent: 'space-between', height: 42, borderBottomColor: '#c3c3c3',*/}
                            {/*borderBottomWidth: 0.5*/}
                            {/*}]}>*/}
                            {/*<Text style={[styles.text_class, {width: 90}]}>{this.state.subIdSwitchIsOn ? '修改子账号' : '添加子账号'}</Text>*/}
                            {/*<Image style={{marginRight:14, width: 32, height: 32}} source={require('../../res/images/ic_tiaozhuan.png')}/>*/}
                            {/*</View>*/}
                            {/*</TouchableOpacity>*/}
                            {/*{subIdContent}*/}
                        </View>
                    </TouchableWithoutFeedback>
                    {this.state.showImagePicker ? <ImagePickerView ref='imagePickerView' imagePickerCallback={()=> {this.imagePickerCallback()}}
                                                                   takePhotoClick={()=>this.takePhotoClick()} selectPicture={()=>this.selectPicture()}/> : null}
                </KeyboardAwareScrollView>
        )
    }

    imagePickerCallback() {
        this.setState({
            showImagePicker: false,
        })

        // this.forceUpdate();
    }

    // selectSubId() {
    //     this.props.navigator.push({
    //         name:'SubUserListView',
    //         component:SubUserListView,
    //         params: {
    //             subUsers: UmInfoInstance.getInstance()._subUsers,
    //             selectSubUserCallback: (userInfo)=> {
    //                 this.item.subUser = userInfo;
    //                 this.setState({
    //                     subIdSwitchIsOn : true,
    //                     name: userInfo.userName,
    //                     phone:userInfo.mobile,
    //                 })
    //             }
    //         }
    //     })
    // }

    outContainerClick() {
        this.hiddenPicker();
        this.otherViewPressClick();
    }

    otherViewPressClick() {
        dismissKeyboard();
    }

    loadingView() {
        return (
            <View style={{width:GlobalStyles.window_width, height:GlobalStyles.window_height, position:'absolute'}}>
                <LoadingProgressView ref = 'loadingView' msg="提交中"/>
            </View>
        )
    }


    selectSearchResult(item) {
        if (!!item) {
            if (StringUtils.isNotEmpty(item.name) && StringUtils.isNotEmpty(item.address)) {
                this.item.buildingName = item.name;
                this.item.address = item.address;
                this.item.streetId = item.street_id;

                if (!!item.location) {
                    this.item.location = item.location;
                }
                this.setState({
                    searchPlace: item.name,
                    address: item.address,
                    nameEditableInput: false,
                    addressEditableInput: false,
                })
            }
        }
    }

    showCity() {
        dismissKeyboard();
        this.pickerManager._isPickerShow((status) => {
            if (status) {
                this.pickerManager._toggle()
            } else {
                let value = (!!this.state.city && this.state.city.length > 0) ? this.state.city : '深圳'
                this.pickerManager._showCitiesPicker(value, (value) => {
                    this.item.city = value[0];
                    this.setState({
                        city: value[0],
                        citySelectColor: {color: '#000'}
                    })
                }, () => {

                })
            }
        })
    }

    rightSearchView() {
        return (
            <TouchableOpacity
                onPress={() => this.search()}
                disabled={this.state.searchDisable}
            >
                <View
                    style={[styles.search_view_class]}
                >
                    <Text style={{color: '#ffffff'}}>{this.state.nameEditableInput ? '搜索' : '修改'}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    search() {
        // + '&region=' + '深圳'
        // if (!this.searchPlace || this.searchPlace.length <= 0) {
        //     ToastUtils.toast(this.refs.toast, '请输入搜索名称')
        //     return ;
        // }

        this.hiddenPicker();
        dismissKeyboard();

        if (!this.state.nameEditableInput) {
            this.setState({
                nameEditableInput: true,
                addressEditableInput: true,
            })
            return;
        }

        if (!this.state.city || this.state.city.length <= 0) {
            ToastUtils.toast(this.refs.toast, '请选择城市');
            return;
        }

        // this.setState({
        //     isVisible:true,
        // })
        //
        // var url = URLConstances.baidu_place_api + 'q=' + this.searchPlace  + '&region=' + this.state.city +
        //     '&output=json&ak=' + (Platform.OS == 'ios' ? KeyConstances.IOS_BAIDU_PLACE_KEY : KeyConstances.ANDROID_BAIDU_PLACE_KEY)
        //     + '&mcode=' + (Platform.OS == 'ios' ? KeyConstances.IOS_BAIDU_PLACE_CODE : KeyConstances.ANDROID_BAIDU_PLACE_MCODE)
        //     + '&page_num=' + 0;
        //
        // // var url = URLConstances.baidu_place_suggestion_api + 'query=' + this.searchPlace + '&region=' + '深圳' + '&city_limit=true&output=json&ak=' +
        // //     (Platform.OS == 'ios' ? KeyConstances.IOS_BAIDU_PLACE_KEY : KeyConstances.ANDROID_BAIDU_PLACE_KEY) +
        // //     '&mcode=' + (Platform.OS == 'ios' ? KeyConstances.IOS_BAIDU_PLACE_CODE : KeyConstances.ANDROID_BAIDU_PLACE_MCODE);
        //
        // this.dataManager.fetchDataFromNetwork(url, false, null)
        //     .then((data) => {
        //
        //     })
        //     .catch((error) => {
        //
        //     })
        // this.refs.search.open(this.state.city, this.searchPlace)
        this.props.navigator.push({
            component: BuildingSearchView,
            name: 'BuildingSearchView',
            params: {
                city: this.state.city,
                searchPlace: this.state.searchPlace,
                selectSearchResult: (item) => this.selectSearchResult(item),
            }
        })
    }


    computeReact() {
        if (!!this.refs.buildingImgUrl) {
            this.refs.buildingName.measure((ox, oy, width, height, px, py) => {
                this.positionReact = {x: px, y: py, width: width, height: height}
            });
        }

    }

    getRightNavBtn() {
        let label = this.state.switchIsOn ? '下一步' : '提交';
        let that = this;
        return (
            <TouchableOpacity
                underlayColor='transparent'
                style={{padding: 8}}
                onPress={() => {
                    this.hiddenPicker();

                    if (this.state.switchIsOn) {
                        if (BuildingRegCheckUtils.buildingAddCanNext(this.refs.toast, this.item)) {
                            this.props.navigator.push({
                                title: 'BatchRoomsEditView',
                                component: BatchRoomsEditView,
                                params: {
                                    totalFloor: this.state.totalFloor,
                                    totalRoom: this.state.totalRoom,
                                    roomPref: this.roomPref,
                                    ...this.props,
                                    AddBuildingControlView: that,
                                    callback: () => {
                                        this.onBack();
                                    },
                                    ...this.props,
                                },
                            })
                        }
                    } else {
                        if (BuildingRegCheckUtils.buildingAddCanSave(this.refs.toast, this.item)) {
                            this.addBuildToServer();
                        }
                    }
                }}>
                <Text style={{fontSize: GlobalStyles.nav_bar_fontsize, color: '#ffffff'}}>{label}</Text>
            </TouchableOpacity>
        )
    }

    addBuildToServer() {
        let imgary = [];
        if (!!this.state.buildingImgUrl && this.state.buildingImgUrl.length > 0) {
            imgary.push(this.state.buildingImgUrl);
        }
        super.setLoadingView(true);
        this.dataManager.uploadDataWithFromData(URLConstances.building_add_url,
            {body: this.dataManager.fromData(imgary, JsonProcessUtils.mergeJsonWithLogin(this.item))})
            .then((data) => {
                super.setLoadingView(false);
                console.log(data);
                if (!!data) {
                    if (data.code === 0) {
                        if (typeof (this.props.successCallback) === 'function') {
                            this.props.successCallback();
                        }
                        this.onBack();
                    } else {
                        ToastUtils.toast(this.refs.toast, data.msg ? data.msg : '提交失败，请重试');
                    }
                } else {
                    ToastUtils.toast(this.refs.toast, '提交失败，请重试')
                }
            })
            .catch((error) => {
                super.setLoadingView(false);
                console.log(error);
                ToastUtils.toast(this.refs.toast, '提交失败，请重试')
            })

        // this.dataManager.fetchDataFromNetwork(URLConstances.building_add_url, false,
        //     {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin(this.item))})
        //     .then((data) => {
        //         if (data.code === 0 && data.msg === 'ok') {
        //             this.onBack();
        //         } else {
        //             ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '提交失败，请重试');
        //         }
        //     })
        //     .catch((error) => {
        //         ToastUtils.toast(this.refs.toast, '提交失败，请重试');
        //     })
    }

    getBatchAddRoomView() {
        let name = this.state.customFloor ? '标准' : '自定义';
        let content = this.state.customFloor ?
            <TextInput
                ref='customFloorInput'
                style={[styles.input_class, {flex: 1}]}
                placeholder={'自定义总楼层，只能小于100'}
                placeholderTextColor={'#D7DBDC'}
                underlineColorAndroid='transparent'
                onChangeText={(text) => {
                    this.setState({text});
                    if (!!this.props.onChangeText) {
                        this.props.onChangeText(text);
                    }
                }}
                clearButtonMode={'never'}
            /> :
            <TouchableOpacity
                onPress={() => this.selectFloorClick()}
                underlayColor='transparent'
                style={{flex: 1}}
            >
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: GlobalStyles.setSpText(12), width: GlobalStyles.scaleSize(60), alignSelf: 'center'}}>{this.state.totalFloor}</Text>
                    <Image source={require('../../res/images/common/ic_code.png')}/>
                </View>
            </TouchableOpacity>;
        let right =
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        customFloor: !this.state.customFloor,
                    })
                }}
                underlayColor='transparent'>
                <Text style={{width: GlobalStyles.scaleSize(120), alignSelf: 'center', textAlign: 'right', right: GlobalStyles.scaleSize(28)}}>{name}</Text>
            </TouchableOpacity>

        return (
            <View style={[styles.view_class]}>
                <Text style={styles.text_class}>总楼层</Text>
                {content}
                {right}
            </View>
        )
    }

    selectFloorClick() {
        dismissKeyboard();
        this.pickerManager._isPickerShow((status) => {
            if (status) {
                this.pickerManager._toggle()
            } else {
                let num = this.state.totalFloor;
                this.pickerManager._showNumPicker(100, num, (value) => {
                    this.setState({
                        totalFloor: parseInt(value),
                    })
                }, () => {

                })
            }
        })
    }

    selectRoomClick() {
        dismissKeyboard();
        this.pickerManager._isPickerShow((status) => {
            if (status) {
                this.pickerManager._toggle()
            } else {
                let num = this.state.totalRoom;
                this.pickerManager._showNumPicker(15, num, (value) => {
                    this.setState({
                        totalRoom: parseInt(value),
                    })
                }, () => {

                })
            }
        })
    }

    hiddenPicker() {
        this.pickerManager._isPickerShow((status) => {
            if (status) {
                this.pickerManager._toggle()
            }
        })
    }

    hinddenKeyboard() {
        this.refs.buildInput.blur();
        this.refs.addressInput.blur();
    }

    batchAddRoomClick() {

    }

    imageBtnClick() {
        dismissKeyboard();
        this.selectPhotoTapped();
    }

    selectPhotoTapped() {
        this.hiddenPicker();

        // const options = {
        //     title: '选择图片',
        //     takePhotoButtonTitle: '拍照',
        //     chooseFromLibraryButtonTitle: '从手机相册选择',
        //     cancelButtonTitle: '取消',
        //     quality: 1.0,
        //     maxWidth: 750,
        //     maxHeight: 750,
        //     storageOptions: {
        //         skipBackup: true,
        //     }
        // };
        //
        // ImagePicker.showImagePicker(options, (response) => {
        //     console.log('Response = ', response);
        //
        //     if (response.didCancel) {
        //         console.log('User cancelled photo picker');
        //     }
        //     else if (response.error) {
        //         console.log('ImagePicker Error: ', response.error);
        //     }
        //     else if (response.customButton) {
        //         console.log('User tapped custom button: ', response.customButton);
        //     }
        //     else {
        //         // You can also display the image using data:
        //         // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        //         this.setState({
        //             buildingImgUrl: response.uri
        //         });
        //     }
        // });
        this.setState({
            showImagePicker:true,
        })
        if (!!this.refs.imagePickerView) {
            this.refs.imagePickerView.setVisible(true);
        }
    }

    takePhotoClick() {
        this.timer = setTimeout(()=> {
            let width = 750 >= GlobalStyles.window_width ? GlobalStyles.window_width : 750
            ImageCropPicker.openCamera({
                width:  Math.ceil(width),
                height: Math.ceil(width * 563 / 750),
                cropping: true
            }).then(image => {
                console.log(image);
                this.setState({
                    buildingImgUrl: image.path,
                });
            });
        }, 100)
    }

    selectPicture() {
        this.timer = setTimeout(
            () => {
                // this.selectPicture();
                let width = 750 >= GlobalStyles.window_width ? GlobalStyles.window_width : 750
                ImageCropPicker.openPicker({
                    width: Math.ceil(width),
                    height: Math.ceil(width * 563 / 750),
                    cropping: true,
                    loadingLabelText:'图片处理中'
                }).then(image => {
                    console.log(image);
                    this.setState({
                        buildingImgUrl: image.path,
                    });
                });
            },
            100
        );
    }


    onBack() {
        this.outContainerClick();
        super.onBack();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.timer && clearTimeout(this.timer)
        ImageCropPicker.clean().then(() => {
            console.log('removed tmp images from tmp directory');
        }).catch(e => {

        });
    }
}


const margin = GlobalStyles.scaleSize(24);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.backgroundColor,
    },

    text_class: {
        marginLeft: GlobalStyles.scaleSize(24),
        width: GlobalStyles.scaleSize(140),
        fontSize: GlobalStyles.setSpText(12),
        color:GlobalStyles.titleColor,
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
        fontSize: GlobalStyles.setSpText(12),
        flex: 1,
        textAlign: 'left',
        alignSelf: 'center'
    },

    line_class: {
        height: 0.5,
        left: GlobalStyles.scaleSize(24),
        backgroundColor: '#c3c3c3'
    },

    img_class: {
        width: GlobalStyles.scaleSize(108),
        height: GlobalStyles.scaleSize(108),
        borderRadius: GlobalStyles.scaleSize(8),
        marginTop: GlobalStyles.scaleSize(16),
        marginBottom: GlobalStyles.scaleSize(16),
        marginLeft: GlobalStyles.scaleSize(16),
        marginRight: GlobalStyles.scaleSize(16),
        right: GlobalStyles.scaleSize(16),
    },

    switch_class: {
        right: GlobalStyles.scaleSize(16),
        marginRight: GlobalStyles.scaleSize(16),
    },

    search_view_class: {
        height: GlobalStyles.scaleSize(64),
        width: GlobalStyles.scaleSize(120),
        borderRadius: GlobalStyles.scaleSize(8),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: GlobalStyles.scaleSize(24),
        backgroundColor: GlobalStyles.nav_bar_backgroundColor
    },

    right_txt: {
        padding:margin,
    }
})
