/**
 * Created by zhuozhipeng on 25/8/17.
 */

import React, {
    Component
} from 'react'

import {
    ListView,
    View,
    StyleSheet,
    FlatList,
    Platform,
    TouchableOpacity,
    Text
} from 'react-native'

import Popover from '../common/widget/Popover'
import DataManager from '../manager/DataManager'
import URLConstances from '../constances/URLConstances'
import KeyConstances from '../constances/KeyConstances'
import GlobalStyles from '../../res/style/GlobalStyles'
const MAX_PAGE_SIZE = 10;

const DATA = [
    {
       name:'平安',
        address:'深圳福田'
    },
    {
        name:'平安',
        address:'深圳福田'
    },
    {
        name:'平安',
        address:'深圳福田'
    },
    {
        name:'平安',
        address:'深圳福田'
    },
    {
        name:'平安',
        address:'深圳福田'
    },
    {
        name:'平安',
        address:'深圳福田'
    },
    {
        name:'平安',
        address:'深圳福田'
    },
]

export default class BuildingSearchWithBaiduApiView extends Component {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();
        this.city = '';
        this.searchPlace='';
        this.currentPage = 0;
        this.data = [];
        this.state = {
            isVisible: false,
            buttonRect: {},
            isLoadingMore: false,
            hasNotMoreData: false,
            isRefreshLoading:false,
            isLoading:false,
            showFooterViewError: false,
            dataSource:[],
        }
        this.city = props.city;
        this.searchPlace = props.searchPlace;
        this.showPopover();
    }

    open(city,place) {
        this.city = city;
        this.searchPlace = place;
        this.currentPage = 0;
        this.data = [];
        // this.loadData(false);
        this.showPopover();
    }

    showPopover() {
        if (!this.props.anchorView)return;
        let anchorView=this.props.anchorView;

        anchorView.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                isLoadingMore: false,
                hasNotMoreData: false,
                isRefreshLoading:false,
                showFooterViewError: false,
                dataSource:[],
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }


    closePopover() {
        this.setState({
            isVisible: false,
        });
        if (typeof(this.props.onClose) == 'function')this.props.onClose();
    }

    componentDidMount() {
        // this.loadData(false);
    }

    componentWillUnmount() {

    }

    renderSearchResultView() {
        let view =
            <View style={[styles.container, {width:GlobalStyles.window_width-48, marginLeft: 24, marginRight: 24,
                top: this.state.buttonRect.y + this.state.buttonRect.height, alignSelf:'center'}]}>
                <FlatList
                    // ListFooterComponent = {this._footerView}
                    renderItem={this._renderItem}
                    // onEndReachedThreshold={0.1}
                    // onEndReached={(info) => {
                    //     this.loadMore();
                    // }}
                    // data={this.state.dataSource}
                    data={DATA}
                    getItemLayout={(data, index) => (
                        { length: 58, offset: (58 + 2) * index, index }
                    ) }
                />
            {/*<Text>测试</Text>*/}
                {/*<View style={styles.item_content}>*/}
                    {/*<Text style={styles.building_name}>平安</Text>*/}
                    {/*<Text style={styles.building_address}>平安福田</Text>*/}
                {/*</View>*/}
        </View>
        return view;
    }

    loadData(loadMore) {
        if (!loadMore) {
            this.setState({
                isLoading:true,
            })
        }

        var url = URLConstances.baidu_place_api + 'q=' + this.searchPlace  + '&region=' + this.city +
            '&output=json&ak=' + (Platform.OS == 'ios' ? KeyConstances.IOS_BAIDU_PLACE_KEY : KeyConstances.ANDROID_BAIDU_PLACE_KEY)
            + '&mcode=' + (Platform.OS == 'ios' ? KeyConstances.IOS_BAIDU_PLACE_CODE : KeyConstances.ANDROID_BAIDU_PLACE_MCODE)
            + '&page_num=' + this.currentPage;

        // var url = URLConstances.baidu_place_suggestion_api + 'query=' + this.searchPlace + '&region=' + '深圳' + '&city_limit=true&output=json&ak=' +
        //     (Platform.OS == 'ios' ? KeyConstances.IOS_BAIDU_PLACE_KEY : KeyConstances.ANDROID_BAIDU_PLACE_KEY) +
        //     '&mcode=' + (Platform.OS == 'ios' ? KeyConstances.IOS_BAIDU_PLACE_CODE : KeyConstances.ANDROID_BAIDU_PLACE_MCODE);

        this.dataManager.fetchDataFromNetwork(url, false, null)
            .then((data) => {
                if (data.status == 0 && data.message == "ok") {
                    if (!!data.results) {
                        if (data.results.length < MAX_PAGE_SIZE) {
                            that.setState({
                                hasNotMoreData:true,
                            })
                        } else {
                            this.currentPage = this.currentPage + 1;
                        }
                        this.data.push.apply(this.data, data.results);
                        this.setState({
                            dataSource:this.data,
                            showFooterViewError:false,
                            isLoadingMore:false,
                            isLoading:false,
                        })
                    } else {
                        this.setState({
                            hasNotMoreData:true,
                            showFooterViewError:false,
                            isLoadingMore:false,
                            isLoading:false,
                        })
                    }
                } else {
                    this.setState({
                        showFooterViewError:true,
                        isLoadingMore:false,
                        isLoading:false,
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    showFooterViewError:true,
                    isLoadingMore:false,
                    isLoading:false,
                })
            })
    }

    loadMore() {
        if (this.state.isLoadingMore || this.state.hasNotMoreData || this.state.isRefreshLoading) {
            return;
        }

        this.setState({
            isLoadingMore:true,
        })
        this.loadData(true);
    }

    _footerView = ()=> {
        var flag = (this.state.isLoadingMore === false
                        && this.state.showFooterViewError === false
                        && this.state.hasNotMoreData === false);
        let content = (flag && (this.currentPage === 0 || !this.data || this.data.length <= 0)) ? <View/> :
            <View style={styles.footer}>
                <Text>{this.state.isLoadingMore ? '加载中' : this.state.showFooterViewError ? '加载错误，请重试' : '已加载所有内容'}</Text>
            </View>
        return content;
    }

    _renderItem = (item)=> {
        return (
            <View style={styles.item_content}>
                <Text style={styles.building_name}>平安</Text>
                <Text style={styles.building_address}>平安福田</Text>
            </View>
        )
    }

    render() {
        return (this.renderSearchResultView());
    }
}

const styles = StyleSheet.create({
    container: {
        position:'absolute',
        alignItems: 'center',
        flex:1
    },

    footer: {
        flex:1,
        height:42,
        justifyContent:'center'
    },

    item_content: {
        justifyContent:'center',
        backgroundColor:'rgba(0,0,0,0.5)',
        minHeight: 48,
        flex:1,
        width:GlobalStyles.window_width - 48,
        marginLeft: 24, marginRight: 24
    },

    building_name: {
        color:'#fff',
        fontSize: 14,
    },

    building_address: {
        color:'#fff',
        fontSize: 14,
    },
})