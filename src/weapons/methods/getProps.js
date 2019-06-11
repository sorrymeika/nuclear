import getValue from "../../methods/getValue";

const defaultConfig = { type: 'any', useExpression: true };

export default function getProps(context, propsConfig, weaponProps, otherProps) {

    return Object.keys(weaponProps)
        .map((name) => {
            const config = propsConfig[name] || defaultConfig;
            const valueExp = weaponProps[name];

            if (config.useExpression) {
                return getValue(context, valueExp, otherProps);
            } else {
                return context[valueExp];
            }
        });

}