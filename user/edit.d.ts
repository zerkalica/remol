import React from 'react';
import { Remol } from '@remol/react';
import { RemolDemoUserStore } from './store';
export declare class RemolDemoUserEdit extends Remol<{
    id: string;
}> {
    users(): RemolDemoUserStore;
    userSelectedId(next?: number): number;
    userSelected(): import("./store").RemolDemoUserDTO;
    userNext(): void;
    userSave(): void;
    userEditableName(next?: string): string;
    errorCount: number;
    sub(p?: Readonly<{
        id: string;
    }> & Readonly<{
        children?: React.ReactNode;
    }>): JSX.Element;
}
//# sourceMappingURL=edit.d.ts.map