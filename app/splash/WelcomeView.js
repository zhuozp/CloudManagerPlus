/**
 * Created by zhuozhipeng on 11/9/17.
 */
import React,{Component}from 'react'

import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Text,
    Platform,
}  from 'react-native'

import Swiper from 'react-native-swiper'
import GlobalStyles from '../../res/style/GlobalStyles'
import BaseView from '../common/widget/BaseView'
import KeyConstances from '../constances/KeyConstances'
import MainView from '../main/MainView'
import UmInfoInstance from '../um/UmInfoInstance'
import UmLoginView from '../um/login/UmLoginView'
import DataManager from '../manager/DataManager'

const IMGS = [
    require('../../res/images/welcome/pic_welcome_1.png'),
    require('../../res/images/welcome/pic_welcome_2.png'),
    require('../../res/images/welcome/pic_welcome_3.png')
]

export default class WelcomeView extends BaseView {

    constructor(props) {
        super(props);
        this.dataManager = new DataManager();
        super.needProcessHardwareBackPress(false);
    }

    render() {
        return (
            <View style={{flex:1}}>
                <Swiper
                    // showsButtons
                    autoplay={false}
                    loop={false}
                >
                    {
                        this.renderView().map((elem, index) => {
                            return elem;
                        })
                    }
                </Swiper>
            </View>
        )
    }

    renderView() {
        var viewContent=[];
        for(var i=0;i < IMGS.length;i++){
            viewContent.push(
                <View style={styles.container}>
                    <Image style={styles.container} source={IMGS[i]}/>
                    {i=== IMGS.length-1 ?
                        <View style={[styles.container, {position:'absolute', alignItems:'center', justifyContent:'flex-end'}]}>
                            <TouchableOpacity onPress={()=> {
                                if (!this.props.fromAboutPage) {
                                    this.determineTo();
                                } else {
                                    super.onBack();
                                }
                            }}>
                                <View style={{justifyContent:'center', alignItems:'center',
                                    width:GlobalStyles.scaleSize(200), height:GlobalStyles.scaleSize(80),
                                    backgroundColor:GlobalStyles.nav_bar_backgroundColor,
                                    borderRadius:GlobalStyles.scaleSize(16), marginBottom:GlobalStyles.scaleSize(120)}}>
                                    <Text style={{color:'#fff', fontSize:GlobalStyles.setSpText(16)}}>开始使用</Text>
                                </View>
                            </TouchableOpacity>
                        </View> : null}
                    {this.props.fromAboutPage ?
                        <View style={{position:'absolute', padding:GlobalStyles.scaleSize(16),
                            top:GlobalStyles.scaleSize(60), left:GlobalStyles.scaleSize(24)}}>
                            <TouchableOpacity onPress={()=> {
                                super.onBack();
                            }}>
                                <Image style={{padding: GlobalStyles.scaleSize(16), width:GlobalStyles.scaleSize(60), height:GlobalStyles.scaleSize(60)}} source={require('../../res/images/common/ic_back_white.png')}/>
                            </TouchableOpacity>

                        </View> : null}
                </View>
            );
        }

        return viewContent;
    }

    determineTo() {
        const {navigator} = this.props;
        this.dataManager.getData(KeyConstances.KEY_USER_INFO).then((data) => {
            if (!!data && !!data.token && data.token.length > 0) {
                if (UmInfoInstance.getInstance()._experienceAccount) {
                    navigator.resetTo({
                        component: UmLoginView,
                        name: 'UmLoginView',
                    });
                } else {
                    UmInfoInstance.getInstance().setInfo(data);
                    navigator.resetTo({
                        component: MainView,
                        name: 'MainView',
                    });
                }
            } else {
                navigator.resetTo({
                    component: UmLoginView,
                    name: 'UmLoginView',
                });
            }
        }).catch((error) => {
            navigator.resetTo({
                component: UmLoginView,
                name: 'UmLoginView',
            });
        })
    }
}

const styles = StyleSheet.create({
    container: {
        width: GlobalStyles.window_width,
        height: GlobalStyles.window_height - (Platform.OS === 'ios' ? 0 : GlobalStyles.scaleSize(20)),
    }
})
