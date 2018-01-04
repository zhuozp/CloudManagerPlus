/**
 * Created by zhuozhipeng on 10/8/17.
 */
import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    Image,
} from 'react-native'

import TabNavigator from 'react-native-tab-navigator'
import TabNavigatorItem from "react-native-tab-navigator/TabNavigatorItem"
import GlobalStyles from '../../res/style/GlobalStyles'
import HomePageView from '../home/HomePageView'
import BuildingView from '../building/BuildingView'
import BuildingDataAnalyzeView from '../dataanalyze/BuildingDataAnalyzeView'
import ContactView from '../contact/ContactView'
import MyView from '../my/MyView'

// export var FLAG_TAB = {
//     flag_dataTab: 'flag_dataTab',
//     flag_buildingTab: 'flag_buildingTab',
//     flag_contactTab: 'flag_contactTab',
//     flag_myTab: 'flag_myTab'
// }

export var FLAG_TAB = {
    flag_homeTab: 'flag_homeTab',
    flag_buildingTab: 'flag_buildingTab',
    flag_myTab: 'flag_myTab'
}

export default class MainView extends Component {

    constructor(props) {
        super(props);
        let selectedTab = this.props.selectedTab ? this.props.selectedTab : FLAG_TAB.flag_homeTab;
        this.state = {
            selectedTab: selectedTab,
        }
    }

    _renderTab(refTag, Component, selectedTab, title, renderIcon, selectIcon) {
        return (
            <TabNavigatorItem
                selected={this.state.selectedTab === selectedTab}
                title={title}
                titleStyle={{color:GlobalStyles.normalColor}}
                selectedTitleStyle={{color:GlobalStyles.selectedColor}}
                renderIcon={()=> <Image style={styles.tabBarIcon} source={renderIcon}/>}
                renderSelectedIcon={() => <Image
                    style={styles.tabBarSelectedIcon}
                    source={selectIcon}
                />}
                onPress={() => this.onSelected((selectedTab))}
            >
               <Component {...this.props} mainView = {this} ref={refTag}/>
            </TabNavigatorItem>
        )
    }

    needUpdate(ref) {
        if (ref === 'homePageView') {
            if (!!this.refs.homePageView) {
                this.refs.homePageView.loadData();
            }
        } else if (ref === 'buildingView') {
            if (!!this.refs.buildingView) {
                this.refs.buildingView.loadData(true);
            }
        }
    }

    onSelected(selectedTab) {
        this.setState({
            selectedTab: selectedTab,
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator
                    tabBarStyle={{backgroundColor:'#ffffff'}}
                    sceneStyle={{paddingBottom:0}}
                >
                    {this._renderTab('homePageView', HomePageView, FLAG_TAB.flag_homeTab, '首页', require('../../res/images/tarbar/ic_tab_home.png'), require('../../res/images/tarbar/ic_tab_home_seclect.png'))}
                    {this._renderTab('buildingView', BuildingView, FLAG_TAB.flag_buildingTab, '楼宇', require('../../res/images/tarbar/ic_tab_building.png'), require('../../res/images/tarbar/ic_tab_building_select.png'))}
                    {/*{this._renderTab(ContactView, FLAG_TAB.flag_contactTab, '合同', require('../../res/images/tarbar/ic_contact.png'))}*/}
                    {this._renderTab('myView', MyView, FLAG_TAB.flag_myTab, '我', require('../../res/images/tarbar/ic_tab_my.png'), require('../../res/images/tarbar/ic_tab_my_seclect.png'))}
                </TabNavigator>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    tabBarIcon: {
        width: 26, height: 26,
        resizeMode: 'contain',
    },
    tabBarSelectedIcon: {
        width: 26, height: 26,
        resizeMode: 'contain',
        // tintColor: GlobalStyles.nav_bar_backgroundColor,
    }
})




















