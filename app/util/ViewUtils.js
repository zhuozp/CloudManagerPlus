/**
 * Created by zhuozhipeng on 9/8/17.
 */
import React  from 'react';
import {
    TouchableHighlight,
    Image,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import GlobalStyles from '../../res/style/GlobalStyles'

export default class ViewUtils {
    static getSettingItem(callBack, icon, text, tintStyle, expandableIco) {
        return (
            <TouchableHighlight
                onPress={callBack}>
                <View style={[styles.setting_item_container]}>
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                        {icon ?
                            <Image source={icon} resizeMode='stretch'
                                   style={[{opacity: 1, width: 16, height: 16, marginRight: 10,}, tintStyle]}/> :
                            <View style={{opacity: 1, width: 16, height: 16, marginRight: 10,}} />
                        }
                        <Text>{text}</Text>
                    </View>
                    <Image source={expandableIco ? expandableIco : require('../../res/images/common/ic_back.png')}
                           style={[{
                               marginRight: 10,
                               height: 22,
                               width: 22,
                               alignSelf: 'center',
                               opacity: 1
                           }, tintStyle]}/>
                </View>
            </TouchableHighlight>
        )
    }
    // static getMoreButton(callBack) {
    //     return <TouchableHighlight
    //         ref='moreMenuButton'
    //         underlayColor='transparent'
    //         style={{padding:5}}
    //         onPress={callBack}>
    //         <View style={{paddingRight:8}}>
    //             <Image
    //                 style={{width: 24, height: 24, marginLeft: 5}}
    //                 source={require('../../res/images/ic_more_vert_white_48pt.png')}
    //             />
    //         </View>
    //     </TouchableHighlight>
    // }

    static getAddButton(callBack) {
        return <TouchableHighlight
            ref='addButton'
            underlayColor='transparent'
            style={{padding:5}}
            onPress={callBack}>
            <View style={{paddingRight:8}}>
                <Image
                    style={{width: 24, height: 24, marginLeft: 5}}
                    source={require('../../res/images/common/ic_add_44.png')}
                />
            </View>
        </TouchableHighlight>
    }

    static getLeftButton(callBack) {
        return <TouchableOpacity
            style={{padding:8}}
            onPress={callBack}>
            <Image
                style={{width: GlobalStyles.scaleSize(44), height: GlobalStyles.scaleSize(44),}}
                source={require('../../res/images/common/ic_back_white.png')}/>
        </TouchableOpacity>
    }

    // static getSearchButton(callBack) {
    //     return (
    //     <TouchableHighlight
    //         ref='button'
    //         underlayColor='transparent'
    //         onPress={callBack}>
    //         <View style={{padding:5}}>
    //             <Image
    //                 style={{width: 24, height: 24}}
    //                 source={require('../../res/images/nav/ic_search_white_48pt.png')}
    //             />
    //         </View>
    //     </TouchableHighlight>
    //     );
    // }

    static getAddBtnByName(name, callBack) {
        return <TouchableHighlight
            ref='addButton'
            underlayColor='transparent'
            style={{padding:5}}
            onPress={callBack}>
            <View>
                <View style={{alignSelf:'center', borderWidth:0.5,
                    borderColor:'#c3c3c3', borderRadius:1,
                    width: GlobalStyles.window_width - 36, height: 42}}/>
                <View style={{position:'relative', flexDirection:'row',
                    marginTop:-42, justifyContent:'center', alignItems:'center',
                    width: GlobalStyles.window_width - 36, height: 42, backgroundColor:GlobalStyles.nav_bar_backgroundColor}}>
                    <View style={{paddingRight:8}}>
                        <Image
                            style={{width: 24, height: 24, marginLeft: 5}}
                            source={require('../../res/images/building/ic_addd_44.png')}
                        />
                    </View>
                    <Text style={{position:'relative', color:'#fff'}}>{name}</Text>
                </View>
            </View>
        </TouchableHighlight>
    }

    static getAddBtnWithDataByName(name, callBack) {
        return <TouchableHighlight
            underlayColor='transparent'
            onPress={callBack}>
            <View style={{
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'center',
                flex:1,
                height: 42,
                padding:5,
                backgroundColor:'#ffffff'}}>
                <View style={{paddingRight:8}}>
                    <Image
                        style={{width: 24, height: 24, marginLeft: 5}}
                        source={require('../../res/images/common/ic_add_44.png')}
                    />
                </View>
                <Text style={{color:GlobalStyles.selectedColor}}>{name}</Text>
            </View>
        </TouchableHighlight>
    }
}

const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        padding: 10, height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
})