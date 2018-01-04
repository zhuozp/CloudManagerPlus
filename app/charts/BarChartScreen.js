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
import DataWrap from './data/DataWrap'

class BarChartScreen extends React.Component {

  constructor() {
    super();

    this.state = {
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
    var clientData = DataWrap.getTcDataWithClient();
    return (
      <ScrollView style={{flex: 1}}>

        <View style={styles.container}>
          <View style={{flexDirection:'row', alignItems:'center', height:32}}>
            <View style={{borderWidth: 8, borderColor:'#0FFFE9',marginBottom:6,marginTop:6,height:16, alignSelf:'center'}}/>
            <Text style={{paddingLeft: 12, paddingTop: 6, paddingBottom: 6,
                flex:1, height:32, fontSize: 14, backgroundColor:'#ffffff'}}>成交数据样例:</Text>
          </View>


          <View style={{alignSelf:'center', alignSelf:'center', marginTop: 20}}>
            <BarChart
              style={styles.chart}
              data={this.state.data}
              xAxis={this.state.xAxis}
              animation={{durationX: 2000}}
              legend={this.state.legend}
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
                data={clientData.data}
                xAxis={clientData.xAxis}
                animation={{durationX: 2000}}
                legend={clientData.legend}
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

export default BarChartScreen;
