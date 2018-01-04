/**
 * Created by zhuozhipeng on 16/8/17.
 */
import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    FlatList,
    Image,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native'

import GlobalStyles from '../../res/style/GlobalStyles'
import StringUtils from '../util/StringUtils'
import NavigationBar from '../common/widget/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import BaseCommon from '../common/BaseCommon'
import LoadingProgressView from '../common/widget/LoadingProgressView'
import DataManager from '../manager/DataManager'
import URLConstances from '../constances/URLConstances'
import JsonProcessUtils from '../util/JsonProcessUtils'
import Toast from 'react-native-easy-toast'
import ToastUtils from '../util/ToastUtils'
import BaseView from '../common/widget/BaseView'

export default class BatchRoomsEditView extends BaseView {
    constructor(props) {
        super(props);
        this.rooms = [];
        this.dataManager = new DataManager();
        let selectArray = [];
        var i = 1;
        let session = Math.ceil(this.props.totalRoom / 4);
        this.totalSession = session;
        let flagArray = [];
        for (; i <= this.props.totalFloor; i++) {
            selectArray.push(false);
            flagArray[i-1] = [];
            for (let j = 0; j < session; j++) {
                flagArray[i-1][j] = [];
                for (let k = 0; k < 4 && (j * 4 + k) < this.props.totalRoom; k++) {
                    flagArray[i-1][j].push(false);
                }
            }
        }

        this.state = {
            selectArray: selectArray,
            flagArray: flagArray,
            isLoading:false,
            disable:false,
        };

        super.navBarTitle('确认房号');
    }

    navBarRightView() {
        return this.getRightNavBtn();
    }

    genData() {
        let data = [];
        for (let i = 1; i <= this.props.totalFloor; i++) {
            data.push(i);
        }

        return data;
    }

    onBack() {
        this.props.navigator.pop();
    }

