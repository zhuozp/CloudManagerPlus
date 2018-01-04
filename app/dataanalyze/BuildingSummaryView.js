/**
 * Created by zhuozhipeng on 11/8/17.
 */

import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    ScrollView,
    Text,
} from 'react-native'

import GlobalStyles from '../../res/style/GlobalStyles'
import PercentageCircle from 'react-native-percentage-circle';

const radius = parseInt((Math.ceil(GlobalStyles.window_width / 3) - 36) / 2);
export default class BuildingSummaryView extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <ScrollView style={styles.container}
            >
                <View style={{flex:1}}>
                    {/*<Text style={{paddingLeft: 12, paddingTop: 6, paddingBottom: 6,*/}
                        {/*width: GlobalStyles.width, fontSize: 14, backgroundColor:'#efefef'}}>概览样例:</Text>*/}

                    <View style={{alignItems:'center', alignSelf:'center', flexDirection:'row'}}>
                        <View style={{flex : 1}}>
                            <View style={{alignSelf:'center', marginTop:20, justifyContent:'center', alignItems:'center'}}>
                                <PercentageCircle radius={radius} percent={30.64} color={"#db0e42"}/>

                                <Text style={{fontSize: 16, marginTop: 16, color:'#000000'}}>已租</Text>
                                <Text style={{fontSize: 11, marginTop: 8, color:'#252525'}}>12774.59m²</Text>
                            </View>
                        </View>
                        <View style={{flex : 1}}>
                            <View style={{alignSelf:'center', marginTop:20, justifyContent:'center', alignItems:'center'}}>
                                <PercentageCircle radius={radius} percent={69.36} color={"#db6232"}/>

                                <Text style={{fontSize: 16, marginTop: 16, color:'#000000'}}>空置</Text>
                                <Text style={{fontSize: 11, marginTop: 8, color:'#252525'}}>28918.91m²</Text>
                            </View>
                        </View>
                        <View style={{flex : 1}}>
                            <View style={{alignSelf:'center', marginTop:20, justifyContent:'center', alignItems:'center'}}>
                                <PercentageCircle radius={radius} percent={66.02} color={"#1325db"}/>

                                <Text style={{fontSize: 16, marginTop: 16, color:'#000000'}}>可招商</Text>
                                <Text style={{fontSize: 11, marginTop: 8, color:'#252525'}}>27527.21m²</Text>
                            </View>
                        </View>
                    </View>
                    {/*<View style={{flex:1, flexDirection:'row', alignItems:'center',marginTop:24}}>*/}
                        {/*<Text style={{color:'#252525', fontSize:14, width: 90, marginLeft: 16}}>在租均价:</Text>*/}
                        {/*<Text style={{color:'#000000', fontSize:16, marginLeft: 16,flex:1}}>882.89元/m².月</Text>*/}
                    {/*</View>*/}
                    {/*<View style={{flex:1, flexDirection:'row', alignItems:'center', marginTop:8}}>*/}
                        {/*<Text style={{color:'#252525', fontSize:14,width: 90, marginLeft: 16}}>总面积:</Text>*/}
                        {/*<Text style={{color:'#000000', fontSize:16, marginLeft: 16,flex:1}}>41693.5m²</Text>*/}
                    {/*</View>*/}
                    {/*<View style={{flex:1, flexDirection:'row', alignItems:'center', marginTop:8}}>*/}
                        {/*<Text style={{color:'#252525', fontSize:14,width: 90, marginLeft: 16}}>楼宇数:</Text>*/}
                        {/*<Text style={{color:'#000000', fontSize:16, marginLeft: 16,flex:1}}>70</Text>*/}
                    {/*</View>*/}
                    {/*<View style={{flex:1, flexDirection:'row', alignItems:'center', marginTop:8}}>*/}
                        {/*<Text style={{color:'#252525', fontSize:14,width: 90, marginLeft: 16}}>上个月总租金:</Text>*/}
                        {/*<Text style={{color:'#000000', fontSize:16, marginLeft: 16,flex:1}}>50.8万元</Text>*/}
                    {/*</View>*/}
                    {/*<View style={{flex:1, flexDirection:'row', alignItems:'center', marginTop:8}}>*/}
                        {/*<Text style={{color:'#252525', fontSize:14,width: 90, marginLeft: 16}}>下个月总租金:</Text>*/}
                        {/*<Text style={{color:'#000000', fontSize:16, marginLeft: 16,flex:1}}>50.8万元</Text>*/}
                    {/*</View>*/}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:GlobalStyles.backgroundColor,
    },

    // circle_class: {
    //     radius:Math.ceil(GlobalStyles.window_width / 3) - 26
    // }
})

