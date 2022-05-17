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
}
