import dotenv from 'dotenv';
import {Config} from '../../models/config.model';

export function provideConfig(environment: 'staging' | 'production' = 'staging'): Config {
  dotenv.config({path: '.env.' + environment});

  return {
    botToken: String(process.env.BOT_TOKEN),
  };
}
