export interface Pagination {
    total_count: number;
    count: number;
    offset: number;
}

export interface MappedPagination {
    current: number;
    last: number;
}
