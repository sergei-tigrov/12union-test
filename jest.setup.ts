// Global jest setup: provide a minimal localStorage polyfill for Node environment
if (typeof globalThis.localStorage === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.localStorage = {
    _data: new Map<string, string>(),
    getItem(key: string) {
      return this._data.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      this._data.set(key, value);
    },
    removeItem(key: string) {
      this._data.delete(key);
    },
    clear() {
      this._data.clear();
    }
  } as Storage;
}
