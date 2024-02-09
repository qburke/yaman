import React from 'react';
import TagDropdown from './TagDropdown';
import { Modal, Button, Header, Form, Divider } from 'semantic-ui-react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

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
            methods: ['Loading...'],
            tags: ['Loading...'],
            parentTags: ['Loading...'],
            editMode: props.txn ? true : false
        }
        if (props.txn) {
            this.state.amount = props.txn.amount;
            this.state.vendor = props.txn.vendor;
            this.state.method = props.txn.method;
            this.state.date = props.txn.date;
            this.state.memo = props.txn.memo;
            this.state.receipt = props.txn.receipt;
            this.state.tag = props.txn.tag;
        }
        //this.fetchTxns = props.fetchTxns
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
        fetch("http://localhost:5000/tag-tree")
        .then(res => res.json())
        .then(
          (result) => {
            var tagTree = []
            Object.entries(result).forEach(([parent, children]) => {
              tagTree.push({key: parent, text: parent, value: parent})
              tagTree.push(...children.map((tag) => {return { key: tag, text: "|-- " + tag, value: tag }}))
            })
            this.setState({
              tagTree: tagTree
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
        fetch("http://localhost:5000/methods")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              methods: result
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
                date : this.state.date.toISOString().substring(0, 10),
                memo : this.state.memo,
                receipt : this.state.receipt,
                tag : this.state.tag
            })
        })
        .then(
          (result) => {
            
            },
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
        const { amount, vendor, date, memo, method, tag, receipt, tags, newTag, parentTags, methods } = this.state
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
                name='vendor'
                size='large'
                value={vendor}
                onChange={this.handleChange}
                placeholder='Vendor'
                width={8}/>
                <DatePicker
                    showIcon
                    name='date'
                    selected={date}
                    onChange={(date) => this.setState({date : date})}
                />
            </Form.Group>
            <Form.Group>
                <TagDropdown.Form
                name='tag'
                width={4}
                onChange={this.handleChange}
                options={this.state.tagTree}//{tags.map((tag) => {return { key: tag, text: tag, value: tag }})}
                value={tag}
                />
            <Form.Dropdown
                onChange={this.handleChange}
                options={methods.map((m) => {return { key: m, text: m, value: m }})}
                placeholder='Method'
                selection
                name='method'
                width={4}
                value={method}/>
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
        trigger={props.txn ? props.children : <Button>New Transaction</Button>}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}>
        <Header icon='plus' content={props.txn ? 'Edit Transaction' : 'New Transaction'} />
        <Modal.Content>
            <TxnFormInner txn={props.txn} />
        </Modal.Content>
    </Modal>
    );
}

export default TxnForm;
