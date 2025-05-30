interface GenerateOptions {
    name?: string;
    path?: string;
    dryRun?: boolean;
}
export declare function generateCode(generator: string, options?: GenerateOptions): Promise<void>;
export {};
