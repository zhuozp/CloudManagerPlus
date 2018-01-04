/**
 * Created by zhuozhipeng on 1/9/17.
 */

import React from 'react'

import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    Text,
    TouchableHighlight,
    ListView,
    RefreshControl,
    Alert,
} from 'react-native'

import BaseView from '../../common/widget/BaseView'
import GlobalStyles from '../../../res/style/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'
import ContactsWrapper from 'react-native-contacts-wrapper'
import UserInfo from '../model/UserInfo'
import KeyConstances from '../../constances/KeyConstances'
import URLConstances from '../../constances/URLConstances'
import JsonProcessUtils from '../../util/JsonProcessUtils'
import DataManager from '../../manager/DataManager'
import RegCheckUtils from '../util/RegCheckUtils'
import UmInfoInstance from '../UmInfoInstance'

import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view'

export default class SubUserListView extends BaseView {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2)=>row1 !== row2,
        }),
        this.navBarTitle('子账号系统');

        this.subUsers = this.props.subUsers;
        if (!this.subUsers) {
            this.subUsers = [];
        }

        this.state={
            dataSource:this.subUsers,
            isAdding: false,
            addUserInfo: new UserInfo(),
            isRefreshLoading:false,
        }
    }

    loadData() {
        this.setState({
            isRefreshLoading:true,
        })
        this.dataManager.fetchDataFromNetwork(URLConstances.sub_user_refresh_url, false,
            {body:JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({}))})
            .then((data)=> {
                this.setState({
                    isRefreshLoading:false,
                })
                console.log(data);
                if (!!data) {
                    if (data.code === 0) {
                        var data = data.msg;
                        if (!!data) {
                            this.process(data);
                        } else {
                            super.showToast(!!data.msg ? data.msg : '添加失败，请重试');
                        }
                    } else {
                        super.showToast(!!data.msg ? data.msg : '添加失败，请重试');
                    }
                } else  {
                    super.showToast('添加失败，请重试')
                }
            })
            .catch((error)=> {
                this.setState({
                    isRefreshLoading:false,
                })
                super.showToast('添加失败，请重试')
            })
    }


    // navBarRightView() {
    //     let rightView = this.state.isAdding ?
    //         <TouchableHighlight
    //             underlayColor='transparent'
    //             style={{padding: 8}}
    //             onPress={() => {
    //
    //             }}>
    //             <Text style={{fontSize: 14, color: '#ffffff'}}>提交</Text>
    //         </TouchableHighlight> : undefined;
    //     return rightView;
    // }

    contentRender() {
        return (
        <View style={{flex:1, alignItems:'center'}}>
            <SwipeListView
                dataSource= {!!this.state.dataSource ? this.ds.cloneWithRows(this.state.dataSource) : {}}
                renderRow={(e, secId, rowId, rowMap) => this.renderRow(e, secId, rowId, rowMap)}
                renderFooter={()=> {
                    return <View style={{height: 20}}/>
                }}
                renderHeader={()=>{
                    return  this._headerView();
                }}
                enableEmptySections={true}

                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshLoading}
                        onRefresh={()=>this.onRefresh()}
                        tintColor={GlobalStyles.nav_bar_backgroundColor}
                        title="加载中..."
                        titleColor={GlobalStyles.nav_bar_backgroundColor}
                        colors={[GlobalStyles.nav_bar_backgroundColor, GlobalStyles.nav_bar_backgroundColor, GlobalStyles.nav_bar_backgroundColor]}
                    />
                }
            />
        </View>
        )
    }

    onRefresh() {
        this.loadData();
    }

    renderRow(e, secId, rowId, rowMap) {
        return this.item(e, false, secId, rowId, rowMap);
    }

    _headerView = ()=> {
        let editView = this.state.isAdding ?
            this.item(this.state.addUserInfo, true): null;
        let btnView = this.state.isAdding ?
            <View style={{
                width:GlobalStyles.window_width - 24,
                backgroundColor:'#fff',
                justifyContent:'center',
                flexDirection:'row',
                marginLeft:12,
                alignItems:'center'
            }}>
                <TouchableOpacity
                    style={{flex:1, height:42, alignItems:'center', justifyContent:'center'}}
                    onPress={()=> {
                    this.setState({
                        isAdding:false,
                    })
                }}>
                    <View style={{flex:1, height:42, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{font:'#c3c3c3', alignSelf:'center'}}>取消</Text>
                    </View>
                </TouchableOpacity>

                <View style={{height: 36,width:0.5, backgroundColor:'#c3c3c3'}}/>

                <TouchableOpacity
                    style={{flex:1, height:42, alignItems:'center', justifyContent:'center'}}
                    onPress={()=>this.addSubUser()}>
                    <View style={{flex:1, height:42, alignItems:'center', justifyContent:'center'}}>
                        <Text>确认</Text>
                    </View>
                </TouchableOpacity>
            </View> :
            <View style={{
                marginLeft:12,
                marginRight:12,
                width:GlobalStyles.window_width - 24,
                backgroundColor:'#fff'
            }}>
                {ViewUtils.getAddBtnWithDataByName('添加子账号', ()=> {
                    if (!this.state.isAdding) {
                        this.setState({
                            isAdding:true,
                        })
                    }
                })}
            </View>
        return (
            <View>
                <View style={{height: 12, backgroundColor: GlobalStyles.backgroundColor,
                    marginLeft:12,
                    marginRight:12,
                    width:GlobalStyles.window_width - 24}}/>
                {btnView}
                <View style={{height: 12, backgroundColor: GlobalStyles.backgroundColor, width:GlobalStyles.window_width - 24, marginLeft:12}}/>
                {editView}
            </View>
        )
    }

    deleteRow(secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].closeRow();
        Alert.alert(
            '',
            '是否删除改子账号信息',
            [
                {text: '保留', onPress: () => {

                }},
                {text: '确认', onPress: () => {
                    super.setLoadingView(true);
                    var item = new UserInfo(this.state.dataSource[rowId]);
                    this.dataManager.fetchDataFromNetwork(URLConstances.sub_user_delete_url, false,
                        {body:JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({userName:item.userName,
                            mobile:item.mobile}))})
                        .then((data)=> {
                            super.setLoadingView(false);
                            console.log(data);
                            if (!!data) {
                                if (data.code === 0) {
                                    var data = data.msg;
                                    if (!!data) {
                                        this.process(data);
                                    } else {
                                        super.showToast(!!data.msg ? data.msg : '删除失败，请重试');
                                    }
                                } else {
                                    super.showToast(!!data.msg ? data.msg : '删除失败，请重试');
                                }
                            } else  {
                                super.showToast('删除失败，请重试')
                            }
                        })
                        .catch((error)=> {
                            super.setLoadingView(false);
                            super.showToast('删除失败，请重试')
                        })
                }},
            ]
        )
    }

    addSubUser() {
        if (!this.state.addUserInfo.userName || !!this.state.addUserInfo.userName.length <= 0) {
            super.showToast('请输入姓名');
            return;
        }

        if (!this.state.addUserInfo.mobile || !!this.state.addUserInfo.mobile.length <= 0) {
            super.showToast('请输入联系方式');
            return;
        }

        this.dataManager.fetchDataFromNetwork(URLConstances.sub_user_add_url, false,
            {body:JSON.stringify(JsonProcessUtils.mergeJsonWithLogin({userName:this.state.addUserInfo.userName,
                mobile:this.state.addUserInfo.mobile}))})
            .then((data)=> {
                this.setState({
                    isAdding:false,
                    addUserInfo: new UserInfo(),
                })
                console.log(data);
                if (!!data) {
                    if (data.code === 0) {
                        var data = data.msg;
                        if (!!data) {
                            this.process(data);
                        } else {
                            super.showToast(!!data.msg ? data.msg : '添加失败，请重试');
                        }
                    } else {
                        super.showToast(!!data.msg ? data.msg : '添加失败，请重试');
                    }
                } else  {
                    super.showToast('添加失败，请重试')
                }
            })
            .catch((error)=> {
                this.setState({
                    isAdding:false,
                    addUserInfo: new UserInfo(),
                })
                super.showToast('添加失败，请重试')
            })
    }

    process(data) {
        UmInfoInstance.getInstance()._subUsers = data;
        UmInfoInstance.getInstance()._wholeData.subUsers = data;
        this.dataManager.saveData(KeyConstances.KEY_USER_INFO,
            JSON.stringify(UmInfoInstance.getInstance()._wholeData));

        this.subUsers = UmInfoInstance.getInstance()._subUsers;
        this.setState({
            dataSource: this.subUsers,
        })
    }

    itemClick(item, editable) {
        if (!editable && !!this.props.selectSubUserCallback) {
            this.props.selectSubUserCallback(item);
            super.onBack();
        }
    }

    item(item, editable, secId, rowId, rowMap) {
        var mobile = item.mobile;
        var userName = item.userName;
        let tips = editable ? <Text style={{color: '#ffda62', fontSize: 12}}>导入通信录</Text> : null;
        return (
        <SwipeRow ref={editable ? 'add' : rowId}
            disableRightSwipe={true}
            leftOpenValue={75}
            rightOpenValue={-75}>
            <View style={styles.rowBack}>
                <Text></Text>
                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ _ => this.deleteRow(secId, rowId, rowMap) }>
                    <Text style={styles.backTextWhite}>删除</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={this.itemClick.bind(this, item, editable)}
                underlayColor={'#AAA'}
            >
            <View style={{width:GlobalStyles.window_width - 24,height: 104}}>
                <View style={{
                    width:GlobalStyles.window_width - 24,
                    height: 92, backgroundColor: '#ffffff',
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                    borderRadius:4,
                    marginLeft:12,
                    marginRight:12,
                }}>
                    {/*<TouchableOpacity*/}
                        {/*onPress={() => {*/}
                            {/*if (!editable) {*/}
                                {/*return;*/}
                            {/*}*/}
                            {/*ContactsWrapper.getContact()*/}
                                {/*.then((contact) => {*/}
                                    {/*// Replace this code*/}
                                    {/*this.state.addUserInfo.mobile = contact.phone;*/}
                                    {/*this.state.addUserInfo.userName = contact.name;*/}
                                    {/*console.log(contact);*/}
                                    {/*this.setState({*/}
                                        {/*addUserInfo:this.state.addUserInfo,*/}
                                    {/*})*/}
                                {/*})*/}
                                {/*.catch((error) => {*/}
                                    {/*console.log("ERROR CODE: ", error.code);*/}
                                    {/*console.log("ERROR MESSAGE: ", error.message);*/}
                                {/*});*/}
                        {/*}}*/}
                        {/*disable={editable}*/}
                    {/*>*/}
                        {/*<View style={{width: 78, justifyContent: 'center', alignItems: 'center'}}>*/}
                            {/*<Image style={{width: 42, height: 42}}*/}
                                   {/*source={require('../../../res/images/icon_contact.png')}/>*/}
                            {/*{tips}*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                    <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row', height: 45, alignItems: 'center'}}>
                            <Text style={styles.text_class}>姓名</Text>
                            <TextInput
                                // ref='nameInput'
                                style={styles.input_class}
                                placeholder='请输入姓名'
                                placeholderTextColor={'#D7DBDC'}
                                underlineColorAndroid='transparent'
                                onChangeText={(text) => {
                                    if (editable) {
                                        this.state.addUserInfo.userName = text;
                                        this.setState({
                                            addUserInfo:this.state.addUserInfo,
                                        })
                                    }
                                }}
                                onFocus={() => {

                                }}
                                value={userName}
                                clearButtonMode={'never'}
                                editable={editable}
                            />
                        </View>
                        <View style={[styles.line_class, {height: 0.5}]}/>
                        <View style={{flexDirection: 'row', height: 45, alignItems: 'center'}}>
                            <Text style={styles.text_class}>电话</Text>
                            <TextInput
                                // ref='phoneInput'
                                style={styles.input_class}
                                placeholder='请输入电话'
                                placeholderTextColor={'#D7DBDC'}
                                underlineColorAndroid='transparent'
                                onChangeText={(text) => {
                                    if (editable) {
                                        this.state.addUserInfo.mobile = text;
                                        this.setState({
                                            addUserInfo:this.state.addUserInfo,
                                        })
                                    }
                                }}
                                onFocus={() => {
                                }}
                                value={mobile}
                                clearButtonMode={'never'}
                                editable={editable}
                            />
                        </View>
                    </View>
                </View>
                <View style={{height: 12, backgroundColor: GlobalStyles.backgroundColor}}/>
            </View>
            </TouchableOpacity>
        </SwipeRow>
        )
    }
}

const styles = StyleSheet.create({
    text_class: {
        marginLeft: 12,
        width: 70,
    },

    view_class: {
        width: GlobalStyles.window_width,
        height: 48,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
    },

    input_class: {
        height: 48,
        fontSize: 14,
        flex: 1,
        textAlign: 'left',
        alignSelf: 'center'
    },

    line_class: {
        height: 1,
        left: 12,
        backgroundColor: '#c3c3c3',
        marginRight:12,
    },

    img_class: {
        width: 54,
        height: 54,
        borderRadius: 4,
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 8,
        marginRight: 8,
        right: 8,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        width:GlobalStyles.window_width - 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height:92,
        marginLeft:12,
        marginRight:12,
        borderRadius:4,
    },

    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        borderRadius:4,
    },

    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        borderRadius:4,
    },

    backTextWhite: {
        color: '#FFF'
    },

    rowFront: {
        flexDirection:'row',
        backgroundColor: '#ffffff',
        borderBottomColor: '#c3c3c3',
        borderBottomWidth: 0.5,
        height: 68,
    },
})