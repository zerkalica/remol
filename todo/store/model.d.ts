import { RemolActionQueue } from '@remol/core';
export declare type RemolDemoTodoDTO = {
    id: string;
    title: string;
    checked: boolean;
};
export declare class RemolDemoTodoModel extends Object {
    static instance: RemolDemoTodoModel;
    constructor(id?: string);
    title(next?: RemolDemoTodoDTO['title']): string;
    pipe(): RemolActionQueue;
    toggle(): void;
    toggle2(checked: boolean): void;
    checked(next?: RemolDemoTodoDTO['checked']): boolean;
    [Symbol.toStringTag]: string;
    id(next?: string): string | undefined;
    dto_pick<Field extends keyof RemolDemoTodoDTO>(field: Field, value?: RemolDemoTodoDTO[Field]): Partial<RemolDemoTodoDTO>[Field];
    dto(next?: Partial<RemolDemoTodoDTO> | null): Partial<RemolDemoTodoDTO>;
    get pending(): boolean;
    get error(): Error | undefined;
    status(next?: boolean | Error): boolean | Error;
    remove(): void;
    update(patch: Partial<RemolDemoTodoDTO> | null): void;
}
//# sourceMappingURL=model.d.ts.map