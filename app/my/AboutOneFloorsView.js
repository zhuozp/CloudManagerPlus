/**
 * Created by zhuozhipeng on 29/8/17.
 */
import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    Linking,
    Platform,
} from 'react-native'

import NavigationBar from '../common/widget/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import GlobalStyles from '../../res/style/GlobalStyles'
import BaseView from '../common/widget/BaseView'
import Package from '../../package.json'
import URLConstances from '../constances/URLConstances'
import WelcomeView from '../splash/WelcomeView'

export default class AboutOneFloorsView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {};
        super.navBarTitle('关于我们')
    }

    contentRender() {
        return (
            <View style={styles.container}>
                <View style={{marginTop: GlobalStyles.scaleSize(60), alignItems:'center', paddingBottom: GlobalStyles.scaleSize(36)}}>
                    <Image style={{width: GlobalStyles.scaleSize(120), height: GlobalStyles.scaleSize(120)}} source={require('../../res/images/logo/ic_applogo_120.png')}/>
                    <Text style={{marginTop: GlobalStyles.scaleSize(32), fontSize: GlobalStyles.setSpText(14), color: GlobalStyles.normalColor}}>{'壹楼 ' +  Package.version}</Text>
                </View>
                <View style={{height:0.5, backgroundColor:'#c3c3c3'}}/>
                {this.getItem('去评分')}
                <View style={{height:0.5, backgroundColor:'#c3c3c3',left:GlobalStyles.scaleSize(32)}}/>
                {this.getItem('欢迎页')}
                <View style={{height:0.5, backgroundColor:'#c3c3c3',left:GlobalStyles.scaleSize(32)}}/>
                {/*{this.getItem('联系我们')}*/}
                {/*<View style={{height:0.5, backgroundColor:'#c3c3c3'}}/>*/}


            </View>
        )
    }

    getItem(title) {
        return (
            <TouchableOpacity onPress={this.itemClick.bind(this, title)}>
                <View style={{flexDirection:'row', justifyContent:'space-between', width: GlobalStyles.window_width, alignItems:'center', height: GlobalStyles.scaleSize(84), backgroundColor:'#fff'}}>
                    <Text style={{marginLeft:GlobalStyles.scaleSize(32), color:GlobalStyles.selectedColor}}>{title}</Text>
                    <Image style={{width:GlobalStyles.scaleSize(38), height:GlobalStyles.scaleSize(38), marginRight:GlobalStyles.scaleSize(32)}} source={require('../../res/images/common/ic_forword.png')}/>
                </View>
            </TouchableOpacity>
        )
    }

    itemClick(title) {
        if ('去评分' === title) {
            var url = URLConstances.ANDROID_MARKETING;
            if (Platform.OS === 'ios') {
                url = URLConstances.IOS_APP_STORE_URL;
            }
            Linking.openURL(url)
                .catch((err)=>{
                    console.log('An error occurred', err);
                });
        } else if ('欢迎页' === title) {
            this.props.navigator.push({
                name: 'WelcomeView',
                component: WelcomeView,
                params: {
                    fromAboutPage:true,
                }
            })
        } else if ('联系我们' === title) {
            Linking.openURL('tel:13530164033')
                .catch((err)=>{
                    console.log('An error occurred', err);
                });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:GlobalStyles.backgroundColor,
    }
})