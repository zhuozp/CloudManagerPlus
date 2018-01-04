/**
 * Created by Gibbon on 2017/8/27.
 */
import React, {
    Component,
} from 'react'

import {
    StyleSheet,
    ActivityIndicator,
    Text,
    View,
} from 'react-native'


export default class LoadingProgressView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        }
    }

    setIsLoadingState(isLoading) {
        this.setState({
            isLoading:isLoading,
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <ActivityIndicator
                        animating={this.state.isLoading}
                        size="large"
                    />
                    <Text style={styles.txt_indicator}>{this.props.msg ? this.props.msg : '加载中'}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'rgba(0,0,0,0)',
        justifyContent:'center',
        alignItems:'center',
    },

    content: {
        padding:6,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#000',
        borderRadius:12,
        width: 80,
        height: 76,
    },

    txt_indicator: {
        color:'#fff',
        fontSize: 14,
        marginTop: 4,
    }
})