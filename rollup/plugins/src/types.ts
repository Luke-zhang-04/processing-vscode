export type PluginFunc<T> = (options: T) => import("rollup").Plugin | undefined
