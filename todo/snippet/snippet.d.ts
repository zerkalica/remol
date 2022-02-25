import * as React from 'react';
import { Remol } from '@remol/react';
import { RemolDemoTodoModel } from '../store/model';
export declare class RemolDemoTodoSnippet extends Remol<{
    id: string;
    todo: RemolDemoTodoModel;
}> {
    toggle(): void;
    remove(): void;
    draft(next?: RemolDemoTodoModel | null): RemolDemoTodoModel | null;
    beginEdit(): void;
    submit(): void;
    submitOrRestore({ key }: React.KeyboardEvent<HTMLInputElement>): void | RemolDemoTodoModel | null;
    setFocusRef(el?: HTMLInputElement | null): void;
    setTitle(e: React.ChangeEvent<HTMLInputElement>): void;
    Form({ id, todo }?: Readonly<{
        id: string;
        todo: RemolDemoTodoModel;
    }> & Readonly<{
        children?: React.ReactNode;
    }>, css?: {
        destroy: string;
        toggle: string;
        regular: string;
        editing: string;
        edit: string;
        viewLabelRegular: string;
        viewLabelCompleted: string;
        viewLabelDisabled: string;
    }, draft?: RemolDemoTodoModel | null): JSX.Element | null;
    View({ id, todo }?: Readonly<{
        id: string;
        todo: RemolDemoTodoModel;
    }> & Readonly<{
        children?: React.ReactNode;
    }>, css?: {
        destroy: string;
        toggle: string;
        regular: string;
        editing: string;
        edit: string;
        viewLabelRegular: string;
        viewLabelCompleted: string;
        viewLabelDisabled: string;
    }): JSX.Element;
    sub(): JSX.Element | null;
}
//# sourceMappingURL=snippet.d.ts.map