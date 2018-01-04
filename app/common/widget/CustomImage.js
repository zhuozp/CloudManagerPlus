/**
 * Created by zhuozhipeng on 17/8/17.
 */
import {
    Image,
    Platform,
} from 'react-native'

export  default class CustomImage extends Image {
    viewConfig = Object.assign({} , this.viewConfig, {
        validAttributes: Object.assign(
            {},
            this.viewConfig.validAttributes,
            {[Platform.OS === 'ios' ? 'source' : 'src']: true})
    });

    constructor() {
        super();
        this.setNativeProps = (props = {}) => {

            if (props.source) {
                const source = this.resolveAssetSource(props.source);
                let sourceAttr = Platform.OS === 'ios' ? 'source' : 'src';
                let sources;
                if (Array.isArray(source)) {
                    sources = source;
                } else {
                    sources = [source];
                }
                Object.assign(props, {[sourceAttr]: sources});
            }

            return super.setNativeProps(props);
        }
    }
}