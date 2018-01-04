/**
 * Created by zhuozhipeng on 13/9/17.
 */
import React from 'react'

import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Text,
} from 'react-native'

import BaseView from '../../common/widget/BaseView'
import GlobalStyles from '../../../res/style/GlobalStyles'

export default class SelectRoomView extends BaseView {
    constructor(props) {
        super(props);
        this.totalLength = this.props.item.roomsDetail.length;
        this.roomDetail = this.props.item.roomsDetail;
        let session = Math.ceil(this.props.item.roomsDetail.length / 4);
        this.totalSession = session;

        this.data = [];
        for (let i = 1; i <= this.totalSession; i++) {
            this.data.push(i);
        }

        var hasSelectAll = true;
        for (let i = 0; i < this.totalLength; i++) {
            if (!this.roomDetail[i].hasSelect) {
                hasSelectAll = false;
                break;
            }
        }
        this.state = {
            selectAll: hasSelectAll,
            data: this.data,
            roomDetail: this.roomDetail,
        };

        super.navBarTitle('选择房号');
    }

    onBack() {
        if (typeof(this.props.selectCallback) === 'function') {
            this.props.selectCallback();
        }
        super.onBack();
    }

    // navBarRightView() {
    //     return this.getRightNavBtn();
    // }
    contentRender() {
        return (
            <View style={styles.container}>
                <View style={{width:GlobalStyles.window_width, height:GlobalStyles.scaleSize(80),flexDirection:'row', alignItems:'center', backgroundColor:'#fff'}}>
                    <View>
                        <TouchableOpacity onPress={this.processSelectClick.bind(this)}>
                            {this.state.selectAll ?
                                <Image style={styles.img_cls} source={require('../../../res/images/building/ic_select_2_44.png')}/> :
                                <Image style={styles.img_cls} source={require('../../../res/images/building/ic_select_44.png')}/> }
                        </TouchableOpacity>
                    </View>
                    <Text style={{
                        fontSize: GlobalStyles.setSpText(12),
                        color: this.state.selectAll ? GlobalStyles.nav_bar_backgroundColor : GlobalStyles.normalColor
                    }}>
                        {this.state.selectAll ? '取消选择' : '选择全部'}</Text>
                </View>
                <FlatList
                    data={this.state.data}
                    renderItem={this._renderItem}
                />
            </View>
        )
    }

    // getRightNavBtn() {
    //     return (
    //         <TouchableOpacity
    //             disable={this.state.disable}
    //             style={{padding:GlobalStyles.scaleSize(16)}}
    //             onPress={()=> {
    //
    //             }}>
    //             <Text style={{fontSize: GlobalStyles.nav_bar_fontsize, color: '#ffffff'}}>直接分享</Text>
    //         </TouchableOpacity>
    //     )
    // }

    processSelectClick(){
        for (let i = 0; i < this.totalLength; i++) {
            this.roomDetail[i].hasSelect = !this.state.selectAll;
        }
        this.props.item.hasSelect = !this.state.selectAll;

        var data = []
        for (let i = 1; i <= this.totalSession; i++) {
            data.push(i);
        }
        this.setState({
            selectAll: !this.state.selectAll,
            roomDetail: this.roomDetail,
            data: data,
        })
    }

    _renderItem = (item) => {
        var endIndex = (item.index + 1) * 4;
        var startIndex = item.index * 4;
        var oneLineGroup = [];
        for (let i = startIndex; i < this.totalLength && i < endIndex; i++) {
            oneLineGroup.push(
                <TouchableOpacity
                    onPress={this.processBtnClick.bind(this, i)}>
                    <View
                        style={[styles.btn_cls, this.state.roomDetail[i].hasSelect ? {backgroundColor: GlobalStyles.nav_bar_backgroundColor} : null]}>
                        <Text
                            style={[styles.btn_text_cls, this.state.roomDetail[i].hasSelect ? {color: '#ffffff'} : null]}>{this.state.roomDetail[i].roomNo}</Text>
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <View style={{flexDirection:'row', alignItems:'center'}}>
                {
                    oneLineGroup.map((elem, index) => {
                        return elem;
                    })
                }
            </View>
        )
    }

    processBtnClick(index) {
        this.roomDetail[index].hasSelect = !this.roomDetail[index].hasSelect;
        var hasSelectAll = true;
        var hasSelect = false;
        for (let i = 0; i < this.totalLength; i++) {
            if (!this.roomDetail[i].hasSelect) {
                hasSelectAll = false;
                break;
            }
        }

        for (let i = 0; i < this.totalLength; i++) {
            if (this.roomDetail[i].hasSelect) {
                hasSelect = true;
            }
        }

        var data = []
        for (let i = 1; i <= this.totalSession; i++) {
            data.push(i);
        }
        this.setState({
            selectAll: hasSelectAll,
            roomDetail: this.roomDetail,
            data: data,
        })
        this.props.item.hasSelect = hasSelect;
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:GlobalStyles.backgroundColor,
        width:GlobalStyles.window_width,
    },

    session_cls: {
        height: GlobalStyles.scaleSize(76),
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#ffffff'
    },

    session_text_cls: {
        color:'#000000',
        left:GlobalStyles.scaleSize(24),
    },

    session_img_cls: {
        marginRight: GlobalStyles.scaleSize(24),
        width:GlobalStyles.scaleSize(52),
        height:GlobalStyles.scaleSize(52),
        padding:GlobalStyles.scaleSize(8),
    },

    content_cls: {
        paddingTop:GlobalStyles.scaleSize(24),
        paddingBottom:GlobalStyles.scaleSize(24),
        backgroundColor:'#f4f4f4',
        width:GlobalStyles.window_width,
    },

    btn_cls: {
        height:GlobalStyles.scaleSize(96),
        width: Math.ceil((GlobalStyles.window_width - GlobalStyles.scaleSize(24)) / 4),
        backgroundColor:'#ffffff',
        borderWidth:GlobalStyles.scaleSize(12),
        borderColor:'#f4f4f4',
        borderRadius:GlobalStyles.scaleSize(16),
        justifyContent:'center',
        alignItems:'center',
    },

    btn_text_cls: {
        color:'#000000',
    },

    img_cls: {
        marginRight:GlobalStyles.scaleSize(12),
        marginLeft: GlobalStyles.scaleSize(24),
        padding: GlobalStyles.scaleSize(12),
        width:GlobalStyles.scaleSize(38),
        height:GlobalStyles.scaleSize(38),
    }
})