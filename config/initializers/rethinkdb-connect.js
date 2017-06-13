import rethinkdb from 'rethinkdb';

export default {
  name: 'rethinkdb-connect',
  before: 'define-orm-models',

  async initialize({ container, config, logger }) {
    let defaultConfig = { host: 'localhost', port: 28015 };
    let dbConfig = config.database;
    let rdbConfig = dbConfig && dbConfig.config;
    
    rdbConfig = rdbConfig || defaultConfig;

    try {
      let connection = await rethinkdb.connect(rdbConfig);

      connection.use(config.db);
      container.register('database:rethinkdb', connection, { singleton: true });
    } catch (error) {
      logger.error('Error initializing the rethinkdb adapter or database connection:');
      logger.error(error.stack);

      throw error;
    }
  }
};
