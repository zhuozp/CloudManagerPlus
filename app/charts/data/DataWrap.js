/**
 * Created by Gibbon on 2017/8/13.
 */
import {
    processColor,
} from 'react-native'

export default class DataWrap {
    static getTcDataWithArea(data) {
        if (!data) {
            // 样例
            return {
                legend: {
                    enabled: true,
                    textSize: 14,
                    form: 'SQUARE',
                    formSize: 14,
                    xEntrySpace: 10,
                    yEntrySpace: 5,
                    formToTextSpace: 5,
                    wordWrapEnabled: true,
                    maxSizePercent: 0.5,
                    position: 'ABOVE_CHART_LEFT',
                },
                data: {
                    dataSets: [{
                        values: [{y: 100.2}, {y: 105.6}, {y: 102}, {y: 110}, {y: 114}, {y: 109}, {y: 109}],
                        label: '2017年成交面积',
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
                    valueFormatter: ['1月', '2月', '3月', '4月', '5月', '6月','7月'],
                    granularityEnabled: true,
                    granularity : 1,
                }
            }
        }

        // or
        return data;  // need wrap
    }

    static getTcDataWithClient(data) {
        if (!data) {
            // 样例
            return {
                legend: {
                    enabled: true,
                    textSize: 14,
                    form: 'SQUARE',
                    formSize: 14,
                    xEntrySpace: 10,
                    yEntrySpace: 5,
                    formToTextSpace: 5,
                    wordWrapEnabled: true,
                    maxSizePercent: 0.5,
                    position: 'ABOVE_CHART_LEFT',
                },
                data: {
                    dataSets: [{
                        values: [{y: 3}, {y: 5}, {y: 2}, {y: 15}, {y: 18}, {y: 1}, {y: 9}],
                        label: '2017年成交客户数',
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
                    valueFormatter: ['1月', '2月', '3月', '4月', '5月', '6月','7月'],
                    granularityEnabled: true,
                    granularity : 1,
                }
            }
        }



        return data;
    }

    // 增加在租租金未来走势，就是事先帮包租客计算好未来收入
    static getRentCountWithMonth(data) {

    }

    static getRentRatWithMouth(data) {
        if (!data) {
            return {
                data: {
                    dataSets: [{
                        values: [{y: 0.00}, {y: 0.00}, {y: 19.08}, {y: 26.19}, {y: 30.64}, {y: 30.64}],
                        label: '出租率（%）',
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
                    valueFormatter: ['2月', '3月', '4月', '5月', '6月','7月'],
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
                            labels: ['出租率（%）', ]
                        }
                },
                marker: {
                    enabled: true,
                        backgroundTint: processColor('teal'),
                        markerColor: processColor('#F0C0FF8C'),
                        textColor: processColor('white'),

                }
            }
        }

        return data;
    }

    static getVacancyRateWithMonth(data) {
        if (!data) {
            return {
                data: {
                    dataSets: [{
                        values: [{y: 100}, {y: 100}, {y: 80.92}, {y: 73.81}, {y: 69.36}, {y: 69.36}],
                        label: '空置率（%）',
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
                    valueFormatter: ['2月', '3月', '4月', '5月', '6月','7月'],
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
                        labels: ['空置率（%）', ]
                    }
                },
                marker: {
                    enabled: true,
                    backgroundTint: processColor('teal'),
                    markerColor: processColor('#F0C0FF8C'),
                    textColor: processColor('white'),

                }
            }
        }

        return data;
    }

    static getRentCountWithMonth(data) {
        if (!data) {
            return {
                data: {
                    dataSets: [{
                        values: [{y: 100}, {y: 100}, {y: 80.92}, {y: 73.81}, {y: 69.36}, {y: 69.36}],
                        label: '空置率（%）',
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
                    valueFormatter: ['2月', '3月', '4月', '5月', '6月','7月'],
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
                        labels: ['空置率（%）', ]
                    }
                },
                marker: {
                    enabled: true,
                    backgroundTint: processColor('teal'),
                    markerColor: processColor('#F0C0FF8C'),
                    textColor: processColor('white'),

                }
            }
        }

        return data;
    }
}