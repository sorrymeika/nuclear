import { useApiRouter } from "./core";
import "./api";

export const useProjectManager = (app) => {
    app.use('/api/:apiName', (request, response) => {
        const apiName = request.params.apiName;
        return useApiRouter(apiName, request, response);
    });
};