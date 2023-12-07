const { spawn } = require('node:child_process');
const git_stag = spawn('git', ['add', 'gh-contributions.json'],{cwd: `${process.env.GITHUB_CONTRIBUTION_WORKING_DIR}`});
const today = new Date().toISOString()
const git_commit = spawn('git', ['commit', '-m', `${today}_github_contributions`],{cwd: `${process.env.GITHUB_CONTRIBUTION_WORKING_DIR}`})
const git_push = spawn('git', ['push', 'origin', 'main'],{cwd: `${process.env.GITHUB_CONTRIBUTION_WORKING_DIR}`})