/**
 * Created by zhuozhipeng on 2017/9/26.
 */

import React, {
    Component,
} from 'react'

import {
    StyleSheet,
    View,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Text,
    InteractionManager,
} from 'react-native'

import GlobalStyles from '../../../res/style/GlobalStyles'

export default class ImagePickerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible : true,
        }
    }

    setVisible(flag) {
        this.setState({
            isVisible: flag,
        })
    }

    render() {
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.state.isVisible}
                onRequestClose={()=> {
                    this.setVisible(false);
                    if (!!this.props.imagePicker) {
                        this.props.imagePicker();
                    }
                }}
            >
                <TouchableWithoutFeedback onPress={()=> {
                    this.setVisible(false);
                    if (!!this.props.imagePickerCallback) {
                        this.props.imagePickerCallback();
                    }
                }}>
                    <View style={styles.container}>
                        <TouchableWithoutFeedback onPress={()=> {}}>
                            <View style={styles.content}>
                                <View style={styles.header}>
                                    <View style={{width:GlobalStyles.window_width - 24, height:GlobalStyles.scaleSize(90), justifyContent:'center', alignItems:'center',
                                        borderBottomWidth:0.5, borderBottomColor:'#cecece'}}>
                                        <Text style={{color:GlobalStyles.normalColor, fontSize:GlobalStyles.setSpText(11)}}>选择图片</Text>
                                    </View>
                                    <TouchableOpacity onPress={()=> {
                                        this.takePhoto();
                                        this.setVisible(false);
                                        if (!!this.props.imagePickerCallback) {
                                            this.props.imagePickerCallback();
                                        }
                                    }}>
                                        <View style={{width:GlobalStyles.window_width - 24, height:GlobalStyles.scaleSize(104), justifyContent:'center', alignItems:'center',
                                            borderBottomWidth:0.5, borderBottomColor:'#cecece'}}>
                                            <Text style={{color:GlobalStyles.nav_bar_backgroundColor, fontSize:GlobalStyles.setSpText(15)}}>拍照</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={()=> {
                                        this.selectPicture();
                                        this.setVisible(false);
                                        if (!!this.props.imagePickerCallback) {
                                            this.props.imagePickerCallback();
                                        }
                                    }}>
                                        <View style={{width:GlobalStyles.window_width - 24, height:GlobalStyles.scaleSize(104), justifyContent:'center', alignItems:'center'}}>
                                            <Text style={{color:GlobalStyles.nav_bar_backgroundColor, fontSize:GlobalStyles.setSpText(15)}}>从手机相册选择</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>


                                <TouchableOpacity onPress={
                                    () => {
                                        this.setVisible(false);
                                        if (!!this.props.imagePickerCallback) {
                                            this.props.imagePickerCallback();
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

    takePhoto() {
        if (typeof (this.props.takePhotoClick) === 'function') {
            this.props.takePhotoClick();
        }
    }

    selectPicture() {
        if (typeof (this.props.selectPicture) === 'function') {
            this.props.selectPicture();
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
        // padding: 16,
        backgroundColor:'#ffffff',
        width: GlobalStyles.window_width - 24,
        alignItems:'center',
        justifyContent:'center',
        // flexDirection:'row',
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