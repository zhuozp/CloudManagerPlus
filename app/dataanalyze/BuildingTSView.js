/**
 * Created by zhuozhipeng on 11/8/17.
 */

import React, {
    Component
} from 'react'

import {
    View,
} from 'react-native'

import BarChartScreen from '../charts/BarChartScreen'
import RealDataForTSView from './RealDataForTSView'

export default class BuildingTSView extends Component {
    constructor(props) {
        super(props)

        if (!!this.props.data && this.props.data.length > 0) {
            this.state = {
                hasData : true,
            }
        } else {
            this.state = {
                hasData : false,
            }
        }
    }

    render() {
        return (
            this.state.hasData ? <RealDataForTSView data={this.props.data}/> : <BarChartScreen/>
        );
    }
}