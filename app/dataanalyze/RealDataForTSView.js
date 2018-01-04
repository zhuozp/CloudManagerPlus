/**
 * Created by Gibbon on 2017/9/13.
 */
import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    processColor,
    ScrollView
} from 'react-native';

import {BarChart} from 'react-native-charts-wrapper';
import GlobalStyles from '../../res/style/GlobalStyles'

class RealDataForTSView extends React.Component {

    constructor(props) {
        super(props);

        var lastYear = '';
        var thisYear = '';

        var data = this.props.data;

        var areaYValues = [];
        var tenantYValues = [];
        var xValues = [];
        if (data.length >= 6) {
            for (let i = data.length - 6; i < data.length; i++) {
                var time = data[i].dealMonth.split('-');
                if (i === data.length - 6) {
                    lastYear = time[0];
                } else if (i === data.length - 1) {
                    thisYear = data[i].dealMonth.split('-')[0];
                }

                areaYValues.push({y: data[i].dealArea});
                tenantYValues.push({y: data[i].dealTenant})
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
                    areaYValues.push({y:0});
                    tenantYValues.push({y:0});
                }
            } else {
                lastYear = time[0];

                for (let i = 0; i < 6 - data.length; i++) {
                    xValues.push.push((parseInt(time[0]) - data.length + i) + '月')
                    areaYValues.push({y:0});
                    tenantYValues.push({y:0});
                }
            }


            for (let i = 0; i < data.length; i++) {
                time = data[i].dealMonth.split('-');
                areaYValues.push({y: data[i].dealArea});
                tenantYValues.push({y: data[i].dealTenant})
                xValues.push(time[1] + '月')
            }
        }

        this.state = {
            areaLegend: {
                enabled: true,
                textSize: GlobalStyles.setSpText(14),
                form: 'SQUARE',
                formSize: 14,
                xEntrySpace: 10,
                yEntrySpace: 5,
                formToTextSpace: 5,
                wordWrapEnabled: true,
                maxSizePercent: 0.5,
                position: 'ABOVE_CHART_LEFT',
            },
            areaData: {
                dataSets: [{
                    values: areaYValues,
                    label: lastYear === thisYear ? thisYear + '年成交面积' : lastYear + '至' + thisYear + '年成交面积',
                    config: {
                        color: processColor('teal'),
                        barSpacePercent: 40,
                        barShadowColor: processColor('lightgrey'),
                        highlightAlpha: 90,
                        highlightColor: processColor('red'),
                    }
                }],
            },
            xAxis: {
                valueFormatter: xValues,
                granularityEnabled: true,
                granularity : 1,
            },

            tenantLegend: {
                enabled: true,
                textSize: GlobalStyles.setSpText(14),
                form: 'SQUARE',
                formSize: 14,
                xEntrySpace: 10,
                yEntrySpace: 2,
                formToTextSpace: 5,
                wordWrapEnabled: true,
                maxSizePercent: 0.5,
                position: 'ABOVE_CHART_LEFT',
            },

            tenantData: {
                dataSets: [{
                    values: tenantYValues,
                    label: lastYear === thisYear ? thisYear + '年成交客户数' : lastYear + '至' + thisYear + '年成交客户数',
                    config: {
                        color: processColor('teal'),
                        barSpacePercent: 40,
                        barShadowColor: processColor('lightgrey'),
                        highlightAlpha: 90,
                        highlightColor: processColor('red'),
                    }
                }],
            },

            xAxis: {
                valueFormatter: xValues,
                granularityEnabled: true,
                granularity : 1,
            },
        };
    }

    handleSelect(event) {
        let entry = event.nativeEvent
        if (entry == null) {
            this.setState({...this.state, selectedEntry: null})
        } else {
            this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
        }
    }


    render() {
        return (
            <ScrollView style={{flex: 1}}>

                <View style={styles.container}>
                    <View style={{flexDirection:'row', alignItems:'center', height:32}}>
                        <View style={{borderWidth: 8, borderColor:'#0FFFE9',marginBottom:6,marginTop:6,height:16, alignSelf:'center'}}/>
                        <Text style={{paddingLeft: 12, paddingTop: 6, paddingBottom: 6,
                            flex:1, height:32, fontSize: 14, backgroundColor:'#ffffff'}}>成交统计数据如下:</Text>
                    </View>


                    <View style={{alignSelf:'center', alignSelf:'center', marginTop: 20}}>
                        <BarChart
                            style={styles.chart}
                            data={this.state.areaData}
                            xAxis={this.state.xAxis}
                            animation={{durationX: 2000}}
                            legend={this.state.areaLegend}
                            gridBackgroundColor={processColor('#ffffff')}
                            drawBarShadow={false}
                            drawValueAboveBar={true}
                            drawHighlightArrow={true}
                            onSelect={this.handleSelect.bind(this)}
                            chartDescription={{ text: '' }}
                            doubleTapToZoomEnabled={false}
                            touchEnabled={false}
                        />
                    </View>

                    <View style={{height:8, backgroundColor:GlobalStyles.backgroundColor}}/>
                    <View style={{alignSelf:'center', alignSelf:'center', position:'relative',marginTop:20}}>
                        <BarChart
                            style={styles.chart}
                            data={this.state.tenantData}
                            xAxis={this.state.xAxis}
                            animation={{durationX: 2000}}
                            legend={this.state.tenantLegend}
                            gridBackgroundColor={processColor('#ffffff')}
                            drawBarShadow={false}
                            drawValueAboveBar={true}
                            drawHighlightArrow={true}
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

export default RealDataForTSView;
