interface PackageInfo {
    name: string;
    version: string;
    description: string;
}
export declare function packageInfo(): PackageInfo;
export declare function getProjectPackageInfo(projectPath?: string): PackageInfo | null;
export {};
