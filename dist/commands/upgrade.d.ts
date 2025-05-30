interface UpgradeOptions {
    version?: string;
    checkOnly?: boolean;
    force?: boolean;
}
export declare function upgradeProject(options?: UpgradeOptions): Promise<void>;
export {};
