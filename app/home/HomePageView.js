/**
 * Created by zhuozhipeng on 18/8/17.
 */

import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
} from 'react-native'

import NavigationBar from '../common/widget/NavigationBar'
import UmLoginView from '../um/login/UmLoginView'
import GlobalStyles from '../../res/style/GlobalStyles'
import BuildingSummaryView from '../dataanalyze/BuildingSummaryView'
import PercentageCircle from '../charts/PercentageCircle'
// import PercentageCircle from 'react-native-percentage-circle'
import {FLAG_TAB} from '../main/MainView'
import BuildingDataAnalyzeView from '../dataanalyze/BuildingDataAnalyzeView'
import DataManager from '../manager/DataManager'
import URLConstances from '../constances/URLConstances'
import JsonProcessUtils from '../util/JsonProcessUtils'
import UmInfoInstance from '../um/UmInfoInstance'
import LoadingProgressView from '../common/widget/LoadingProgressView'
const radius = parseInt((Math.ceil(GlobalStyles.window_width / 3) - 36) / 2);
import BaseView from '../common/widget/BaseView'
import SubUserListView from '../um/subuser/SubUserListView'
import HomeDataItem from './model/HomeDataItem'
import PressForPaymentView from '../payment/PressForPaymentView'
import LessorEditView from '../um/relation/lessor/LessorEditView'
import LessorListView from '../um/relation/lessor/LessorListView'
import ContactView from '../contact/ContactView'
import PieChartScreen from '../charts/PieChartScreen'
import TenantListView from '../um/relation/tenant/TenantListView'
import BuildingShareView from '../building/share/BuildingShareView'

export default class HomePageView extends BaseView {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();
        this.state = {
            noticeRed:false,
            noData:true,
        }

