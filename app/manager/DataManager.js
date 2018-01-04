/**
 * Created by zhuozhipeng on 10/8/17.
 */

import {
    AsyncStorage
} from 'react-native';

import JsonProcessUtils from '../util/JsonProcessUtils';

const HTTP_PARAMS = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
};

const HTTP_FROM_PARAMS = {
    method: 'POST',
    headers: {
        'Content-Type':'multipart/form-data',
    }
}


export default class DataManager {
    constructor(flag) {
        this.flag = flag;
    }

    fetchData(url, needSave, params) {
        if (!needSave) {
            return new Promise((resolve, reject)=> {
                this.fetchDataFromNetwork(url, needSave, params).then((data)=> {
                    resolve(data);
                }).catch((error)=> {
                    reject(error);
                })
            })
        } else {
            return new Promise((resolve, reject)=> {
                this.fetchDataFromLocal(url).then((wrapData)=> {
                    if (wrapData) {
                        resolve(wrapData);
                    } else {
                        this.fetchDataFromNetwork(url, needSave, params).then((data)=> {
                            resolve(data);
                        }).catch((error)=> {
                            reject(error);
                        })
                    }
                }).catch((error)=> {
                    console.log('fetchLocalData fail, may be is null:' + error);
                    this.fetchDataFromNetwork(url, needSave, params)((data)=> {
                        resolve(data);
                    }).catch((error=> {
                        reject(error);
                    }))
                })
            })
        }
    }

    fetchDataFromLocal(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result)=> {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            })
        })
    }

    fetchDataFromNetwork(url, needSaved, params) {
        return new Promise((resolve, reject)=> {
            if (params) {
                fetch(url, JsonProcessUtils.mergeJson(HTTP_PARAMS, params))
                    .then((response)=> response.json())
                    .catch((error)=> {
                        reject(error);
                    }).then((responseData)=> {
                    // 这里添加json格式的要求
                    if (!responseData || !responseData.data) {
                        reject(new Error('responseData is null'));
                        return;
                    }

                    resolve(responseData.data);
                    if (needSaved) {
                        this.saveData(url, responseData.data);
                    }
                }).done();
            } else {
                fetch(url)
                    .then((response)=> response.json())
                    .catch((error)=> {
                        reject(error);
                    }).then((responseData)=> {
                    // 这里添加json格式的要求
                    if (!responseData) {
                        reject(new Error('responseData is null'));
                        return;
                    }

                    resolve(responseData);
                    if (needSaved) {
                        this.saveData(url, responseData);
                    }
                }).done();
            }
        })
    }

    fromData(imgUriAry, params) {
        let formData = new FormData();
        for(var i = 0;i<imgUriAry.length;i++){
            let file = {uri: imgUriAry[i], type: 'multipart/form-data', name: 'image.png'};
            formData.append("image",file);
        }
        
        formData.append("params", JSON.stringify(params))
        return formData;
    }

    uploadDataWithFromData(url, fromdata) {
        return new Promise((resolve, reject)=> {
            fetch(url, JsonProcessUtils.mergeJson(HTTP_FROM_PARAMS, fromdata))
                .then((response)=> response.json())
                .catch((error)=> {
                    reject(error);
                }).then((responseData)=> {
                // 这里添加json格式的要求
                if (!responseData || !responseData.data) {
                    reject(new Error('responseData is null'));
                    return;
                }

                resolve(responseData.data);
            }).done();
        })
    }

    saveData(key, data, callback) {
        if (!key) return;

        AsyncStorage.setItem(key, data, callback);
    }

    getData(key) {
       if (!key) return;
       return new Promise((resolve, reject) => {
           AsyncStorage.getItem(key, (error, result)=> {
               if (!error) {
                   try {
                       resolve(JSON.parse(result));
                   } catch (e) {
                       reject(e);
                       console.error(e);
                   }
               } else {
                   reject(error);
                   console.error(error);
               }
           })
       })
    }
}