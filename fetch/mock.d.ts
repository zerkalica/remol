import { RemolDemoFetch } from './fetch';
export declare class RemolDemoFetchMock extends RemolDemoFetch {
    static timeout(): number;
    static data(pathname: string, method: string, body: any): void;
    static fetch(url: string, init?: RequestInit): Promise<Response>;
}
//# sourceMappingURL=mock.d.ts.map