const DataLoader = require('dataloader');
const sift = require('../utils/sift');
const ConnectionLoader = require('../ConnectionLoader');
const WorkerCompact = require('../entities/WorkerCompact');

module.exports = ({ queue }, isAuthed, rootUrl, monitor, strategies, req, cfg, requestId) => {
  const worker = new DataLoader(queries =>
    Promise.all(
      queries.map(async ({ provisionerId, workerType, workerGroup, workerId }) => {
        try {
          return await queue.getWorker(provisionerId, workerType, workerGroup, workerId); // TODO: update to WM
        } catch (err) {
          return err;
        }
      },
      ),
    ),
  );
  const workers = new ConnectionLoader(
    async ({ provisionerId, workerType, options, filter, isQuarantined }) => {
      const raw = await queue.listWorkers( // TODO: update to WM
        provisionerId,
        workerType,
        typeof isQuarantined === 'boolean'
          ? { ...options, quarantined: isQuarantined }
          : options,
      );
      const workers = sift(filter, raw.workers);

      return {
        ...raw,
        items: workers.map(
          worker => new WorkerCompact(provisionerId, workerType, worker),
        ),
      };
    },
  );

  return {
    worker,
    workers,
  };
};
