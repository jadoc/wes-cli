import assert from 'assert';
import { readFile } from 'fs/promises';

import { arrayOfStrings, arrayOfStringsOfStrings } from '../utils/array.js';
import { Config, ModuleConfig } from './configTypes.js';

export function parse(
  configFilePath: string,
  options: { type: 'local' },
): Promise<Config>;
export function parse(
  configFilePath: string,
  options: { type: 'module' },
): Promise<ModuleConfig>;
export async function parse(
  configFilePath: string,
  options: { type: 'local' | 'module' },
) {
  const contents = await readFile(configFilePath, { encoding: 'utf-8' });
  const config = JSON.parse(contents) as Config | ModuleConfig;

  assert(
    config !== null && typeof config === 'object',
    'Config must be an object',
  );

  assert('version' in config, 'Missing config version');

  assert(config.version === 1, `Unsupported config version: ${config.version}`);

  if ('dependencies' in config) {
    assert(
      Array.isArray(config.dependencies) &&
        ((options.type === 'local' && arrayOfStrings(config.dependencies)) ||
          (options.type === 'module' &&
            arrayOfStringsOfStrings(config.dependencies))),
      '`dependencies` must be an array of strings',
    );
  }

  return config;
}
