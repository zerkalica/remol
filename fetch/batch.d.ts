export declare type RemoDemoFetchBatchResponse<V> = {
    data: Record<string, V>;
    errors?: Record<string, RemoDemoFetchBatchErrorDTO>;
};
export declare type RemoDemoFetchBatchErrorDTO = {
    code: string;
    message?: string;
};
export declare class RemoDemoFetchBatchError extends Error {
    readonly cause: RemoDemoFetchBatchErrorDTO | undefined;
    constructor(p: {
        id: string;
        input: RequestInfo;
        cause: RemoDemoFetchBatchErrorDTO;
    });
    get code(): string | undefined;
}
export declare class RemoDemoFetchBatch extends Object {
    protected input: RequestInfo;
    protected errors: Record<string, RemoDemoFetchBatchErrorDTO>;
    constructor(input: RequestInfo, errors: Record<string, RemoDemoFetchBatchErrorDTO>);
    static response<V>(input: RequestInfo, res: RemoDemoFetchBatchResponse<V>): Record<string, V>;
    get(data: Record<string, unknown>, id: string): unknown;
}
//# sourceMappingURL=batch.d.ts.map