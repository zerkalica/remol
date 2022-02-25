import { RemolContext } from '@remol/core';
import { RemolDemoFetch } from '../fetch/fetch';
export interface RemolDemoUserDTO {
    first_name: string;
}
export declare class RemolDemoUserStore {
    protected $: RemolContext;
    constructor($?: RemolContext);
    get fetcher(): typeof RemolDemoFetch;
    user(id: string, next?: RemolDemoUserDTO): RemolDemoUserDTO;
}
//# sourceMappingURL=store.d.ts.map