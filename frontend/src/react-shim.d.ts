import type { ReactNode as _ReactNode, ComponentType as _ComponentType } from 'react';

declare global {
  namespace React {
    type ReactNode = _ReactNode;
    type ComponentType<P = any> = _ComponentType<P>;
  }
}
