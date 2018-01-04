/**
 * Created by zhuozhipeng on 10/8/17.
 */

import React, {
    Component
} from 'react';

import {
    View,
    StyleSheet,
    InteractionManager,
    Platform,
} from 'react-native';

import SplashScreen from '../module/SplashScreen';
import MainView from '../main/MainView'
import UmLoginView from '../um/login/UmLoginView'
import UmRegisterFirstView from '../um/register/UmRegisterFirstView'
import LocationTest from '../location/LocationTest'
import SwipeListViewTest from '../test/SwipeListViewTest'
import ImagePickerTest from '../test/ImagePickerTest'

import DataManager from '../manager/DataManager'
import KeyConstances from '../constances/KeyConstances'
import UmInfoInstance from '../um/UmInfoInstance'
import PieChartScreen from '../charts/PieChartScreen'
import Package from '../../package.json'
import StringUtils from '../util/StringUtils'
import WelcomeView from './WelcomeView'

export default class SplashView extends Component {
    componentDidMount() {
        const {navigator} = this.props;
        this.dataManager = new DataManager();
        this.timer = setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                SplashScreen.hide();
                this.checkNewVersion();
                // this.determineTo();
                // this.gotoWelcomPage();
            });
        }, 500);
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={styles.container}>
                {/*<Image style={{flex:1,width:null}} resizeMode='repeat' source={require('../../res/images/LaunchScreen.png')}/>*/}
            </View>
        );
    }

    checkNewVersion() {
        this.dataManager.getData(KeyConstances.KEY_NEW_VERSION).then((data)=> {

            if (!!data && StringUtils.isNotEmpty(data.key_for_version_data)) {
                var oldStr = data.key_for_version_data.split('.');
                var oldStrNum = 0;
                for (let i = 0; i < oldStr.length; i++) {
                    oldStrNum = oldStrNum + oldStr[i] * (2 << (16 - 4 * i))
                }

                var newStr = Package.version.split('.');
                var newStrNum = 0;
                for (let i = 0; i < newStr.length; i++) {
                    newStrNum = newStrNum + newStr[i] * (2 << (16 - 4 * i))
                }

                if (newStrNum > oldStrNum) {
                    this.dataManager.saveData(KeyConstances.KEY_NEW_VERSION, JSON.stringify({key_for_version_data:Package.version}));
                    this.gotoWelcomPage();
                } else {
                    this.determineTo();
                }
            } else {
                this.dataManager.saveData(KeyConstances.KEY_NEW_VERSION, JSON.stringify({key_for_version_data:Package.version}));
                this.gotoWelcomPage();
            }
        }).catch((error)=> {
            this.dataManager.saveData(KeyConstances.KEY_NEW_VERSION, JSON.stringify({key_for_version_data:Package.version}));
            this.gotoWelcomPage();
        })
    }

    gotoWelcomPage() {
        this.props.navigator.resetTo({
            component:WelcomeView,
            name:'WelcomeView',
        })
    }

    determineTo() {
        const {navigator} = this.props;
        this.dataManager.getData(KeyConstances.KEY_USER_INFO).then((data) => {
            if (!!data && !!data.token && data.token.length > 0) {
                UmInfoInstance.getInstance().setInfo(data);
                if (UmInfoInstance.getInstance()._experienceAccount) {
                    navigator.resetTo({
                        component: UmLoginView,
                        name: 'UmLoginView',
                    });
                } else {
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
    container:{
        flex:1,
    }
})