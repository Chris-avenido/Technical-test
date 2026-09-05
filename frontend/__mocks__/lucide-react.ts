/**
 * Manual Jest mock for lucide-react.
 *
 * lucide-react ships as pure ESM which Jest's default CJS transformer cannot handle.
 * This mock replaces every named icon export with a simple React <span> stub so that
 * component tests can render components that use lucide-react icons without any
 * transform or babel configuration changes.
 */

const React = require('react');

/**
 * A lightweight icon stub that renders a <span> with a data-testid="icon" attribute.
 */
function MockIcon({ className, ...rest }: { className?: string; [key: string]: unknown }) {
  return React.createElement('span', { className, 'data-testid': 'mock-icon', ...rest });
}

// Export every possible icon name as the MockIcon component.
// We use module.exports to ensure CommonJS compatibility.
module.exports = new Proxy(
  { __esModule: true, default: MockIcon },
  {
    get(target, prop: string) {
      if (prop === '__esModule' || prop === 'default') return target[prop as keyof typeof target];
      // All named exports (Globe, Search, X, etc.) return the MockIcon component
      return MockIcon;
    },
  }
);
