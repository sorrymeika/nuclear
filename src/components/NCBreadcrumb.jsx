import React from "react";
import { Breadcrumb, Icon } from "antd";

export function NCBreadcrumb(props) {
    return (
        <Breadcrumb style={{ marginBottom: 10 }}>
            <Breadcrumb.Item href="#/"><Icon type="home" /> 首页</Breadcrumb.Item>
            {
                props.items && props.items.map((item) => {
                    return (
                        typeof item === 'string'
                            ? <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
                            : <Breadcrumb.Item key={item.text} {...item.href ? { href: item.href } : {}}>
                                {item.icon ? <Icon type="home" /> : null}
                                {item.text}
                            </Breadcrumb.Item>
                    );
                })
            }
        </Breadcrumb>
    );
}

