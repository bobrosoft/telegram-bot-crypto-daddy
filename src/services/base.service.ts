import {LoggerService} from './logger/logger.service';

export abstract class BaseService {
  protected abstract name: string;

  protected constructor(protected logger: LoggerService) {}

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;

  protected log(message: string) {
    this.logger.log(this.name, message);
  }
}
