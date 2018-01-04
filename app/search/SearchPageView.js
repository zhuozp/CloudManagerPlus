/**
 * Created by zhuozhipeng on 14/8/17.
 */

import React, {
    Component
} from 'react';

import {
    View,
    ListView,
    ScrollView,
} from 'react-native';

import GlobalStyles from '../../res/style/GlobalStyles'
import SeachRenderView from './SearchRenderView'

export default class SeachPageView extends Component {
    constructor(props) {
        super(props);
        this.common = new BaseCommon({...props, backPress: (e) => this.onBackPress(e)});
    }

    componentDidMount() {
        this.common.componentDidMount();
    }

    componentWillUnmount() {
        this.common.componentWillUnmount();
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:GlobalStyles.backgroundColor}}>
                <SeachRenderView
                    ref='search'
                    onLeftClick={() => {
                        this.onBackPress()
                    }}
                    onRightClick={(text) => {
                        this.onRightClick(text)
                    }}
                />
            </View>
        )
    }

    searchByExistData() {
        var data = this.props.data;
        // notifyChange listview
    }

    searchByNetWork() {
        // notifyChange listview
    }

    onBackPress() {
        this.refs.search.refs.input.blur();
        this.props.navigator.pop();
    }

    onRightClick(text) {

    }
}