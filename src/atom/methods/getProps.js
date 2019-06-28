import getValue from "./getValue";

const defaultConfig = { type: 'any', useExpression: true };

export default function getProps(context, propsConfig, props, otherProps) {

    return Object.keys(props)
        .map((name) => {
            const config = propsConfig[name] || defaultConfig;
            const valueExp = props[name];

            if (config.useExpression) {
                return getValue(context, valueExp, otherProps);
            } else {
                return context[valueExp];
            }
        });

}