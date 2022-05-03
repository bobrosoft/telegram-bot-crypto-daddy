export class Utils {
  static setTimeoutAsync(ms: number): Promise<void> {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
}