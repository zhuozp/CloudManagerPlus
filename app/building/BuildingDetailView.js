/**
 * Created by zhuozhipeng on 18/8/17.
 */


import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ListView,
    RefreshControl,
    Text,
    TouchableHighlight,
    ActivityIndicator,
    Alert,
    InteractionManager,
} from 'react-native';

import {
    SwipeListView,
    SwipeRow
} from 'react-native-swipe-list-view'

import GlobalStyles from '../../res/style/GlobalStyles'
import BaseCommon from '../common/BaseCommon'
import NavigationBar from '../common/widget/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import RoomDetailView from './RoomDetailView'
import BuildingRoom from '../test/BuildingRoom.json'
import URLConstances from '../constances/URLConstances'
import DataManager from '../manager/DataManager'
import BuildingItem from './model/BuildingItem'
import Toast from 'react-native-easy-toast'
import JsonProcessUtils from '../util/JsonProcessUtils'
import RoomItem from './model/RoomItem'
import ImageShowModal from './ImageShowModal'
import BaseView from '../common/widget/BaseView'
import ModifyBuildingControlView from './ModifyBuildingControlView'

export default class BuildingDetailView extends BaseView {
    constructor(props) {
        super(props)
        // this.common = new BaseCommon({...props, backPress: (e) => this.onBackPress(e)});

        this.item = new BuildingItem(this.props.item);

        this.dataManager =  new DataManager();
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2)=>row1 !== row2,
        });

        this.state = {
            dataSource: [],
            isLoading:true,
            isRefreshLoading:false,
            imageModalVisible : false,
            sharing:false,
            item: this.item,
        }

        this.needCallback = false;

        super.navBarTitle('楼宇详情')
    }


    // navBarRightView() {
    //     let cancleBtn = this.state.sharing ?
    //         <TouchableHighlight
    //             underlayColor='transparent'
    //             style={{padding: 8}}
    //             onPress={() => {
    //                 if (!!this.state.dataSource && this.state.dataSource.length > 0) {
    //                     for (let i = 0; i < this.state.dataSource; i++) {
    //                         this.state.dataSource[i].share = false;
    //                     }
    //                 }
    //                 this.setState({
    //                     sharing:false,
    //                     dataSource: this.state.dataSource,
    //                 })
    //             }}>
    //             <Text style={{fontSize: GlobalStyles.nav_bar_fontsize, color: '#ffffff'}}>取消</Text>
    //         </TouchableHighlight> : null;
    //     let label = this.state.sharing ? '确认' : '分享'
    //     return (
    //             <View style={{flexDirection:'row', alignItems:'center'}}>
    //                 {cancleBtn}
    //                 <TouchableHighlight
    //                     underlayColor='transparent'
    //                     style={{padding: 8}}
    //                     onPress={this.shareBtnClick.bind(this,label)}>
    //                     <Text style={{fontSize: GlobalStyles.nav_bar_fontsize, color: '#ffffff'}}>{label}</Text>
    //                 </TouchableHighlight>
    //             </View>
    //     )
    // }


    shareBtnClick(label) {
        if (label === '确认') {
            super.showShareView();
            return;
        }
        var canShareDirect = false;
        if (!!this.state.dataSource && this.state.dataSource.length > 0) {
            for (let i = 0; i < this.state.dataSource; i++) {
                if (this.state.dataSource[i].share) {
                    canShareDirect = true;
                    // 做处理
                    break;
                }
            }
        } else {
            canShareDirect = true;
        }

        if (canShareDirect) {
            super.showShareView();
        } else {
            Alert.alert(
                '添加房间信息到分享信息',
                '您是否需要分享具体房间信息?如果需要，请在下列房间列表中标记。',
                [
                    {text: '去标记', onPress: () => {
                        this.setState({
                            sharing:true,
                        })
                    }},
                    {text: '不需要', onPress: () => {
                        super.showShareView();
                    }},
                ]
            )
        }
    }

    contentRender() {
        // let navigatorBar =
        //     <NavigationBar
        //         navigator={this.props.navigator}
        //         leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
        //         style={{backgroundColor: GlobalStyles.nav_bar_backgroundColor}}
        //         popEnabled={true}
        //         title='楼宇详情'
        //     />

        // let loadingView = this.state.isLoading ?
        //     <View style={{position:'relative', flex:1, justifyContent:'center', alignItems:'center'}}>
        //         <ActivityIndicator
        //             style={styles.centering}
        //             animating={this.state.isLoading}
        //             size="large"
        //         />
        //     </View>: null;

        let imageView = this.state.imageModalVisible ?
            <ImageShowModal
                ref='imageShowModal'
                callback={this.callback.bind(this)}
                imagesUrls = {this.item.buildingImageUrl}
            /> : null;
        return (
            <View style={styles.container}>
                {/*{navigatorBar}*/}
                <View>
                    <SwipeListView
                        dataSource= {this.state.dataSource !== null ? this.ds.cloneWithRows(this.state.dataSource) : null}
                        renderRow={(e, secId, rowId, rowMap) => this.renderRow(e, secId, rowId, rowMap)}
                        renderFooter={()=> {
                            return <View style={{height: GlobalStyles.scaleSize(100)}}/>
                        }}
                        renderHeader={()=>{
                            return  this.headerView() ;
                        }}
                        enableEmptySections={true}

                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshLoading}
                                onRefresh={()=>this.onRefresh()}
                                tintColor={GlobalStyles.nav_bar_backgroundColor}
                                title="加载中..."
                                titleColor={GlobalStyles.nav_bar_backgroundColor}
                                colors={[GlobalStyles.nav_bar_backgroundColor, GlobalStyles.nav_bar_backgroundColor, GlobalStyles.nav_bar_backgroundColor]}
                            />
                        }
                    />
                    {/*{loadingView}*/}
                </View>
                {imageView}
                <Toast />
            </View>
        )
    }

    imageClick() {
        if (!!this.refs.imageShowModal) {
            this.refs.imageShowModal.setVisible(true);
        }
        this.setState({
            imageModalVisible:true,
        })
    }

    callback() {
        this.setState({
            imageModalVisible:false,
        })
    }

    deleteRow(secId, rowId, rowMap) {
        let roomItem = new RoomItem(this.state.dataSource[rowId]);
        rowMap[`${secId}${rowId}`].closeRow();

        if (!roomItem.buildingId) {
            roomItem.buildingId = this.item.buildingId;
        }

        Alert.alert(
            '',
            '删除该房号将同时删除该房间基本信息、租客信息以及合同等数据，请确认是否删除！',
            [
                {text: '保留楼宇', onPress: () => {

                }},
                {text: '确认', onPress: () => {
                    super.setLoadingView(true);
                    this.dataManager.fetchDataFromNetwork(URLConstances.room_delete_url, false,
                        {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({buildingId: roomItem.buildingId, roomId:roomItem.roomId}))})
                        .then((data)=> {
                            super.setLoadingView(false);
                            if (!!data && data.msg === 'ok') {
                                const newData = [...this.state.dataSource];
                                newData.splice(rowId, 1);

                                // if (!!this.props.mainView) {
                                //     this.props.mainView.needUpdate('homePageView');
                                // }
                                this.loadData(true);
                                this.setState({dataSource: newData});
                                super.showToast('已成功删除房间')
                            } else {
                                super.showToast(!!data.msg ? data.msg : '删除房间失败，请重试')
                            }
                        })
                        .catch((errpr)=> {
                            super.setLoadingView(false);
                            super.showToast('删除房间失败，请重试')
                        })
                }},
            ]
        )


    }

    renderRow(projectModel, secId, rowId, rowMap){
        let {navigator}=this.props;

        let item = new RoomItem(projectModel)
        if (!item.buildingId) {
            item.buildingId = this.item.buildingId;
        }
        var name = item.roomNo;
        let icon = item.share ? require('../../res/images/share/star_gold.png') :  require('../../res/images/share/star_grey.png')
        let shareImgSelected = this.state.sharing ?
            <TouchableOpacity onPress={()=> {
                this.state.dataSource[rowId].share = !this.state.dataSource[rowId].share;
                this.setState({
                    dataSource: this.state.dataSource,
                })
            }}>
                <Image style={{marginLeft: GlobalStyles.scaleSize(24), padding: GlobalStyles.scaleSize(20), width: GlobalStyles.scaleSize(48)}} source={icon}/>
            </TouchableOpacity>: null;
        return (
            <SwipeRow
                disableRightSwipe={true}
                leftOpenValue={75}
                rightOpenValue={-75}
            >
                <View style={styles.rowBack}>
                    <Text></Text>
                    <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ _ => this.deleteRow(secId, rowId, rowMap) }>
                        <Text style={styles.backTextWhite}>删除</Text>
                    </TouchableOpacity>
                </View>

                <TouchableHighlight
                    onPress={this.itemClick.bind(this, item)}
                    underlayColor={'#AAA'}

                >
                    <View style={styles.rowFront}>
                        <View style={{flex:1, justifyContent:'space-between',flexDirection:'row', alignItems:'center'}}>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                {shareImgSelected}
                                <Text style={{color:'#000', fontSize:GlobalStyles.setSpText(12), left: GlobalStyles.scaleSize(24)}}>{name}</Text>
                            </View>
                            <Text style={{color: item.isLet ?'#000' : '#ff4f48', fontSize:GlobalStyles.setSpText(12), right: GlobalStyles.scaleSize(24)}}>{!item.isLet ? '闲置' : '出租'}</Text>
                        </View>
                        <Image style={{alignSelf:'center', right: 0, width:GlobalStyles.scaleSize(30), height: GlobalStyles.scaleSize(30), marginRight:GlobalStyles.scaleSize(12)}} source={require('../../res/images/common/ic_forword.png')}/>
                    </View>
                </TouchableHighlight>
            </SwipeRow>
        );
    }

    itemClick(item) {
        this.props.navigator.push({
            name:'RoomDetailView',
            component:RoomDetailView,
            params:{
                buildingId: this.state.item.buildingId,
                item: item,
                buildingName: this.item.buildingName,
                successCallback: ()=> {
                    this.loadData(true);
                }
            }
        })
    }

    onRefresh() {
        this.loadData(true);
    }

    headerView() {
        let length = this.state.item.buildingImageUrl.length;
        let icon = (!!this.state.item.buildingImageUrl && length > 0 && !!this.state.item.buildingImageUrl[0]) ?
            <Image style={styles.header_img} source={{uri: this.state.item.buildingImageUrl[0]}}/> :
            <Image style={styles.header_img} source={require('../../res/images/building/ic_add_building_picture_96.png')}/>
        return (
            <View style={styles.header_container}>
                <View style={[styles.header_content]}>
                    <TouchableOpacity
                        disabled={length <= 0}
                        onPress={() => {
                        this.imageClick();
                    }}>
                        <View>
                            {icon}
                            {length <= 0 ? null :
                            <View style={{position:'absolute', top: GlobalStyles.scaleSize(62),marginLeft: GlobalStyles.scaleSize(24),
                                height:GlobalStyles.scaleSize(42),borderBottomLeftRadius:4, borderBottomRightRadius:4,
                                width:GlobalStyles.scaleSize(104), alignItems:'center', justifyContent:'center',
                                backgroundColor:'rgba(0,0,0,0.5)'}}>
                                <Text style={{fontSize: GlobalStyles.setSpText(12), color:'#fff'}}>{'共' + length + '张'}</Text>
                            </View>}
                        </View>
                    </TouchableOpacity>
                    <View style={styles.txt_content}>
                        <Text style={styles.txt_title}>{this.state.item.buildingName}</Text>
                        <Text style={styles.txt_address} numberOfLines={2}>{this.state.item.address}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>this.gotoModify()}>
                        <View style={{width:GlobalStyles.scaleSize(160), height:GlobalStyles.scaleSize(160), backgroundColor:'#fff',justifyContent:'center', alignItems:'center'}}>
                            <Image style={{width:GlobalStyles.scaleSize(98),height:GlobalStyles.scaleSize(98), alignSelf:'center'}} source={require('../../res/images/building/ic_buildingamend_98.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.line_class}/>

                <View style={styles.common_info_content}>
                    {this.getItem('总面积:', this.state.item.totalArea)}
                    {this.getItem('已出租:', this.state.item.lettedArea)}
                </View>
                <View style={styles.line_class}/>

                <View style={styles.common_info_content}>
                    {this.getItem('总房间:', this.state.item.totalRooms)}
                    {this.getItem('空余房间:', this.state.item.idleRooms)}
                </View>
                <View style={styles.line_class}/>

                <View style={styles.common_info_content}>
                    {this.getItem('平均租价:', this.state.item.averagePrice)}
                    {this.getItem('租客数:', this.state.item.totalTenant)}
                </View>
                <View style={[styles.line_class, {left:0}]}/>

                <View style={{height: 16, backgroundColor:GlobalStyles.backgroundColor}}/>
                {ViewUtils.getAddBtnWithDataByName('添加房号',()=>this.addBuildingRoomClick())}
                <View style={{height: 6, backgroundColor:GlobalStyles.backgroundColor}}/>
            </View>
        )
    }

    gotoModify() {
        this.props.navigator.push({
            name:'ModifyBuildingControlView',
            component:ModifyBuildingControlView,
            params: {
                buildingItem: this.state.item,
                ...this.props,
            }
        })
    }

    getItem(title, value) {
        return (
            <View style={styles.item_content}>
                <Text style={[styles.text_info, {width:GlobalStyles.scaleSize(160), marginLeft:GlobalStyles.scaleSize(24)}]}>{title}</Text>
                <Text style={[styles.text_info, {flex:1}]}>{value}</Text>
            </View>
        )
    }


    addBuildingRoomClick() {
        this.props.navigator.push({
            title: 'RoomDetailView',
            component: RoomDetailView,
            params: {
                buildingId: this.item.buildingId,
                isAdd: true,
                successCallback: ()=> {
                    this.loadData(true);
                }
            }
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.loadData(false);
    }
    //
    // componentWillUnmount() {
    //     this.common.componentWillUnmount();
    // }
    //
    // onBack() {
    //     this.props.navigator.pop();
    // }
    //
    // onBackPress() {
    //     this.onBack();
    //     return true;
    // }

    loadData(freshFlag) {
        if (freshFlag) {
            this.setState({
                isRefreshLoading:true,
            })
        }

        if (freshFlag) {
            this.dataManager.fetchDataFromNetwork(URLConstances.building_list_url, false,
                {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({buildingId:this.item.buildingId}))})
                .then((data)=> {

                    if (!!data && data.code === 0) {
                        if (typeof (data.msg) !== 'string') {

                            this.needCallback = true;
                            this.setState({
                                item: data.msg[0],
                            })
                        }
                    }
                })
                .catch((error)=> {

                })
        }


        this.dataManager.fetchData(URLConstances.rooms_list_url, false, {body:JSON.stringify(
            JsonProcessUtils.mergeJsonWithLogin({buildingId:this.state.item.buildingId}))}).then((data) => {
            console.log(data);
            this.setState({
                isLoading:false,
                isRefreshLoading:false,
            })
            super.setState({
                isLoading:false,
            })
            if (data) {
                if (data.code == 0) {
                    if (!!data.msg) {
                        this.setState({
                            dataSource: data.msg,
                        })
                    }
                }
            }
        }).catch((error) => {
            super.setState({
                isLoading:false,
            })
            this.setState({
                isLoading:false,
                isRefreshLoading:false,
            })
        })
    }

    componentWillUnmount() {
        if (this.needCallback) {
            if (!!this.props.successCallback) {
                this.props.successCallback();
            }
        }
        super.componentWillUnmount();
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:GlobalStyles.backgroundColor,
    },

    header_container: {
        width:GlobalStyles.window_width,
        justifyContent:'center',
    },

    header_content: {
        width:GlobalStyles.window_width,
        height: GlobalStyles.scaleSize(160),
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#ffffff',
    },

    common_info_content: {
        width:GlobalStyles.window_width,
        height: GlobalStyles.scaleSize(96),
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff'
    },

    item_content: {
        flex:1,
        // height: scaleSize(96),
        flexDirection:'row',
        justifyContent:'center',
    },

    text_info: {
        fontSize: GlobalStyles.setSpText(12),
        color:GlobalStyles.titleColor,
    },

    header_img: {
        marginLeft: GlobalStyles.scaleSize(24),
        marginRight: GlobalStyles.scaleSize(24),
        width: GlobalStyles.scaleSize(104),
        height: GlobalStyles.scaleSize(104),
        borderRadius:GlobalStyles.scaleSize(8),
    },

    txt_content: {
        flex:1,
        justifyContent:'center',
        height: GlobalStyles.scaleSize(160),
    },

    txt_title: {
        fontSize: GlobalStyles.setSpText(13),
        color:GlobalStyles.selectedColor,
        marginTop: GlobalStyles.scaleSize(12),
    },

    txt_address: {
        fontSize: GlobalStyles.setSpText(12),
        color: GlobalStyles.normalColor,
        marginTop: GlobalStyles.scaleSize(12),
    },

    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: GlobalStyles.scaleSize(30),
    },

    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: GlobalStyles.scaleSize(150)
    },

    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0
    },

    backTextWhite: {
        color: '#FFF'
    },

    rowFront: {
        flexDirection:'row',
        backgroundColor: '#ffffff',
        borderBottomColor: '#c3c3c3',
        borderBottomWidth: 0.5,
        height: GlobalStyles.scaleSize(104),
    },

    line_class: {
        height: 0.5,
        left:GlobalStyles.scaleSize(24),
        backgroundColor:'#c3c3c3'
    },

    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        flex: 1,
    },
})