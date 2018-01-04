/**
 * Created by zhuozhipeng on 17/8/17.
 */
/**
 * Created by zhuozhipeng on 16/8/17.
 */
import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    FlatList,
    Image,
    Text,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native'

import GlobalStyles from '../../res/style/GlobalStyles'
import StringUtils from '../util/StringUtils'
import NavigationBar from '../common/widget/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import BaseCommon from '../common/BaseCommon'
import CustomImage from '../common/widget/CustomImage'

export default class BatchRoomsEditView extends Component {
    constructor(props) {
        super(props);
        this.common = new BaseCommon({...props, backPress: (e) => this.onBackPress(e)});

        this.selectArray = [];
        var i = 1;
        this.oneLineGroup = [];
        this.viewGroup = [];
        this.selectGroup = [];
        let session = Math.floor(this.props.totalRoom / 4) + 1;
        for (; i <= this.props.totalFloor; i++) {
            this.selectArray.push(false);
            this.selectGroup.push(false);
        }

        // this.state = {
        //     selectArray: selectArray,
        // };

        for (i = 1; i <= this.props.totalFloor; i++) {
            this.oneLineGroup[i-1] = [];
            this.viewGroup[i-1] = [];
            for (let j = 0; j < session; j++) {
                this.oneLineGroup[i-1][j] = [];
            }
            this.initData(i);
        }

        this.state = {
            blnUpdate: false,
        };
    }

    setUpdate(){
        this.setState({
            blnUpdate: !this.state.blnUpdate
        });
    }

    initData(floor) {
        let flag = this.selectArray[floor-1];
        let viewStyleBg = flag ? {backgroundColor:GlobalStyles.nav_bar_backgroundColor} : null;
        let txtStyleBg = flag ? {color:'#ffffff'}:null;
        let session = Math.floor(this.props.totalRoom / 4);
        var str = '';
        var i = 0;
        var linekey =  floor + 'floor';
        for (; i < session ; i++) {
            for (let j = 0; j < 4; j++) {
                str = StringUtils.pad(i * 4 + j + 1,2)
                str = floor + str;
                this.oneLineGroup[floor-1][i].push(
                    <TouchableHighlight
                        onPress={this.processBtnClick.bind(this, floor, i, j)}
                        key={str}>
                        <View style={[styles.btn_cls, viewStyleBg]}>
                            <Text style={[styles.btn_text_cls, txtStyleBg]}>{str}</Text>
                        </View>
                    </TouchableHighlight>)
            }

            var oneLineView = (<View key={i} style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                {
                    this.oneLineGroup[floor-1][i].map((elem, index) => {
                        return elem;
                    })
                }
            </View>)
            this.viewGroup[floor-1].push(oneLineView);
        }

        for (i = session * 4; i < this.props.totalRoom; i++) {
            str = StringUtils.pad(i + 1,2)
            str = floor + str;
            this.oneLineGroup[floor-1][session].push(
                <TouchableHighlight
                    key={str}
                    onPress={()=>{
                        this.processBtnClick(floor, session, i - session * 4);
                    }}
                >
                    <View style={[styles.btn_cls, viewStyleBg]}>
                        <Text style={[styles.btn_text_cls, txtStyleBg]}>{str}</Text>
                    </View>
                </TouchableHighlight>)
        }


        if (this.oneLineGroup[floor-1][session].length > 0) {
            var oneLineView = (<View  key={session} style={{flexDirection:'row', alignItems:'center', left:6}}>
                {
                    this.oneLineGroup[floor-1][session].map((elem, index) => {
                        return elem;
                    })
                }
            </View>)
            this.viewGroup[floor-1].push(oneLineView);
        }
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
        return true;
    }

    genData() {
        let data = [];
        for (let i = 1; i <= this.props.totalFloor; i++) {
            data.push(i);
        }

        return data;
    }

    onBack() {
        this.props.navigator.pop();
    }

