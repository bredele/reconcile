# reconcile

Reconcile data from multiple async sources.

## Installation

```sh
npm install @bredele/reconcile
```

## Usage

```ts
import reconcile from '@bredele/reconcile';

const output = await reconcile([
  () => ({ name: 'jane', age: null }),
  () => ({ name: 'john', city: 'toronto' }),
  () => ({ city: 'paris', gender: 'female', age: 29 }),
]);
// => { name: 'jane', age: 29, city: 'toronto', gender: 'female' }
```
