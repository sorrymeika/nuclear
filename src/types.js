export interface INCFormViewModel {
    resetValidator(): void;
    submit(): void;
    data: { [name]: any };
    onSubmit: Function
}

export type IApiResult = Promise<{ total: number, data: any[] }>;

export type IRequester = {
    load(params: any): IApiResult
};

export interface INCTableViewModel {
    onEditItem: Function;
    onDeleteItem: Function;
    on: Function;
    setRequester(requester: IRequester): void;
    search(params: { [name]: any }, pageIndex): IApiResult;
    total: number;
    pageIndex: number;
    pageSize: number;
    load(): IApiResult
}