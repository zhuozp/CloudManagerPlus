/**
 * Created by zhuozhipeng on 29/8/17.
 */

import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native'

import BaseCommon from '../BaseCommon'
import NavigationBar from './NavigationBar'
import ViewUtils from '../../util/ViewUtils'
import GlobalStyles from '../../../res/style/GlobalStyles'
import ShareView from '../../share/ShareView'
import Toast from 'react-native-easy-toast'
import ToastUtils from '../../util/ToastUtils'

export default class BaseView extends Component {
    constructor(props) {
        super(props);
        this.common = new BaseCommon({...props, backPress: (e) => this.onBackPress(e)});
        // this.state = {
        //     isLoading:this.props.loading,
        // }
        this.title = '';
        this.hasLeftView = true;
        this.needHardwareBackPress = true;
        this.shareContent = null;
    }

    navigatorBar(title, rightView) {
        let leftView = this.hasLeftView ? ViewUtils.getLeftButton(() => this.onBack()) : undefined;
        return (
            <NavigationBar
                navigator={this.props.navigator}
                leftButton={leftView}
                rightButton={rightView}
                style={{backgroundColor: GlobalStyles.nav_bar_backgroundColor}}
                popEnabled={true}
                title={title}
            />
        )
    }

    render() {
        let loadingView = this.state.isLoading ?
            <View style={{position:'absolute', flex:1,
                justifyContent:'center', alignItems:'center'}}>
                {this.loadingView()}
            </View> : null;
        let shareView = this.state.showShareView ? <ShareView ref='share' callback={this.shareCallback} shareClickCallback={(text) => {this.shareClickCallback(text)}}/> : null;
        return (
            <TouchableWithoutFeedback onPress={this.outContainerClick.bind(this)}>
                <View style={styles.container}>
                    {this.navigatorBar(this.title, this.navBarRightView())}
                    <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor: GlobalStyles.backgroundColor}}>
                        {this.contentRender()}
                        {loadingView}
                    </View>
                    {shareView}
                    <Toast ref='toast' position={'center'}/>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    outContainerClick() {

    }

    showShareView() {
        this.setState({
            showShareView:true,
        })
        if (!!this.refs.share) {
            this.refs.share.setVisible(true);
        }
    }

    showToast(str) {
        if (!!this.refs.toast) {
            ToastUtils.toast(this.refs.toast, str);
        }
    }

    shareCallback() {
        this.setState({
            showShareView: false,
        })
    }

    contentRender() {

    }

    navBarRightView() {

    }

    navBarTitle(title) {
        this.title = title;
    }
    
    navBarLeftViewExist(flag) {
        this.hasLeftView = flag;
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

    setLoadingView(visible) {
        this.setState({
            isLoading:visible,
        })
    }

    needProcessHardwareBackPress(flag) {
        this.needHardwareBackPress = flag;
    }

    componentDidMount() {
        this.common.componentDidMount();
    }

    componentWillUnmount() {
        this.common.componentWillUnmount();
    }

    onBack() {
        this.props.navigator.pop();
    }

    onBackPress() {
        this.onBack();
        return this.needHardwareBackPress;
    }

    shareClickCallback(title) {

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:GlobalStyles.backgroundColor,
        flex:1,
    },
    centering: {
        alignSelf:'center',
        padding: 8,
        flex:1
    },
})