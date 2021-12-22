import octokit from "./lib/loadOctokit";

const target = {
  owner: "e-chan1007",
  repo: "1222-github-api",
  branch: "main"
};

(async () => {
  const latestCommit = (await octokit.rest.repos.getBranch(target)).data.commit;

  const createdBlob = (await octokit.rest.git.createBlob({
    ...target,
    content: Buffer.from("Hello GitHub API With Base64 Encoded!", "utf-8").toString("base64"),
    encoding: "base64"
  })).data;

  const createdTree = (await octokit.rest.git.createTree({
    ...target,
    tree: [{
      type: "blob",
      path: "test.txt",
      mode: "100644",
      content: "Hello GitHub API!"
    }, {
      type: "blob",
      path: "base64/test.txt",
      mode: "100644",
      sha: createdBlob.sha
    }],
    base_tree: latestCommit.sha
  })).data;

  const createdCommit = (await octokit.rest.git.createCommit({
    ...target,
    message: "Test Commit with GitHub API",
    tree: createdTree.sha,
    parents: [latestCommit.sha],
  })).data;

  await octokit.rest.git.updateRef({
    ...target,
    ref: `heads/${target.branch}`,
    sha: createdCommit.sha
  });
})();
