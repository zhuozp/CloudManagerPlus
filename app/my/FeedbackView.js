/**
 * Created by zhuozhipeng on 29/8/17.
 */
import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    Text,
} from 'react-native'

import GlobalStyles from '../../res/style/GlobalStyles'
import BaseView from '../common/widget/BaseView'
import LoadingProgressView from '../common/widget/LoadingProgressView'
import DataManager from '../manager/DataManager'
import StringUtils from '../util/StringUtils'
import URLConstances from '../constances/URLConstances'
import JsonProcessUtils from '../util/JsonProcessUtils'
import UmInfoInstance from '../um/UmInfoInstance'

export default class FeedbackView extends BaseView {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();
        this.text = '';
        super.navBarTitle('意见反馈')
        this.state = {
            text:this.text,
        }
    }

    navBarRightView() {
        return (
            <TouchableOpacity
                style={{padding: 8}}
                onPress={() => {
                    this.uploadData();
                }}>
                <Text style={{fontSize: GlobalStyles.nav_bar_fontsize, color: '#ffffff'}}>发送</Text>
            </TouchableOpacity>
        )
    }

    uploadData() {
        if (!StringUtils.isNotEmpty(this.state.text)) {
            super.showToast('你还未输入反馈意见');
            return;
        }

        super.setLoadingView(true);
        this.dataManager.fetchDataFromNetwork(URLConstances.feedback_url, false,
            {body: JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({token:UmInfoInstance.getInstance()._loginToken, content: this.state.text}))})
            .then((data)=> {
                super.setLoadingView(false);
                if (!!data) {
                    if (data.code === 0 && data.msg === 'ok') {
                        super.showToast('提交反馈意见成功，感谢您的反馈！')
                    } else {
                        super.showToast(!!data.msg ? data.msg : '发送失败，请重试')
                    }
                } else {
                    super.showToast('发送失败，请重试')
                }
            })
            .catch((error)=> {
                super.setLoadingView(false);
                super.showToast('发送失败，请重试')
            })
    }

    contentRender() {
        return (
            <View style={styles.container}>
                <TextInput
                    ref='feedbackInput'
                    style={styles.content}
                    placeholder={'请输入你的建议(不超过500个字)'}
                    placeholderTextColor={GlobalStyles.nav_bar_backgroundColor}
                    underlineColorAndroid='transparent'
                    onChangeText={(text) => {
                        if (text.length > 500) {
                            this.setState({
                                text:text.substring(0, 500),
                            })
                        } else {
                            this.setState({
                                text:text,
                            })
                        }
                    }}
                    value={this.state.text}
                    multiline={true}
                    textAlignVertical={'top'}
                />
            </View>
        )
    }

    loadingView() {
        return (
            <View style={{width:GlobalStyles.window_width, height:GlobalStyles.window_height, position:'absolute'}}>
                <LoadingProgressView ref = 'loadingView' msg="提交中"/>
            </View>
        )
    }

    outContainerClick() {
        if (!!this.refs.feedbackInput) {
            this.refs.feedbackInput.blur();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:GlobalStyles.backgroundColor,
    },

    content: {
        margin:GlobalStyles.scaleSize(24),
        marginTop:GlobalStyles.scaleSize(56),
        height:GlobalStyles.scaleSize(400),
        width:GlobalStyles.window_width - GlobalStyles.scaleSize(48),
        backgroundColor:'#fff',
        borderWidth:1,
        borderRadius:GlobalStyles.scaleSize(16),
        borderColor:GlobalStyles.nav_bar_backgroundColor,
        padding:GlobalStyles.scaleSize(16),
        fontSize:GlobalStyles.setSpText(12),
    }
})