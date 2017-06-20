# denali-rethinkdb

Allows use of [RethinkDB](https://www.rethinkdb.com) as a store for your models.

## Installation

1. Install this package (`denali install denali-rethinkdb`)
2. Add a `app/orm-adapters/application.js` that extends this adapter.

```js
import RethinkdbAdapter from 'denali-rethinkdb/app/orm-adapters/rethinkdb';

export default RethinkdbAdapter;
```

3. Make sure your models (if any) have their attributes defined with the attributes that this adapter defines.

## Configuration

The configuration can be updated in `config/environment.js`.

It would look something like:

```js
config.database = {
  config: {
    host: 'localhost',
    port: 28015,
    db: 'test'
  },
  autoCreateTables: true
};
```

## Opinions

Currently, this adapter converts model names into plural table names.

```js
export default class Issue extends Model {

  static createdAt = attr('date'); // maps to the issued table and createdAt column

}
```

## Developing

1. Clone the repo down
2. `npm install`
3. `denali server`
4. Hit [localhost:3000](http://localhost:3000)


## Tests

```sh
$ denali test
```
