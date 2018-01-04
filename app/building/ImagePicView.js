/**
 * Created by zhuozhipeng on 29/8/17.
 */
import React, {
    Component,
} from 'react'

import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Text,
} from 'react-native'

import GlobalStyles from '../../res/style/GlobalStyles'
import NavigationBar from '../common/widget/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import BaseCommon from '../common/BaseCommon'
import BaseView from '../common/widget/BaseView'
import ImageShowModal from './ImageShowModal'
import ImagePicker from 'react-native-image-picker'
import ImageCropPicker from 'react-native-image-crop-picker'
import ImagePickerView from '../picker/image/ImagePickerView'
import StringUtils from '../util/StringUtils'

export default class ImagePicView extends BaseView {
    constructor(props) {
        super(props);
        this.common = new BaseCommon({...props, backPress: (e) => this.onBackPress(e)});
        this.imgs = [];
        for (let i = 0; !!this.props.imageUrl && i < this.props.imageUrl.length; i++) {
            this.imgs.push(this.props.imageUrl[i]);
        }
        this.imgs.push('add');


        this.state = {
            imgs: this.imgs,
            managerSwitch: false,
            imageModalVisible:false,
            showImagePicker: false,
        }
        
        super.navBarTitle('房间照片');
        if ('BuildingPicView' === this.props.from) {
            super.navBarTitle('大厦照片');
        }
    }

    contentRender() {
        // let bottomView = this.state.managerSwitch ?
        //     <View style={{position:'relative', flex:1, justifyContent:'flex-end'}}>
        //         <View style={{width: GlobalStyles.window_width, height: GlobalStyles.scaleSize(100),
        //             flexDirection:'row', backgroundColor:'#fff',
        //             alignItems:'center'}}>
        //             {this.bottomViewItem('全选', require('../../res/images/icon_module.png'))}
        //             <View style={{width:0.5, height: GlobalStyles.scaleSize(74), backgroundColor:'#c3c3c3'}}/>
        //             {this.bottomViewItem('删除', require('../../res/images/icon_module.png'))}
        //         </View>
        //     </View>: null;

        let imageView = this.state.imageModalVisible ?
            <ImageShowModal
                ref='imageShowModal'
                callback={()=> {
                    this.setState({
                        imageModalVisible:false,
                    })
                }}
                imagesUrls = {this.state.imgs}
            /> : null;
        return (
            <View style={styles.container}>
                {
                    this.renderImg().map((elem, index) => {
                        return elem;
                    })
                }
                {/*{bottomView}*/}
                {imageView}
                {this.state.showImagePicker ? <ImagePickerView ref='imagePickerView' imagePickerCallback={()=> {this.imagePickerCallback()}}
                                                               takePhotoClick={()=>this.takePhotoClick()} selectPicture={()=>this.selectPicture()}/> : null}
            </View>
        )
    }

