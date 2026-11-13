import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { installPack } from '../src/install.js';

test('installs the pet pack and preserves customizations on subsequent starts', () => {
  const home = mkdtempSync(join(tmpdir(), 'xizai-dsh-'));
  try {
    const { config, assets } = installPack(home);
    const parsed = JSON.parse(readFileSync(config, 'utf8'));
    assert.equal(parsed.pets[0].id, 'dsh-xizai-pet');
    assert.deepEqual(parsed.animations.clicks, ['click']);
    for (const name of ['idle', 'waiting', 'waving', 'jumping', 'review', 'click']) {
      assert.deepEqual([...readFileSync(join(assets, name + '.webm')).subarray(0, 4)], [0x1a, 0x45, 0xdf, 0xa3]);
    }
    writeFileSync(config, '{"custom":true}\n');
    writeFileSync(join(assets, 'idle.webm'), 'custom artwork');
    installPack(home);
    assert.equal(readFileSync(config, 'utf8'), '{"custom":true}\n');
    assert.equal(readFileSync(join(assets, 'idle.webm'), 'utf8'), 'custom artwork');
  } finally { rmSync(home, { recursive: true, force: true }); }
});
