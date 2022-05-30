const { execSync } = require('child_process');

const TOKEN = process.env.GITHUB_TOKEN;
const BRANCH = process.env.BRANCH;
const REPOSITORY = process.env.GITHUB_REPOSITORY;

const reIssueLink =
  /(?<=(Close|Closes|Closed|Fix|Fixes|Fixed|Resolve|Resolves|Resolved) #)[0-9]*/g;

class TODOUnremovedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TODOUnremovedError';
  }
}

const main = () => {
  const response = execSync(
    `curl -H "Authorization: Bearer ${TOKEN}" https://api.github.com/search/issues?q=head:${BRANCH}+repo:${REPOSITORY}`,
  );
  const parsedResponse = JSON.parse(response.toString());

  if (
    parsedResponse.message === 'Bad credentials' ||
    parsedResponse.message === 'Validation Failed'
  ) {
    throw new Error(parsedResponse.message);
  } else if (parsedResponse.total_count === 0) {
    throw new Error('linked issue with current branch doesnt exist');
  }

  const linkedIssues = parsedResponse.items[0].body.match(reIssueLink);
  if (!linkedIssues) return;

  try {
    const issuesString = linkedIssues.join('|');
    const todo_matching = execSync(
      `git grep -E "TODO (${issuesString})" $(git ls-remote . 'refs/remotes/origin/${BRANCH}' | cut -f 2)`,
    );
    throw new TODOUnremovedError(todo_matching.toString());
  } catch (e) {
    if (e.status !== 1) {
      throw e;
    }
    console.log('TODO check completed');
  }
};

main();
