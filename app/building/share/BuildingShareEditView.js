/**
 * Created by zhuozhipeng on 13/9/17.
 */

import React from 'react'

import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    TextInput,
    TouchableWithoutFeedback
} from 'react-native'

import BaseView from '../../common/widget/BaseView'
import GlobalStyles from '../../../res/style/GlobalStyles'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

var dismissKeyboard = require('dismissKeyboard');

export default class BuildingShareEditView extends BaseView {
    constructor(props) {
        super(props);
        this.content = this.props.shareTx;
        this.state = {
            text: this.props.shareTx,
            showShareView: false,
        }
        super.navBarTitle('分享编辑')
    }

    navBarRightView() {
        return (
            <TouchableOpacity
                style={{padding: 8}}
                onPress={() => {
                    this.setState({
                        showShareView: true,
                    })
                    if (!!this.refs.share) {
                        this.refs.share.setVisible(true);
                    }
                }}>
                <Text style={{fontSize: GlobalStyles.nav_bar_fontsize, color: '#ffffff'}}>分享</Text>
            </TouchableOpacity>
        )
    }

    shareCallback() {
        this.setState({
            showShareView: false,
        })
    }

    shareClickCallback(title) {
        if (!!this.refs.share) {
            this.refs.share.share(title, this.content, (text)=> {
                super.showToast(text);
            });
        }
    }

    contentRender() {
        return (
            <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
                <TouchableWithoutFeedback onPress={()=> {
                    this.outContainerClick();
                }}>
                    <View style={styles.container}>
                        <TextInput
                            ref='feedbackInput'
                            style={styles.content}
                            placeholder={'请输入要分享的内容'}
                            placeholderTextColor={GlobalStyles.nav_bar_backgroundColor}
                            underlineColorAndroid='transparent'
                            onChangeText={(text) => {
                                this.content = text;
                                this.setState({
                                    text: text,
                                })
                            }}
                            value={this.state.text}
                            multiline={true}
                            textAlignVertical={'top'}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        )
    }

    outContainerClick() {
        dismissKeyboard();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.backgroundColor,
    },

    content: {
        margin: GlobalStyles.scaleSize(24),
        marginTop: GlobalStyles.scaleSize(56),
        height: GlobalStyles.scaleSize(560),
        width: GlobalStyles.window_width - GlobalStyles.scaleSize(48),
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: GlobalStyles.scaleSize(16),
        borderColor: GlobalStyles.nav_bar_backgroundColor,
        padding: GlobalStyles.scaleSize(16),
        fontSize: GlobalStyles.setSpText(12),
    }
})