/**
 * Created by zhuozhipeng on 29/8/17.
 */
import React from 'react'

import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    Text
} from 'react-native'

import GlobalStyles from '../../res/style/GlobalStyles'
import BaseView from '../common/widget/BaseView'
import DataManager from '../manager/DataManager'
import URLConstances from '../constances/URLConstances'
import JsonProcessUtils from '../util/JsonProcessUtils'
import NoticeMsgDetailView from './NoticeMsgDetailView'

export function NoticeItem(item) {
    if (!item) return;
    this.title = item.title;
    this.newsUrl = item.newsUrl;
    this.createTime = item.createTime;
}

export default class NoticeMessageView extends BaseView {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();
        super.navBarTitle('通知消息')

        this.state = {
            dataSource: null,
        }
    }

    componentDidMount() {
        super.componentDidMount();
        this.loadData();
    }

    loadData() {
        super.setLoadingView(true);
        this.dataManager.fetchDataFromNetwork(URLConstances.notice_msg_url, false,
            {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({}))})
            .then((data) => {
                super.setLoadingView(false);
                if (!!data) {
                    if (data.code == 0 && !!data.msg && typeof(data.msg) !== 'string') {
                        this.setState({
                            dataSource:data.msg,
                        })
                    } else {
                    //     this.setState({
                    //         dataSource:[{
                    //             title: '[壹楼]app使用样例',
                    //             time: '2017-09-25',
                    //             newsUrl: 'http://www.58.com',
                    // }, {
                    //             title: '[壹楼]app使用样例2',
                    //             time: '2017-09-24',
                    //             newsUrl: 'http://blog.csdn.net/qq_16666847/article/details/54092297'
                    //         }],
                    //     })
                        super.showToast(!!data.msg ? data.msg : '加载失败，请重试')
                    }
                } else {
                    super.showToast('加载失败，请重试')
                }
            })
            .catch((error)=> {
                super.setLoadingView(false);
                super.showToast('加载失败，请重试')
            })
    }

    contentRender() {
        return (
            <FlatList
                renderItem={this._renderItem}
                data={this.state.dataSource}
                getItemLayout={(data, index) => (
                    { length: GlobalStyles.scaleSize(124), offset: (GlobalStyles.scaleSize(124) + 0.5) * index, index }
                ) }
            />
        )
    }

    _renderItem = (item)=> {
        var noticeItem = new NoticeItem(item.item);
        return (
            <TouchableOpacity onPress={()=> {
                this.props.navigator.push({
                    name: 'NoticeMsgDetailView',
                    component: NoticeMsgDetailView,
                    params: {
                        url: noticeItem.newsUrl
                    }
                })
            }}>
                <View style={{width:GlobalStyles.window_width, height: GlobalStyles.scaleSize(124),backgroundColor:'#fff',
                    borderBottomWidth:0.5, borderBottomColor:'#c3c3c3', justifyContent:'center'}}>
                    <Text style={{marginLeft:GlobalStyles.scaleSize(24),marginLeft:GlobalStyles.scaleSize(24),fontSize: GlobalStyles.setSpText(13), color: GlobalStyles.selectedColor}} numberOfLines={2}>{noticeItem.title}</Text>
                    <Text style={{marginLeft:GlobalStyles.scaleSize(24),marginLeft:GlobalStyles.scaleSize(24),marginTop: GlobalStyles.scaleSize(8), fontSize: GlobalStyles.setSpText(11),color:GlobalStyles.normalColor}} >{noticeItem.createTime}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}