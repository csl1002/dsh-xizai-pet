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
    assert.equal(parsed.pets[0].fixedEnabled, false);
    assert.equal(parsed.animations.moves.actions[0].name, 'walk');
    for (const name of ['idle', 'waiting', 'waving', 'jumping', 'review', 'click', 'walk', 'turn']) {
      assert.deepEqual([...readFileSync(join(assets, name + '.webm')).subarray(0, 4)], [0x1a, 0x45, 0xdf, 0xa3]);
    }
    writeFileSync(config, '{"custom":true}\n');
    writeFileSync(join(assets, 'idle.webm'), 'custom artwork');
    installPack(home);
    assert.equal(readFileSync(config, 'utf8'), '{"custom":true}\n');
    assert.equal(readFileSync(join(assets, 'idle.webm'), 'utf8'), 'custom artwork');
  } finally { rmSync(home, { recursive: true, force: true }); }
});

test('upgrades the old default motion while retaining user settings and a backup', () => {
  const home = mkdtempSync(join(tmpdir(), 'xizai-dsh-upgrade-'));
  try {
    const { config } = installPack(home);
    const original = JSON.parse(readFileSync(config, 'utf8'));
    original.pets[0].size = 350;
    original.pets[0].fixedEnabled = true;
    original.animations.turn = [];
    original.animations.moves.actions = [];
    original.animationWeights = { idle: 100, turn: 0, move: 0 };
    writeFileSync(config, JSON.stringify(original));
    installPack(home);
    const upgraded = JSON.parse(readFileSync(config, 'utf8'));
    assert.equal(upgraded.pets[0].size, 350);
    assert.equal(upgraded.pets[0].fixedEnabled, false);
    assert.deepEqual(upgraded.animations.turn, ['turn']);
    assert.equal(upgraded.animations.moves.actions[0].name, 'walk');
    assert.equal(JSON.parse(readFileSync(config + '.pre-walk-v1.0.1.bak', 'utf8')).pets[0].fixedEnabled, true);
    upgraded.animations.moves.actions = [{ name: 'custom' }];
    writeFileSync(config, JSON.stringify(upgraded));
    installPack(home);
    assert.equal(JSON.parse(readFileSync(config, 'utf8')).animations.moves.actions[0].name, 'custom');
  } finally { rmSync(home, { recursive: true, force: true }); }
});
