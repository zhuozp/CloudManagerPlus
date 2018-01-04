/**
 * Created by zhuozhipeng on 7/9/17.
 */
import React from 'react'

import {
    StyleSheet,
    WebView,
    View,
} from 'react-native'

import BaseView from '../common/widget/BaseView'
import GlobalStyles from '../../res/style/GlobalStyles'

var WEBVIEW_REF = 'webview';

export default class NoticeMsgDetailView extends BaseView {
    constructor(props) {
        super(props);

        super.navBarTitle('通知消息')

        this.state={
            canGoBack:false,
            url: this.props.url,
        }
    }

    contentRender() {
        return (

            <View style={styles.container}>
                <WebView
                    style={{flex:1, width:GlobalStyles.window_width}}
                    ref={WEBVIEW_REF}
                    startInLoadingState={false}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                    source={{uri: this.state.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}/>
            </View>
        )
    }

    onBack() {
        if (this.state.canGoBack) {
            this.refs[WEBVIEW_REF].goBack();
        } else {
            this.props.navigator.pop();
        }
    }

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:GlobalStyles.backgroundColor,
    }
})