/**
 * Created by Gibbon on 2017/9/14.
 */
import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    processColor,
    ScrollView,
} from 'react-native';
import update from 'immutability-helper';

import {LineChart} from 'react-native-charts-wrapper';
import GlobalStyles from '../../res/style/GlobalStyles'

class RealDataForRCView extends React.Component {

    constructor(props) {
        super(props);

        var lastYear = '';
        var thisYear = '';

        var data = this.props.data;

        var rentRateYValues = [];
        var vancacyRateYValues = [];
        var xValues = [];
        if (data.length >= 6) {
            for (let i = data.length - 6; i < data.length; i++) {
                var time = data[i].dealMonth.split('-');
                if (i === data.length - 6) {
                    lastYear = time[0];
                } else if (i === data.length - 1) {
                    thisYear = data[i].dealMonth.split('-')[0];
                }

                rentRateYValues.push({y: data[i].letRate * 100});
                vancacyRateYValues.push({y: data[i].unoccupiedRate * 100})
                xValues.push(time[1] + '月')
            }
        } else {
            var time = data[0].dealMonth.split('-');
            thisYear = time[0];
            if (time[1] - (6 - data.length) <= 0) {
                lastYear = (parseInt(time[0]) - 1) + '';

                var month;
                for (let i = 0; i < 6 - data.length; i++) {
                    month = 12 + parseInt(time[1]) - (6 - data.length) + i;
                    if (month % 12 === 0) {
                        xValues.push.push(12 + '月');
                    } else {
                        xValues.push.push((month % 12) + '月');
                    }
                    rentRateYValues.push({y:0});
                    vancacyRateYValues.push({y:100});
                }
            } else {
                lastYear = time[0];

                for (let i = 0; i < 6 - data.length; i++) {
                    xValues.push.push((parseInt(time[0]) - data.length + i) + '月')
                    rentRateYValues.push({y:0});
                    vancacyRateYValues.push({y:100});
                }
            }


            for (let i = 0; i < data.length; i++) {
                time = data[i].dealMonth.split('-');
                rentRateYValues.push({y: data[i].letRate * 100});
                vancacyRateYValues.push({y: data[i].unoccupiedRate * 100})
                xValues.push(time[1] + '月')
            }
        }

        this.state = {
            rentRate : {
                data: {
                    dataSets: [{
                        values: rentRateYValues,
                        label: lastYear === thisYear ? thisYear + '年出租率（%）' : lastYear + '至' + thisYear + '年出租率（%）',
                        config: {
                            lineWidth: 1,
                            drawCubicIntensity: 0.4,
                            circleRadius: 5,
                            drawHighlightIndicators: false,
                            color: processColor('blue'),
                            drawFilled: true,
                            fillColor: processColor('blue'),
                            fillAlpha: 45,
                            circleColor: processColor('blue')
                        },
                    }]
                },
                xAxis: {
                    valueFormatter: xValues,
                    granularityEnabled: true,
                    granularity : 1,
                },
                legend: {
                    enabled: true,
                    textColor: processColor('blue'),
                    textSize: 12,
                    position: 'ABOVE_CHART_LEFT',
                    form: 'SQUARE',
                    formSize: 14,
                    xEntrySpace: 10,
                    yEntrySpace: 5,
                    formToTextSpace: 5,
                    wordWrapEnabled: true,
                    maxSizePercent: 0.5,
                    custom: {
                        colors: [processColor('blue')],
                        labels: [lastYear === thisYear ? thisYear + '年出租率（%）' : lastYear + '至' + thisYear + '年出租率（%）', ]
                    }
                },
                marker: {
                    enabled: true,
                    backgroundTint: processColor('teal'),
                    markerColor: processColor('#F0C0FF8C'),
                    textColor: processColor('white'),

                }
            },

            vacancyRate: {
                data: {
                    dataSets: [{
                        values: vancacyRateYValues,
                        label: lastYear === thisYear ? thisYear + '年空置率（%）' : lastYear + '至' + thisYear + '年空置率（%）',
                        config: {
                            lineWidth: 1,
                            drawCubicIntensity: 0.4,
                            circleRadius: 5,
                            drawHighlightIndicators: false,
                            color: processColor('blue'),
                            drawFilled: true,
                            fillColor: processColor('blue'),
                            fillAlpha: 45,
                            circleColor: processColor('blue')
                        },
                    }]
                },
                xAxis: {
                    valueFormatter: xValues,
                    granularityEnabled: true,
                    granularity : 1,
                },
                legend: {
                    enabled: true,
                    textColor: processColor('blue'),
                    textSize: 12,
                    position: 'ABOVE_CHART_LEFT',
                    form: 'SQUARE',
                    formSize: 14,
                    xEntrySpace: 10,
                    yEntrySpace: 5,
                    formToTextSpace: 5,
                    wordWrapEnabled: true,
                    maxSizePercent: 0.5,
                    custom: {
                        colors: [processColor('blue')],
                        labels: [lastYear === thisYear ? thisYear + '年空置率（%）' : lastYear + '至' + thisYear + '年空置率（%）', ]
                    }
                },
                marker: {
                    enabled: true,
                    backgroundTint: processColor('teal'),
                    markerColor: processColor('#F0C0FF8C'),
                    textColor: processColor('white'),

                }
            }
        };
    }

