import React from 'react';
import { Label, List, Card, Image, Segment, Header, Modal } from 'semantic-ui-react';


class Accounts extends React.Component {

    constructor(props) {
        super(props);
        this.state = { accounts : props.accounts};
        // cards
        // accounts
        // cash
    }

    // Change to a list item instead
    Account(props) {
        const account = props.account;
        return <Card fluid>
            <Card.Content>
            <Card.Header>{account.name}</Card.Header>
            <Card.Meta>{account.bank}</Card.Meta>
            <Card.Description>
            <Header size="mini" >Balance: {account.balance}</Header>
            </Card.Description>
            </Card.Content>
        </Card>
    }

    render() {
      const listItems = this.props.accounts.map((account) =>
        <List.Item><this.Account account={account}/></List.Item>
      );
      return <Segment basic style={{overflow: 'auto', maxHeight: '90vh'}}><List>{listItems}</List></Segment>;
    }
}

export default Accounts;
