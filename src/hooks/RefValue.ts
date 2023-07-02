import { RefObject } from 'react';

export function getRefValue<T>(ref: RefObject<T>) {
  return ref.current as T;
}
