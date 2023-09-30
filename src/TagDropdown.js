import React from 'react';
import { Dropdown, Form } from 'semantic-ui-react';

function TagDropdown() {
    return (
    <Dropdown
        //icon='tags'
        //iconPosition='left'
        placeholder='Tags'
        selection
        options={[{ key: 'food', text: 'Food', value: 'food' }, { key: 'rent', text: 'Rent', value: 'rent' }]} />
    );
}

function TagDropdownForm(props) {
    return (
    <Form.Dropdown
        //icon='tags'
        //iconPosition='left'
        placeholder='Tag'
        selection
        search
        options={props.options}
        width={props.width}
        name={props.name}
        value={props.value}
        onChange={props.onChange}/>
    );
}

TagDropdown.Form = TagDropdownForm;

export default TagDropdown;
