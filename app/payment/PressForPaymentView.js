/**
 * Created by zhuozhipeng on 4/9/17.
 */
import React from 'react'

import {
    StyleSheet,
    View,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
    Text,
    Alert,
    InteractionManager,
} from 'react-native'

import BaseView from '../common/widget/BaseView'
import {
    SwipeListView,
    SwipeRow
} from 'react-native-swipe-list-view'
import GlobalStyles from '../../res/style/GlobalStyles'
import PaymentMsgItem from './model/PaymentMsgItem'
import DataManager from '../manager/DataManager'
import URLConstances from '../constances/URLConstances'
import JsonProcessUtils from '../util/JsonProcessUtils'
import LoadingProgressView from '../common/widget/LoadingProgressView'

export default class PressForPaymentView extends BaseView {
    constructor(props) {
        super(props);
        this.notice = this.props.notice;
        this.dataManager = new DataManager();
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })

        this.state = {
            dataSource: this.notice,
        }

        this.send = false;
        super.navBarTitle('催租')
    }


    contentRender() {
        return (
        <View style={{flex:1, backgroundColor:GlobalStyles.backgroundColor}}>
            <SwipeListView
                closeOnRowBeginSwipe={true}
                dataSource={!!this.state.dataSource ? this.ds.cloneWithRows(this.state.dataSource) : {}}
                renderRow={(e, secId, rowId, rowMap) => this.renderRow(e, secId, rowId, rowMap)}
                renderHeader={() => {
                    return <View style={{height: GlobalStyles.scaleSize(24)}}/>;
                }}
                enableEmptySections={true}
            />
        </View>
        )
    }

    deleteRow(secId, rowId, rowMap){
        let item = new PaymentMsgItem(this.state.dataSource[rowId]);
        rowMap[`${secId}${rowId}`].closeRow();
        Alert.alert(
            '',
            '是否忽略该信息，不向租客发催租短信',
            [
                {text: '取消', onPress: () => {

                }},
                {text: '确定', onPress: () => {
                    super.setLoadingView(true);
                    this.dataManager.fetchDataFromNetwork(URLConstances.ignore_payment_msg_url, false,
                        {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({buildingId: item.buildingId, roomId:item.roomId}))})
                        .then((data)=> {
                            super.setLoadingView(false);
                            if (!!data && data.code === 0) {
                                this.notice.splice(rowId, 1);
                                this.setState({
                                    dataSource: this.notice,
                                })


                                InteractionManager.runAfterInteractions(()=> {
                                    if (!this.props.ignoreCallback) {
                                        this.props.ignoreCallback();
                                    }
                                })
                            } else {
                                super.showToast(!!data && !!data.msg ? data.msg : '操作失败，请重试')
                            }
                        })
                        .catch((error)=> {
                            super.setLoadingView(false);
                            super.showToast('发送失败，请稍后再试')
                        })
                }},
            ]
        )
    }

    renderRow(e, secId, rowId, rowMap) {
        var item = new PaymentMsgItem(e);
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
                        <Text style={styles.backTextWhite}>忽略</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <View style={styles.rowFront}>
                        <Text style={{
                            flex: 1,
                            margin: GlobalStyles.scaleSize(24),
                            marginTop: GlobalStyles.scaleSize(16),
                            marginBottom: GlobalStyles.scaleSize(16)
                        }} numberOfLines={2}>{item.noticeMessage}</Text>

                        <TouchableHighlight
                            onPress={this.itemClick.bind(this, item, rowId)}
                            underlayColor={'#f3f3f3'}
                        >
                            <View style={{
                                width: GlobalStyles.scaleSize(156),
                                height: GlobalStyles.scaleSize(116),
                                backgroundColor: GlobalStyles.nav_bar_backgroundColor,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{fontSize: GlobalStyles.setSpText(15), color: '#fff'}}>提醒</Text>
                            </View>
                        </TouchableHighlight>
                    </View>

                    <View style={{height: GlobalStyles.scaleSize(24), backgroundColor: GlobalStyles.backgroundColor}}/>
                </View>
            </SwipeRow>
        )
    }

    itemClick(item, rowId) {
        Alert.alert(
            '',
            '确定由系统给租客发催租短信吗？',
            [
                {text: '取消', onPress: () => {

                }},
                {text: '确定', onPress: () => {
                    this.send = true;
                    super.setLoadingView(true);
                    this.dataManager.fetchDataFromNetwork(URLConstances.send_payment_msg_url, false,
                        {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({mobile: item.mobile, sendMessage:item.sendMessage}))})
                        .then((data)=> {
                            this.send = false;
                            super.setLoadingView(false);
                            if (!data && data.code === 0) {
                                this.notice.splice(rowId, 1);
                                this.setState({
                                    dataSource: this.notice,
                                })
                            } else {
                                super.showToast(!!data && !!data.msg ? data.msg : '发送失败，请重试')
                            }
                        })
                        .catch((error)=> {
                            this.send = false;
                            super.setLoadingView(false);
                            super.showToast('发送失败，请稍后再试')
                        })
                }},
            ]
        )
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
    rowBack: {
        alignItems: 'center',
        backgroundColor: GlobalStyles.backgroundColor,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        height: GlobalStyles.scaleSize(116),
    },

    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        height: GlobalStyles.scaleSize(116),
    },

    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        height: GlobalStyles.scaleSize(116),
    },

    backTextWhite: {
        color: '#FFF'
    },

    rowFront: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        // borderBottomColor: '#c3c3c3',
        // borderBottomWidth: 0.5,
        height: GlobalStyles.scaleSize(116),
        width:GlobalStyles.window_width,
        alignItems:'center'
    },
})