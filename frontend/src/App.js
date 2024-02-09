import logo from './logo.svg';
import './App.css';
import myData from './testdata.json';
import React from 'react';
import TxnList from './TxnList';
import TxnForm from './TxnForm';
import SearchArea from './SearchArea';
import SpendingChart from './SpendingChart';
import Accounts from './Accounts';
import { useRef } from 'react';
import { Input, Grid, List, Segment, Divider } from 'semantic-ui-react';

function Layout(top, left, middle, right) {
  return (
    <Grid>
      <Grid.Row>
        {top}
      </Grid.Row>
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


class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        txns : [],
        startMonth: 0, startYear: 0, endMonth: 0, endYear: 0,
        accounts : [],
        summary : {},
        summaryLoaded : false
      }
  }

  fetchTxns () {
    fetch("http://localhost:5000/list-transactions?" + new URLSearchParams({
          startMonth: this.state.startMonth,
          startYear: this.state.startYear,
          endMonth: this.state.endMonth,
          endYear: this.state.endYear
        }))
        .then(res => res.json())
        .then(
          (result) => {
              this.setState({ txns : result })
          },
          (error) => {
            this.setState({ txns : [] })
          }
        )
  }

  fetchSummary() {
    fetch("http://localhost:5000/summary?" + new URLSearchParams({
      startMonth: this.state.startMonth,
      startYear: this.state.startYear,
      endMonth: this.state.endMonth,
      endYear: this.state.endYear
    }))
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
            summary : result,
            summaryLoaded : true
        });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        this.setState({
          summaryLoaded: false,
          error
        });
      }
    )
  }

  fetchAccounts() {
    fetch("http://localhost:5000/accounts")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({accounts : result}); 
          },
          (error) => {
          }
        )
  } 

  updateDateRange(startMonth, startYear, endMonth, endYear) {
    if ((endMonth === 0 || endYear === 0) || (endYear === startYear && endMonth === startMonth)) {
      // one month
        this.setState({
            startMonth: startMonth,
            startYear: startYear,
            endMonth: null,
            endYear: null
        }, () => {
          this.fetchTxns()
          this.fetchSummary()
        })
    }
    else if ((endYear > startYear) || (endYear===startYear && endMonth > startMonth)) {
        this.setState({
            startMonth: startMonth,
            startYear: startYear,
            endMonth: endMonth,
            endYear: endYear
        }, () => {
          this.fetchTxns()
          this.fetchSummary()
        })
    } else {
      return
    }
  }

  componentDidMount() {
    this.fetchTxns()
    this.fetchSummary()
    this.fetchAccounts()
  }

  render() {
    return Layout(
      <SearchArea updateDateRange={this.updateDateRange.bind(this)} />,
      <TxnList txns={this.state.txns}/>,
      <SpendingChart summary={this.state.summary} loaded={this.state.summaryLoaded}/>,
      <Segment basic>
   	    <Accounts accounts={this.state.accounts} />
        <Input transparent label='Income' value={1}/>
        <TxnForm cards={this.state.cards} />
      </Segment>
    )
  }

}

export default App;
