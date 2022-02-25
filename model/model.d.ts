import { RemolContext } from '@remol/core';
import { RemolDemoFetch } from '../fetch/fetch';
export declare abstract class RemolModel<DTO extends Object = Object> extends Object {
    protected $: RemolContext;
    constructor($?: RemolContext);
    static createId(): string;
    get fetcher(): typeof RemolDemoFetch;
    id(next?: string): string;
    dto_pick<Field extends keyof DTO>(field: Field, next?: DTO[Field]): DTO[Field];
    dto(next?: Partial<DTO> | null): DTO;
    get pending(): boolean;
    get error(): Error | undefined;
    patching(next?: unknown): unknown;
    remove(): void;
}
//# sourceMappingURL=model.d.ts.map