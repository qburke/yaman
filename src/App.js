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

class PieChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      data: [12, 19, 3, 5, 2, 3]
    };
    this.PieChartInner = this.PieChartInner.bind(this);
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
          data: this.state.data
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
      this.state = {
        accounts : [
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
      }
      var cards = this.state.accounts.map((acc) =>
        {
          acc.cards.map((card) => {
            return {
              bank : acc.bank,
              lastFour : card.lastFour,
              expiration : card.expiration
            }
          })
        }
      );
      this.setState({
        cards : cards
      })
  }

  componentDidMount() {
      fetch("http://localhost:5000/bank-info")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              txns: result
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

  render() {
    var accounts = this.state.accounts.map((acc) =>
      <BankAcc bank={acc.bank} accNum={acc.number} balance={acc.balance} cards={acc.cards}/>
    );
    console.log(this.state.cards);
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
