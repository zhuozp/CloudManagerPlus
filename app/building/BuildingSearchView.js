/**
 * Created by Gibbon on 2017/8/25.
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
    Text,
    ActivityIndicator,
    TextInput,
} from 'react-native'

import DataManager from '../manager/DataManager'
import URLConstances from '../constances/URLConstances'
import KeyConstances from '../constances/KeyConstances'
import GlobalStyles from '../../res/style/GlobalStyles'
import ViewUtils from '../util/ViewUtils'
import BaseCommon from '../common/BaseCommon'
import Toast from 'react-native-easy-toast'
import StringUtils from '../util/StringUtils'

const MAX_PAGE_SIZE = 10;

export default class BuildingSearchView extends Component {
    constructor(props) {
        super(props);
        this.common = new BaseCommon({...props, backPress: (e) => this.onBackPress(e)});
        this.dataManager = new DataManager();
        this.currentPage = 0;
        this.data = [];
        this.searchPlace = this.props.searchPlace;
        this.state = {
            isVisible: false,
            isLoadingMore: false,
            hasNotMoreData: false,
            isRefreshLoading:false,
            isLoading:false,
            showFooterViewError: false,
            dataSource:[],
            searchPlace:this.props.searchPlace,
        }
    }

    componentDidMount() {
        this.common.componentDidMount();
        this.loadData(false, this.props.searchPlace);
    }

    componentWillUnmount() {
        this.common.componentWillUnmount();
    }

    onBack() {
        this.refs.input.blur();
        this.props.navigator.pop();
    }

    onBackPress() {
        this.onBack();
        return true;
    }


    renderNavBar() {
        let backButton =ViewUtils.getLeftButton(()=>this.onBackPress());
        let onFocus = !StringUtils.isNotEmpty(this.props.searchPlace)
        let inputView =
            <TextInput
                ref="input"
                autoFocus={onFocus}
                style={styles.textInput}
                underlineColorAndroid='transparent'
                placeholder="搜索大厦"
                placeholderTextColor="white"
                clearButtonMode="while-editing"
                onChangeText={(inputKey) => {
                    this.searchPlace = inputKey;
                }}
            />;
        let rightButton =
            <TouchableOpacity
                onPress={()=> {
                    this.refs.input.blur();
                    this.setState({
                        searchPlace: this.searchPlace
                    })
                    this.onRightButtonClick(this.searchPlace);
                }}
            >
                <View style={{alignItems: 'center', marginRight: GlobalStyles.scaleSize(20)}}>
                    <Text style={[styles.title, {color:'#fff'}]}>搜索</Text>
                </View>
            </TouchableOpacity>;
        return (
            <View style={{
                backgroundColor: GlobalStyles.nav_bar_backgroundColor,
                height: Platform.OS==='ios'? GlobalStyles.nav_bar_height_ios:GlobalStyles.nav_bar_height_android,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                {backButton}
                {inputView}
                {rightButton}
            </View>
        )
    }

    onRightButtonClick(searchPlace) {
        this.loadData(false, searchPlace);
    }

    renderSearchResultView() {
        let statusBar = null;

        if (Platform.OS === 'ios') {
            statusBar =
                <View style={[styles.statusBar, {backgroundColor: GlobalStyles.nav_bar_backgroundColor}]}/>;
        }
        let indicatorView = this.state.isLoading ?
            <ActivityIndicator
                animating={this.state.isLoading}
                style={[styles.centering,]}
                size="large"
            /> : null;
        let listView = !this.state.isLoading ?
            <FlatList
                ListFooterComponent = {this._footerView}
                ListHeaderComponent = {this._headerView}
                renderItem={this._renderItem}
                onEndReachedThreshold={0.1}
                onEndReached={(info) => {
                     this.loadMore(this.state.searchPlace);
                }}
                data={this.state.dataSource}
                getItemLayout={(data, index) => (
                    { length: GlobalStyles.scaleSize(114), offset: GlobalStyles.scaleSize(115) * index, index }
                ) }
            /> : null;
        let resultView =
            <View style={{flex:1}}>
                {indicatorView}
                {listView}
            </View>

        return (
            <View style={styles.container}>
                {statusBar}
                {this.renderNavBar()}
                {resultView}
                <Toast ref="toast" position='bottom'/>
            </View>
        )
    }

    loadData(loadMore, searchPlace) {
        if (!loadMore) {
            if (StringUtils.isNotEmpty(searchPlace)) {
                this.setState({
                    isLoading:true,
                })
            } else {
                return;
            }
        }

        var url = URLConstances.baidu_place_api + 'q=' + searchPlace  + '&region=' + this.props.city +
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
                            this.setState({
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

    loadMore(searchPlace) {
        if (this.state.isLoadingMore || this.state.hasNotMoreData || this.state.isRefreshLoading) {
            return;
        }

        this.setState({
            isLoadingMore:true,
        })
        this.loadData(true, searchPlace);
    }

    _headerView = ()=> {
        let str = '搜索' + this.props.city +  '"' + this.state.searchPlace + '"' + '关键字的楼宇'
        return (
            <View style={{width:GlobalStyles.window_width, height:42,
                justifyContent:'center', marginRight:12,
                borderBottomColor:'#c3c3c3',
                borderBottomWidth:0.5}}>
                <Text style={{color:'#cecece',marginLeft:12}}>{str}</Text>
            </View>
        )
    }

    _footerView = ()=> {
        var flag = (this.state.isLoadingMore === false
        && this.state.showFooterViewError === false
        && this.state.hasNotMoreData === false);
        let content = (flag && (this.currentPage === 0 || !this.data || this.data.length <= 0)) ? <View/> :
            <View style={styles.footer}>
                <Text style={{marginLeft:GlobalStyles.scaleSize(24)}}>{this.state.isLoadingMore ? '加载中' : this.state.showFooterViewError ? '加载错误，请重试'
                    : !this.state.hasNotMoreData ? '上拉加载更多' : (!!this.data.dataSource && this.data.dataSource.length > 0) ? '已加载所有内容' : '没有搜索到相应地址'}</Text>
            </View>
        return content;
    }

    _renderItem = (item)=> {
        let name = item.item.name;
        let address = item.item.address;
        return (
            <TouchableOpacity onPress={()=> {
                if (typeof(this.props.selectSearchResult) === "function") {
                    this.props.selectSearchResult(item.item);
                    this.onBack()
                }
            }}>
                <View style={[styles.item_content, {borderBottomWidth:0.5, borderBottomColor:'#c3c3c3', alignItems:'center'}]}>
                    <Text style={styles.building_name}>{name}</Text>
                    <Text style={styles.building_address} multiline={true}>{address}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (this.renderSearchResultView());
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:GlobalStyles.backgroundColor,
    },

    footer: {
        flex:1,
        height:GlobalStyles.scaleSize(84),
        justifyContent:'center',
        width:GlobalStyles.window_width,
        borderBottomColor:'#c3c3c3',
        borderBottomWidth:0.5,
        color:'#c3c3c3'
    },

    item_content: {
        justifyContent:'center',
        minHeight:GlobalStyles.scaleSize(114),
        width:GlobalStyles.window_width,
        backgroundColor:'#ffffff'
    },

    building_name: {
        color:'#000',
        fontSize: GlobalStyles.setSpText(14),
        width:GlobalStyles.window_width-GlobalStyles.scaleSize(48),
        marginLeft: GlobalStyles.scaleSize(24),
        marginRight: GlobalStyles.scaleSize(24),
    },

    building_address: {
        color:'#c3c3c3',
        fontSize: GlobalStyles.scaleSize(24),
        width:GlobalStyles.window_width-GlobalStyles.scaleSize(48),
        marginLeft: GlobalStyles.scaleSize(24),
        marginRight: GlobalStyles.scaleSize(24),
        marginTop:GlobalStyles.scaleSize(12),
    },

    textInput: {
        flex: 1,
        height: (Platform.OS === 'ios') ?30:40,
        borderWidth: 1,
        borderColor: 'white',
        alignSelf: 'center',
        paddingLeft: GlobalStyles.scaleSize(10),
        marginLeft: GlobalStyles.scaleSize(10),
        marginRight: GlobalStyles.scaleSize(20),
        borderRadius: GlobalStyles.scaleSize(6),
        opacity: 0.7,
        color:'white'
    },
    statusBar: {
        height: 20,
    },
})