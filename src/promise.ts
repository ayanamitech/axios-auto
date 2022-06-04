/*
 * Created by Trevor Sears <trevor@trevorsears.com> (https://trevorsears.com/).
 * 10:37 PM -- October 28th, 2019.
 * Project: promise-any-polyfill
 *
 * promise-any-polyfill - A polyfill for the proposed/upcoming `Promise.any` functionality.
 * Copyright (C) 2021 Trevor Sears
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
export {};

declare global {
  interface PromiseConstructor {
    any<T>(values: Iterable<T | PromiseLike<T>>): Promise<T>;
  }
}

Promise.any = <T>(values: Iterable<T | PromiseLike<T>>): Promise<T> => {
  return new Promise<T>((resolve: (value: T) => void, reject: (reason?: any) => void): void => {
    let hasResolved = false;
    const promiseLikes: Array<T | PromiseLike<T>> = [];
    let iterableCount = 0;
    const rejectionReasons: any[] = [];

    function resolveOnce(value: T): void {
      if (!hasResolved) {
        hasResolved = true;
        resolve(value);
      }
    }

    function rejectionCheck(reason?: any): void {
      rejectionReasons.push(reason);
      if (rejectionReasons.length >= iterableCount) reject(rejectionReasons);
    }

    for (const value of values) {
      iterableCount++;
      promiseLikes.push(value);
    }

    for (const promiseLike of promiseLikes) {
      if ((promiseLike as PromiseLike<T>)?.then !== undefined ||
				(promiseLike as Promise<T>)?.catch !== undefined) {
        (promiseLike as Promise<T>)
          ?.then((result: T): void => resolveOnce(result))
          ?.catch((): void => undefined);
        (promiseLike as Promise<T>)?.catch((reason?: any): void => rejectionCheck(reason));
      } else resolveOnce(promiseLike as T);
    }
  });
};
