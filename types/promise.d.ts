export {};
declare global {
    interface PromiseConstructor {
        any<T>(values: Iterable<T | PromiseLike<T>>): Promise<T>;
    }
}
