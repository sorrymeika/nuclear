export interface IQuickSearchService {
    visible: boolean;
    dataSource: string;
    onBlur: () => any;
    onSelect: () => any;
}