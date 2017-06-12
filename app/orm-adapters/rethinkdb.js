import { ORMAdapter, inject } from 'denali';
import { fromNode } from 'bluebird';
import rethinkdb from 'rethinkdb';
import upperFirst from 'lodash/upperFirst';

export default class RethinkdbAdapter extends ORMAdapter {
  connection = inject('database:rethinkdb');

  find(type, id) {
    return rethinkdb.table(type).get(id).run(this.connection);
  }

  async all(type) {
    let cursor = await rethinkdb.table(type).run(this.connection);
    return cursor.toArray();
  }

  query(type, query) {
    return rethinkdb.table(type).filter(query).run(this.connection);
  }

  findOne(type, query) {
    return rethinkdb.table(type).filter(query).nth(0).run(this.connection);
  }

  createRecord(type, data) {
    return rethinkdb.table(type).insert(data).run(this.connection);
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

  saveRecord({ type, record }) {
    return rethinkdb.table(type).get(record.id).update(record).run(this.connection);
  }

  deleteRecord({ type, record }) {
    return rethinkdb.table(type).get(record.id).delete().run(this.connection);
  }

}