    render() {
        let navBar =
            <NavigationBar
                navigator={this.props.navigator}
                leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                rightButton={this.getRightNavBtn()}
                style={{backgroundColor: GlobalStyles.nav_bar_backgroundColor}}
                popEnabled={true}
                title='确认房号'
            />
        var data = this.genData();
        return (
            <View style={styles.container}>
                {navBar}
                <FlatList
                    data={data}
                    renderItem={this._renderItem}
                />
            </View>
        )
    }

    getRightNavBtn() {
        return (
            <TouchableHighlight
                style={{padding:8}}
                onPress={()=> {
                    this.props.navigator.push({
                        title: 'BatchRoomsEditView',
                        component: BatchRoomsEditView,
                    })
                }}>
                <Text style={{fontSize: 14, color: '#ffffff'}}>完成</Text>
            </TouchableHighlight>
        )
    }

    selectAll(index) {
        // this.state.selectArray[index] = !this.state.selectArray[index];
        var i = 0;
        //
        // this.setState({
        //     selectArray:this.state.selectArray,
        // })

        this.selectGroup[index] = !this.selectGroup[index];

        // let session = Math.floor(this.props.totalRoom / 4) + 1;
        // for (; i < session; i++) {
        //     for (let j = 0; j < 4; j++) {
        //         var obj = this.oneLineGroup[index][i][j];
        //         obj.props.children.props.style[1] = this.selectGroup[index] ? {backgroundColor:GlobalStyles.nav_bar_backgroundColor} : null;
        //         obj.props.children.props.children.props.style[1] = this.selectGroup[index] ? {color:'#ffffff'}:null;
        //     }
        // }

        var image = this._refImg;
        if (this.selectGroup[index]) {
            this._refImg.setNativeProps({
                source: {uri: '../../res/images/btn_check_on.png'},
            })
        } else {
            this._refImg.setNativeProps({
                source: {uri: '../../res/images/btn_check_off.png'},
            })
        }

    }

    processBtnClick(floor, session, i){
        // var obj = this.oneLineGroup[floor-1][session][i];
        //
        // if (obj.props.children.props.style[1] != null) {
        //     obj.props.children.props.style = [styles.btn_cls, null];
        // } else {
        //     obj.props.children.props.style = [styles.btn_cls, {backgroundColor:GlobalStyles.nav_bar_backgroundColor}]
        // }
        //
        // if (obj.props.children.props.children.props.style[1] != null) {
        //     obj.props.children.props.children.props.style = [styles.btn_text_cls, null];
        // } else {
        //     obj.props.children.props.children.props.style = [styles.btn_text_cls,{color:'#ffffff'}];
        // }
        //
        // obj = this.viewGroup[floor-1][session].props.children[i];
        // if (obj.props.children.props.style[1] != null) {
        //     obj.props.children.props.style = [styles.btn_cls, null];
        // } else {
        //     obj.props.children.props.style = [styles.btn_cls, {backgroundColor:GlobalStyles.nav_bar_backgroundColor}]
        // }
        //
        // if (obj.props.children.props.children.props.style[1] != null) {
        //     obj.props.children.props.children.props.style = [styles.btn_text_cls, null];
        // } else {
        //     obj.props.children.props.children.props.style = [styles.btn_text_cls,{color:'#ffffff'}];
        // }
        // // if (obj.props.children.props.style[1] != null) {
        // //     obj.props.children.props.style = [styles.btn_cls, null];
        // // } else {
        // //     obj.props.children.props.style = [styles.btn_cls, {backgroundColor:GlobalStyles.nav_bar_backgroundColor}]
        // // }
        //
        // this.setUpdate();
        this.state.flagArray[floor][session][i] = !this.state.flagArray[floor][session][i];
        this.setState({
            flagArray:this.state.flagArray,
        })
    }