    contentRender() {
        var data = this.genData();
        return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={this._renderItem}
            />
        </View>
        )
    }

    loadingView() {
        return(
            <View style={{width:GlobalStyles.window_width, height:GlobalStyles.window_height, position:'absolute'}}>
                <LoadingProgressView ref = 'loadingView' msg="提交中"/>
            </View>
        )
    }

    getRightNavBtn() {
        return (
            <TouchableOpacity
                disable={this.state.disable}
                style={{padding:GlobalStyles.scaleSize(16)}}
                onPress={()=> {
                    this.uploadItem();
                }}>
                <Text style={{fontSize: GlobalStyles.nav_bar_fontsize, color: '#ffffff'}}>提交</Text>
            </TouchableOpacity>
        )
    }


    uploadItem() {
        this.setState({
            disabled:true,
        })
        let pre = !this.props.roomPref ? '' : this.props.roomPref;
        var str = '';
        for (let index = 0; index < this.props.totalFloor; index++) {
            for (let i = 0; i < this.totalSession; i++) {
                for (let j = 0; j < 4 && (i * 4 + j) < this.props.totalRoom; j++) {
                    if (this.state.flagArray[index][i][j]) {
                        str = StringUtils.pad(i * 4 + j + 1,2);
                        str = pre + (index + 1) + str;
                        this.rooms.push(str);
                    }
                }
            }
        }

        if(!!this.props.AddBuildingControlView && !!this.props.AddBuildingControlView.item) {
            this.props.AddBuildingControlView.item.rooms = this.rooms;
            super.setLoadingView(true);
            let imgary = [];
            if (!!this.props.AddBuildingControlView.state.buildingImgUrl && this.props.AddBuildingControlView.state.buildingImgUrl.length > 0) {
                imgary.push(this.props.AddBuildingControlView.state.buildingImgUrl);
            }
            this.dataManager.uploadDataWithFromData(URLConstances.building_add_url,
                {body: this.dataManager.fromData(imgary, JsonProcessUtils.mergeJsonWithLogin(this.props.AddBuildingControlView.item))})
                .then((data)=> {
                    super.setLoadingView(false);
                    console.log(data);
                    this.setState({
                        isLoading:false,
                        disable:false,
                    })
                    if (!!data) {
                        if (data.code === 0) {
                            if (typeof(this.props.callback) === 'function') {
                                // this.onBack();
                                // this.props.callback();
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
                            }
                        } else {
                            ToastUtils.toast(this.refs.toast, data.msg ? data.msg : '提交失败，请重试');
                        }
                    } else {
                        ToastUtils.toast(this.refs.toast, '提交失败，请重试')
                    }
                })
                .catch((error)=> {
                    super.setLoadingView(false);
                    this.setState({
                        disable:false,
                    })
                    console.log(error);
                    ToastUtils.toast(this.refs.toast, '提交失败，请重试')
                })
        }
    }

    processBtnClick(floor, session, i){
        this.state.flagArray[floor][session][i] = !this.state.flagArray[floor][session][i];

        // 房号选中与否的逻辑处理，相应修改全选与否按钮
        var flag = false;
        for (let i = 0; i < this.totalSession; i++) {
            for (let j = 0; j < 4 && (i * 4 + j) < this.props.totalRoom; j++) {
                if (this.state.flagArray[floor][i][j]) {
                    flag = true;
                    break;
                }
            }
        }

        this.state.selectArray[floor] = flag;

        this.setState({
            flagArray:this.state.flagArray,
            selectArray:this.state.selectArray,
        })
    }

    _renderItem = (item) => {
        let floorNum = item.item + '层';
        let sessionImage = this.state.selectArray[item.index] ?
            <Image style={styles.session_img_cls} source={require('../../res/images/building/ic_select_2_44.png')}/> :
            <Image style={styles.session_img_cls} source={require('../../res/images/building/ic_select_44.png')}/>

        let session = Math.floor(this.props.totalRoom / 4);
        var viewGroup = [];
        var oneLineGroup = [];
        var str = '';
        var i = 0;
        var j = 0;
        var linekey =  item.item + 'floor';
        for (; i < session ; i++) {
            for (let j = 0; j < 4; j++) {
                str = StringUtils.pad(i * 4 + j + 1,2)
                str = item.item + str;
                oneLineGroup.push(
                    <TouchableOpacity
                        key={str}
                        onPress={this.processBtnClick.bind(this, item.index, i, j)}>
                        <View
                            style={[styles.btn_cls, this.state.flagArray[item.index][i][j] ? {backgroundColor: GlobalStyles.nav_bar_backgroundColor} : null]}>
                            <Text
                                style={[styles.btn_text_cls, this.state.flagArray[item.index][i][j] ? {color: '#ffffff'} : null]}>{str}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }

            var oneLineView = (<View key={{linekey} + i} style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                {
                    oneLineGroup.map((elem, index) => {
                        return elem;
                    })
                }
            </View>)
            viewGroup.push(oneLineView);
            oneLineGroup.length = 0;
        }

        for (i = session * 4; i < this.props.totalRoom; i++) {
            str = StringUtils.pad(i + 1,2)
            str = item.item + str;
            var j = i - 4 * session;
            oneLineGroup.push(
                <TouchableOpacity
                    key={str}
                    onPress={this.processBtnClick.bind(this, item.index, session, j)}>
                    <View
                        style={[styles.btn_cls, this.state.flagArray[item.index][session][j] ? {backgroundColor: GlobalStyles.nav_bar_backgroundColor} : null]}>
                        <Text
                            style={[styles.btn_text_cls, this.state.flagArray[item.index][session][j] ? {color: '#ffffff'} : null]}>{str}</Text>
                    </View>
                </TouchableOpacity>
            )
        }


        if (oneLineGroup.length > 0) {
            var oneLineView = (<View  key={{linekey} + session} style={{flexDirection:'row', alignItems:'center', left:6}}>
                {
                    oneLineGroup.map((elem, index) => {
                        return elem;
                    })
                }
            </View>)
            viewGroup.push(oneLineView);
            oneLineGroup.length = 0;
        }


        return (
        <TouchableWithoutFeedback onPress={()=>{}}>
            <View style={{backgroundColor: GlobalStyles.backgroundColor}}>
                <View style={styles.session_cls}>
                    <Text style={styles.session_text_cls}>{floorNum}</Text>
                    <TouchableOpacity onPress={this.sessionSelectBtnClick.bind(this, item.index)}>
                        {sessionImage}
                    </TouchableOpacity>
                </View>

                <View style={[styles.content_cls]}>
                    {
                        viewGroup.map((elem, index) => {
                            return elem;
                        })
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>
        )
    }

    sessionSelectBtnClick(floorIndex) {
        this.state.selectArray[floorIndex] = !this.state.selectArray[floorIndex];

        for (let i = 0; i < this.totalSession; i++) {
            for (let j = 0; j < 4 && (i * 4 + j) < this.props.totalRoom; j++) {
                this.state.flagArray[floorIndex][i][j] = this.state.selectArray[floorIndex];
            }
        }

        this.setState({
            selectArray: this.state.selectArray,
            flagArray: this.state.flagArray,
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:GlobalStyles.backgroundColor,
        width:GlobalStyles.window_width,
    },

    session_cls: {
        height: GlobalStyles.scaleSize(76),
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#ffffff'
    },

    session_text_cls: {
        color:'#000000',
        left:GlobalStyles.scaleSize(24),
    },

    session_img_cls: {
        marginRight: GlobalStyles.scaleSize(24),
        width:GlobalStyles.scaleSize(52),
        height:GlobalStyles.scaleSize(52),
        padding:GlobalStyles.scaleSize(8),
    },

    content_cls: {
        paddingTop:GlobalStyles.scaleSize(24),
        paddingBottom:GlobalStyles.scaleSize(24),
        backgroundColor:'#f4f4f4',
        width:GlobalStyles.window_width,
    },

    btn_cls: {
        height:GlobalStyles.scaleSize(96),
        width: Math.ceil((GlobalStyles.window_width - 12) / 4),
        backgroundColor:'#ffffff',
        borderWidth:GlobalStyles.scaleSize(12),
        borderColor:'#f4f4f4',
        borderRadius:GlobalStyles.scaleSize(16),
        justifyContent:'center',
        alignItems:'center',
    },

    btn_text_cls: {
        color:'#000000',
    }
})