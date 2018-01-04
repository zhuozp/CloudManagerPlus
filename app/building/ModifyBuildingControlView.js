/**
 * Created by zhuozhipeng on 31/8/17.
 */
import React from 'react'

import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Image,
    TouchableOpacity,
    TextInput,
} from 'react-native'

import BaseView from '../common/widget/BaseView'
import BuildingItem from './model/BuildingItem'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import GlobalStyles from '../../res/style/GlobalStyles'
import BuildingPicView from './ImagePicView'
import StringUtils from '../util/StringUtils'
import DataManager from '../manager/DataManager'
import BuildingRegCheckUtils from './BuildingRegCheckUtils'
import URLConstances from '../constances/URLConstances'
import KeyConstances from '../constances/KeyConstances'
import JsonProcessUtils from '../util/JsonProcessUtils'
import ImageCropPicker from 'react-native-image-crop-picker'

export default class ModifyBuildingControlView extends BaseView {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();
        this.tempItem = new BuildingItem(this.props.buildingItem);
        this.item = new BuildingItem(this.props.buildingItem);
        this.addImageUrl = [];

        var netImg = !!this.item.buildingImageUrl ? this.item.buildingImageUrl.length : 0;
        var localImg = this.addImageUrl.length;
        this.state = {
            buildingImgUrl: !!this.item.buildingImageUrl && this.item.buildingImageUrl.length > 0 ? this.item.buildingImageUrl[0] : null,
            searchDisable: true,
            searchPlace: this.item.buildingName,
            address: this.item.address,
            manageFee: !!this.item.manageFee ? this.item.manageFee.toString() : '',
            parkingLot: !!this.item.manageFee ? this.item.parkingLot.toString() : '',
            layout:this.item.layout,

            phone: '',
            name: '',
            isLoading:false,

            imgCount:  netImg + localImg,
        }
        super.navBarTitle('楼宇修改');
    }
    
    navBarRightView() {
        return (
            <TouchableHighlight
                underlayColor='transparent'
                style={{padding: 8}}
                onPress={() => {
                    this.uploadData();
                }}>
                <Text style={{fontSize: GlobalStyles.nav_bar_fontsize, color: '#ffffff'}}>提交</Text>
            </TouchableHighlight>
        )
    }

    uploadData() {
        if (JSON.stringify(this.tempItem) === JSON.stringify(this.item) && this.addImageUrl.length <= 0) {
            super.showToast('没做任何修改');
            return;
        }

        if (BuildingRegCheckUtils.buildingAddCanSave(this.refs.toast, this.item)) {
            this.addBuildToServer();
        }
    }

    addBuildToServer() {
        let imgary = [];
        if (!!this.addImageUrl && this.addImageUrl.length > 0) {
            for (let i = 0; i < this.addImageUrl.length; i++) {
                if (StringUtils.isNotEmpty(this.addImageUrl[i])) {
                    imgary.push(this.addImageUrl[i]);
                }
            }

        }
        super.setLoadingView(true);
        this.dataManager.uploadDataWithFromData(URLConstances.building_modify_url,
            {body: this.dataManager.fromData(imgary, JsonProcessUtils.mergeJsonWithLogin(this.item))})
            .then((data) => {
                super.setLoadingView(false);
                console.log(data);
                if (!!data) {
                    if (data.code === 0) {
                        if (typeof (this.props.successCallback) === 'function') {
                            this.props.successCallback();
                        }
                        const routes = this.props.navigator.state.routeStack;
                        let destinationRoute = '';
                        for (let i = routes.length - 1; i >= 0; i--) {
                            if(routes[i].name === 'MainView'){
                                destinationRoute = this.props.navigator.getCurrentRoutes()[i]
                                break;
                            }
                        }
                        this.props.navigator.popToRoute(destinationRoute);
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

    contentRender() {
        let image = (!!this.state.buildingImgUrl && this.state.buildingImgUrl.length > 0) ?
            <Image style={styles.img_class} source={{uri: this.state.buildingImgUrl}}/> :
            <Image style={styles.img_class} source={require('../../res/images/building/ic_add_building_picture_96.png')}/>

        return (
        <View>
            <KeyboardAwareScrollView style={styles.container}>
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
                    }}>修改基本信息</Text>
                </View>
                <View ref='buildingName' style={styles.view_class}>
                    <Text style={styles.text_class}>楼宇名:</Text>
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

                        }}
                        clearButtonMode={'never'}
                        value={this.state.searchPlace}
                    />
                </View>
                <View style={styles.line_class}/>
                <View style={styles.view_class}>
                    <Text style={styles.text_class}>地址:</Text>
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

                        }}
                        clearButtonMode={'never'}
                        multiline={true}
                        value={this.state.address}
                    />
                </View>
                <View style={styles.line_class}/>
                <TouchableHighlight
                    onPress={() => this.imageBtnClick()}
                    underlayColor='transparent'
                >
                <View style={[styles.view_class,
                    {
                        height: GlobalStyles.scaleSize(140), justifyContent: 'space-between', borderBottomColor: '#c3c3c3',
                        borderBottomWidth: 0.5,
                    }]}>
                    <Text style={styles.text_class}>楼宇照片:</Text>
                    <View>
                        {image}
                        {this.state.imgCount <= 0 ? null :
                        <View style={{position:'absolute', top: GlobalStyles.scaleSize(66),right:GlobalStyles.scaleSize(16),
                            height:GlobalStyles.scaleSize(42),borderBottomLeftRadius:GlobalStyles.scaleSize(8), borderBottomRightRadius:GlobalStyles.scaleSize(8),
                            width:GlobalStyles.scaleSize(108), alignItems:'center', justifyContent:'center',
                            backgroundColor:'rgba(0,0,0,0.5)'}}>
                            <Text style={{fontSize: GlobalStyles.setSpText(12), color:'#fff'}}>{'共' + this.state.imgCount + '张'}</Text>
                        </View>}
                    </View>
                </View>
                </TouchableHighlight>

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
                    }}>修改额外信息</Text>
                </View>
                <View style={styles.view_class}>
                    <Text style={styles.text_class}>管理费:</Text>
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

                        }}
                        keyboardType='numeric'
                        value={this.state.manageFee}
                        clearButtonMode={'never'}
                    />
                    <Text style={styles.right_txt}>元/m²</Text>
                </View>
                <View style={styles.line_class}/>
                <View style={styles.view_class}>
                    <Text style={styles.text_class}>停车位:</Text>
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

                        }}
                        clearButtonMode={'never'}
                        value={this.state.parkingLot}
                    />
                    <Text style={styles.right_txt}>个</Text>
                </View>
                <View style={styles.line_class}/>
                <View style={styles.view_class}>
                    <Text style={styles.text_class}>标准层:</Text>
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

                        }}
                        clearButtonMode={'never'}
                        value={this.state.layout}
                    />
                    <Text style={styles.right_txt}>m</Text>
                </View>
                <View style={[styles.line_class, {left:0}]}/>
            </KeyboardAwareScrollView>
        </View>
        )
    }

    imageBtnClick() {
        var tempImg = [];
        var i = 0;
        for (i = 0; !!this.item.buildingImageUrl && i < this.item.buildingImageUrl.length; i++) {
            tempImg.push(this.item.buildingImageUrl[i]);
        }

        for (i = 0; i < this.addImageUrl.length; i++) {
            tempImg.push(this.addImageUrl[i]);
        }
        this.props.navigator.push({
            component: BuildingPicView,
            name: 'BuildingPicView',
            params: {
                imageUrl: tempImg,
                from:'BuildingPicView',
                addImgCallback: (imgurl)=>{
                    this.addImageUrl.push(imgurl);
                    let currentImg = !!this.item.buildingImageUrl && this.item.buildingImageUrl.length > 0 ? this.item.buildingImageUrl[0] :
                        !!this.addImageUrl && this.addImageUrl.length > 0 ? this.addImageUrl[0] : null;
                    this.setState({
                        imgCount: this.item.buildingImageUrl.length + this.addImageUrl.length,
                        buildingImgUrl:currentImg,
                    })
                },
                deleteImgUrl: (imgurl)=> {
                    var item;
                    if (imgurl.startsWith('http')) {
                        item = this.item.buildingImageUrl;
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

                    let currentImg = !!this.item.buildingImageUrl && this.item.buildingImageUrl.length > 0 ? this.item.buildingImageUrl[0] :
                                            !!this.addImageUrl && this.addImageUrl.length > 0 ? this.addImageUrl[0] : null;
                    this.setState({
                        imgCount: this.item.buildingImageUrl.length + this.addImageUrl.length,
                        buildingImgUrl:currentImg,
                    })
                }
            }
        })
    }

    outContainerClick() {
        if (!!this.refs.roomPrefInput) {
            this.refs.roomPrefInput.blur();
        }

        if (!!this.refs.nameInput) {
            this.refs.nameInput.blur();
        }

        if (!!this.refs.phoneInput) {
            this.refs.phoneInput.blur();
        }

        if (!!this.refs.buildInput) {
            this.refs.buildInput.blur();
        }

        if (!!this.refs.addressInput) {
            this.refs.addressInput.blur();
        }

        if (!!this.refs.manageFeeInput) {
            this.refs.manageFeeInput.blur();
        }

        if (!!this.refs.parkingLotInput) {
            this.refs.parkingLotInput.blur();
        }

        if (!!this.refs.layoutInput) {
            this.refs.layoutInput.blur();
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
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
        height: 1,
        left: GlobalStyles.scaleSize(24),
        backgroundColor: '#c3c3c3'
    },

    img_class: {
        width: GlobalStyles.scaleSize(108),
        height: GlobalStyles.scaleSize(108),
        borderRadius: GlobalStyles.scaleSize(8),
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