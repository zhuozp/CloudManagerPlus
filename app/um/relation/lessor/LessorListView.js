/**
 * Created by zhuozhipeng on 5/9/17.
 */
import React from 'react'

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    RefreshControl,
    ListView,
    TouchableHighlight,
} from 'react-native'

import {
    SwipeListView,
    SwipeRow
} from 'react-native-swipe-list-view'

import BaseView from '../../../common/widget/BaseView'
import LessorItem from './model/LessorItem'
import GlobalStyles from '../../../../res/style/GlobalStyles'
import LessorEditView from './LessorEditView'
import DataManager from '../../../manager/DataManager'
import JsonProcessUtils from '../../../util/JsonProcessUtils'
import KeyConstances from '../../../constances/KeyConstances'
import URLConstances from '../../../constances/URLConstances'
import LoadingProgressView from '../../../common/widget/LoadingProgressView'


export default class LessorListView extends BaseView {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })
        super.navBarTitle('出租方列表');
        this.state = {
            isRefreshLoading:false,
            dataSource:[],
        }
        this.dataManager = new DataManager();
    }

    componentDidMount() {
        super.componentDidMount();
        this.dataManager.getData(KeyConstances.KEY_LESSOR_LIST)
            .then((data) => {
                if (!!data) {
                    this.setState({
                        item: data,
                    })
                }
            })
            .catch((error) => {
                console.log('列表不存在')
            })

        this.loadData(false);
    }

    loadData(refresh) {
        if (refresh) {
            this.setState({
                isRefreshLoading:true,
            })
        } else {
            super.setLoadingView(true);
        }

        this.dataManager.fetchDataFromNetwork(URLConstances.lessor_list_url, false, {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({}))})
            .then((data)=> {
                super.setLoadingView(false);
                if (refresh) {
                    this.setState({
                        isRefreshLoading:false,
                    })
                }

                if (!!data) {
                    if (data.code === 0) {
                        if (typeof(data.msg) !== 'string') {
                            this.setState({
                                dataSource: data.msg,
                            })
                            this.dataManager.saveData(KeyConstances.KEY_LESSOR_LIST, JSON.stringify(data.msg), null);
                            if (data.msg.length === 0) {
                                super.showToast('列表为空，您可添加出租方信息')
                            }
                        } else {
                            super.showToast(!!data.msg ? data.msg : '网络异常，请重试');
                        }
                    }
                } else {
                    super.showToast('网络异常，请重试')
                }
            })
            .catch((error)=> {
                super.setLoadingView(false);
                super.showToast('网络异常，请重试')
                if (refresh) {
                    this.setState({
                        isRefreshLoading:true,
                    })
                }
            })
    }


    navBarRightView() {
        return (
            <TouchableOpacity
                underlayColor='transparent'
                style={{padding: 8}}
                onPress={() => {
                    this.props.navigator.push({
                        name: 'LessorEditView',
                        component: LessorEditView,
                        params: {
                            add: true,
                            processCallback:()=> {
                                this.loadData(true);
                            }
                        }
                    })
                }}>
                <Text style={{fontSize: GlobalStyles.nav_bar_fontsize, color: '#ffffff'}}>添加</Text>
            </TouchableOpacity>
        )
    }

    contentRender() {
        return (
            <View style={{flex:1, backgroundColor:GlobalStyles.backgroundColor}}>
                <SwipeListView
                    closeOnRowBeginSwipe={true}
                    dataSource={!!this.state.dataSource ? this.ds.cloneWithRows(this.state.dataSource) : {}}
                    renderRow={(e, secId, rowId, rowMap) => this.renderRow(e, secId, rowId, rowMap)}
                    enableEmptySections={true}
                    renderHeader={()=>{
                        return  <View style={{height:GlobalStyles.scaleSize(24), backgroundColor:GlobalStyles.backgroundColor}}/> ;
                    }}
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
        )
    }

    onRefresh() {
        this.loadData(true)
    }

    renderRow(e, secId, rowId, rowMap){
        var item = new LessorItem(e);
        return (
            <SwipeRow
                disableRightSwipe={true}
                leftOpenValue={GlobalStyles.scaleSize(150)}
                rightOpenValue={-GlobalStyles.scaleSize(150)}
            >
                <View style={styles.rowBack}>
                    <Text></Text>
                    <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]}
                                      onPress={ _ => this.deleteRow(secId, rowId, rowMap) }>
                        <Text style={styles.backTextWhite}>删除</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableHighlight
                        onPress={()=> {
                        if (typeof(this.props.lessItemSelect) === 'function') {
                            this.props.lessItemSelect(item);
                            this.onBack();
                        }
                    }}
                        underlayColor={'#AAA'}
                    >
                        <View style={styles.rowFront}>
                            <View style={{
                                flex: 1,
                                margin: GlobalStyles.scaleSize(24),
                                marginTop: GlobalStyles.scaleSize(16),
                                marginBottom: GlobalStyles.scaleSize(16),
                                justifyContent:'center'
                            }}>
                                <Text style={{fontSize:GlobalStyles.setSpText(12),color:GlobalStyles.selectedColor}}>{'法定代表人:' + item.lessorName}</Text>
                                <Text style={{fontSize:GlobalStyles.setSpText(12),color:GlobalStyles.selectedColor, marginTop: GlobalStyles.scaleSize(6)}}>{'电话:' + item.lessorMobile}</Text>
                                <Text style={{fontSize:GlobalStyles.setSpText(12), color:GlobalStyles.selectedColor, marginTop: GlobalStyles.scaleSize(6)}}>
                                    {'开户名:' + item.acountName}</Text>
                                <Text style={{fontSize:GlobalStyles.setSpText(12), color:GlobalStyles.selectedColor, marginTop: GlobalStyles.scaleSize(6)}}>
                                    {'银行账号:' + item.acountNum}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={this.itemClick.bind(this, item, rowId)}
                                underlayColor={'#f3f3f3'}
                            >
                                <View style={{
                                    width: GlobalStyles.scaleSize(160),
                                    height: GlobalStyles.scaleSize(200),
                                    backgroundColor: GlobalStyles.nav_bar_backgroundColor,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{fontSize: GlobalStyles.setSpText(15), color: '#fff'}}>查看</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableHighlight>
                    <View style={{height: GlobalStyles.scaleSize(24), backgroundColor: GlobalStyles.backgroundColor}}/>
                </View>
            </SwipeRow>
        )
    }

    itemClick(item, rowId) {
        this.props.navigator.push({
            name: 'LessorEditView',
            component: LessorEditView,
            params: {
                item: item,
                processCallback:()=> {
                    this.loadData(true);
                }
            }
        })
    }

    deleteRow(secId, rowId, rowMap){
        rowMap[`${secId}${rowId}`].closeRow();
        var item = new LessorItem(this.state.dataSource[rowId]);

        this.send = true;
        super.setLoadingView(true);

        this.dataManager.fetchDataFromNetwork(URLConstances.lessor_delete_url, false,
            {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({lessorId: item.lessorId}))})
            .then((data)=> {
                super.setLoadingView(false);
                this.send = false;
                if (!!data) {
                    if (data.code === 0 && data.msg === 'ok') {
                        super.showToast('删除成功');
                        this.state.dataSource.splice(rowId, 1);
                        this.setState({
                            dataSource: this.state.dataSource,
                        })
                    } else {
                        super.showToast(!!data.msg ? data.msg : '删除出租方信息失败，请重试')
                    }
                } else {
                    super.showToast('删除出租方信息失败，请重试')
                }
            })
            .catch((error)=> {
                this.send = false;
                super.setLoadingView(false);
                super.showToast('删除出租方信息失败，请重试')
            })
    }

    loadingView() {
        if (this.send) {
            return (
                <View style={{width:GlobalStyles.window_width, height:GlobalStyles.window_height, position:'absolute'}}>
                    <LoadingProgressView ref = 'loadingView' msg="删除中"/>
                </View>
            )
        }

        return super.loadingView();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.backgroundColor,
    },

    rowBack: {
        alignItems: 'center',
        backgroundColor: GlobalStyles.backgroundColor,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        height: GlobalStyles.scaleSize(139),
    },

    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: GlobalStyles.scaleSize(150),
        height: GlobalStyles.scaleSize(200),
    },

    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        height: GlobalStyles.scaleSize(200),
    },

    backTextWhite: {
        color: '#FFF'
    },

    rowFront: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        // borderBottomColor: '#c3c3c3',
        // borderBottomWidth: 0.5,
        height: GlobalStyles.scaleSize(200),
        width:GlobalStyles.window_width,
        alignItems:'center'
    },
})