const { spawn } = require('node:child_process');
const git_stag = spawn('git', ['add', 'gh-contributions.json']);
const today = new Date().toISOString()
const git_commit = spawn('git', ['commit', '-m', `${today}_github_contributions`])
const git_push = spawn('git', ['push'])