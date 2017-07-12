import rethinkdb from 'rethinkdb';
import { pluralize } from 'inflection';

export default {
  name: 'sync-database',
  after: 'define-orm-models',

  async initialize({ container, config }) {
    let dbConfig = config.database;
    let autoCreateTables = dbConfig.autoCreateTables;

    if (!autoCreateTables) {
      return;
    }

    let modelsHash = container.lookupAll('model');
    let concreteModelNames = Object.keys(modelsHash).filter((model) => !model.abstract);

    if (concreteModelNames.length) {
      let connection = container.lookup('database:rethinkdb', { loose: true });
      let existingTables = await rethinkdb.tableList().run(connection);

      for (let index in concreteModelNames) {
        let tableName = pluralize(concreteModelNames[index]);

        if (!existingTables.includes(tableName)) {
          await rethinkdb.tableCreate(tableName).run(connection);
        }
      }
    }
  }
};
