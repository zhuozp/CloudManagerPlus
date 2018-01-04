/**
 * Created by zhuozhipeng on 14/8/17.
 */
'use strict';

import React, {
    Component
} from 'react';

import {
    StyleSheet,
    Text,
    View,
    MapView
} from 'react-native'

exports.framework = 'React';
exports.title = 'Geolocation';
exports.description = 'Examples of using the Geolocation API.';

exports.examples = [
    {
        title: 'navigator.geolocation',
        render: function(): ReactElement<any> {
            return <GeolocationExample />;
        },
    }
];

export default class LocationTest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initialPosition: 'unknown',
            lastPosition: 'unknown',
        }
    }

    render() {
        return (
            <View>
                <Text>
                    <Text style={styles.title}>Initial position: </Text>
                    {this.state.initialPosition}
                </Text>
                <Text>
                    <Text style={styles.title}>Current position: </Text>
                    {this.state.lastPosition}
                </Text>
            </View>
        );
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var initialPosition = JSON.stringify(position);
                this.setState({initialPosition});
            },
            (error) => alert(error.message),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
        this.watchID = navigator.geolocation.watchPosition((position) => {
            var lastPosition = JSON.stringify(position);
            this.setState({lastPosition});
        });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }
}


const styles = StyleSheet.create({
    title: {
        fontWeight: '500',
    },
});