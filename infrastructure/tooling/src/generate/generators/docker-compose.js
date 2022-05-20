const path = require('path');
const { listServices, readRepoYAML, writeRepoYAML } = require('../../utils');

const SERVICES = listServices();

const COMPOSE_FILENAME = 'docker-compose.yml';

const ports = {
  rabbitmq: [5672, 15672],
  postgres: [5432],
  taskclusterRoot: [3050],

  'auth': [3011],
  'github': [3012],
  'hooks': [3013],
  'index': [3014],
  'notify': [3015],
  'object': [3016],
  'purge-cache': [3017],
  'queue': [3018],
  'secrets': [3019],
  'worker-manager': [3020],
  'web-server': [3050],
  'ui': [9009],
};

const mapServicePorts = (service) => (ports[service] || []).map((port => `${port}:${port}`));

const defaultValues = {
  NODE_ENV: 'development',

  LEVEL: 'debug',
  FORCE_SSL: 'false',
  TRUST_PROXY: 'true',

  USERNAME_PREFIX: 'test',
  ADMIN_DB_URL: `postgresql://postgres@postgres:${ports.postgres[0]}/taskcluster`,
  READ_DB_URL: `postgresql://postgres@postgres:${ports.postgres[0]}/taskcluster`,
  WRITE_DB_URL: `postgresql://postgres@postgres:${ports.postgres[0]}/taskcluster`,

  TASKCLUSTER_ROOT_URL: `http://localhost:${ports.taskclusterRoot[0]}`,

  PULSE_USERNAME: 'admin',
  PULSE_PASSWORD: 'admin',
  PULSE_HOSTNAME: 'rabbitmq',
  PULSE_VHOST: 'local',
  PULSE_AMQPS: 'false',

  APPLICATION_NAME: 'Taskcluster',
  GRAPHQL_ENDPOINT: 'http://localhost:3050/graphql',
  GRAPHQL_SUBSCRIPTION_ENDPOINT: 'http://localhost:3050/graphql',
  UI_LOGIN_STRATEGY_NAMES: 'local',
};

exports.tasks = [];

const uiConfig = [
  { type: '!env', var: 'PORT' },
  { type: '!env', var: 'APPLICATION_NAME' },
  { type: '!env', var: 'GRAPHQL_SUBSCRIPTION_ENDPOINT' },
  { type: '!env', var: 'GRAPHQL_ENDPOINT' },
  { type: '!env', var: 'UI_LOGIN_STRATEGY_NAMES' },
  { type: '!env:string', var: 'BANNER_MESSAGE', optional: true },
  { type: '!env:json', var: 'SITE_SPECIFIC', optional: true },
];

exports.tasks.push({
  title: `Generate docker-compose.yml`,
  requires: [
    ...SERVICES.map(name => `configs-${name}`),
    ...SERVICES.map(name => `procslist-${name}`),
  ],
  provides: ['target-docker-compose.yml'],
  run: async (requirements, utils) => {
    const currentRelease = await readRepoYAML(path.join('infrastructure', 'tooling', 'current-release.yml'));

    const serviceEnv = (name) => {
      const config = name === 'ui' ? uiConfig : requirements[`configs-${name}`];
      if (!config) {
        console.warn(`No configs-${name}`);
        return {};
      }

      return Object.fromEntries(config.map(cfg => {
        let value = defaultValues[cfg.var];

        if (cfg.var === 'PORT' && ports[name]) {
          value = ports[name][0];
        }

        if (!value && !cfg.optional) {
          console.warn(`Missing required config ${cfg.var} for ${name}`);
        }

        return [cfg.var, value];
      }));
    };

    const serviceDefinition = (name, overrides = {}) => ({
      image: currentRelease.image,
      networks: ['local'],
      environment: serviceEnv(name),
      ...overrides,
      ...((overrides.ports || mapServicePorts(name)).length > 0
        ? { ports: overrides.ports || mapServicePorts(name) } : {}),
    });

    const dockerCompose = {
      version: '3',
      volumes: {
        'db-data': {},
      },
      networks: {
        local: {
          driver: 'bridge',
        },
      },
      services: {
        rabbitmq: serviceDefinition('rabbitmq', {
          image: 'rabbitmq:3.7.8-management',
          healthcheck: {
            test: 'rabbitmq-diagnostics ping',
            interval: '1s',
            timeout: '2s',
            retries: 30,
            start_period: '3s',
          },
          environment: {
            RABBITMQ_DEFAULT_USER: 'admin',
            RABBITMQ_DEFAULT_PASS: 'admin',
            RABBITMQ_DEFAULT_VHOST: 'local',
          },
        }),
        postgres: serviceDefinition('postgres', {
          image: 'postgres:11',
          volumes: [
            'db-data:/var/lib/postgresql/data',
            './docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql',
          ],
          environment: {
            POSTGRES_DB: 'taskcluster',
            POSTGRES_HOST_AUTH_METHOD: 'trust',
            LC_COLLATE: 'en_US.UTF8',
            LC_CTYPE: 'en_US.UTF8',
          },
          healthcheck: {
            test: 'pg_isready -U postgres',
            interval: '1s',
            timeout: '2s',
            retries: 30,
            start_period: '3s',
          },
        }),
        pg_init_db: serviceDefinition('pg_init_db', {
          'x-info': 'Run this first to bring database up to date',
          command: ['script/db:upgrade'],
          depends_on: {
            postgres: {
              condition: 'service_healthy',
            },
          },
        }),
        ui: serviceDefinition('ui', { command: ['ui/web'] }),
      },
    };

    for (let name of SERVICES) {
      const procs = requirements[`procslist-${name}`];
      // only web services for now

      Object.keys(procs).forEach((proc) => {
        if (procs[proc].type !== 'web') {
          return;
        }

        dockerCompose.services[`${name}-${proc}`] = serviceDefinition(name, {
          // entrypoint is defined in dockerfile
          // command is defined in entrypoint and is SERVICE/PROC
          command: [`${name}/${proc}`],
          depends_on: {
            rabbitmq: {
              condition: 'service_healthy',
            },
            postgres: {
              condition: 'service_healthy',
            },
          },
        });
      });
    }

    await writeRepoYAML(path.join('.', COMPOSE_FILENAME), dockerCompose);
    return {
      'target-docker-compose.yml': dockerCompose,
    };
  },
});
