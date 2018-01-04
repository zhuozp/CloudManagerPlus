/**
 * Created by zhuozhipeng on 14/8/17.
 */

import React, {
    Component,
} from 'react';

import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    Text,
} from 'react-native'

import GlobalStyles from '../../res/style/GlobalStyles'
import ViewUtils from '../util/ViewUtils'

export default class SeachRenderView extends Component {
    constructor(props) {
        super(props)
        this.setState = {
            inputKey: '',
        }
    }



    render() {
        let backButton =ViewUtils.getLeftButton(()=>this.onBackPress());
        let inputView =
            <TextInput
                ref="input"
                style={styles.textInput}
                autoFocus={true}
                underlineColorAndroid="white"
                placeholder="Search repos"
                placeholderTextColor="white"
                clearTextOnFocus={true}
                clearButtonMode="while-editing"
                onChangeText={(inputKey) => this.setState({inputKey})}
            />;
        let rightButton =
            <TouchableOpacity
                onPress={()=> {
                    this.refs.input.blur();
                    if (!!this.props.rightClick) {
                        this.props.rightClick(this.state.inputKey)
                    }
                }}
            >
                <View style={{alignItems: 'center', marginRight: 10}}>
                    <Text style={styles.title}>搜索</Text>
                </View>
            </TouchableOpacity>;
        return (
            <View style={{
                backgroundColor: GlobalStyles.nav_bar_backgroundColor,
                height: Platform.OS==='ios'? GlobalStyles.nav_bar_height_ios:GlobalStyles.nav_bar_height_android,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                {backButton}
                {inputView}
                {rightButton}
            </View>
        )
    }

    onBackPress() {
        if (!!this.props.onLeftClick) {
            this.props.onLeftClick();
        }
    }
}

const  styles = StyleSheet.create({
    textInput: {
        flex: 1,
        height: (Platform.OS === 'ios') ?30:40,
        borderWidth: 1,
        borderColor: 'white',
        alignSelf: 'center',
        paddingLeft: 5,
        marginLeft: 5,
        marginRight: 10,
        borderRadius: 3,
        opacity: 0.7,
        color:'white'
    },
})
