interface DoctorOptions {
    fix?: boolean;
    verbose?: boolean;
}
export declare function doctorCheck(options?: DoctorOptions): Promise<void>;
export {};
