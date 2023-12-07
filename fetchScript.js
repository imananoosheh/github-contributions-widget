
require("dotenv").config({ path: `${process.env.GITHUB_CONTRIBUTION_WORKING_DIR}.env` });
const fileSystem = require("fs");

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
  fileSystem.writeFile(`${process.env.GITHUB_CONTRIBUTION_WORKING_DIR}archive.json`, JSON.stringify(data), (error) => {
    if (error) {
      console.log(error);
    }
  });
}

getContributions(process.env.GITHUB_ACCESS_TOKEN, process.env.GITHUB_USERNAME);

setTimeout(() => {
  fileSystem.readFile(`${process.env.GITHUB_CONTRIBUTION_WORKING_DIR}archive.json`, "utf-8", (err, data) => {
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
    fileSystem.writeFile(
      `${process.env.GITHUB_CONTRIBUTION_WORKING_DIR}gh-contributions.json`,
      JSON.stringify(contributionFile),
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
      }
    );
  });
}, 2000);
