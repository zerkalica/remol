import { RemolContext } from '@remol/core';
export declare class RemolDemoLocation extends Object {
    protected $: RemolContext;
    constructor($?: RemolContext);
    static instance: RemolDemoLocation;
    protected get history(): History;
    protected get location(): Location;
    ns(): string;
    [Symbol.toStringTag]: string;
    protected params(): URLSearchParams;
    protected paramsToString(params: URLSearchParams): string;
    url(next?: Record<string, string>, hash?: string): string;
    protected pushState(params: URLSearchParams): void;
    value<V extends string>(key: string, next?: V | null): V | null;
}
//# sourceMappingURL=location.d.ts.map