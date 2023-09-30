import React from 'react';
import TxnForm from './TxnForm';
import { Label, List, Card, Image, Segment, Header, Modal } from 'semantic-ui-react';


class TxnList extends React.Component {

    constructor(props) {
        super(props);
        this.TxnItem = this.TxnItem.bind(this);
    }
    
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    TxnItem(props) {
        const txn = props.txn;
        return <Card fluid>
            <Card.Content>
            <Image floated='right' size='mini'>{this.months[txn.date.month]} {txn.date.day}</Image>
            <Card.Header>{txn.amount}</Card.Header>
            <Card.Meta>{txn.vendor}</Card.Meta>
            <Card.Description>
            <Label size="mini" >{txn.tag}</Label>
            </Card.Description>
            </Card.Content>
        </Card>
    }

    render() {
      const listItems = this.props.txns.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).map((txn) =>
      <TxnForm txn={txn}><List.Item><this.TxnItem txn={txn}/></List.Item></TxnForm>
      );
      return <Segment basic style={{overflow: 'auto', maxHeight: '90vh'}}><List>{listItems}</List></Segment>;
    }
}

export default TxnList;
