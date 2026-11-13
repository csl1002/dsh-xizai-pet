import { homedir } from 'node:os';
import { join } from 'node:path';
import { installPack } from './install.js';

export const name = 'dsh-xizai-pet';

export function apply() {
  const home = process.env.DSH_HOME || join(process.env.USERPROFILE || process.env.HOME || homedir(), '.dsh');
  installPack(home);
}
