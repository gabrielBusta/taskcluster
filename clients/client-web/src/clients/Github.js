// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import Client from '../Client';

export default class Github extends Client {
  constructor(options = {}) {
    super({
      serviceName: 'github',
      serviceVersion: 'v1',
      exchangePrefix: '',
      ...options,
    });
    this.ping.entry = {"args":[],"category":"Ping Server","method":"get","name":"ping","query":[],"route":"/ping","stability":"stable","type":"function"}; // eslint-disable-line
    this.githubWebHookConsumer.entry = {"args":[],"category":"Github Service","method":"post","name":"githubWebHookConsumer","query":[],"route":"/github","stability":"stable","type":"function"}; // eslint-disable-line
    this.builds.entry = {"args":[],"category":"Github Service","method":"get","name":"builds","output":true,"query":["continuationToken","limit","organization","repository","sha"],"route":"/builds","scopes":"github:list-builds","stability":"stable","type":"function"}; // eslint-disable-line
    this.badge.entry = {"args":["owner","repo","branch"],"category":"Github Service","method":"get","name":"badge","query":[],"route":"/repository/<owner>/<repo>/<branch>/badge.svg","scopes":"github:get-badge:<owner>:<repo>:<branch>","stability":"experimental","type":"function"}; // eslint-disable-line
    this.repository.entry = {"args":["owner","repo"],"category":"Github Service","method":"get","name":"repository","output":true,"query":[],"route":"/repository/<owner>/<repo>","scopes":"github:get-repository:<owner>:<repo>","stability":"experimental","type":"function"}; // eslint-disable-line
    this.latest.entry = {"args":["owner","repo","branch"],"category":"Github Service","method":"get","name":"latest","query":[],"route":"/repository/<owner>/<repo>/<branch>/latest","scopes":"github:latest-status:<owner>:<repo>:<branch>","stability":"stable","type":"function"}; // eslint-disable-line
    this.createStatus.entry = {"args":["owner","repo","sha"],"category":"Github Service","input":true,"method":"post","name":"createStatus","query":[],"route":"/repository/<owner>/<repo>/statuses/<sha>","scopes":"github:create-status:<owner>/<repo>","stability":"experimental","type":"function"}; // eslint-disable-line
    this.createComment.entry = {"args":["owner","repo","number"],"category":"Github Service","input":true,"method":"post","name":"createComment","query":[],"route":"/repository/<owner>/<repo>/issues/<number>/comments","scopes":"github:create-comment:<owner>/<repo>","stability":"stable","type":"function"}; // eslint-disable-line
  }
  /* eslint-disable max-len */
  // Respond without doing anything.
  // This endpoint is used to check that the service is up.
  /* eslint-enable max-len */
  ping(...args) {
    this.validate(this.ping.entry, args);

    return this.request(this.ping.entry, args);
  }
  /* eslint-disable max-len */
  // Capture a GitHub event and publish it via pulse, if it's a push,
  // release or pull request.
  /* eslint-enable max-len */
  githubWebHookConsumer(...args) {
    this.validate(this.githubWebHookConsumer.entry, args);

    return this.request(this.githubWebHookConsumer.entry, args);
  }
  /* eslint-disable max-len */
  // A paginated list of builds that have been run in
  // Taskcluster. Can be filtered on various git-specific
  // fields.
  /* eslint-enable max-len */
  builds(...args) {
    this.validate(this.builds.entry, args);

    return this.request(this.builds.entry, args);
  }
  /* eslint-disable max-len */
  // Checks the status of the latest build of a given branch
  // and returns corresponding badge svg.
  /* eslint-enable max-len */
  badge(...args) {
    this.validate(this.badge.entry, args);

    return this.request(this.badge.entry, args);
  }
  /* eslint-disable max-len */
  // Returns any repository metadata that is
  // useful within Taskcluster related services.
  /* eslint-enable max-len */
  repository(...args) {
    this.validate(this.repository.entry, args);

    return this.request(this.repository.entry, args);
  }
  /* eslint-disable max-len */
  // For a given branch of a repository, this will always point
  // to a status page for the most recent task triggered by that
  // branch.
  // Note: This is a redirect rather than a direct link.
  /* eslint-enable max-len */
  latest(...args) {
    this.validate(this.latest.entry, args);

    return this.request(this.latest.entry, args);
  }
  /* eslint-disable max-len */
  // For a given changeset (SHA) of a repository, this will attach a "commit status"
  // on github. These statuses are links displayed next to each revision.
  // The status is either OK (green check) or FAILURE (red cross),
  // made of a custom title and link.
  /* eslint-enable max-len */
  createStatus(...args) {
    this.validate(this.createStatus.entry, args);

    return this.request(this.createStatus.entry, args);
  }
  /* eslint-disable max-len */
  // For a given Issue or Pull Request of a repository, this will write a new message.
  /* eslint-enable max-len */
  createComment(...args) {
    this.validate(this.createComment.entry, args);

    return this.request(this.createComment.entry, args);
  }
}
