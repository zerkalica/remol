import { RemolDemoStoreMock } from '../../model/mock';
import type { RemolDemoTodoDTO } from './model';
export declare class RemolDemoTodoStoreMock extends RemolDemoStoreMock<RemolDemoTodoDTO> {
    max(): number;
    create(id: string): {
        id: string;
        title: string;
        checked: boolean;
    };
    data(pathname: string, method: string, body: any): {
        data: Record<string, RemolDemoTodoDTO | null>;
    } | {
        data: {
            ids: string[];
        };
    } | undefined;
    list(filter?: unknown): {
        data: {
            ids: string[];
            activeCount: number;
            completedCount: number;
        };
    };
    toggleAll(): {
        data: {
            ids: string[];
        };
    };
    completeAll(): {
        data: {
            ids: string[];
        };
    };
    clearCompleted(): {
        data: {
            ids: string[];
        };
    };
}
//# sourceMappingURL=mock.d.ts.map