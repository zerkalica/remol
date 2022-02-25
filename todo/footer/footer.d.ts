import * as React from 'react';
import { RemolActionQueue } from '@remol/core';
import { Remol } from '@remol/react';
import { RemolDemoLocation } from '../../location/location';
import { RemolDemoTodoStore, TODO_FILTER } from '../store/store';
export declare class RemolDemoTodoFooter extends Remol<{
    id: string;
}> {
    static links: {
        id: TODO_FILTER;
        title: string;
    }[];
    css: {
        footer: string;
        clearCompleted: string;
        todoCount: string;
        filters: string;
        filterItem: string;
        linkRegular: string;
        linkSelected: string;
    };
    linkCss(isSelected: boolean): string;
    get store(): RemolDemoTodoStore;
    get location(): RemolDemoLocation;
    filterLink(id: TODO_FILTER): string;
    clickLink(e: React.MouseEvent<HTMLAnchorElement>): void;
    clearCompletedStatus(): RemolActionQueue;
    clearCompleted(e: React.MouseEvent): void;
    sub({ id }?: Readonly<{
        id: string;
    }> & Readonly<{
        children?: React.ReactNode;
    }>, store?: RemolDemoTodoStore): JSX.Element | null;
}
//# sourceMappingURL=footer.d.ts.map