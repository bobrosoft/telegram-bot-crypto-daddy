import {TFunction} from 'i18next';
import {InjectionToken} from 'tsyringe';
import {Config} from '../models/config.model';

export const TFunctionToken: InjectionToken<TFunction> = 'TFunctionToken';
export const ConfigToken: InjectionToken<Config> = 'ConfigToken';
