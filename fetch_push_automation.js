import dotenv from "dotenv";
import { writeFile, readFile } from "fs";
import { spawn } from "child_process";

const workingDir = process.env.GITHUB_CONTRIBUTION_WORKING_DIR;
dotenv.config({ path: `${workingDir}.env` });

async function getContributions(token, username) {
	const headers = {
		Authorization: `bearer ${token}`,
	};
	const body = {
		query: `query {
            user(login: "${username}") {
              name
              contributionsCollection {
                contributionCalendar {
                  colors
                  totalContributions
                  weeks {
                    contributionDays {
                      color
                      contributionCount
                      date
                      weekday
                    }
                    firstDay
                  }
                }
              }
            }
          }`,
	};
	const response = await fetch("https://api.github.com/graphql", {
		method: "POST",
		body: JSON.stringify(body),
		headers: headers,
	});
	const data = await response.json();
	writeFile(
		`${process.env.GITHUB_CONTRIBUTION_WORKING_DIR}archive.json`,
		JSON.stringify(data),
		(error) => {
			if (error) {
				console.log(error);
			}
		}
	);
	console.log("Data is fetched and saved to file.");
}

getContributions(process.env.GITHUB_ACCESS_TOKEN, process.env.GITHUB_USERNAME);

setTimeout(() => {
	console.log("Reading the most updated saved file...");
	readFile(
		`${process.env.GITHUB_CONTRIBUTION_WORKING_DIR}archive.json`,
		"utf-8",
		(err, data) => {
			if (err) {
				console.log(err);
				return;
			}
			const contributions = JSON.parse(data);
			let contributionFile = [];
			for (const week of contributions.data.user.contributionsCollection
				.contributionCalendar.weeks) {
				contributionFile.push(...week["contributionDays"]);
			}
			writeFile(
				`${process.env.GITHUB_CONTRIBUTION_WORKING_DIR}gh-contributions.json`,
				JSON.stringify(contributionFile),
				(err) => {
					if (err) {
						console.log(err);
						return;
					}
				}
			);
		}
	);

	// In this section we add, commit, and push to a repo where most updated file is kept
	console.log("Pushing to GitHub...");
	const git_stag = spawn("git", ["add", "gh-contributions.json"], {
		cwd: workingDir,
	});
	git_stag.on("close", (code) => {
		console.log(`git add exited with code ${code}`);

		const today = new Date().toISOString();

		const git_commit = spawn(
			"git",
			["commit", "-m", `${today}_github_contributions`],
			{ cwd: workingDir }
		);

		git_commit.on("close", (code) => {
			console.log(`git commit exited with code ${code}`);
            git_commit.stdout.on('data', (data) => {
                console.log(`git_commit stdout: ${data}`);
              });

			const git_push = spawn("git", ["push", "origin", "main"], {
				cwd: workingDir,
			});
            
			git_push.on("close", (code) => {
				console.log(`git push exited with code ${code}`);
			});
		});
	});
}, 2000);
