import {Context} from 'telegraf';

export type ContextWithMatch = Context & {match?: {groups?: {command?: string; params?: string}}};
