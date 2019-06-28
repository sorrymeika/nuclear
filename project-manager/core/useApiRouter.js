import { handleRequest } from "./Controller";

export const useApiRouter = (apiName, request, response) => {
    const [controllerName, methodName] = apiName.split('.');
    return handleRequest(controllerName, methodName, request, response);
};