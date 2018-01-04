/**
 * Created by zhuozhipeng on 22/8/17.
 */

import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    Text,
    Modal,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native'

import GlobalStyles from '../../res/style/GlobalStyles'
import BaseCommon from '../common/BaseCommon'
import * as WeChat from 'react-native-wechat'

export default class ShareView extends Component {
    constructor(props) {
        super(props);
        // this.common = new BaseCommon({...props, backPress: (e) => this.onBackPress(e)});
        this.state = {
            isVisible : true,
        }
    }

    componentDidMount (){
        WeChat.registerApp('wx590c2f4013637cc6');
    }

    // componentDidMount() {
    //     this.common.componentDidMount();
    // }
    //
    // componentWillUnmount() {
    //     this.common.componentWillUnmount();
    // }
    //
    // onBackPress(e) {
    //     if (this.state.isVisible) {
    //         this.setVisible(false);
    //         if (!!this.props.shareCallback) {
    //             this.props.shareCallback();
    //         }
    //         return true;
    //     }
    // }

    render() {
        return (
        <Modal
            animationType={"none"}
            transparent={true}
            visible={this.state.isVisible}
            onRequestClose={()=> {
                this.setVisible(false);
                if (!!this.props.shareCallback) {
                    this.props.shareCallback();
                }
            }}
        >
            <TouchableWithoutFeedback onPress={()=> {
                this.setVisible(false);
                if (!!this.props.shareCallback) {
                    this.props.shareCallback();
                }
            }}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={()=> {}}>
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={()=> {
                                    // this.share.bind(this, 'wechat')
                                    if (typeof (this.props.shareClickCallback) === 'function') {
                                        this.props.shareClickCallback('wechat');
                                    }
                                    this.setVisible(false);
                                    if (!!this.props.shareCallback) {
                                        this.props.shareCallback();
                                    }
                                }}>
                                    <View style={{justifyContent:'center', alignItems:'center'}}>
                                        <Image style={{width: 54, height:54}} source={require('../../res/images/share/wechat.png')}/>
                                        <Text style={{marginTop: 12}}>微信好友</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=> {
                                    if (typeof (this.props.shareClickCallback) === 'function') {
                                        this.props.shareClickCallback('friendGround');
                                    }
                                    this.setVisible(false);
                                    if (!!this.props.shareCallback) {
                                        this.props.shareCallback();
                                    }
                                }}>
                                    <View style={{marginLeft: 58, justifyContent:'center', alignItems:'center'}}>
                                        <Image style={{width: 54, height:54}} source={require('../../res/images/share/friendround.png')}/>
                                        <Text style={{marginTop: 12}}>朋友圈</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={
                                () => {
                                    this.setVisible(false);
                                    if (!!this.props.shareCallback) {
                                        this.props.shareCallback();
                                    }
                                }
                            }>
                                <View style={styles.footer}>
                                    <Text style={{textAlign:'center', fontSize: 18}}>取消</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
        )
    }

    setVisible(flag) {
        this.setState({
            isVisible: flag,
        })
    }

    share(title, content, callback) {
        if (title === 'wechat') {
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                    if (isInstalled) {
                        WeChat.shareToSession({
                            // thumbImage: 'http://mta.zttit.com:8080/images/ZTT_1404756641470_image.jpg',
                            type: 'text',
                            title: '', // WeChat app treat title as file name
                            description: content,
                            webpageUrl:'http://blog.csdn.net/liu__520/article/details/52801139',
                        })
                            .catch((error) => {
                                console.log(error.message);
                            });
                    }else {
                        if (!!callback) {
                            callback('没有安装微信软件')
                        }
                        console.log('没有安装微信软件');
                    }
                });
        } else if (title === 'friendGround') {
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                    if (isInstalled) {
                        WeChat.shareToTimeline({
                            // thumbImage: 'http://mta.zttit.com:8080/images/ZTT_1404756641470_image.jpg',
                            type: 'text',
                            title: '', // WeChat app treat title as file name
                            description: content,
                        })
                            .catch((error) => {
                                console.log(error.message);
                            });
                    }else {
                        if (!!callback) {
                            callback('没有安装微信软件')
                        }
                        console.log('没有安装微信软件');
                    }
                });
        }
    }

    urlShare(title, data, callback) {
        if (title === 'wechat') {
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                    if (isInstalled) {
                        WeChat.shareToSession({
                            thumbImage: data.imgUrl,
                            type: 'news',
                            title: data.shareTitle, // WeChat app treat title as file name
                            description: data.content,
                            webpageUrl:data.url,
                        })
                            .catch((error) => {
                                console.log(error.message);
                            });
                    }else {
                        if (!!callback) {
                            callback('没有安装微信App')
                        }
                        console.log('没有安装微信App');
                    }
                });
        } else if (title === 'friendGround') {
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                    if (isInstalled) {
                        WeChat.shareToTimeline({
                            thumbImage: data.imgUrl,
                            type: 'news',
                            title: data.shareTitle, // WeChat app treat title as file name
                            description: data.content,
                            webpageUrl:data.url,
                        })
                            .catch((error) => {
                                console.log(error.message);
                            });
                    }else {
                        if (!!callback) {
                            callback('没有安装微信App')
                        }
                        console.log('没有安装微信App');
                    }
                });
        }
    }

    fileShare(title, data, callback) {
        if (title === 'wechat') {
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                    if (isInstalled) {
                        WeChat.shareToSession({
                            type: 'file',
                            title: data.shareTitle, // WeChat app treat title as file name
                            description: data.content,
                            filePath:data.path,
                            fileExtension: data.fileExtension,
                            mediaTagName: 'word file',
                            messageAction: undefined,
                            messageExt: undefined,
                        })
                            .catch((error) => {
                                console.log(error.message);
                            });
                    }else {
                        if (!!callback) {
                            callback('没有安装微信App')
                        }
                        console.log('没有安装微信App');
                    }
                });
        } else if (title === 'friendGround') {
            callback('为保障租客权益，不允许分享到朋友圈')
            return;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent:'flex-end',
    },

    content: {
        margin:12,
        width: GlobalStyles.window_width - 24,
    },

    header: {
        padding: 16,
        backgroundColor:'#ffffff',
        width: GlobalStyles.window_width - 24,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        marginBottom: 12,
        borderRadius:8,
    },

    footer: {
        borderRadius:8,
        height: 52,
        backgroundColor:'#ffffff',
        width: GlobalStyles.window_width - 24,
        alignItems:'center',
        justifyContent:'center',
    }
})