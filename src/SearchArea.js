import React from 'react';
import { Dropdown, Form } from 'semantic-ui-react';

class SearchArea extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startMonth: 0, endMonth: 0, startYear: 0, endYear: 0
        }
        this.updateDateRange = props.updateDateRange
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value }) 
        // if date and two slashes tehn 
        // highlight on errors
    }

    handleFilter = () => {
        this.updateDateRange(this.state.startMonth, this.state.startYear, this.state.endMonth, this.state.endYear)
    }

    render() {
        return (
        <Form onSubmit={this.handleFilter}>
        <Form.Group>
            <MonthDropdownForm
                placeholder='Start Month'
                name='startMonth'
                onChange={this.handleChange} />
            <YearDropdownForm
                placeholder='Start Year'
                name='startYear'
                onChange={this.handleChange} />
            <MonthDropdownForm
                placeholder='End Month'
                name='endMonth'
                onChange={this.handleChange} />
            <YearDropdownForm
                placeholder='End Year'
                name='endYear'
                onChange={this.handleChange} />
            <Form.Button content='Filter' />
        </Form.Group>
        </Form>
        )
    }
}

function MonthDropdownForm(props) {
    return (
    <Form.Dropdown
        placeholder={props.placeholder}
        selection
        options={[
            { key: 0, text: 'FIXME', value: 0 },
            { key: 1, text: 'Jan', value: 1 },
            { key: 2, text: 'Feb', value: 2 },
            { key: 3, text: 'Mar', value: 3 },
            { key: 4, text: 'Apr', value: 4 },
            { key: 5, text: 'May', value: 5 },
            { key: 6, text: 'Jun', value: 6 },
            { key: 7, text: 'Jul', value: 7 },
            { key: 8, text: 'Aug', value: 8 },
            { key: 9, text: 'Sep', value: 9 },
            { key: 10, text: 'Oct', value: 10 },
            { key: 11, text: 'Nov', value: 11 },
            { key: 12, text: 'Dec', value: 12 },
        ]}
        width={props.width}
        name={props.name}
        onChange={props.onChange}/>
    );
}

function YearDropdownForm(props) {
    return (
    <Form.Dropdown
        placeholder={props.placeholder}
        selection
        options={[
            { key: 0, text: 'FIXME', value: 0 },
            { key: 2023, text: '2023', value: 2023 }
        ]}
        width={props.width}
        name={props.name}
        onChange={props.onChange}/>
    );
}

export default SearchArea;