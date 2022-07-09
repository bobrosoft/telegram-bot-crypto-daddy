export class Utils {
  static setTimeoutAsync(ms: number): Promise<void> {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  static normalizePrice(value: string | number | undefined): string {
    return Number(value).toFixed(2);
  }

  /**
   * Clones simple objects
   */
  static clone<T>(source: T): T {
    return JSON.parse(JSON.stringify(source));
  }
}
