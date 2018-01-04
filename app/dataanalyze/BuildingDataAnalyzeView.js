/**
 * Created by zhuozhipeng on 11/8/17.
 */
import React, {
    Component
} from 'react';

import {
    View,
    StyleSheet,
    Text,
    ActivityIndicator
} from 'react-native'

import GlobalStyles from '../../res/style/GlobalStyles';
import NavigationBar from '../common/widget/NavigationBar'
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view'
import BuildingSummaryView from '../dataanalyze/BuildingSummaryView'
import BuildingTSView from '../dataanalyze/BuildingTSView'
import BuildingRCView from '../dataanalyze/BuildingRCView'
import BaseCommon from '../common/BaseCommon'
import ViewUtils from '../util/ViewUtils'
import BaseView from '../common/widget/BaseView'
import DataManager from '../manager/DataManager'
import URLConstances from '../constances/URLConstances'
import JsonProcessUtils from '../util/JsonProcessUtils'
import Toast from 'react-native-easy-toast'
import ToastUtils from '../util/ToastUtils'


export default class BuildingDataAnalyzeView extends Component {
    constructor(props) {
        super(props);
        this.common = new BaseCommon({...props, backPress: (e) => this.onBackPress(e)});
        this.dataManager = new DataManager();

        this.state={
            isLoading:true,
        }
    }

    componentDidMount() {
        this.common.componentDidMount();
        this.setState({
            isLoading:true,
        })
        this.dataManager.fetchDataFromNetwork(URLConstances.building_data_url, false,
            {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({}))})
            .then((data)=> {
                if (!!data && data.code === 0) {
                    if (typeof (data.msg) !== 'string') {
                        this.setState({
                            data: data.msg,
                        })
                    } else {
                        if (!!this.refs.toast) {
                            ToastUtils.toast(this.refs.toast, !!data && data.msg ? data.msg : '数据加载失败，请稍后再试');
                        }
                    }
                } else {
                    if (!!this.refs.toast) {
                        ToastUtils.toast(this.refs.toast, !!data && data.msg ? data.msg : '数据加载失败，请稍后再试');
                    }
                }
                this.setState({
                    isLoading:false,
                })
            })
            .catch((error)=> {
                this.setState({
                    isLoading:false,
                })

                if (!!this.refs.toast) {
                    ToastUtils.toast(this.refs.toast, '数据加载失败，请稍后再试');
                }
            })
    }

    render() {
        let navigationBar =
            <NavigationBar
                leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                style={{backgroundColor: GlobalStyles.nav_bar_backgroundColor}}
                title='楼宇数据'/>;
        let loadingView = this.state.isLoading ?
            <View style={{position:'absolute', flex:1,
                justifyContent:'center', alignItems:'center'}}>
                {this.loadingView()}
            </View> : null;
        return (
            <View style={styles.container}
            >
                {navigationBar}
                {loadingView}
                {!this.state.isLoading ?
                    <ScrollableTabView
                    tabBarUnderlineColor='#e7e7e7'
                    tabBarInactiveTextColor='mintcream'
                    tabBarActiveTextColor='white'
                    tabBarBackgroundColor={GlobalStyles.nav_bar_backgroundColor}
                    ref="scrollableTabView"
                    initialPage={0}
                    renderTabBar={() => <ScrollableTabBar style={{height: 40,borderWidth:0,elevation:2}} tabStyle={{height: 39}}
                                                          underlineHeight={2}/>}
                >
                    {/*<BuildingSummaryView tabLabel='概览'/>*/}
                    <BuildingTSView tabLabel='成交统计' data={this.state.data}/>
                    <BuildingRCView tabLabel='租控统计' data={this.state.data}/>
                </ScrollableTabView> : null}
                <Toast ref='toast' position={'center'}/>
            </View>
        )
    }

    loadingView() {
        return (
            <ActivityIndicator
                animating={this.state.isLoading}
                style={[styles.centering,]}
                size="large"
            />
        )
    }

    componentWillUnmount() {
        this.common.componentWillUnmount();
    }

    onBack() {
        this.props.navigator.pop();
    }

    onBackPress(e) {
        this.onBack();
        return true;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.backgroundColor,
    }
})