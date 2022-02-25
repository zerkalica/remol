import React from 'react';
import { Remol } from '@remol/react';
export declare class RemolDemoList extends Remol<{
    id: string;
}> {
    value(id: number, next?: number): number;
    sub(p?: Readonly<{
        id: string;
    }> & Readonly<{
        children?: React.ReactNode;
    }>): JSX.Element;
}
//# sourceMappingURL=list.d.ts.map