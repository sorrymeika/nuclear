import getValue from "../../methods/getValue";

const defaultConfig = { type: 'any', useExpression: true };

export default function getProps(context, propsConfig, configuredProps, otherProps) {

    return Object.keys(configuredProps)
        .map((name) => {
            const config = propsConfig[name] || defaultConfig;
            const valueExp = configuredProps[name];

            if (config.useExpression) {
                return getValue(context, valueExp, otherProps);
            } else {
                return context[valueExp];
            }
        });

}