    _renderItem = (item) => {
        // let floorNum = item.item + '层';
        // let index = item.index;
        // let flag = this.state.selectArray[item.index];
        // let sessionImage = flag ?
        //     <TouchableOpacity onPress={()=> this.selectAll(index)}>
        //         <Image style={styles.session_img_cls} source={require('../../res/images/btn_check_on.png')}/>
        //     </TouchableOpacity> :
        //     <TouchableOpacity onPress={()=> this.selectAll(index)}>
        //         <Image style={styles.session_img_cls} source={require('../../res/images/btn_check_off.png')}/>
        //     </TouchableOpacity>
        // let viewStyleBg = flag ? {backgroundColor:GlobalStyles.nav_bar_backgroundColor} : null;
        // let txtStyleBg = flag ? {color:'#ffffff'}:null;
        // let session = Math.floor(this.props.totalRoom / 4);
        // var viewGroup = [];
        // var oneLineGroup = [];
        // var str = '';
        // var i = 0;
        // var linekey =  item.item + 'floor';
        // for (; i < session ; i++) {
        //     for (let j = 0; j < 4; j++) {
        //         str = StringUtils.pad(i * 4 + j + 1,2)
        //         str = item.item + str;
        //         oneLineGroup.push(
        //             <TouchableHighlight
        //                 onPress={()=>{
        //
        //                 }}
        //             key={str}>
        //             <View style={[styles.btn_cls, viewStyleBg]}>
        //                 <Text style={[styles.btn_text_cls, txtStyleBg]}>{str}</Text>
        //             </View>
        //         </TouchableHighlight>)
        //     }
        //
        //     var oneLineView = (<View key={linekey + i} style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
        //         {
        //             oneLineGroup.map((elem, index) => {
        //                 return elem;
        //             })
        //         }
        //     </View>)
        //     viewGroup.push(oneLineView);
        //     oneLineGroup.length = 0;
        // }
        //
        // for (i = session * 4; i < this.props.totalRoom; i++) {
        //     str = StringUtils.pad(i + 1,2)
        //     str = item.item + str;
        //     oneLineGroup.push(<TouchableHighlight key={str}>
        //         <View style={[styles.btn_cls, viewStyleBg]}>
        //             <Text style={[styles.btn_text_cls, txtStyleBg]}>{str}</Text>
        //         </View>
        //     </TouchableHighlight>)
        // }
        //
        //
        // if (oneLineGroup.length > 0) {
        //     var oneLineView = (<View  key={linekey + session} style={{flexDirection:'row', alignItems:'center', left:6}}>
        //         {
        //             oneLineGroup.map((elem, index) => {
        //                 return elem;
        //             })
        //         }
        //     </View>)
        //     viewGroup.push(oneLineView);
        //     oneLineGroup.length = 0;
        // }

        let floorNum = item.item + '层';
        let index = item.index;
        // let flag = this.state.selectArray[item.index];
        // let sessionImage = flag ?
        let sessionImage =  <TouchableOpacity onPress={()=> this.selectAll(index)} >
            <CustomImage ref={(c) => this._refImg = c} style={styles.session_img_cls} source={require('../../res/images/btn_check_off.png')}/>
        </TouchableOpacity>
        {/*<TouchableOpacity onPress={()=> this.selectAll(index)}>*/}
        {/*<CustomImage style={styles.session_img_cls} source={require('../../res/images/btn_check_off.png')}/>*/}
        {/*</TouchableOpacity>*/}

        return (
            <View style={{backgroundColor: GlobalStyles.backgroundColor}}>
                <View style={styles.session_cls}>
                    <Text style={styles.session_text_cls}>{floorNum}</Text>
                    {sessionImage}
                </View>

                <View style={[styles.content_cls]}>
                    {
                        this.viewGroup[item.index].map((elem, index) => {
                            return elem;
                        })
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:GlobalStyles.backgroundColor
    },

    session_cls: {
        height: 38,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#ffffff'
    },

    session_text_cls: {
        color:'#000000',
        left:12,
        flex:1
    },

    session_img_cls: {
        marginRight: 12,
        width:32,
        height:32,
        padding:3,
    },

    content_cls: {
        paddingTop:12,
        paddingBottom:12,
        backgroundColor:'#f4f4f4',
        width:GlobalStyles.window_width,
    },

    btn_cls: {
        height:48,
        width: Math.ceil((GlobalStyles.window_width - 12) / 4),
        backgroundColor:'#ffffff',
        borderWidth:6,
        borderColor:'#f4f4f4',
        borderRadius:8,
        justifyContent:'center',
        alignItems:'center',
    },

    btn_text_cls: {
        color:'#000000',
    }
})