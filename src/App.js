import logo from './logo.svg';
import './App.css';
import myData from './testdata.json';
import React from 'react';
import TxnList from './TxnList';
import TxnForm from './TxnForm';
import { useRef } from 'react';
import { Grid, List, Segment, Accordion } from 'semantic-ui-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, getElementAtEvent } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Layout(left, middle, right) {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          {left}
        </Grid.Column>
        <Grid.Column width={8}>
          {middle}
        </Grid.Column>
        <Grid.Column width={4}>
          {right}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

let greens = [
  '#3CB371', '#3EB489', '#009F6B', '#50C878', '#00A550', '#2E8B57', '#006241', '#009E60', '#009150',
  '#228B22', '#006A4E', '#71BC78', '#679267', '#4F7942', '#355E3B'
]

let blues = [
  '##0047AB', '#1560bd', '#6082B6', '#4682B4', '#0077c0', '#1F305E', '#004170', '#00538C', '#007791',
  '#00416A', '#72A0C1', '#367588', '#034694', '#0066b2', '#002244'
]

let purples = []

let inTheRed = '#D0342C'

class PieChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      data: [12, 19, 3, 5, 2, 3]
    };
    this.PieChartInner = this.PieChartInner.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:5000/summary")
    .then(res => res.json())
    .then(
      (result) => {
        var labels = []
        var data = []
        var colors = []
        let loopCategories = (categories, colorTemplate, savings) => {
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
          })

          if (savings) {
            var total = result.Savings.total - savingsTotal
            labels.push('Savings')
            if (total > 0) {
              data.push(total)
              colors.push(colorTemplate[i])
            } else {
              data.push(total)
              colors.push(inTheRed)
            }
          }
        }
        loopCategories(result.Needs.subcategories, greens, false)
        loopCategories(result.Wants.subcategories, blues, false)
        loopCategories(result.Savings.subcategories, blues, true) // TODO change to purple
        this.setState({
          isLoaded: true,
          labels: labels,
          data: data,
          backgroundColor: colors
        });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }

  PieChartInner() {
    const chartRef = useRef();
    const onClick = (event) => {
      var activePoints = getElementAtEvent(chartRef.current, event);
      if(activePoints[0]) {
        alert(this.state.labels[activePoints[0].index]);
      }
    }
    return <Pie data={{
      labels: this.state.labels,
      datasets: [
        {
          data: this.state.data,
          backgroundColor: this.state.backgroundColor
        }
      ]
    }} ref={chartRef} onClick={onClick} />;
  }

  render() {
    return (
      <this.PieChartInner/>
    );
  }
}

// requires lastFour and balance
// needs statement vs balance
function CardItem(props) {
  return (
    <List.Item>
      <List.Icon name='cc visa'/>
      <List.Content>
        <List.Header>{props.lastFour}</List.Header>
        <List.Description>
          Balance:   {props.balance}<br/>
          Statement: {props.statement}
        </List.Description>
      </List.Content>
    </List.Item>
  );
}

// requires cards
function BankAcc(props) {
  var cards = props.cards.map((card) =>
    <CardItem credit={card.credit} lastFour={card.lastFour} statement={card.statement} balance={card.total} />
  );
  return (
    <List.Item>
      <List.Icon name='folder'/>
      <List.Content>
        <List.Header>{props.accNum}</List.Header>
        <List.Description>{props.balance}</List.Description>
        <List.List>
          {cards}
        </List.List>
      </List.Content>
    </List.Item>
  );
}

class App extends React.Component {
  constructor(props) {
      super(props);
      var accounts = [
        {
          'bank' : 'Chase',
          'number' : 139620345789,
          'balance' : 25793,
          'cards' : [
            {
              'credit' : true,
              'lastFour' : 1848,
              'expiration' : '01/24',
              'statement' : 235.78,
              'total' : 1523.23
            }
          ]
        }
      ]
      var cards = []
      accounts.map((acc) => {
          acc.cards.map((card) => {
            cards.push({
              bank : acc.bank,
              lastFour : card.lastFour,
              expiration : card.expiration
            })
          })
        });
      this.state = {
        cards : cards,
        accounts : accounts
      }
  }

  componentDidMount() {
      fetch("http://localhost:5000/bank-info")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              txns: result.recentTxns
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: true
            });
          }
        )
    }

  render() {
    var accounts = this.state.accounts.map((acc) =>
      <BankAcc bank={acc.bank} accNum={acc.number} balance={acc.balance} cards={acc.cards}/>
    );
    return Layout(
      <TxnList txns={myData} style={{overflow: "auto", maxHeight: '100vh'}} />,
      <PieChart/>,
      <Segment basic style={{overflow: "auto", maxHeight: '100vh' }}>
        <List>
          {accounts}
        </List>
        <TxnForm cards={this.state.cards}/>
      </Segment>
    )
  }

}

export default App;
