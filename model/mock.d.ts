export declare abstract class RemolDemoStoreMock<DTO extends {
    id: string;
}> extends Object {
    protected cache: Record<string, DTO> | undefined;
    max(): number;
    get items(): Record<string, DTO>;
    abstract create(id: string): DTO;
    list(filter?: unknown): {
        data: {
            ids: string[];
        };
    };
    get(ids: readonly string[]): {
        data: Record<string, DTO>;
    };
    patch(obj: Record<string, DTO | null>): {
        data: Record<string, DTO | null>;
    };
}
//# sourceMappingURL=mock.d.ts.map