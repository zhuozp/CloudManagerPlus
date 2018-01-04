/**
 * Created by zhuozhipeng on 9/8/17.
 */

import {
    Dimensions,
    PixelRatio,
} from 'react-native'
const {height, width} = Dimensions.get('window');

export const deviceWidth = Dimensions.get('window').width;      //设备的宽度
export const deviceHeight = Dimensions.get('window').height;    //设备的高度
let fontScale = PixelRatio.getFontScale();                      //返回字体大小缩放比例

let pixelRatio = PixelRatio.get();      //当前设备的像素密度
const defaultPixel = 2;                           //iphone6的像素密度
//px转换成dp
const w2 = 750 / defaultPixel;
const h2 = 1334 / defaultPixel;
const scale = Math.min(deviceHeight / h2, deviceWidth / w2);   //获取缩放比例

class GlobalStyles {
    constructor() {
        this.line = {
            flex: 1,
                height: 0.4,
                opacity: 0.5,
                backgroundColor: 'darkgray',
        }

        this.backgroundColor = '#f5f5f5';
        this.listView_height = (height-(20+40));
        this.window_height = height;
        this.window_width = width;
        this.nav_bar_height_ios = this.scaleSize(88);

        this.nav_bar_fontsize = this.setSpText(16);
        this.nav_bar_height_android = this.scaleSize(100);
        this.nav_bar_backgroundColor = '#479cf2';
        this.selectedColor = '#252525';
        this.lineColor = '#c3c3c3';
        this.normalColor = '#d2d2d2';
        this.dividerview =  {//分割线区域
            flexDirection: 'row',
                marginLeft: 20,
                marginRight: 20,
        };
        this.divider = {
            flex: 1,
                height: 1,
                backgroundColor: '#ECEDF1'
        };
        this.startColor = '#ff180a'

        this.titleColor = '#939597'
    }

    setSpText(size) {
        // size = Math.round((size * scale + 0.5) * pixelRatio / fontScale);
        // return size / defaultPixel;
        if (pixelRatio === 2) {
            // iphone 5s and older Androids

            if (deviceWidth < 360) {

                return size * 0.95;

            }

            // iphone 5

            if (deviceHeight < 667) {

                return size;

                // iphone 6-6s

            } else if (deviceHeight >= 667 && deviceHeight <= 735) {

                return size * 1.15;

            }

            // older phablets

            return size * 1.25;

        }

        if (pixelRatio === 3) {

            // catch larger devices

            // ie iphone 6s plus / 7 plus / mi note 等等

            return size * 1.27;

        }

        return size;
    }

    scaleSize(size) {

        size = Math.round(size * scale + 0.5);
        return size / defaultPixel;
    }
}

module.exports = new GlobalStyles();
