import React from 'react';
import { Remol } from '@remol/react';
import { RemolDemoTodoStore } from '../store/store';
export declare class RemolDemoTodoPage extends Remol<{
    id: string;
}> {
    store(): RemolDemoTodoStore;
    get $(): import("@remol/core").RemolContext;
    sub({ id }?: Readonly<{
        id: string;
    }> & Readonly<{
        children?: React.ReactNode;
    }>): JSX.Element;
}
//# sourceMappingURL=page.d.ts.map