/**
 * Created by zhuozhipeng on 8/8/17.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    Image,
    TouchableHighlight,
} from 'react-native';

import GlobalStyles from '../../../res/style/GlobalStyles';

export default class EditView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            secureTextEntry: false,
        };
    }

    componentDidMount() {
        this.setState({
            secureTextEntry: this.props.secureTextEntry,
        });
    }

    render() {
        let rightView = !!this.props.rightView ? this.props.rightView : null;
        return (

        <View style={{height: 50}}>
            <View style={styles.container}>
                <Text style={styles.text_class}>{this.props.label}</Text>
                <TextInput
                    ref='textInput'
                    style={styles.textInput_class}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={'#D7DBDC'}
                    underlineColorAndroid='transparent'
                    onChangeText={(text) => {
                        this.setState({text});
                        if (!!this.props.onChangeText) {
                            this.props.onChangeText(text);
                        }
                    }}
                    clearButtonMode={!rightView ? "while-editing" : 'never'}
                    value={this.state.text}
                    secureTextEntry={this.state.secureTextEntry}
                    maxLength={this.props.inputLength}
                    keyboardType={this.props.keyboardType}
                    />
                {rightView}
            </View>
            <View style={GlobalStyles.dividerview}><Text style={GlobalStyles.divider}/></View>
        </View>
        );
    }

    cancelBtnPress() {
        if (this.props.secureTextEntry) {
            this.setState({
                secureTextEntry: !this.state.secureTextEntry,
                text: this.state.text,
            });
        } else {
            this.setState({
                text: ''
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 20,
        marginRight: 20,
        height: 48,
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',
    },

    text_class: {
        color: '#aaadae',
        fontSize: 14,
        width: 64,
    },

    textInput_class: {
        alignItems:'center',
        justifyContent:'center',
        height: 48,
        fontSize: 14,
        flex:1
    },
});