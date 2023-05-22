import React from 'react';
import { Label, List, Card, Image, Segment } from 'semantic-ui-react';

class TxnList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        txns : props.txns
        }
        this.TxnItem = this.TxnItem.bind(this);
    }

    componentDidMount() {
        fetch("http://localhost:5000/list-transactions")
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
    
    // TODO
    updateList(tagsList, dateRange) {

    }

    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    Tags(props) {
        return props.tags.map((tag) =>
        <Label size="mini" >{tag}</Label>
        );
    }

    TxnItem(props) {
        const txn = props.txn;
        return <Card fluid>
            <Card.Content>
            <Image floated='right' size='mini'>{this.months[txn.date.month]} {txn.date.day}</Image>
            <Card.Header>{txn.amount}</Card.Header>
            <Card.Meta>{txn.seller}</Card.Meta>
            <Card.Description>
                <this.Tags tags={txn.tags}/>
            </Card.Description>
            </Card.Content>
        </Card>
    }

    render() {
        const listItems = this.state.txns.map((txn) =>
        <List.Item><this.TxnItem txn={txn}/></List.Item>
        );
        return <Segment basic><List>{listItems}</List></Segment>;
    }
}

export default TxnList;