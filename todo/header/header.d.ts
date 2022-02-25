import React from 'react';
import { RemolActionQueue } from '@remol/core';
import { Remol } from '@remol/react';
import { RemolDemoTodoStore } from '../store/store';
export declare class RemolDemoTodoHeader extends Remol<{
    id: string;
}> {
    get store(): RemolDemoTodoStore;
    title(next?: string): string;
    setTitle(e: React.ChangeEvent<HTMLInputElement>): void;
    setRef(ref?: HTMLInputElement | null): void;
    submitStatus(): RemolActionQueue;
    submit(e: React.KeyboardEvent<HTMLInputElement>): void;
    toggleAllStatus(): RemolActionQueue;
    toggleAll(): (e: React.ChangeEvent<HTMLInputElement>) => void;
    sub({ id }?: Readonly<{
        id: string;
    }> & Readonly<{
        children?: React.ReactNode;
    }>): JSX.Element;
}
//# sourceMappingURL=header.d.ts.map