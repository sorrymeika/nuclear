import { inject } from "snowball/app";

const withService = (serviceName, componentClass) => inject({ [serviceName]: 'service' })(componentClass);

export default withService;