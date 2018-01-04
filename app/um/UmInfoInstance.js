/**
 * Created by zhuozhipeng on 11/8/17.
 */

export default class UmInfoInstance {
    static getInstance() {
        if (!UmInfoInstance.instance) {
            UmInfoInstance.instance = new UmInfoInstance();
        }

        return UmInfoInstance.instance;
    }

    constructor() {
        this._wholeData = null;
        this._address = '';
        this._password = '';
        this._umNo = '';
        this._loginToken = '';
        this._isLogin = false;
        this._userId = '';
        this._subUserId = '';
        this._acountName = '';
        this._openBank = '';
        this._acountNum = '';
        this._subUsers = [];
        this._mobile = '';
        this._experienceAccount = false;
    }


    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }

    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    get subUserId() {
        return this._subUserId;
    }

    set subUserId(value) {
        this._subUserId = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get phoneNo() {
        return this._phoneNo;
    }

    set phoneNo(value) {
        this._phoneNo = value;
    }

    get address() {
        return this._address;
    }

    set address(value) {
        this._address = value;
    }

    get pssword() {
        return this._password;
    }

    set pssword(value) {
        this._password = value;
    }

    get umNo() {
        return this._umNo;
    }

    set umNo(value) {
        this._umNo = value;
    }

    get loginToken() {
        return this._loginToken;
    }

    set loginToken(value) {
        this._loginToken = value;
    }

    get isLogin() {
        return this._isLogin;
    }

    set isLogin(value) {
        this._isLogin = value;
    }

    setInfo(data) {
        this._wholeData = data;
        this._isLogin = true;
        this._loginToken = data.token;
        this._mobile = data.mobile;
        this._password =data.password;
        this._userId = data.userId;
        this._subUserId = data.subUserId;
        this._address = data.address;
        this._acountName = data.acountName;
        this._openBank = data.openBank;
        this._acountNum = data.acountNum;
        this._subUsers = data.subUsers;
        this._name = data.userName;
        this._experienceAccount = data.experienceAccount;
    }
}