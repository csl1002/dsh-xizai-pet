import { constants, copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../pet/', import.meta.url));

/** Install only missing files; existing user configuration and artwork are preserved. */
export function installPack(dshHome) {
  const dest = join(dshHome, 'dsh-pet', 'pet');
  const config = join(dest, 'xizai-pet-config.json');
  const assets = join(dest, 'xizai-pet-animation');
  mkdirSync(assets, { recursive: true });
  const copyMissing = (from, to) => {
    try { copyFileSync(from, to, constants.COPYFILE_EXCL); }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
  };
  for (const file of readdirSync(join(source, 'xizai-pet-animation'))) {
    if (file.endsWith('.webm')) copyMissing(join(source, 'xizai-pet-animation', file), join(assets, file));
  }
  if (!existsSync(config)) copyMissing(join(source, 'xizai-pet-config.json'), config);
  return { config, assets };
}
