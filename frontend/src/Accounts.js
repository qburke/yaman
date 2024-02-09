import React from 'react';
import { Label, List, Image, Segment, Header, Modal } from 'semantic-ui-react';


class Accounts extends React.Component {

    constructor(props) {
        super(props);
        this.state = { accounts : props.accounts};
        // cards
        // accounts
        // cash
    }

    // Cards
    // Name ->Last Four
    // Statement
    // Balance
    Account(props) {
        const account = props.account;
        return <List fluid>
            { 'lastFour' in account ?
            <List.Content floated='right'>
                <List.Header>{account.lastFour}</List.Header>
            </List.Content>
            : null}
            <List.Content>
            <List.Header>{account.name}</List.Header>
            <List.Description>
                <p style={{margin:0}}>Balance: {account.balance}</p>
                {'statement' in account ? <p>Statement: {account.statement}</p> : null}
            </List.Description>
            </List.Content>
        </List>
    }

    render() {
      const listItems = this.props.accounts.map((account) =>
        <List.Item><this.Account account={account}/></List.Item>
      );
      return <Segment basic style={{overflow: 'auto', maxHeight: '90vh'}}><List>{listItems}</List></Segment>;
    }
}

export default Accounts;
