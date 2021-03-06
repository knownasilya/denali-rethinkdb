import { ORMAdapter, inject } from 'denali';
import rethinkdb from 'rethinkdb';
import { pluralize } from 'inflection';

export default class RethinkdbAdapter extends ORMAdapter {
  connection = inject('database:rethinkdb');

  find(type, id) {
    let table = pluralize(type);
    return rethinkdb.table(table).get(id).run(this.connection);
  }

  async all(type) {
    let table = pluralize(type);
    let cursor = await rethinkdb.table(table).run(this.connection);
    return cursor.toArray();
  }

  query(type, query) {
    let table = pluralize(type);

    if (typeof query === 'function') {
      let base = rethinkdb.table(table);
      let result = query(base);

      if (result && typeof result.run === 'function') {
        return result.run(this.connection);
      }

      throw new Error('Invalid query returned, please return the modified query');
    }

    return rethinkdb.table(table).filter(query).run(this.connection);
  }

  findOne(type, query) {
    let table = pluralize(type);
    return rethinkdb.table(table).filter(query).nth(0).run(this.connection);
  }

  buildRecord(type, data) {
    return data;
  }

  idFor(model) {
    return model.record.id;
  }

  getAttribute(model, property) {
    return model.record[property];
  }

  setAttribute(model, property, value) {
    model.record[property] = value;
    return true;
  }

  deleteAttribute(model, property) {
    model.record[property] = null;
    return true;
  }

  async saveRecord(model) {
    let { type, record } = model;
    let table = pluralize(type);
    let result;

    if (record.id) {
      result = await rethinkdb.table(table).get(record.id).update(record).run(this.connection);
    } else {
      result = await rethinkdb.table(table).insert(record).run(this.connection);
    }

    if (result && result.inserted === 1) {
      model.record.id = result.generated_keys[0];
    } else {
      throw new Error('Failed to save record');
    }
  }

  deleteRecord({ type, record }) {
    let table = pluralize(type);
    return rethinkdb.table(table).get(record.id).delete().run(this.connection);
  }

}
