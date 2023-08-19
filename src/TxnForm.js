import React from 'react';
import TagDropdown from './TagDropdown';
import { Modal, Button, Header, Form, Divider } from 'semantic-ui-react';

/* keep open after submit, second modal with success/failure
amount seller date
tags card/method --autofill--> bank account
memo
receipt
*/

// summary: tags, method

// props: add, edit, remove, none
class TxnFormInner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        amount: '', vendor: '', method: '', date: '', memo: '', receipt: '', tag: '', newTag: '', newTagParent: '',
        cardOptions: props.cards.map((card) => {
            return {
              key : card.lastFour,
              text: card.lastFour,
              value: card
            }
          }),
        tags: ['Loading...'],
        parentTags: ['Loading...']
        }
    }

    fetchTags = () => {
        fetch("http://localhost:5000/tags")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              tags: result
            });
          },
          (error) => {
            this.setState({
              error
            });
          }
        )
        fetch("http://localhost:5000/parent-tags")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              parentTags: result
            });
          },
          (error) => {
            this.setState({
              error
            });
          }
        )
    }

    componentDidMount() {
        this.fetchTags()
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value }) 
        // if date and two slashes tehn 
        // highlight on errors
    }

    handleSubmit = () => {
        fetch("http://localhost:5000/new-txn", {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify({
                amount : this.state.amount,
                vendor : this.state.vendor,
                method : this.state.method,
                date : this.state.date,
                memo : this.state.memo,
                receipt : this.state.receipt,
                tag : this.state.tag
            })
        })
        .then(
          (result) => {
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
          }
        )
    }

    handleNewTag = () => {
        fetch("http://localhost:5000/new-tag", {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify({
                parent: this.state.newTagParent,
                newtag: this.state.newTag
            })
        })
        .then(
          (result) => {
            this.fetchTags()
          },
          (error) => {
          }
        )
    }

    render() {
        const { amount, vendor, date, memo, receipt, tags, newTag, newTagParent, parentTags } = this.state
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
                placeholder='MM/dd/YY'
                width={4}/>
            </Form.Group>
            <Form.Group>
                <TagDropdown.Form
                name='tag'
                width={4}
                onChange={this.handleChange}
                options={tags.map((tag) => {return { key: tag, text: tag, value: tag }})}
                />
                <Form.Dropdown
                onChange={this.handleChange}
                options={this.state.cardOptions}
                placeholder='Method'
                selection
                name='method'
                width={4}/>
                <Form.Input
                icon=''
                iconPosition='left'
                type='text'
                name='memo'
                value={memo}
                onChange={this.handleChange}
                placeholder='Memo'
                width={8}/>
            </Form.Group>
            <Form.Group>
            <Form.Input
                icon=''
                iconPosition='left'
                type='text'
                name='receipt'
                value={receipt}
                onChange={this.handleChange}
                placeholder='Receipt'/>
            </Form.Group>
            <Form.Group>
                <Form.Button content='Submit' />
            </Form.Group>
            </Form>
            <Divider />
            <Form onSubmit={this.handleNewTag}>
            <Form.Group>
                <Form.Input
                    icon=''
                    iconPosition='left'
                    type='text'
                    name='newTag'
                    value={newTag}
                    onChange={this.handleChange}
                    placeholder='New Tag'
                    width={4}
                    />
                <TagDropdown.Form
                    name='newTagParent'
                    width={4}
                    onChange={this.handleChange}
                    options={parentTags.map((tag) => {return { key: tag, text: tag, value: tag }})}
                    />
                <Form.Button content='Create' />
            </Form.Group>
            </Form>
        </div>
        )
    }
}

function TxnForm (props) {
    const [open, setOpen] = React.useState(false);
    return (
        <Modal
        closeIcon
        open={open}
        trigger={<Button>Show Modal</Button>}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}>
        <Header icon='plus' content='New Transaction' />
        <Modal.Content>
            <TxnFormInner cards={props.cards}/>
        </Modal.Content>
    </Modal>
    );
}

export default TxnForm;