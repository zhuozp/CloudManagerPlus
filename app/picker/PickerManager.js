/**
 * Created by zhuozhipeng on 16/8/17.
 */

import Picker from 'react-native-picker'
import area from './area.json'
import ImportantCity from './ImportantCity.json'

export default class PickerManager {
    constructor() {

    }

    _creatNumData(num) {
        let data = [];
        for (let i = 1; i <= num; i++) {
            data.push(i);
        }

        return data;
    }

    _createDateData() {
        let date = [];
        for(let i=2000;i<2067;i++){
            let month = [];
            for(let j = 1;j<13;j++){
                let day = [];
                if(j === 2){
                    for(let k=1;k<29;k++){
                        day.push(k+'日');
                    }
                    //Leap day for years that are divisible by 4, such as 2000, 2004
                    if((i%4 === 0 && i%100 !== 0) || i%400 === 0){
                        day.push(29+'日');
                    }
                }
                else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                    for(let k=1;k<32;k++){
                        day.push(k+'日');
                    }
                }
                else{
                    for(let k=1;k<31;k++){
                        day.push(k+'日');
                    }
                }
                let _month = {};
                _month[j+'月'] = day;
                month.push(_month);
            }
            let _date = {};
            _date[i+'年'] = month;
            date.push(_date);
        }
        return date;
    }

    _createAreaData() {
        let data = [];
        let len = area.length;
        for(let i=0;i<len;i++){
            let city = [];
            for(let j=0,cityLen=area[i]['city'].length;j<cityLen;j++){
                let _city = {};
                _city[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
                city.push(_city);
            }

            let _data = {};
            _data[area[i]['name']] = city;
            data.push(_data);
        }
        return data;
    }

    _showNumPicker(num,selectValue, confirmCallback, cancelCallback) {
        Picker.init({
            pickerData: this._creatNumData(num),
            pickerToolBarFontSize: 16,
            pickerFontSize: 16,
            pickerFontColor: [255, 0 ,0, 1],
            selectedValue: [selectValue],
            pickerTitleText:'选择号码',
            pickerCancelBtnText:'取消',
            pickerConfirmBtnText:'确定',
            onPickerConfirm: (pickedValue) => {
                console.log('num', pickedValue);
                if (!!confirmCallback) {
                    confirmCallback(pickedValue);
                }
            },
            onPickerCancel: (pickedValue) => {
                console.log('num', pickedValue);
                if (!!cancelCallback) {
                    cancelCallback();
                }
            },
            onPickerSelect: (pickedValue) => {
                console.log('num', pickedValue);
            }
        });
        Picker.show();
    }

    _showDatePicker(selectedValue, confirmCallback, cancelCallback) {
        Picker.init({
            pickerData: this._createDateData(),
            pickerToolBarFontSize: 16,
            pickerFontSize: 16,
            pickerFontColor: [255, 0 ,0, 1],
            selectedValue:selectedValue,
            pickerTitleText:'选择日期',
            pickerCancelBtnText:'取消',
            pickerConfirmBtnText:'确定',
            onPickerConfirm: (pickedValue, pickedIndex) => {
                console.log('date', pickedValue, pickedIndex);
                if (!!confirmCallback) {
                    confirmCallback(pickedValue, pickedIndex);
                }
            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                console.log('date', pickedValue, pickedIndex);
                if (!!cancelCallback) {
                    cancelCallback();
                }
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                console.log('date', pickedValue, pickedIndex);
            }
        });
        Picker.show();
    }

    _showAreaPicker(confirmCallback, cancelCallback) {
        Picker.init({
            pickerData: this._createAreaData(),
            selectedValue: ['河北', '唐山', '古冶区'],
            onPickerConfirm: pickedValue => {
                console.log('area', pickedValue);
                if (!!confirmCallback) {
                    confirmCallback(pickedValue);
                }
            },
            onPickerCancel: pickedValue => {
                console.log('area', pickedValue);
                if (!!cancelCallback) {
                    cancelCallback();
                }
            },
            onPickerSelect: pickedValue => {
                //Picker.select(['山东', '青岛', '黄岛区'])
                console.log('area', pickedValue);
            }
        });
        Picker.show();
    }

    _showCitiesPicker(selectedValue, confirmCallback, cancelCallback) {
        Picker.init({
            pickerData: ImportantCity.cities,
            selectedValue: [selectedValue],
            pickerTitleText:'选择城市',
            pickerCancelBtnText:'取消',
            pickerConfirmBtnText:'确定',
            onPickerConfirm: pickedValue => {
                console.log('area', pickedValue);
                if (!!confirmCallback) {
                    confirmCallback(pickedValue);
                }
            },
            onPickerCancel: pickedValue => {
                console.log('area', pickedValue);
                if (!!cancelCallback) {
                    cancelCallback();
                }
            },
            onPickerSelect: pickedValue => {
                console.log('area', pickedValue);
            }
        });
        Picker.show();
    }

    _showTimePicker(confirmCallback, cancelCallback) {
        let years = [],
            months = [],
            days = [],
            hours = [],
            minutes = [];

        for(let i=1;i<51;i++){
            years.push(i+1980);
        }
        for(let i=1;i<13;i++){
            months.push(i);
            hours.push(i);
        }
        for(let i=1;i<32;i++){
            days.push(i);
        }
        for(let i=1;i<61;i++){
            minutes.push(i);
        }
        let pickerData = [years, months, days, ['am', 'pm'], hours, minutes];
        let date = new Date();
        let selectedValue = [
            [date.getFullYear()],
            [date.getMonth()+1],
            [date.getDate()],
            [date.getHours() > 11 ? 'pm' : 'am'],
            [date.getHours() === 12 ? 12 : date.getHours()%12],
            [date.getMinutes()]
        ];
        Picker.init({
            pickerData,
            selectedValue,
            pickerTitleText: 'Select Date and Time',
            wheelFlex: [2, 1, 1, 2, 1, 1],
            onPickerConfirm: pickedValue => {
                console.log('area', pickedValue);
                if (!!confirmCallback) {
                    confirmCallback(pickedValue);
                }
            },
            onPickerCancel: pickedValue => {
                console.log('area', pickedValue);
                if (!!cancelCallback) {
                    cancelCallback();
                }
            },
            onPickerSelect: pickedValue => {
                let targetValue = [...pickedValue];
                if(parseInt(targetValue[1]) === 2){
                    if(targetValue[0]%4 === 0 && targetValue[2] > 29){
                        targetValue[2] = 29;
                    }
                    else if(targetValue[0]%4 !== 0 && targetValue[2] > 28){
                        targetValue[2] = 28;
                    }
                }
                else if(targetValue[1] in {4:1, 6:1, 9:1, 11:1} && targetValue[2] > 30){
                    targetValue[2] = 30;

                }
                // forbidden some value such as some 2.29, 4.31, 6.31...
                if(JSON.stringify(targetValue) !== JSON.stringify(pickedValue)){
                    // android will return String all the time，but we put Number into picker at first
                    // so we need to convert them to Number again
                    targetValue.map((v, k) => {
                        if(k !== 3){
                            targetValue[k] = parseInt(v);
                        }
                    });
                    Picker.select(targetValue);
                    pickedValue = targetValue;
                }
            }
        });
        Picker.show();
    }

    _toggle() {
        Picker.toggle();
    }

    _isPickerShow(callback){
        Picker.isPickerShow(status => {
            callback(status);
        });
    }
}