import { default as PromiseAny } from 'promise.any';

export {};

declare global {
  interface PromiseConstructor {
    any<T>(values: Iterable<T | PromiseLike<T>>): Promise<T>;
  }
}

Promise.any = PromiseAny;
