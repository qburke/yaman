import React from 'react';
import { useRef } from 'react';
import { Pie, getElementAtEvent } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

let greens = [
  '#3CB371', '#3EB489', '#009F6B', '#50C878', '#00A550', '#2E8B57', '#006241', '#009E60', '#009150',
  '#228B22', '#006A4E', '#71BC78', '#679267', '#4F7942', '#355E3B'
]

let blues = [
  '#0047AB', '#1560bd', '#6082B6', '#4682B4', '#0077c0', '#1F305E', '#004170', '#00538C', '#007791',
  '#00416A', '#72A0C1', '#367588', '#034694', '#0066b2', '#002244'
]

let purples = [
  '#E6D7FF', '#D8BFD8', '#DDA0DD', '#BA55D3', '#9370DB', '#E0B0FF', '#DF73FF', '#DE6FA1', '#B768A2',
  '#9966CC', '#9867C5', '#BE93E4', '#B65FCF', '#D2AFFF', '#D399E6']

let inTheRed = '#D0342C'
let ON_TARGET = '#ececec'
let OVER_BUDGET = '#ff007f'

class SpendingChart extends React.Component {
  constructor(props) {
    super(props);
    this.PieChartInner = this.PieChartInner.bind(this);
    this.state = {
        summary : {},
        loaded : false,
        labels : [],
        data : [],
        colors : []
    }
  }

  PieChartInner(props) {
    const chartRef = useRef();
    const onClick = (event) => {
      var activePoints = getElementAtEvent(chartRef.current, event);
      if(activePoints[0]) {
        alert(props.labels[activePoints[0].index]);
      }
    }
    return <Pie data={{
      labels: props.labels,
      datasets: [
        {
          data: props.data,
          backgroundColor: props.backgroundColor
        }
      ]
    }} ref={chartRef} onClick={onClick} />;
  }
    
    loopCategories (categories, colorTemplate, savings) {
      var { summary, loaded, labels, data, colors } = this.state;
      var i = 0
      var savingsTotal = 0 // only used when savings set
      Object.entries(categories).forEach(([name, item]) => {
        var subcats = Object.entries(item.subcategories)
        var subcatTotal = 0
        subcats.forEach(([name, total]) => {
          if (total > 0) {
            labels.push(name)
            data.push(total)
            colors.push(colorTemplate[i])
            subcatTotal += total
          }
        })
        var total = item.total - subcatTotal
        if (total > 0) {
          labels.push(name)
          data.push(total)
          colors.push(colorTemplate[i])

          savingsTotal += item.total
        }
        i = (i + 1) % colorTemplate.length
        // budget
        if (item.budget !== undefined) {
          var delta = item.budget - item.total
          if (delta > 0) {
            // gray
            labels.push(name + " Budget Left")
            data.push(delta)
            colors.push(ON_TARGET)
          } else {
            // pink
            labels.push(name + " Over Budget")
            data.push(-delta)
            colors.push(OVER_BUDGET)
          }
        }
      })

      if (savings) {
        var total = savings - savingsTotal
        labels.push('Savings')
        if (total > 0) {
          data.push(total)
          colors.push(colorTemplate[i])
        } else {
          data.push(total)
          colors.push(inTheRed)
        }
      }
      this.state = {
        labels : labels,
        data : data,
        colors : colors
      }
  }

  render() {
    this.state = { summary : this.props.summary , loaded : this.props.loaded};
    const summary = this.props.summary;
    if (this.state.loaded) {
        this.state.labels = []
        this.state.data = []
        this.state.colors = []
        this.loopCategories(summary.Needs.subcategories, greens, false)
        this.loopCategories(summary.Wants.subcategories, blues, false)
        this.loopCategories(summary.Savings.subcategories, purples, summary.Savings.total)
    }
    const { labels, data, colors} = this.state;
      
    return (
      <this.PieChartInner labels={labels} data={data} backgroundColor={colors}/>
    );
  }
}

export default SpendingChart;
