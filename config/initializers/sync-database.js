import rethinkdb from 'rethinkdb';

export default {
  name: 'sync-database',
  after: 'define-orm-models',

  async initialize({ container, config }) {
    let dbConfig = config.database;
    let autoCreateTables = dbConfig.autoCreateTables;

    if (autoCreateTables && dbConfig.tables) {
      let connection = container.lookup('database:rethinkdb', { loose: true });
      let existingTables = await rethinkdb.tableList().run(connection);

      for (let index in dbConfig.tables) {
        let table = dbConfig.tables[index];

        if (!existingTables.includes(table)) {
          await rethinkdb.tableCreate(table).run(connection);
        }
      }
    }
  }
};
