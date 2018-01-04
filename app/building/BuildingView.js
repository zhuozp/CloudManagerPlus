/**
 * Created by zhuozhipeng on 10/8/17.
 */
import React, {
    Component
} from 'react';

import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    ListView,
    RefreshControl,
    ToastAndroid,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native'

import {
    SwipeListView,
    SwipeRow
} from 'react-native-swipe-list-view'

import GlobalStyles from '../../res/style/GlobalStyles'
import NavigationBar from '../common/widget/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import SearchPageView from '../search/SearchPageView'
import URLConstances from '../constances/URLConstances'
import DataManager from '../manager/DataManager'
import AddBuildingControlView from './AddBuildingControlView'
import BuildingDetailView from './BuildingDetailView'
import JsonProcessUtils from '../util/JsonProcessUtils'
import UmInfoInstance from '../um/UmInfoInstance'
import Toast from 'react-native-easy-toast'
import ToastUtils from '../util/ToastUtils'
import BuildingItem from './model/BuildingItem'

export default class BuildingView extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2)=>row1 !== row2,
        })
        this.state = {
            searchResult: '',
            isRefreshLoading: false,
            isLoading:false,
            dataSource:null,
        }

        this.dataManager =  new DataManager();
        // this.defaultItems = buildingViewJson.items;
    }

    componentDidMount() {
        this.loadData(false);
    }


    loadData(freshFlag) {
        if (freshFlag) {
           this.setState({
               isLoading:false,
               isRefreshLoading:true,
           })
        } else {
            this.setState({
                isLoading:true,
            })
        }

        // this.setState({
        //     dataSource: this.defaultItems,
        // })

        this.dataManager.fetchData(URLConstances.building_list_url, false, {
            body: JSON.stringify(JsonProcessUtils.mergeJsonWithParams(
                {
                    'userId': UmInfoInstance.getInstance()._userId,
                    'subUserId': UmInfoInstance.getInstance()._subUserId
                }))
        })
            .then((data) => {
                console.log(data);
                if (!!data) {
                    this.setState({
                        isRefreshLoading: false,
                        isLoading: false,
                    })
                    if (data.code == 0) {
                        if (!!data.msg && data.msg.length >= 0) {
                            this.setState({
                                dataSource: data.msg,
                            })
                        } else {
                            ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '请求出错，请重试！');
                            this.setState({
                                dataSource:null,
                            })
                        }
                    } else {
                        ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '请求出错，请重试！');
                    }

                } else {
                    ToastUtils.toast(this.refs.toast, '请求出错，请重试！');
                }
            }).catch((error) => {
            this.setState({
                dataSource: this.defaultItems,
                isRefreshLoading: false,
                isLoading: false,
            })
            ToastUtils.toast(this.refs.toast, '请求出错，请重试！');
        })
    }


    render() {
        let navigationBar =
            <NavigationBar
                style={{backgroundColor: GlobalStyles.nav_bar_backgroundColor}}
                // rightButton={ViewUtils.getSearchButton(()=>this.search())}
                title='楼宇管理'/>;

        let emptyDataView = ViewUtils.getAddBtnByName('添加楼宇', ()=>this.addBuildingClick());
        let dataContent = this.dataContentView();
        let content = (!!this.state.dataSource && this.state.dataSource.length > 0) ? dataContent :
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>{emptyDataView}</View>;

        let indicatorView = this.state.isLoading ?
            <ActivityIndicator
                animating={this.state.isLoading}
                style={[styles.centering,]}
                size="large"
            /> : null;
        let contentView = !this.state.isLoading ? content : null;
        return (
            <View style={styles.container}
            >
                {navigationBar}
                <View style={{flex:1}}>
                    {indicatorView}
                    {contentView}
                </View>
                <View style={[{marginBottom: GlobalStyles.scaleSize(96), backgroundColor:GlobalStyles.backgroundColor}]}/>
                <Toast ref='toast' position='bottom'/>
            </View>
        )
    }

    addBuildingClick() {
        this.props.navigator.push({
            title: 'AddBuildingControlView',
            component: AddBuildingControlView,
            params: {
                successCallback: () => {
                    if (!!this.props.mainView) {
                        this.props.mainView.needUpdate('homePageView');
                    }

                    if (!!this.state.dataSource && this.state.dataSource > 0) {
                        this.loadData(true);
                    } else {
                        this.loadData(false);
                    }
                }
            }
        });
    }

    search() {
        // ToastAndroid.show('add click', ToastAndroid.SHORT)
        this.props.navigator.push({
            component:SearchPageView,
            name:'SearchPageView',
            params: {
                from:'BuildingView',
                data: this.props.data,
            }
        })
    }

    renderHeader() {
        let addBtn = ViewUtils.getAddBtnWithDataByName('添加楼宇',()=>this.addBuildingClick());
        return (
        <View>
            {addBtn}
            <View style={{height:GlobalStyles.scaleSize(24), backgroundColor:'#eeeeee'}}/>
        </View>
        )
    }

    itemClick(projectModel) {
        this.props.navigator.push({
            name:'BuildingDetailView',
            component:BuildingDetailView,
            params: {
                item: projectModel,
                successCallback: () => {
                    if (!!this.props.mainView) {
                        this.props.mainView.needUpdate('homePageView');
                    }
                    if (!!this.state.dataSource && this.state.dataSource > 0) {
                        this.loadData(false);
                    } else {
                        this.loadData(true);
                    }
                }
            }
        })
    }

    deleteRow(secId, rowId, rowMap) {
        let buildingItem = new BuildingItem(this.state.dataSource[rowId]);
        let buildingId = buildingItem.buildingId;
        rowMap[`${secId}${rowId}`].closeRow();

        Alert.alert(
            '',
            '删除该楼宇将同时包括该楼宇房间，租客信息以及合同等数据，请确认是否删除！',
            [
                {text: '保留楼宇', onPress: () => {

                }},
                {text: '确认', onPress: () => {
                    this.dataManager.fetchDataFromNetwork(URLConstances.building_delete_url, false,
                        {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({buildingId: buildingId}))})
                        .then((data)=> {
                            if (!!data && data.msg === 'ok') {
                                const newData = [...this.state.dataSource];
                                newData.splice(rowId, 1);

                                if (!!this.props.mainView) {
                                    this.props.mainView.needUpdate('homePageView');
                                }
                                this.setState({dataSource: newData});
                            } else {
                                ToastUtils.toast(this.refs.toast, !!data.msg ? data.msg : '删除楼宇失败，请重试')
                            }
                        })
                        .catch((errpr)=> {
                            ToastUtils.toast(this.refs.toast, '删除楼宇失败，请重试')
                        })
                }},
            ]
        )


    }

    renderRow(projectModel, secId, rowId, rowMap) {
        if (!projectModel) return null;
        let item = new BuildingItem(projectModel);
        let {navigator}=this.props;
        let image = (!!item.buildingImageUrl && !!item.buildingImageUrl[0]) ?
            <Image style={styles.image_cls} source={{uri: item.buildingImageUrl[0]}}/> :
            <Image style={styles.image_cls} source={require('../../res/images/building/ic_add_building_picture_96.png')}/>
        let name = item.buildingName;
        let info = '共' + item.totalRooms + '套房' + ' 闲置' + item.idleRooms + '套'
        return (
            <SwipeRow
                disableRightSwipe={true}
                leftOpenValue={GlobalStyles.scaleSize(150)}
                rightOpenValue={-GlobalStyles.scaleSize(150)}
            >
                <View style={styles.rowBack}>
                    <Text>Left</Text>
                    <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ _ => this.deleteRow(secId, rowId, rowMap) }>
                        <Text style={styles.backTextWhite}>删除</Text>
                    </TouchableOpacity>
                </View>

                <TouchableHighlight
                    onPress={this.itemClick.bind(this, item)}
                    underlayColor={'#AAA'}

                >
                    <View style={styles.rowFront}>
                        {image}
                        <View style={{flex:1, justifyContent:'center',flexDirection:'column'}}>
                            <Text style={{color:GlobalStyles.selectedColor, fontSize:GlobalStyles.setSpText(13)}}>{name}</Text>
                            <Text style={{color:GlobalStyles.normalColor, fontSize:GlobalStyles.setSpText(11), marginTop:GlobalStyles.scaleSize(14)}}>{info}</Text>
                        </View>
                        <Image style={{alignSelf:'center', right: 0, width:GlobalStyles.scaleSize(32), height:GlobalStyles.scaleSize(32), right:GlobalStyles.scaleSize(12)}} source={require('../../res/images/common/ic_forword.png')}/>
                    </View>
                </TouchableHighlight>
            </SwipeRow>
        );
    }

    dataContentView() {
        var content =
            <View style={styles.container}>
                <SwipeListView
                    closeOnRowBeginSwipe={true}
                    dataSource= {!!this.state.dataSource ? this.ds.cloneWithRows(this.state.dataSource) : {}}
                    renderRow={(e, secId, rowId, rowMap) => this.renderRow(e, secId, rowId, rowMap)}
                    renderFooter={()=> {
                        return <View style={{height: GlobalStyles.scaleSize(100)}}/>
                    }}
                    renderHeader={()=>{
                        return  this.renderHeader() ;
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
            </View>
        return (
            <View style={{flex:1}}>
                {content}
            </View>

        );
    }

    onRefresh() {
        // ToastAndroid.show('header refresh', ToastAndroid.SHORT);
        this.loadData(true)
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
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
        height: GlobalStyles.scaleSize(136),
    },
    image_cls: {
        marginLeft:GlobalStyles.scaleSize(28),
        marginRight: GlobalStyles.scaleSize(28),
        marginTop: GlobalStyles.scaleSize(20),
        marginBottom: GlobalStyles.scaleSize(20),
        width:GlobalStyles.scaleSize(96),
        height:GlobalStyles.scaleSize(96),
        borderRadius:GlobalStyles.scaleSize(4)
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: GlobalStyles.scaleSize(16),
        flex: 1,
    },
});
