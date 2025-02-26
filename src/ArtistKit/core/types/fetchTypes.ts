export enum Status {
    OK,
    FAILED,
    PENDING
};

export interface FetchResult<T> {
    items: T[];
    total: number;
    status: Status;
}