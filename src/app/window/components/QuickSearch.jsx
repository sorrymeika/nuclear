import React, { useState } from "react";
import ReactDOM from 'react-dom';
import { AutoComplete } from 'antd';
import { inject } from "snowball/app";
import { $ } from "snowball/utils";

export function QuickSearch({ visible, dataSource, onBlur, onSelect }) {
    const [value, setValue] = useState();

    return visible
        ? (
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
        )
        : null;
}

export const FileQuickSearch = inject(({ fileQuickSearchSearvice }) => ({
    visible: fileQuickSearchSearvice.visible,
    dataSource: fileQuickSearchSearvice.dataSource,
    onBlur: fileQuickSearchSearvice.onBlur,
    onSelect: fileQuickSearchSearvice.onSelect,
}))(QuickSearch);