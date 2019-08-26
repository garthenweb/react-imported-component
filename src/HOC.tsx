import * as React from 'react';
import {ImportedComponent} from './Component';
import {executeLoadable, getLoadable} from './loadable';
import {HOC, HOCType, LazyImport, Loadable} from "./types";
import {useLoadable} from "./useImported";
import {useEffect, useRef, useState, useMemo} from "react";
import {asDefault} from "./utils";
import {isBackend} from "./detectBackend";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;

/**
 *
 * @param {Function} loaderFunction - () => import('a'), or () => require('b')
 * @param {Object} [options]
 * @param {React.Component} [options.LoadingComponent]
 * @param {React.Component} [options.ErrorComponent]
 * @param {Function} [options.onError] - error handler. Will consume the real error.
 * @param {Function} [options.async] - enable React 16+ suspense.
 */
const loader: HOC = (loaderFunction, baseOptions = {}) => {
  const loadable = getLoadable(loaderFunction);

  const Imported = React.forwardRef<any, any>(
    function ImportedComponentHOC({importedProps = {}, ...props}, ref) {
      const options = {...baseOptions, ...importedProps};

      return (
        <ImportedComponent
          loadable={loadable}

          LoadingComponent={options.LoadingComponent}
          ErrorComponent={options.ErrorComponent}

          onError={options.onError}

          render={options.render}

          forwardProps={props || {}}
          forwardRef={ref}
        />
      )
    }) as HOCType<any, any>;

  Imported.preload = () => {
    loadable.load().catch(() => ({}));

    return loadable.resolution;
  };
  Imported.done = loadable.resolution;

  return Imported;
};

export function lazy<T>(importer: LazyImport<T>): React.FC<T> {
  if (isBackend) {
    return loader(importer);
  }

  if (process.env.NODE_ENV !== 'production') {
    // lazy is not hot-reloadable
    if ((module as any).hot) {
      return loader(importer, {async: true})
    }
  }

  const topLoadable = getLoadable(importer);

  return function ImportedLazy(props: T) {
    const {loadable} = useLoadable(topLoadable);

    const Lazy = useMemo(() => (
      React.lazy(
        () => loadable.tryResolveSync(asDefault as any) as any,
      )
    ), []);

    return (<Lazy {...props as any} />)
  }
}


export default loader;