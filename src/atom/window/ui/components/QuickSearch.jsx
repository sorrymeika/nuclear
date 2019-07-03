import React, { useState } from "react";
import ReactDOM from 'react-dom';
import { AutoComplete } from 'antd';
import { $ } from "snowball/utils";

export default function QuickSearch({ dataSource, onBlur, onSelect }) {
    const [value, setValue] = useState();

    return (
        <AutoComplete className="nc-window-quick-search"
            dataSource={dataSource}
            onChange={setValue}
            onBlur={onBlur}
            onSelect={onSelect}
            value={value}
            defaultActiveFirstOption={true}
            filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            ref={(ref) => {
                if (ref) {
                    ReactDOM.findDOMNode(ref)
                        .querySelector('input')
                        .focus();
                    $(ReactDOM.findDOMNode(ref)).trigger('click');
                }
            }}
        />
    );
}