    bottomViewItem(title, icon) {
        return (
            <View style={{flex:1, alignItems:'center', alignItems:'center'}}>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}} >
                    <Image style={{width:GlobalStyles.scaleSize(64), height:GlobalStyles.scaleSize(64)}} source={icon}/>
                    <Text style={{color:'#000', fontSize:GlobalStyles.setSpText(14)}}>{title}</Text>
                </View>
            </View>
        )
    }

    renderImg() {
        let length = this.state.imgs.length;
        var session = Math.ceil(length / 3);
        let oneGroup = [];
        var icon;
        let viewGroup = [];
        for (let i = 0; i < session; i++) {
            for (let j = 0; j < 3 && (i * 3 + j) < length; j++) {
                let index = i * 3 + j;
                let deleteIcon = (index + 1) !== length && this.state.managerSwitch ?
                    <View style={{position:'absolute', justifyContent:'flex-end', flexDirection:'row', width:GlobalStyles.window_width / 3, marginTop: GlobalStyles.scaleSize(24)}}>
                        <TouchableOpacity onPress={()=> {
                            if (typeof (this.props.deleteImgUrl) === 'function') {
                                this.props.deleteImgUrl(this.imgs[index])
                            }


                            this.imgs.splice(index, 1);
                            this.setState({
                                imgs: this.imgs
                            })
                        }}>
                            <Image style={{padding:10, width:GlobalStyles.scaleSize(60), height:GlobalStyles.scaleSize(60), margin: GlobalStyles.scaleSize(8)}}
                                   source={require('../../res/images/common/ic_delect_40.png')}/>
                        </TouchableOpacity>
                    </View> : null;
                oneGroup.push(
                        <View key={index} style={styles.item_content}>
                            <TouchableOpacity
                                onPress={this.imgClick.bind(this, index)}>
                                <Image  style={styles.image} source={(index + 1) == length ?
                                    require('../../res/images/common/ic_add_big_208.png') : {uri: this.state.imgs[index]}}/>
                            </TouchableOpacity>
                            {deleteIcon}
                        </View>

                )
            }

            viewGroup.push(
                <View style={styles.line_content}>
                    {
                        oneGroup.map((elem, index) => {
                            return elem;
                        })
                    }
                </View>
            )

            oneGroup.length = 0;
        }

        return viewGroup;
    }

    imgClick(index) {
        if (index == this.state.imgs.length - 1) {
            this.selectPhotoTapped();
        } else {
            if (!!this.refs.imageShowModal) {
                this.refs.imageShowModal.setVisible(true);
            }
            this.setState({
                imageModalVisible:true,
            })
        }
    }

    selectPhotoTapped() {
        // const options = {
        //     title: '选择图片',
        //     takePhotoButtonTitle: '拍照',
        //     chooseFromLibraryButtonTitle: '从手机相册选择',
        //     cancelButtonTitle: '取消',
        //     quality: 1.0,
        //     maxWidth: 750,
        //     maxHeight: 750,
        //     storageOptions: {
        //         skipBackup: true,
        //     }
        // };
        //
        // ImagePicker.showImagePicker(options, (response) => {
        //     console.log('Response = ', response);
        //
        //     if (response.didCancel) {
        //         console.log('User cancelled photo picker');
        //     }
        //     else if (response.error) {
        //         console.log('ImagePicker Error: ', response.error);
        //     }
        //     else if (response.customButton) {
        //         console.log('User tapped custom button: ', response.customButton);
        //     }
        //     else {
        //         // You can also display the image using data:
        //         // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        //         if (typeof(this.props.addImgCallback) === 'function') {
        //             this.props.addImgCallback(response.uri);
        //         }
        //         this.state.imgs.splice(this.state.imgs.length-1, 0, response.uri);
        //         this.setState({
        //             imgs: this.imgs,
        //         });
        //     }
        // });
        this.setState({
            showImagePicker:true,
        })
        if (!!this.refs.imagePickerView) {
            this.refs.imagePickerView.setVisible(true);
        }
    }

    imagePickerCallback() {
        this.setState({
            showImagePicker: false,
        })
    }

    takePhotoClick() {
        this.timer = setTimeout(()=> {
            let width = 750 >= GlobalStyles.window_width ? GlobalStyles.window_width : 750
            ImageCropPicker.openCamera({
                width:  Math.ceil(width),
                height: Math.ceil(width * 563 / 750),
                cropping: true
            }).then(image => {
                console.log(image);
                if (StringUtils.isNotEmpty(image.path)) {
                    if (typeof(this.props.addImgCallback) === 'function') {
                        this.props.addImgCallback(image.path);
                    }
                    this.state.imgs.splice(this.state.imgs.length - 1, 0, image.path);
                    this.setState({
                        imgs: this.imgs,
                    });
                }
            });
        }, 100)
    }

    selectPicture() {
        this.timer = setTimeout(()=> {
            let width = 750 >= GlobalStyles.window_width ? GlobalStyles.window_width : 750
            ImageCropPicker.openPicker({
                width: Math.ceil(width),
                height: Math.ceil(width * 563 / 750),
                cropping: true,
                multiple:true,
                loadingLabelText:'图片处理中'
            }).then(images => {
                console.log(images);
                if (!!images && images.length > 0) {
                    for (let i = 0; i < images.length; i++) {
                        if (StringUtils.isNotEmpty(images[i].path)) {
                            this.state.imgs.splice(this.state.imgs.length - 1, 0, images[i].path);
                            if (typeof(this.props.addImgCallback) === 'function') {
                                this.props.addImgCallback(images[i].path);
                            }
                        }
                    }

                    this.setState({
                        imgs: this.imgs,
                    });
                }
            });
        }, 100)
    }



    navBarRightView() {
        let label = this.state.managerSwitch ? '完成' : '管理';
        return (
            <TouchableOpacity
                underlayColor='transparent'
                style={{padding: 8}}
                onPress={() => {
                    this.setState({
                        managerSwitch: !this.state.managerSwitch,
                    })
                }}>
                <Text style={{fontSize: 14, color: '#ffffff'}}>{label}</Text>
            </TouchableOpacity>
        )
    }
}


const signleImgWidth = GlobalStyles.scaleSize(218);
const width = GlobalStyles.width / 3 < signleImgWidth ? GlobalStyles.width / 3 -  GlobalStyles.scaleSize(12) : signleImgWidth;

const styles = StyleSheet.create({
    container: {
        backgroundColor:GlobalStyles.backgroundColor,
        flex:1
    },

    line_content: {
        flexDirection:'row',
        width:GlobalStyles.window_width,
        alignItems:'center'
    },

    item_content: {
        width: GlobalStyles.window_width / 3,
        height: GlobalStyles.scaleSize(242),
    },

    image: {
        width:width,
        height:width,
        margin:GlobalStyles.scaleSize(24),
        margin:GlobalStyles.scaleSize(24),
    }
})