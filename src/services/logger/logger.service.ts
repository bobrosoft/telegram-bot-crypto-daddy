import {autoInjectable} from 'tsyringe';

@autoInjectable()
export class LoggerService {
  log(service: string, message: string) {
    console.log(
      `${new Date()
        //
        .toLocaleString('ru-RU')
        .replace(/,\s/g, ' ')} [${service}] ${message}`,
    );
  }
}
