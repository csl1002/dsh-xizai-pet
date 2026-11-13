import { constants, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, renameSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const source = fileURLToPath(new URL('../pet/', import.meta.url));

/** Upgrade only the original no-movement configuration; preserve other settings. */
function enableLegacyMovement(config) {
  let data;
  try { data = JSON.parse(readFileSync(config, 'utf8').replace(/^\uFEFF/, '')); }
  catch { return; }
  const a = data.animations, w = data.animationWeights;
  if (!Array.isArray(data.pets) || !Array.isArray(a?.turn) || a.turn.length !== 0 ||
      !Array.isArray(a?.moves?.actions) || a.moves.actions.length !== 0 ||
      !a.moves.default || w?.idle !== 100 || w?.turn !== 0 || w?.move !== 0) return;
  const backup = config + '.pre-walk-v1.0.1.bak';
  try { copyFileSync(config, backup, constants.COPYFILE_EXCL); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
  for (const pet of data.pets) if (pet.id === 'dsh-xizai-pet') pet.fixedEnabled = false;
  a.turn = ['turn'];
  a.moves.actions = [{ name: 'walk' }];
  if (a.moves.default.leadSec === 1) a.moves.default.leadSec = 0;
  if (a.moves.default.tailSec === 1) a.moves.default.tailSec = 0;
  data.animationWeights = { idle: 40, turn: 25, move: 35 };
  const temp = config + '.' + randomUUID() + '.tmp';
  try {
    writeFileSync(temp, JSON.stringify(data, null, 2) + '\n', { encoding: 'utf8', flag: 'wx' });
    renameSync(temp, config);
  } catch (error) {
    try { if (existsSync(temp)) unlinkSync(temp); } catch {}
    throw error;
  }
}

/** Install missing assets and upgrade the original default configuration once. */
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
  else enableLegacyMovement(config);
  return { config, assets };
}
