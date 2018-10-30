module.exports.githubWebhookListener = (event, context, callback) => {
  // get the GitHub secret from the environment variables
  const token = process.env.GITHUB_WEBHOOK_SECRET;
  // get the remaining variables from the GitHub event
  const headers = event.headers;
  const githubEvent = headers['X-GitHub-Event'];
  const body = JSON.parse(event.body);
  // this prevents errors from the GitHub ping event
  const username = body.pusher ? body.pusher.name : body.repository.owner.login;

  const { repository } = body;
  const repo = repository.name;
  const url = repository.url;
  

  if (typeof token !== 'string') {
    let errMsg = 'Must provide a \'GITHUB_WEBHOOK_SECRET\' env variable';
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: errMsg,
    });
  }

  // We'll keep logging to CloudWatch in case we need to debug
  console.log('---------------------------------');
  console.log(`Github-Event: "${githubEvent}" on this repo: "${repo}" at the url: ${url}.\n ${username} is to blame if something was broken.`);
  console.log('---------------------------------');
  console.log(event.body);
  console.log('---------------------------------');

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      input: event,
    }),
  };

  return callback(null, response);
};