export declare class RemolDemoFetch {
    static fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
    static request(input: RequestInfo, init?: RequestInit): Promise<Response> & {
        destructor(): void;
    };
    static response(input: RequestInfo, init?: RequestInit): {
        readonly headers: Headers;
        readonly ok: boolean;
        readonly redirected: boolean;
        readonly status: number;
        readonly statusText: string;
        readonly type: ResponseType;
        readonly url: string;
        clone: () => Response;
        readonly body: ReadableStream<Uint8Array> | null;
        readonly bodyUsed: boolean;
        arrayBuffer: () => ArrayBuffer;
        blob: () => Blob;
        formData: () => FormData;
        json: () => any;
        text: () => string;
    };
    static batch<V>(input: RequestInfo, init?: RequestInit): Record<string, V | undefined>;
}
//# sourceMappingURL=fetch.d.ts.map