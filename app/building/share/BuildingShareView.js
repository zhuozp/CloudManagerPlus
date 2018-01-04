/**
 * Created by zhuozhipeng on 13/9/17.
 */

import React from 'react'

import {
    StyleSheet,
    FlatList,
    View,
    Image,
    TouchableOpacity,
    Text,
} from 'react-native'

import BaseView from '../../common/widget/BaseView'
import DataManager from '../../manager/DataManager'
import URLConstances from '../../constances/URLConstances'
import JsonProcessUtils from '../../util/JsonProcessUtils'
import ShareItem from '../model/ShareItem'
import GlobalStyles from '../../../res/style/GlobalStyles'
import SelectRoomView from './SelectRoomView'
import BuildingShareEditView from './BuildingShareEditView'
import UmInfoInstance from '../../um/UmInfoInstance'

export default class BuildingShareView extends BaseView {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();

        this.state = {
            dataSource: [],
        }

        super.navBarTitle('一键招商');
    }

    navBarRightView() {
        return (
            <TouchableOpacity
                disable={this.state.disable}
                style={{padding:GlobalStyles.scaleSize(16)}}
                onPress={()=> {
                    this.gotoShareEditView();
                }}>
                <Text style={{fontSize: GlobalStyles.nav_bar_fontsize, color: '#ffffff'}}>分享</Text>
            </TouchableOpacity>
        )
    }

    gotoShareEditView() {
        var shareTx = '';

        var item;
        var roomItem;
        for (let i = 0; i < this.state.dataSource.length; i++) {
            item = this.state.dataSource[i];
            if (item.hasSelect) {
                if (shareTx === '') {
                    shareTx = shareTx + '🌐 ' + '办公室出租-' + item.buildingName +  ' 🌐'
                } else {
                    shareTx = shareTx + '\n\n\n' + '🌐 ' + '办公室出租-' + item.buildingName +  ' 🌐'
                }

                shareTx = shareTx + '\n————————————\n';

                for (let j = 0; j < item.roomsDetail.length; j++) {
                    roomItem = item.roomsDetail[j];
                    if (roomItem.hasSelect) {
                        shareTx = shareTx + '房号' + roomItem.roomNo + '    ' + '面积' + roomItem.area + '    ' + '价格' + roomItem.price + '\n';
                    }
                }
                shareTx = shareTx + '————————————\n';
            }
        }

        shareTx = shareTx + '联系电话☎️： ' + UmInfoInstance.getInstance()._mobile;

        this.props.navigator.push({
            name: 'BuildingShareEditView',
            component: BuildingShareEditView,
            params: {
                shareTx: shareTx,
            }
        })
    }

    componentDidMount() {
        super.componentDidMount();

        super.setLoadingView(true);
        this.dataManager.fetchDataFromNetwork(URLConstances.share_building_url, false,
            {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({}))})
            .then((data) => {
                super.setLoadingView(false);
                if (!!data && data.code === 0) {
                    if (typeof (data.msg) !== 'string') {
                        this.setState({
                            dataSource: data.msg,
                        })
                    } else {
                        super.showToast(data.msg ? data.msg : '加载数据失败，请稍后重试');
                    }
                } else {
                    super.showToast('加载数据失败，请稍后重试');
                }
            })
            .catch((data => {
                super.setLoadingView(false);
                super.showToast('加载数据失败，请稍后重试');
            }))
    }

    contentRender() {
        return (
            <View>
                <FlatList
                    ListHeaderComponent={() => {
                        return <View style={{
                            height: GlobalStyles.scaleSize(24),
                            backgroundColor: GlobalStyles.backgroundColor
                        }}/>
                    }}
                    data={this.state.dataSource}
                    renderItem={this._renderItem}
                />
            </View>
        )
    }

    _renderItem = (item) => {
        var shareItem = item.item;

        return (
            <View>
                <View style={styles.item_content}>
                    <TouchableOpacity onPress={() => {
                        this.state.dataSource[item.index].hasSelect = !this.state.dataSource[item.index].hasSelect;

                        for (let i = 0; !!this.state.dataSource[item.index].roomsDetail &&
                        i < this.state.dataSource[item.index].roomsDetail.length; i++) {
                            this.state.dataSource[item.index].roomsDetail[i].hasSelect = this.state.dataSource[item.index].hasSelect;
                        }
                        this.setState({
                            dataSource: this.state.dataSource,
                        })
                    }}>
                        <View style={styles.select_img_content}>
                            {
                                !!this.state.dataSource[item.index].hasSelect ?
                                    <Image style={styles.select_img}
                                           source={require('../../../res/images/building/ic_select_2_44.png')}/> :
                                    <Image style={styles.select_img}
                                           source={require('../../../res/images/building/ic_select_44.png')}/>
                            }
                            <Text style={{
                                fontSize: GlobalStyles.scaleSize(12), marginTop: GlobalStyles.scaleSize(12),
                                color: this.state.dataSource[item.index].hasSelect ? GlobalStyles.nav_bar_backgroundColor : GlobalStyles.normalColor
                            }}>
                                {this.state.dataSource[item.index].hasSelect ? '取消选择' : '选择全部'}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{flex: 1, height: GlobalStyles.scaleSize(96), justifyContent: 'center'}}>
                        <Text style={styles.txt_content}>{'楼宇： ' + shareItem.buildingName}</Text>
                        <Text
                            style={[styles.txt_content, {marginTop: GlobalStyles.scaleSize(12)}]}>{'招商： ' + '有' + shareItem.roomsDetail.length + '个空置房间待招商'}</Text>
                    </View>

                    <TouchableOpacity onPress={this.selectRooms.bind(this, shareItem, item.index)}>
                        <View style={styles.right_btn}>
                            <Text style={{color: '#fff', fontSize: GlobalStyles.setSpText(12)}}>
                                {'勾选\n房间'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height: GlobalStyles.scaleSize(24), backgroundColor: GlobalStyles.backgroundColor}}/>
            </View>

        )
    }

    selectRooms(item, index) {
        this.props.navigator.push({
            name:'SelectRoomView',
            component:SelectRoomView,
            params: {
                item: item,
                selectCallback: ()=> {
                    this.state.dataSource[index] = item;
                    this.setState({
                        dataSource : this.state.dataSource,
                    })
                }
            }
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    item_content: {
        width: GlobalStyles.window_width,
        height: GlobalStyles.scaleSize(126),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },

    select_img_content: {
        height: GlobalStyles.scaleSize(126),
        margin: GlobalStyles.scaleSize(24),
        justifyContent: 'center',
        alignItems: 'center'
    },

    select_img: {
        width: GlobalStyles.scaleSize(44),
        height: GlobalStyles.scaleSize(44),
        padding: GlobalStyles.scaleSize(8),
    },

    right_btn: {
        height: GlobalStyles.scaleSize(126),
        width: GlobalStyles.scaleSize(126),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: GlobalStyles.nav_bar_backgroundColor,
    },

    txt_content: {
        fontSize: GlobalStyles.setSpText(12),
        color: GlobalStyles.selectedColor,
    }
})