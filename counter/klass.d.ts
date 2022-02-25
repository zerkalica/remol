import React from 'react';
import { Remol } from '@remol/react';
export declare class RemolDemoCounterKlass extends Remol<{
    id: string;
}> {
    value(next?: number): number;
    computed(): string;
    add(): void;
    sub(p?: Readonly<{
        id: string;
    }> & Readonly<{
        children?: React.ReactNode;
    }>): JSX.Element;
}
//# sourceMappingURL=klass.d.ts.map