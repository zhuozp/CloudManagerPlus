import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  processColor
} from 'react-native';

import {PieChart} from 'react-native-charts-wrapper';
import GlobalStyles from '../../res/style/GlobalStyles'

class PieChartScreen extends React.Component {

  constructor(props) {
    super(props);

    var letRate = !!this.props.letRate ? this.props.letRate : -1;
    var unoccupiedRate = !!this.props.unoccupiedRate ? this.props.unoccupiedRate : -1;
    var noData = !!this.props.noData ? this.props.noData : false;
    if (letRate < 0 || letRate > 100 || unoccupiedRate < 0 || unoccupiedRate > 100) {
        noData = true;
    }

    this.state = {
      legend: {
        enabled: true,
        textSize: 16,
        form: 'CIRCLE',
        wordWrapEnabled: false,
      },
      data: {
        dataSets: [{
          values: noData ? [{value:100, label:''}] : [{value: letRate, label: letRate + '%\n出租'},
            {value: unoccupiedRate, label: unoccupiedRate + '%\n未出租'}],
          label: 'Pie dataset',
          config: {
            colors: noData ? [processColor('#c3c3c3')] : [processColor('#C0FF8C'), processColor('#FFF78C')],
            valueTextSize: 0,
            valueTextColor: processColor('green'),
            sliceSpace: 0,
            selectionShift: 0,
              drawValues:false,
          }
        }],
      },
      description: {
        text: 'This is Pie chart description',
        textSize: 15,
        textColor: processColor('darkgray'),

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
    return (

      <View style={{alignItems:'center'}}>

        {/*<View style={{height:80}}>*/}
          {/*<Text> selected entry</Text>*/}
          {/*<Text> {this.state.selectedEntry}</Text>*/}
        {/*</View>*/}

        <View style={{width: GlobalStyles.scaleSize(400), height:GlobalStyles.scaleSize(400)}}>
          <PieChart
            style={styles.chart}
            logEnabled={false}
            // chartBackgroundColor={styles.color}
            data={this.state.data}
            legend={{enabled: false}}

            entryLabelColor = {processColor('black')}
            entryLabelTextSize = {GlobalStyles.setSpText(11)}

            touchEnabled = {false}
            rotationEnabled={false}
            drawSliceText={false}
            usePercentValues={true}
            centerText={'一键招商'}
            centerTextRadiusPercent={100}
            holeRadius={GlobalStyles.scaleSize(80)}
            holeColor={processColor('#f0f0f0')}
            transparentCircleRadius={GlobalStyles.scaleSize(120)}
            transparentCircleColor={processColor('rgba(#fff)')}
            maxAngle={360}
            onSelect={this.handleSelect.bind(this)}
            chartDescription={{ text: '' }}
            marker={{enable:false}}
          />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chart: {
    flex: 1
  },
    // color: 'rgba(0,0,0,0.1)'
});

export default PieChartScreen;
