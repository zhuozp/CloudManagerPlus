/**
 * Created by zhuozhipeng on 9/8/17.
 */

import React from 'React'

import {
    BackAndroid,
} from 'react-native'

export default class BaseCommon {
    constructor(props) {
        this._onHardwareBackPress = this.onHardwareBackPress.bind(this);
        this.props = props;
    }
    componentDidMount() {
        if(this.props.backPress)BackAndroid.addEventListener('hardwareBackPress',this._onHardwareBackPress);
    }
    componentWillUnmount() {
        if(this.props.backPress)BackAndroid.removeEventListener('hardwareBackPress',this._onHardwareBackPress);
    }
    onHardwareBackPress(e){
        return this.props.backPress(e);
    }
}