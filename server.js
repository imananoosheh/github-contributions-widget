// server.js
"use strict";
import dotenv from "dotenv";
import express from "express";
const app = express();
dotenv.config();

const accessToken = process.env.GITHUB_ACCESS_TOKEN;


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
	let contributionData = [];
	for (const week of data.data.user.contributionsCollection
		.contributionCalendar.weeks) {
		contributionData.push(...week["contributionDays"]);
	}

	return contributionData;
}

// Run Server

app.get("/github_calendar/:username", async (req, res) => {
	const username = req.params.username;

	try {
		const contributionData = await getContributions(accessToken, username);
		if (!contributionData || contributionData.length === 0) {
			console.error("No contribution data available.");
			// Handle the error, return or do something else
			return res.status(404).send("No contribution data available.");
		}
		// Return the result to the user
		res.send(JSON.stringify(contributionData));
		document.body.innerHTML = "";
	} catch (error) {
		console.error("Error fetching contribution data:", error);
		// Handle the error, return or do something else
		res.status(500).send("Error fetching contribution data.");
	}
});

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