    componentDidMount() {

    }

    handleSelect(event) {
        // let entry = event.nativeEvent
        // if (entry == null) {
        //     this.setState({...this.state, selectedEntry: null})
        // } else {
        //     this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
        // }
    }

    render() {
        return (
            <ScrollView style={{flex: 1}}>

                <View style={styles.container}>
                    <View style={{flexDirection:'row', alignItems:'center', height:32}}>
                        <View style={{borderWidth: 8, borderColor:'#0FFFE9',marginBottom:6,marginTop:6,height:16, alignSelf:'center'}}/>
                        <Text style={{paddingLeft: 12, paddingTop: 6, paddingBottom: 6,
                            flex:1, height:32, fontSize: 14, backgroundColor:'#ffffff'}}>租控数据如下:</Text>
                    </View>

                    <View style={{alignSelf:'center', alignSelf:'center', marginTop: 20}}>
                        <LineChart
                            style={styles.chart}
                            data={this.state.rentRate.data}
                            description={{text: ''}}
                            legend={this.state.rentRate.legend}
                            marker={this.state.rentRate.marker}
                            xAxis={this.state.rentRate.xAxis}
                            drawGridBackground={false}
                            borderColor={processColor('teal')}
                            borderWidth={1}
                            drawBorders={true}

                            dragEnabled={true}
                            scaleEnabled={true}
                            scaleXEnabled={true}
                            scaleYEnabled={true}
                            pinchZoom={true}

                            dragDecelerationEnabled={true}
                            dragDecelerationFrictionCoef={0.99}

                            keepPositionOnRotation={false}
                            onSelect={this.handleSelect.bind(this)}
                            chartDescription={{ text: '' }}
                            doubleTapToZoomEnabled={false}
                            touchEnabled={false}
                        />
                    </View>

                    <View style={{height:8, backgroundColor:GlobalStyles.backgroundColor}}/>
                    <View style={{alignSelf:'center', alignSelf:'center', position:'relative',marginTop:20}}>
                        <LineChart
                            style={styles.chart}
                            data={this.state.vacancyRate.data}
                            description={{text: ''}}
                            legend={this.state.vacancyRate.legend}
                            marker={this.state.vacancyRate.marker}
                            xAxis={this.state.vacancyRate.xAxis}
                            drawGridBackground={false}
                            borderColor={processColor('teal')}
                            borderWidth={1}
                            drawBorders={true}

                            dragEnabled={true}
                            scaleEnabled={true}
                            scaleXEnabled={true}
                            scaleYEnabled={true}
                            pinchZoom={true}

                            dragDecelerationEnabled={true}
                            dragDecelerationFrictionCoef={0.99}

                            keepPositionOnRotation={false}
                            onSelect={this.handleSelect.bind(this)}
                            chartDescription={{ text: '' }}
                            doubleTapToZoomEnabled={false}
                            touchEnabled={false}
                        />
                    </View>
                    <View style={[{marginBottom: 60, backgroundColor:GlobalStyles.backgroundColor}]}/>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    chart: {
        width:GlobalStyles.window_width - 24,
        height:GlobalStyles.window_width,
    }
});

export default RealDataForRCView;
