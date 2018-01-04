/**
 * Created by zhuozhipeng on 28/8/17.
 */

import React, {
    Component,
} from 'react'

import {
    StyleSheet,
    View,
    Modal,
    Image,
    Text,
    TouchableWithoutFeedback,
    Platform,
} from 'react-native'

import GlobalStyles from '../../res/style/GlobalStyles'
import Swiper from 'react-native-swiper'
import ViewPager from 'react-native-viewpager'

export default class ImageShowModal extends Component {
    constructor(props) {
        super(props);
        this.dataSource = new ViewPager.DataSource({
            pageHasChanged: (p1, p2) => p1 !== p2,
        });
        this.state = {
            isVisible: true,
            dataSource: this.dataSource.cloneWithPages(this.props.imagesUrls),
        }
    }

    setVisible(flag) {
        this.setState({
            isVisible: flag,
        })
    }

    render() {
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.state.isVisible}
                onRequestClose={()=> {
                    this.setVisible(false);
                    if (typeof(this.props.callback) === 'function') {
                        this.props.callback();
                    }
                }}
            >
                {Platform.OS === 'ios' ? this.iosContent() : this.androidContent()}
            </Modal>
        )
    }

    iosContent() {
        return (
            <Swiper
                index={!!this.props.index ? this.props.index : 0}
                showsButtons
                autoPlay={!!this.props.imagesUrls && this.props.imagesUrls.length !== 1}
                loop={!!this.props.imagesUrls && this.props.imagesUrls.length !== 1}
            >
                {
                    this.renderImg().map((elem, index) => {
                        return elem;
                    })
                }
            </Swiper>
        )
    }

    androidContent() {
        return (
            <ViewPager
                style={{width:GlobalStyles.window_width}}
                dataSource={this.state.dataSource}
                renderPage={(data, pageId)=> {
                    return (
                        <TouchableWithoutFeedback
                            onPress={()=> {
                                this.setVisible(false);
                                if (typeof(this.props.callback) === 'function') {
                                    this.props.callback();
                                }
                            }}
                        >
                            <View style={styles.container}>
                                <Image
                                    key={pageId}
                                    style={styles.img_content}
                                    source={{uri:data}}
                                    // resizeMode={'cover'}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }}
                isLoop={!!this.props.imagesUrls && this.props.imagesUrls.length !== 1}
                autoPlay={!!this.props.imagesUrls && this.props.imagesUrls.length !== 1}/>
        )
    }


    renderImg() {
        var imageViews=[];
        for(var i=0;i < this.props.imagesUrls.length;i++){
            imageViews.push(
                <TouchableWithoutFeedback
                    onPress={()=> {
                        this.setVisible(false);
                        if (typeof(this.props.callback) === 'function') {
                            this.props.callback();
                        }
                    }}
                >
                    <View style={styles.container}>
                        <Image
                            key={i}
                            style={styles.img_content}
                            source={{uri:this.props.imagesUrls[i]}}
                            // resizeMode={'cover'}
                        />
                    </View>
                </TouchableWithoutFeedback>
            );
        }
        return imageViews;
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent:'center',
        alignItems:'center',
    },


    img_content: {
        width: GlobalStyles.window_width,
        height: Math.ceil(GlobalStyles.window_width * 563 / 750)
    },

    wrapper: {
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    }
})
