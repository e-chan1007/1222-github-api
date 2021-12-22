import octokit from "./lib/loadOctokit";

const target = {
  owner: "e-chan1007",
  repo: "1222-github-api",
  branch: "main"
};

(async () => {
  const latestCommit = (await octokit.rest.repos.getBranch(target)).data.commit;
  const files = (await octokit.rest.git.getTree({ ...target, tree_sha: latestCommit.sha })).data.tree;
  const blob = (await octokit.rest.git.getBlob({ ...target, file_sha: files.find(file => file.path === "README.md")?.sha! })).data;

  console.log("===== Latest Commit =====");
  console.log(latestCommit);

  console.log("===== Root Files =====");
  console.log(files);

  console.log("===== First File =====");
  console.log(Buffer.from(blob.content, "base64").toString("utf-8"));
})();
