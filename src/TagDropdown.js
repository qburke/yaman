import React from 'react';
import { Dropdown, Form } from 'semantic-ui-react';

function TagDropdown() {
    return (
    <Dropdown
        //icon='tags'
        //iconPosition='left'
        placeholder='Tags'
        multiple selection
        options={[{ key: 'food', text: 'Food', value: 'food' }, { key: 'rent', text: 'Rent', value: 'rent' }]} />
    );
}

function TagDropdownForm() {
    return (
    <Form.Dropdown
        //icon='tags'
        //iconPosition='left'
        placeholder='Tags'
        multiple selection
        options={[{ key: 'food', text: 'Food', value: 'food' }, { key: 'rent', text: 'Rent', value: 'rent' }]} />
    );
}

TagDropdown.Form = TagDropdownForm;

export default TagDropdown;