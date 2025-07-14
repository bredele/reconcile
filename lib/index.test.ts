import test from 'node:test';
import assert from 'node:assert';
import reconcile from './index.js';

test('basic reconciliation - README example', async () => {
  const result = await reconcile([
    async () => ({ name: 'jane', age: null }),
    async () => ({ name: 'john', city: 'toronto' }),
    async () => ({ city: 'paris', gender: 'female', age: 29 }),
  ]);
  
  assert.deepStrictEqual(result, {
    name: 'jane',
    age: 29,
    city: 'toronto',
    gender: 'female'
  });
});

test('null value filtering', async () => {
  const result = await reconcile([
    async () => ({ a: null, b: 1 }),
    async () => ({ a: 2, c: null }),
    async () => ({ a: 3, b: 4, c: 5 }),
  ]);
  
  assert.deepStrictEqual(result, { a: 2, b: 1, c: 5 });
});

test('error handling - failed callbacks are ignored', async () => {
  const result = await reconcile([
    async () => ({ a: 1 }),
    async () => { throw new Error('fail'); },
    async () => ({ b: 2 }),
  ]);
  
  assert.deepStrictEqual(result, { a: 1, b: 2 });
});

test('empty input array', async () => {
  const result = await reconcile([]);
  assert.deepStrictEqual(result, {});
});

test('all callbacks fail', async () => {
  const result = await reconcile([
    async () => { throw new Error('fail1'); },
    async () => { throw new Error('fail2'); },
  ]);
  
  assert.deepStrictEqual(result, {});
});

test('first-wins priority', async () => {
  const result = await reconcile([
    async () => ({ x: 'first', y: 'first' }),
    async () => ({ x: 'second', z: 'second' }),
    async () => ({ x: 'third', y: 'third', z: 'third' }),
  ]);
  
  assert.deepStrictEqual(result, {
    x: 'first',
    y: 'first', 
    z: 'second'
  });
});

test('non-object results are ignored', async () => {
  const result = await reconcile([
    async () => ({ a: 1 }),
    async () => 'string' as any,
    async () => null as any,
    async () => ({ b: 2 }),
  ]);
  
  assert.deepStrictEqual(result, { a: 1, b: 2 });
});
