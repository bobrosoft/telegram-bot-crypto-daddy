import {LoggerService} from './logger.service';

export class LoggerServiceMock extends LoggerService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override log(service: string, message: string) {
    // noop
  }
}
