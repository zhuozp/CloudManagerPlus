/**
 * Created by Gibbon on 2017/9/3.
 */
import React from 'react'

import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    View,
} from 'react-native'

import BaseView from '../../common/widget/BaseView'
import GlobalStyles from '../../../res/style/GlobalStyles'
import StringUtils from '../../util/StringUtils'
import DataManager from '../../manager/DataManager'
import URLConstances from '../../constances/URLConstances'
import KeyConstances from '../../constances/KeyConstances'
import JsonProcessUtils from '../../util/JsonProcessUtils'
import UmInfoInstance from '../../um/UmInfoInstance'
import LoadingProgressView from '../../common/widget/LoadingProgressView'

export default class ModifyUserInfoView extends BaseView {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();
        this.state = {

        }
        this.text = this.props.detail;
        super.navBarTitle(this.props.title);
    }

    navBarRightView() {
        let label = '提交';
        return (
            <TouchableOpacity
                underlayColor='transparent'
                style={{padding: 8}}
                onPress={() => {
                    this.uploadData();
                }}>
                <Text style={{fontSize: 14, color: '#ffffff'}}>{label}</Text>
            </TouchableOpacity>
        )
    }

    contentRender() {
        return (
            <View style={{flex:1}}>
                <View style={{height:GlobalStyles.scaleSize(24), backgroundColor:GlobalStyles.backgroundColor}}/>
                <View style={{height: GlobalStyles.scaleSize(100), justifyContent:'center', backgroundColor:'#fff'}}>
                    <TextInput
                        style={{width:GlobalStyles.window_width,flex:1, padding:GlobalStyles.scaleSize(12),
                            fontSize:GlobalStyles.setSpText(14)}}
                        placeholder={this.props.placeholder}
                        placeholderTextColor={'#D7DBDC'}
                        underlineColorAndroid='transparent'
                        clearButtonMode={'never'}
                        onChangeText={(text)=> {
                            this.text = text;

                        }}
                        defaultValue={this.props.detail}
                    />
                </View>

            </View>
        )
    }

    uploadData() {
        if (StringUtils.isNotEmpty(this.props.detail) && this.props.detail === this.text) {
            super.showToast('没做任何修改')
            return;
        }

        if (!StringUtils.isNotEmpty(this.text)) {
            return;
        }

        var params = {
            mobile: UmInfoInstance.getInstance()._mobile,
            token:UmInfoInstance.getInstance()._loginToken,
        }
        var address = UmInfoInstance.getInstance()._address;
        var userName = UmInfoInstance.getInstance()._name;
        if (this.props.title === '修改姓名') {
            userName = this.text;
            params.userName = userName;
        } else if (this.props.title === '修改地址') {
            address = this.text;
            params.address = address;
        } else {
            return;
        }

        super.setLoadingView(true);
        this.dataManager.fetchDataFromNetwork(URLConstances.modify_user_info_url, false,
            {body:JSON.stringify(JsonProcessUtils.mergeJsonWithLogin(params))})
            .then((data)=> {
                super.setLoadingView(false);
                if (!!data && data.code === 0) {
                    UmInfoInstance.getInstance()._wholeData.address = address;
                    UmInfoInstance.getInstance()._wholeData.userName = userName;
                    UmInfoInstance.getInstance()._name = userName;
                    UmInfoInstance.getInstance()._address = address;
                    this.dataManager.saveData(KeyConstances.KEY_USER_INFO,
                        JSON.stringify(UmInfoInstance.getInstance()._wholeData));

                    if (typeof(this.props.modifyCallback) === 'function') {
                        this.props.modifyCallback();
                        super.onBack();
                    }
                }  else {
                    super.showToast(!!data && data.msg ? data.msg : '修改失败，请重试');
                }
            })
            .catch((error)=> {
                super.setLoadingView(false);
                super.showToast('网络异常，请重试');
            })
    }

    loadingView() {
        return (
            <View style={{width:GlobalStyles.window_width, height:GlobalStyles.window_height, position:'absolute'}}>
                <LoadingProgressView ref = 'loadingView' msg="提交中"/>
            </View>
        )
    }
}
