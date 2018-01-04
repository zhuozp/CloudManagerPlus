/**
 * Created by zhuozhipeng on 10/8/17.
 */
import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ListView,
} from 'react-native'

import GlobalStyles from '../../res/style/GlobalStyles';
import BaseView from '../common/widget/BaseView'
import ContactListItem from './model/ContactListItem'
import LoadingProgressView from '../common/widget/LoadingProgressView'
import DataManager from '../manager/DataManager'
import URLConstances from '../constances/URLConstances'
import JsonProcessUtils from '../util/JsonProcessUtils'
import ContactDetailView from './ContactDetailView'
import {
    SwipeListView,
    SwipeRow,
} from 'react-native-swipe-list-view'

export default class ContactView extends BaseView {
    constructor(props) {
        super(props);

        this.dataManager = new DataManager();
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })

        this.state = {
            dataSource: [],
        }

        this.send = false;
        super.navBarTitle('合同列表')
    }

    componentDidMount() {
        super.componentDidMount();
        this.loadData();
    }

    loadData() {
        super.setLoadingView(true);
        this.dataManager.fetchDataFromNetwork(URLConstances.contact_list_url, false,
            {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({}))})
            .then((data)=> {
                super.setLoadingView(false);
                if (!!data) {
                    if (data.code === 0 && !!data.msg && typeof(data.msg) !== 'string') {
                        if (data.msg.length === 0) {
                            super.showToast('没有相关合同，请前往生成')
                        }
                        this.setState({
                            dataSource:data.msg,
                        })
                    } else {
                        super.showToast(!!data.msg ? data.msg : '请求失败，请重试')
                    }
                } else {
                    super.showToast('请求失败，请重试')
                }
            })
            .catch((error)=> {
                super.setLoadingView(false);
                super.showToast('请求失败，请重试')
            })
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
                />
            </View>
        )
    }

    deleteRow(secId, rowId, rowMap){
        rowMap[`${secId}${rowId}`].closeRow();
        var item = new ContactListItem(this.state.dataSource[rowId]);

        this.send = true;
        super.setLoadingView(true);
        this.dataManager.fetchDataFromNetwork(URLConstances.contact_delete_url, false,
            {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({buildingId:item.buildingId, roomId: item.roomId}))})
            .then((data)=> {
                this.send = false;
                super.setLoadingView(false);
                if (!!data) {
                    if (data.msg === 'ok') {
                        super.showToast('删除合同操作成功')
                        this.state.dataSource.splice(rowId, 1);
                        this.setState({
                            dataSource: this.state.dataSource,
                        })
                    } else {
                        super.showToast(!!data.msg ? data.msg : '删除合同操作失败，请重试');
                    }
                } else {
                    super.showToast('删除合同操作失败，请重试')
                }
            })
            .catch((data)=> {
                this.send = false;
                super.setLoadingView(false);
                super.showToast('删除合同操作失败，请重试')
            })
    }

    renderRow(e, secId, rowId, rowMap) {
        var item = new ContactListItem(e);
        return (
            <SwipeRow
                disableRightSwipe={true}
                leftOpenValue={75}
                rightOpenValue={-75}
            >
                <View style={styles.rowBack}>
                    <Text></Text>
                    <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]}
                                      onPress={ _ => this.deleteRow(secId, rowId, rowMap) }>
                        <Text style={styles.backTextWhite}>删除</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <View style={styles.rowFront}>
                        <View style={{
                            flex: 1,
                            margin: GlobalStyles.scaleSize(24),
                            marginTop: GlobalStyles.scaleSize(16),
                            marginBottom: GlobalStyles.scaleSize(16),
                            justifyContent:'center'
                        }}>
                            <Text style={{fontSize:GlobalStyles.setSpText(13),color:GlobalStyles.selectedColor}}>{'单位:' + item.buildingName + item.roomNo}</Text>
                            <Text style={{fontSize:GlobalStyles.setSpText(13),color:GlobalStyles.selectedColor, marginTop: GlobalStyles.scaleSize(6)}}>{'承租方:' + item.tenantName}</Text>
                            <Text style={{fontSize:GlobalStyles.setSpText(11), color:GlobalStyles.normalColor, marginTop: GlobalStyles.scaleSize(6)}}>
                                {'合同租期:' + item.startTime + ' 至 ' + item.endTime}</Text>
                        </View>

                        <TouchableOpacity
                            onPress={this.itemClick.bind(this, item, rowId)}
                            underlayColor={'#f3f3f3'}
                        >
                            <View style={{
                                width: GlobalStyles.scaleSize(156),
                                // height: GlobalStyles.scaleSize(139),
                                flex:1,
                                backgroundColor: GlobalStyles.nav_bar_backgroundColor,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{fontSize: GlobalStyles.setSpText(15), color: '#fff'}}>{'查看\n合同'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{height: GlobalStyles.scaleSize(24), backgroundColor: GlobalStyles.backgroundColor}}/>
                </View>
            </SwipeRow>
        )
    }

    itemClick(item, rowId) {
        this.props.navigator.push({
            name:'ContactDetailView',
            component:ContactDetailView,
            params: {
                url: item.contractUrl,
                item: item,
            }
        })
    }

    loadingView() {
        if (this.send) {
            return (
                <View style={{width:GlobalStyles.window_width, height:GlobalStyles.window_height, position:'absolute'}}>
                    <LoadingProgressView ref = 'loadingView' msg="发送中"/>
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
        // height: GlobalStyles.scaleSize(139),
    },

    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        // height: GlobalStyles.scaleSize(139),
        flex:1,
        marginBottom: GlobalStyles.scaleSize(24),
    },

    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        // height: GlobalStyles.scaleSize(139),
        flex:1,
        marginBottom: GlobalStyles.scaleSize(24),
    },

    backTextWhite: {
        color: '#FFF'
    },

    rowFront: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        // borderBottomColor: '#c3c3c3',
        // borderBottomWidth: 0.5,
        // height: GlobalStyles.scaleSize(140),
        width:GlobalStyles.window_width,
        alignItems:'center'
    },
})
