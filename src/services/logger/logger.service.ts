import {autoInjectable} from 'tsyringe';

@autoInjectable()
export class LoggerService {
  log(service: string, ...data: any[]) {
    console.log(
      `${new Date()
        //
        .toLocaleString('ru-RU', {timeZone: 'Europe/Samara'})
        .replace(/,\s/g, ' ')} [${service}]`,
      ...data,
    );
  }

  error(service: string, ...data: any[]) {
    this.log(service, '[ERROR]', ...data);
  }
}
