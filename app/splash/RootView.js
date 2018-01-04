/**
 * Created by zhuozhipeng on 10/8/17.
 */
import React, {
    Component,
} from 'react';

import {
    Navigator,
} from 'react-native'

import SplashView from '../splash/SplashView';

export default class RootView extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    _renderScene(route, navigator) {
        let Component = route.component;
        return (
            <Component {...route.params} navigator={navigator}/>
        );
    }
    render() {
        return (
            <Navigator
                initialRoute={{
                    name: 'SplashView',
                    component:SplashView
                }}
                renderScene={(e, i)=>this._renderScene(e, i)}
            />
        );
    }
}