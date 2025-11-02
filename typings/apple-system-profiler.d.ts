declare module 'apple-system-profiler' {
  interface Info {
    name: string,
    items: import('plist').PlistValue,
    properties: import('plist').PlistValue
  }

  interface Options {
    dataTypes?: string[],
    maxBuffer?: number,
    timeout?: number|string,
    detailLevel?: "mini"|"basic"|"full",
    normalize?: boolean,
    cwd?: string
  }
  export function systemProfiler (opts: Options): Promise<Info[] | import('plist').PlistValue>
}
