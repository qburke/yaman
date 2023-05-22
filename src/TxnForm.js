import React from 'react';
import TagDropdown from './TagDropdown';
import { Modal, Button, Header, Form } from 'semantic-ui-react';

/* keep open after submit, second modal with success/failure
amount seller date
tags card/method --autofill--> bank account
memo
receipt
*/

// props: add, edit, remove, none
class TxnFormInner extends React.Component {

    constructor(props) {
        super(props);
        console.log(props.cards);
        this.state = {
        name: '', email: '', amount: '', vendor: '', method: '', date: '', memo: '', receipt: '', bank: '', account: '', submittedName: '', submittedEmail: '',
        cardOptions: props.cards.map((card) => {
            return {
              key : card.lastFour,
              text: card.lastFour,
              value: card
            }
          })
        }
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleMethod = (e, {name, value }) => {
        this.bank = value.bank;
        this.account = value.account;
        this.handleChange(e, { name, value });
    }

    handleSubmit = () => {
        const { name, email } = this.state

        this.setState({ submittedName: name, submittedEmail: email })
    }

    render() {
        const { name, email, amount, vendor, method, date, memo, receipt, bank, account, submittedName, submittedEmail } = this.state

        return (
        <div>
            <Form onSubmit={this.handleSubmit}>
            <Form.Group>
                <Form.Input
                icon='dollar sign'
                iconPosition='left'
                type='text'
                name='amount'
                size='large'
                value={amount}
                onChange={this.handleChange}
                placeholder='Amount'
                width={4}/>
                <Form.Input
                icon=''
                iconPosition='left'
                type='text'
                name='vendor'
                size='large'
                value={vendor}
                onChange={this.handleChange}
                placeholder='Vendor'
                width={8}/>
                <Form.Input
                icon=''
                iconPosition='left'
                type='text'
                name='date'
                size='large'
                value={date}
                onChange={this.handleChange}
                placeholder='Date'
                width={4}/>
            </Form.Group>
            <Form.Group>
                <TagDropdown.Form/>
                <Form.Dropdown
                onChange={this.handleMethod}
                options={this.state.cardOptions}
                placeholder='Method'
                selection
                value={method}/>
                <Form.Input
                placeholder='Bank'
                value={bank}
                readOnly />
                <Form.Input
                placeholder='Account'
                value={account}
                readOnly />
            </Form.Group>
            <Form.Group>
            <Form.Input
                icon=''
                iconPosition='left'
                type='text'
                name='memo'
                value={memo}
                onChange={this.handleChange}
                placeholder='Memo'/>
            <Form.Input
                icon=''
                iconPosition='left'
                type='text'
                name='recipt'
                value={receipt}
                onChange={this.handleChange}
                placeholder='Receipt'/>
            </Form.Group>
            <Form.Group>
                <Form.Button content='Submit' />
            </Form.Group>
            <Form.Group>
                <Form.Input
                placeholder='Name'
                name='name'
                value={name}
                onChange={this.handleChange}
                />
                <Form.Input
                placeholder='Email'
                name='email'
                value={email}
                onChange={this.handleChange}
                />
            </Form.Group>
            </Form>
            <strong>onChange:</strong>
            <pre>{JSON.stringify({ name, email, amount }, null, 3)}</pre>
            <strong>onSubmit:</strong>
            <pre>{JSON.stringify({ submittedName, submittedEmail }, null, 2)}</pre>
        </div>
        )
    }
}

function TxnForm () {
    const [open, setOpen] = React.useState(false);
    return (
        <Modal
        closeIcon
        open={open}
        trigger={<Button>Show Modal</Button>}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}>
        <Header icon='archive' content='Archive Old Messages' />
        <Modal.Content>
            <TxnFormInner/>
        </Modal.Content>
    </Modal>
    );
}

export default TxnForm;