        super.navBarLeftViewExist(false);
        super.navBarTitle('壹楼');
        super.needProcessHardwareBackPress(false);
    }

    componentDidMount() {
        super.componentDidMount()
        this.loadData();
    }
    
    // componentWillUnmount() {
    //
    // }

    loadData() {
        super.setLoadingView(true);
        this.dataManager.fetchData(URLConstances.homepage_url, false,
            {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({}))})
            .then((data) => {
                super.setLoadingView(false);
                if (!!data && data.code === 0) {
                    var data = new HomeDataItem(data.msg);
                    var notData = false;
                    if (!data || data.letRate < 0 || data.letRate > 100
                        || data.unoccupiedRate < 0 || data.unoccupiedRate > 100
                        || (data.letRate === 0 && data.unoccupiedRate === 0)) {
                        notData = true;
                    }
                    this.setState({
                        homeData:data,
                        noticeRed:data.notice.length > 0 ? true : false,
                        noData: notData,
                    })
                    
                } else {
                    this.setState({
                        noData: true,
                    })
                }
            }).catch((error) => {
            super.setLoadingView(false);
            this.setData({
                noData:true,
            })
        })
    }

    contentRender() {
        let content = !this.state.isLoading ?
            <ScrollView>
                <View style={[styles.container, {alignItems:'center', justifyContent:'center'}]}>
                    <View style={{alignItems:'center', alignSelf:'center', flexDirection:'row',
                        backgroundColor:'#ffffff',
                        width: GlobalStyles.window_width, backgroundColor:'#fff',
                        justifyContent:'center', height:GlobalStyles.scaleSize(380), width:GlobalStyles.window_width, }}>
                        {/*<View style={{flex : 1}}>*/}
                            {/*<View style={{alignSelf:'center', justifyContent:'center', alignItems:'center'}}>*/}
                                {/*<PercentageCircle radius={radius} percent={30.64} color={"#ff7f7f"}/>*/}

                                {/*<Text style={{fontSize: 16, marginTop: 16, color:'#000000'}}>已租</Text>*/}
                                {/*<Text style={{fontSize: 11, marginTop: 8, color:'#252525'}}>12774.59m²</Text>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                        {/*<View style={{flex : 1}}>*/}
                            {/*<View style={{alignSelf:'center', justifyContent:'center', alignItems:'center'}}>*/}
                                {/*<PercentageCircle radius={radius} percent={69.36} color={"#82e2be"}/>*/}

                                {/*<Text style={{fontSize: 16, marginTop: 16, color:'#000000'}}>空置</Text>*/}
                                {/*<Text style={{fontSize: 11, marginTop: 8, color:'#252525'}}>28918.91m²</Text>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                        {/*<View style={{flex : 1}}>*/}
                            {/*<View style={{alignSelf:'center', justifyContent:'center', alignItems:'center'}}>*/}
                                {/*<PercentageCircle radius={radius} percent={66.02} color={"#479cf2"}/>*/}

                                {/*<Text style={{fontSize: 16, marginTop: 16, color:'#000000'}}>可招商</Text>*/}
                                {/*<Text style={{fontSize: 11, marginTop: 8, color:'#252525'}}>27527.21m²</Text>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                        {/*<PieChartScreen/>*/}
                        <View >
                            <PercentageCircle
                                innerColor={"#fff"}
                                radius={GlobalStyles.scaleSize(145)} percent={this.state.noData ? 100 : this.state.homeData.letRate}
                                color={this.state.noData ? '#c3c3c3': (this.state.homeData.letRate > 0 ? "#22beec" : "#e0e0e0")} bgcolor={"#e0e0e0"}
                                textStyle={{fontSize:0, color:'rgba(0,0,0,0)'}} borderWidth={GlobalStyles.scaleSize(74)}/>
                            <View style={{alignItems:'center',justifyContent:'center', width:GlobalStyles.scaleSize(120), height:GlobalStyles.scaleSize(120),
                                borderRadius: GlobalStyles.scaleSize(60), borderColor: 'rgba(0,0,0,0)', backgroundColor:GlobalStyles.nav_bar_backgroundColor,
                                position:'absolute', top: GlobalStyles.scaleSize(85), left:GlobalStyles.scaleSize(85)}}>
                                <TouchableOpacity onPress={()=> {
                                    if (this.state.noData || !this.state.homeData) {
                                        this.props.mainView.onSelected(FLAG_TAB.flag_buildingTab);
                                    } else {
                                        this.props.navigator.push({
                                            component:BuildingShareView,
                                            name: 'BuildingShareView',
                                        })
                                    }
                                }}>
                                    <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
                                        <Text style={{color:'#fff', fontSize:GlobalStyles.setSpText(10)}}>{this.state.noData ? '创建楼宇' : !!this.state.homeData ? '一键招商' : '创建楼宇'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{marginLeft:GlobalStyles.scaleSize(80)}}>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <View style={{width:GlobalStyles.scaleSize(22), height:GlobalStyles.scaleSize(22), backgroundColor:this.state.noData ? '#e0e0e0' : '#22beec',
                                    marginRight:GlobalStyles.scaleSize(24)}}/>

                                <View>
                                    <Text style={{color:'#3a3a3a', fontSize:GlobalStyles.setSpText(10)}}>{'出租率：' + (this.state.noData ? '0%': this.state.homeData.letRate + '%')}</Text>
                                    <Text style={{color:'#3a3a3a', fontSize:GlobalStyles.setSpText(10), marginTop:GlobalStyles.scaleSize(8)}}>{'已租面积：' + (this.state.noData ? '0m²': this.state.homeData.totalLet + 'm²')}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', marginTop:GlobalStyles.scaleSize(52), alignItems:'center'}}>
                                <View style={{width:GlobalStyles.scaleSize(22), height:GlobalStyles.scaleSize(22), backgroundColor:this.state.noData ? '#e0e0e0': '#e0e0e0',
                                     marginRight:GlobalStyles.scaleSize(24)}}/>
                                <View>
                                    <Text style={{color:'#3a3a3a', fontSize:GlobalStyles.setSpText(10)}}>{'未租率：' + (this.state.noData ? '0%' : this.state.homeData.unoccupiedRate + '%')}</Text>
                                    <Text style={{color:'#3a3a3a', fontSize:GlobalStyles.setSpText(10), marginTop:GlobalStyles.scaleSize(8)}}>{'未租面积：' + (this.state.noData ? '0m²' : this.state.homeData.totalUnoccupied + 'm²')}</Text>
                                </View>

                            </View>
                        </View>
                    </View>

                    <View style={[{marginBottom: 14, backgroundColor:GlobalStyles.backgroundColor}]}/>

                    <View style={styles.one_line_item_container}>
                        {this.getItem(require('../../res/images/home/ic_home_management.png'), '楼宇', '创建管理')}
                        {this.getItem(require('../../res/images/home/ic_home_renter.png'), '租客', '租客信息集合')}
                    </View>
                    <View style={[{marginBottom: 10, backgroundColor:GlobalStyles.backgroundColor}]}/>
                    <View style={styles.one_line_item_container}>
                        {this.getItem(require('../../res/images/home/ic_home_contract.png'), '合同', '机器生成，节省时间')}
                        {this.getItem(require('../../res/images/home/ic_home_date.png'), '数据', '图表结合，一目了然')}
                    </View>
                    <View style={[{marginBottom: 10, backgroundColor:GlobalStyles.backgroundColor}]}/>
                    <View style={styles.one_line_item_container}>
                        {this.getItem(require('../../res/images/home/ic_home_remind.png'), '催租', '短信提醒，高效快捷')}
                        {this.getItem(require('../../res/images/home/ic_home_chidren.png'), '出租方', '提前录入，操作方便')}
                    </View>
                    <View style={[{marginBottom: 60, backgroundColor:GlobalStyles.backgroundColor}]}/>
                </View>
            </ScrollView> : null;

        return (
            <View style={styles.container}>
                {/*{navigationBar}*/}
                <View style={{flex:1}}>
                    {/*{indicatorView}*/}
                    {content}
                </View>
            </View>
        )
    }

    itemClick(title) {
        if (title === '楼宇') {
            this.props.mainView.onSelected(FLAG_TAB.flag_buildingTab);
        } else if (title === '租客') {
            // ToastAndroid.show(title, ToastAndroid.SHORT);
            this.props.navigator.push({
                name:'TenantListView',
                component:TenantListView,
            })
        } else if (title === '合同') {
            // ToastAndroid.show(title, ToastAndroid.SHORT);
            this.props.navigator.push({
                name:'ContactView',
                component:ContactView,
            })
        } else if (title === '数据') {
            this.props.navigator.push({
                name:'BuildingDataAnalyzeView',
                component:BuildingDataAnalyzeView,
            })
        } else if (title === '出租方') {
            // super.showToast('该版本暂未引入子账号功能，敬请期待')
            // this.props.navigator.push({
            //     name:'SubUserListView',
            //     component:SubUserListView,
            //     params: {
            //         subUsers: UmInfoInstance.getInstance()._subUsers,
            //     }
            // })

            this.props.navigator.push({
                name: 'LessorListView',
                component: LessorListView,
            })

        } else if (title === '催租') {
            if (this.state.noticeRed) {
                this.props.navigator.push({
                    name: 'PressForPaymentView',
                    component: PressForPaymentView,
                    params: {
                        notice: this.state.homeData.notice,
                        ignoreCallback: ()=> {
                            this.setState({
                                homeData:this.state.homeData,
                                noticeRed:this.state.homeData.notice.length > 0,
                            })
                        }
                    }
                })
            } else {
                super.showToast('没有租客还租超期信息');
            }
        }
    }
    
    getItem(icon, title, summary) {
        let red = title === '催租' && this.state.noticeRed ?
            <View style={{position:'absolute', top:GlobalStyles.scaleSize(58), left: GlobalStyles.scaleSize(64),
                width:GlobalStyles.scaleSize(12),
                height: GlobalStyles.scaleSize(12), borderRadius:GlobalStyles.scaleSize(6), backgroundColor:'#ff150c'}}>

            </View> : null;
        return (
        <TouchableOpacity onPress={this.itemClick.bind(this, title)}>
            <View style={styles.item_container}>
                <Image style={styles.item_icon} source={icon}/>
                {red}
                <View style={{justifyContent:'center', height:GlobalStyles.scaleSize(176)}}>
                    <Text style={[styles.item_title, {marginTop:GlobalStyles.scaleSize(12)}]}>{title}</Text>
                    <Text style={[styles.item_summary, {marginTop:GlobalStyles.scaleSize(12)}]}>{summary}</Text>
                </View>
            </View>
        </TouchableOpacity>
        )
    }

    getRightNavBtn() {
        return (
            <TouchableHighlight
                style={{padding:8}}
                onPress={()=> {
                    this.props.navigator.push({
                        title: 'UmLoginView',
                        component: UmLoginView,
                    })
                }}>
                <Text style={{fontSize: 14, color: '#ffffff'}}>登录</Text>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:GlobalStyles.backgroundColor,
    },

    one_line_item_container: {
        width: GlobalStyles.window_width,
        height:GlobalStyles.scaleSize(176),
        backgroundColor:'#ffffff',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },

    item_container: {
        width: Math.ceil(GlobalStyles.window_width / 2),
        height: GlobalStyles.scaleSize(176),
        backgroundColor:'#ffffff',
        flexDirection:'row',
        alignItems:'center',
    },

    item_icon: {
        width:GlobalStyles.scaleSize(58),
        height:GlobalStyles.scaleSize(58),
        marginLeft: GlobalStyles.scaleSize(24),
        marginRight:GlobalStyles.scaleSize(18),
    },

    item_title: {
        fontSize: GlobalStyles.setSpText(14),
        color: '#141414'
    },

    item_summary: {
        fontSize: GlobalStyles.setSpText(11),
        color: '#9e9e9e',
    },

    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        flex: 1,
    },
})