interface SetupOptions {
    name?: string;
    package?: string;
    interactive?: boolean;
}
export declare function setupProject(options?: SetupOptions): Promise<void>;
export {};
