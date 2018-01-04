/**
 * Created by zhuozhipeng on 11/8/17.
 */
import React, {
    Component
} from 'react'

import {
    View,
} from 'react-native'

import TimeSeriesLineChartScreen from '../charts/TimeSeriesLineChartScreen'

import LineChartScreen from '../charts/LineChartScreen'
import RealDataForRCView from './RealDataForRCView'

export default class BuildingRCView extends Component {
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
            this.state.hasData ? <RealDataForRCView data={this.props.data}/> : <LineChartScreen/>
        );
    }
}