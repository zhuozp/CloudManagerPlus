/**
 * Created by zhuozhipeng on 6/9/17.
 */

import React from 'react'

import {
    Platform,
    StyleSheet,
    ScrollView,
    View,
    InteractionManager,
    TouchableOpacity,
    Text,
} from 'react-native'

import BaseView from '../common/widget/BaseView'
import PDFView from 'react-native-pdf-view';
import RNFS from 'react-native-fs';
import GlobalStyles from '../../res/style/GlobalStyles'
import ShareView from '../share/ShareView'
import Toast from 'react-native-easy-toast'

export default class ContactDetailView extends BaseView {
    constructor(props) {
        super(props);

        this.pdfPath = RNFS.DocumentDirectoryPath + '/tmp.pdf'
        this.url = this.props.url;
        this.item = this.props.item;
        this.state = {
            pageCount: 1,
            isPdfDownload: false,
            isLoading: true,
            showShareView: false,
        }
    }


    render() {
        // if (!this.state.isPdfDownload) {
        //     return (
        //         <View style={{justifyContent:'center', alignItems:'center'}}>
        //             {super.navigatorBar('合同详情')}
        //             <View>
        //
        //             </View>
        //         </View>
        //     )
        //
        // }

        var pages = [];
        for (var i = 2; i < this.state.pageCount + 1; i++) {
            pages.push(
                <PDFView ref={(pdf) => {
                    this.pdfView = pdf;
                } }
                         key={"sop" + i}
                         path={this.pdfPath}
                         pageNumber={i}
                         style={styles.pdf}/>
            );
        }

        var laodView = super.loadingView();
        var loadingView = !this.state.isPdfDownload ?
            <View style={[{
                width: GlobalStyles.window_width,
                justifyContent: 'center',
                alignItems: 'center'
            }, styles.pdf]}>
                <View>
                    {laodView}
                </View>
            </View> : null;
        var content = this.state.isPdfDownload ?
            <ScrollView style={{height: GlobalStyles.window_height}}>
                <PDFView ref={(pdf) => {
                    this.pdfView = pdf;
                } }
                         key="sop"
                         path={this.pdfPath}
                         pageNumber={1}
                         onLoadComplete={(pageCount) => {
                             InteractionManager.runAfterInteractions(()=> {
                                 this.setState({pageCount: pageCount});
                                 console.log(`pdf共有: ${pageCount}页`);
                             })
                         } }
                         style={styles.pdf}/>

                {pages.map((elem, index) => {
                    return elem;
                })}
            </ScrollView> : null;

        let shareView = this.state.showShareView ? <ShareView ref='share' callback={this.shareCallback} shareClickCallback={(text) => {this.shareClickCallback(text)}}/> : null;
        return (
            <View>
                {super.navigatorBar('合同详情', this.navBarRightView())}
                {content}
                {loadingView}
                {shareView}
                <Toast ref='toast' position={'center'}/>
            </View>
        )
    }

    navBarRightView() {
        return (
            <TouchableOpacity
                style={{padding: 8}}
                onPress={() => {
                    if (!this.state.isPdfDownload) {
                        return;
                    }

                    this.setState({
                        showShareView: true,
                    })
                    if (!!this.refs.share) {
                        this.refs.share.setVisible(true);
                    }
                }}>
                <Text style={{fontSize: GlobalStyles.nav_bar_fontsize, color: '#ffffff'}}>分享</Text>
            </TouchableOpacity>
        )
    }

    shareCallback() {
        this.setState({
            showShareView: false,
        })
    }

    shareClickCallback(title) {
        if (!!this.refs.share) {
            this.refs.share.fileShare(title, {shareTitle: this.item.buildingName + this.item.roomNo + this.item.tenantName + '合同', content:'租客合同', path: this.pdfPath, fileExtension: '.pdf',}, (text)=> {
                super.showToast(text);
            });
        }
    }

    componentDidMount() {
        super.componentDidMount();
        // super.setLoadingView(true);
        var DownloadFileOptions = {
            fromUrl: this.url,          // URL to download file from
            toFile: this.pdfPath         // Local filesystem path to save the file to
        }
        var result = RNFS.downloadFile(DownloadFileOptions);
        console.log(result);

        var _this = this;
        result.promise.then(function (val) {
                InteractionManager.runAfterInteractions(() => {
                    _this.setState({
                        isPdfDownload: true,
                        isLoading: false,
                    });
                })
            }, function (val) {
                // _this.setLoadingView(false);
                console.log('Error Result:' + JSON.stringify(val));
            }
        ).catch(function (error) {
            // _this.setLoadingView(false);
            console.log(error.message);
        });
    }
}

const heigth = Platform.OS === 'ios' ? GlobalStyles.nav_bar_height_ios + GlobalStyles.scaleSize(20) : GlobalStyles.nav_bar_height_ios
const styles = StyleSheet.create({
    pdf: {
        height: GlobalStyles.scaleSize(1000),
    }
})