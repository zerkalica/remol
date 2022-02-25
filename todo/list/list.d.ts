import React from 'react';
import { Remol } from '@remol/react';
import { RemolDemoTodoStore } from '../store/store';
export declare class RemolDemoTodoList extends Remol<{
    id: string;
}> {
    sub({ id }?: Readonly<{
        id: string;
    }> & Readonly<{
        children?: React.ReactNode;
    }>, store?: RemolDemoTodoStore): JSX.Element;
}
//# sourceMappingURL=list.d.ts.map