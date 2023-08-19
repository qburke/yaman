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
        placeholder='Tags'
        selection
        options={props.options}
        width={props.width}
        name={props.name}
        onChange={props.onChange}/>
    );
}

TagDropdown.Form = TagDropdownForm;

export default TagDropdown;