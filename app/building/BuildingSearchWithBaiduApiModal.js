/**
 * Created by Gibbon on 2017/8/25.
 */

import React, {
    Component,
} from 'react'

import {
    StyleSheet,
    View,
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native'

import GlobalStyles from '../../res/style/GlobalStyles'

export default class BuildingSearchWithBaiduApiModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: true,
            buttonRect:{},
        }
        if (!this.props.anchorView)return;
        let anchorView=this.props.anchorView;

        anchorView.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isLoadingMore: false,
                hasNotMoreData: false,
                isRefreshLoading:false,
                showFooterViewError: false,
                dataSource:[],
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    setVisible(flag) {
        this.setState({
            isVisible: flag,
        })
    }

    render() {
        return(

            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.state.isVisible}
                onRequestClose={()=> {
                }}
            >
                <TouchableWithoutFeedback
                    style={[styles.container]}
                    onPress={()=> {
                    this.setState({
                        isVisible:false,
                    })
                }}>
                    <View>
                        <View style={{width:GlobalStyles.window_width,
                            height:(this.state.buttonRect.y + this.state.buttonRect.height)}}>

                        </View>
                        <View style={[styles.container, {
                            width:GlobalStyles.window_width - 24,
                            height:GlobalStyles.window_height - (this.state.buttonRect.y + this.state.buttonRect.height),
                            marginLeft:12,
                            marginRight:12,
                            // marginTop: this.state.buttonRect.y + this.state.buttonRect.height
                        }]}>
                            <View style={{backgroundColor:'#fff', flex:1}}>
                                <View style={styles.item_content}>
                                    <Text style={styles.building_name}>平安</Text>
                                    <Text style={styles.building_address}>平安福田</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
        // justifyContent:'flex-end',
    },

    footer: {
        flex:1,
        height:42,
        justifyContent:'center'
    },

    item_content: {
        justifyContent:'center',
        backgroundColor:'rgba(0,0,0,0.8)',
        minHeight: 48,
        flex:1,
        width:GlobalStyles.window_width - 48,
        marginLeft: 24, marginRight: 24
    },

    building_name: {
        color:'#fff',
        fontSize: 14,
    },

    building_address: {
        color:'#fff',
        fontSize: 14,
    },
})