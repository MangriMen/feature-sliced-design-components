import { getConfiguration } from './getConfiguration';

export const getCurrentComponentTemplateKey = () =>
  getConfiguration().get<string>('componentTemplate');

export const setCurrentComponentTemplateKey = (value: string) =>
  getConfiguration().update('componentTemplate', value);
