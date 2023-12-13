import { spawn } from 'child_process';

const workingDir = process.env.GITHUB_CONTRIBUTION_WORKING_DIR;

const git_stag = spawn('git', ['add', 'gh-contributions.json'], { cwd: workingDir });

git_stag.on('close', (code) => {
  console.log(`git add exited with code ${code}`);

  const today = new Date().toISOString();

  const git_commit = spawn('git', ['commit', '-m', `${today}_github_contributions`], { cwd: workingDir });

  git_commit.on('close', (code) => {
    console.log(`git commit exited with code ${code}`);

    const git_push = spawn('git', ['push', 'origin', 'main'], { cwd: workingDir });

    git_push.on('close', (code) => {
      console.log(`git push exited with code ${code}`);
    });
  });
});
