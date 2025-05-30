interface AddOptions {
    name?: string;
    directory?: string;
    withTest?: boolean;
    withStory?: boolean;
}
export declare function addComponent(type: string, options?: AddOptions): Promise<void>;
export {};
