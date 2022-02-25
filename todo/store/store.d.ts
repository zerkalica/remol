import { RemolContextObject } from '@remol/core';
import { RemolDemoFetch } from '../../fetch/fetch';
import { RemolDemoLocation } from '../../location/location';
import { RemolDemoTodoDTO, RemolDemoTodoModel } from './model';
import type { RemolDemoTodoStoreMock } from './mock';
export declare enum TODO_FILTER {
    ALL = "all",
    COMPLETE = "complete",
    ACTIVE = "active"
}
export declare class RemolDemoTodoStore extends RemolContextObject {
    static instance: RemolDemoTodoStore;
    get fetcher(): typeof RemolDemoFetch;
    reset(next?: null): number;
    list_last(next?: ReturnType<RemolDemoTodoStoreMock['list']>): {
        data: {
            ids: string[];
            activeCount: number;
            completedCount: number;
        };
    } | undefined;
    list_real(): {
        data: {
            ids: string[];
            activeCount: number;
            completedCount: number;
        };
    };
    list(): {
        data: {
            ids: string[];
            activeCount: number;
            completedCount: number;
        };
    };
    ids(): string[];
    prefetched(): Record<string, RemolDemoTodoDTO | undefined>;
    dto(id: string, next?: Partial<RemolDemoTodoDTO> | null): {};
    item(id: string): RemolDemoTodoModel;
    items(): RemolDemoTodoModel[];
    fetch(url: string, init: RequestInit): {
        data: {
            ids: string[];
        };
    };
    get location(): RemolDemoLocation;
    get activeTodoCount2(): number;
    activeTodoCount(): number;
    get completedCount(): number;
    filter(next?: TODO_FILTER): TODO_FILTER;
    get filteredTodos(): RemolDemoTodoModel[];
    toggleAll(): void;
    completeAll(): void;
    clearCompleted(): void;
}
//# sourceMappingURL=store.d.ts.map