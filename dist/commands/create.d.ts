interface CreateOptions {
    template?: string;
    packageName?: string;
    typescript?: boolean;
    git?: boolean;
    packageManager?: string;
    skipInstall?: boolean;
}
export declare function createProject(projectName: string, options?: CreateOptions): Promise<void>;
export {};
