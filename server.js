// server.js
"use strict";
import dotenv from "dotenv";

import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import fs, { promises as fsPromises } from "fs";
import path from "path";
import { promisify } from "util";
import JSZip from "jszip";
import stream from "stream";
import bodyParser from "body-parser";
const pipeline = promisify(stream.pipeline);

import express from "express";
const app = express();
dotenv.config();

let requestNumber = 0
// parse application/json
app.use(bodyParser.json())
app.use(express.json());
app.use("/files", express.static(process.env.STATIC_DIR.split("/").at(-2)));
app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	res.setHeader("Access-Control-Allow-Credentials", true);
	console.log(
		`***[#${++requestNumber}]
		Received ${req.method} from: ip:${req.ip}
		request to ${req.url}
		body:${JSON.stringify(req.body)}
		***`
	);
	next();
});

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

/**
 * This section of the server does receive urls of github repo, then downloads them all,
 * then write all the files of each zip file in a single .md file and sent it back to ChatGPT
 *
 */
/**
 * Downloads files from URLs and saves them in a local directory concurrently.
 *
 * @param {Array<string>} urls Array of file URLs to download.
 * @param {string} saveDir Directory where the files will be saved.
 */
async function downloadFilesConcurrently(urls, saveDir) {
	// Ensure the save directory exists
	if (!fs.existsSync(saveDir)) {
		fs.mkdirSync(saveDir, { recursive: true });
	}

	const downloadPromises = urls.map(async (url, index) => {
		if (url.endsWith("/")) {
			url = url + "archive/refs/heads/main.zip";
		} else {
			url = url + "/archive/refs/heads/main.zip";
		}
		try {
			const response = await axios({
				url: url,
				method: "GET",
				responseType: "stream",
			});

			// Generate a filename based on the URL or use index to ensure uniqueness
			const fileName =
				new URL(url).pathname.split("/")[2] + ".zip" || `file-${index}`;
			const filePath = path.join(saveDir, fileName);

			console.log(`Downloading file from ${url}...`); // TEST:

			// Save the file to the local directory
			await pipeline(response.data, fs.createWriteStream(filePath));

			console.log(`Saved ${fileName} to ${saveDir}`); // TEST:
		} catch (error) {
			console.error(`Error downloading from ${url}: ${error.message}`);
			const newURL = url.split("main.zip")[0] + "master.zip";
			try {
				const responseToProcess = await axios({
					url: newURL,
					method: "GET",
					responseType: "stream",
				});
				// Generate a filename based on the URL or use index to ensure uniqueness
				const fileName =
					new URL(newURL).pathname.split("/")[2] + ".zip" ||
					`file-${index}`;
				const filePath = path.join(saveDir, fileName);

				console.log(
					`404 received BUT Downloading file AGAIN from ${newURL}...`
				); // TEST:

				// Save the file to the local directory
				await pipeline(
					responseToProcess.data,
					fs.createWriteStream(filePath)
				);
			} catch (error) {
				console.error(
					`2nd try downloading FAILED! from ${newURL}: ${error.message}`
				); // TEST:
			}
		}
	});

	// Wait for all downloads to complete
	await Promise.all(downloadPromises);

	console.log("All downloads complete.");
	return true;
}

async function readZipFilesToMarkdown(saveDir) {
	try {
		const files = await fsPromises.readdir(saveDir);
		console.log("\nCurrent directory filenames:"); // TEST:
		const zipFileAddresses = files
			.filter((file) => file.endsWith(".zip"))
			.map((file) => `${saveDir}/${file}`);
		console.log(`All zip files downloaded: ${zipFileAddresses}`); // TEST:
		return await aZipToAMarkdown(saveDir, zipFileAddresses); // Ensure this call is awaited
	} catch (err) {
		console.error(err);
	}
}

async function aZipToAMarkdown(saveDir, zipFiles) {
	let mdPaths = [];
	try {
		console.log(
			`Going through the save directory for .zip files. current zipfiles:${zipFiles}`
		); // TEST:
		for (let zipPath of zipFiles) {
			const data = await fsPromises.readFile(zipPath);
			const zip = await JSZip.loadAsync(data);
			const allFiles = Object.keys(zip.files);
			/**
			 * TODO: in filtering below excluding files need to be added,
			 * such as package-lock.json which counts as unneccesary
			 */
			const codeFiles = allFiles.filter((file) =>
				codeExtensions.has(path.extname(file))
			);

			if (codeFiles.length > 0) {
				const mdFilename =
					path.basename(zipPath, path.extname(zipPath)) + ".md";
				const mdPath = path.join(saveDir, mdFilename);
				mdPaths.push(mdPath);
				let mdContent = "";

				for (let codeFile of codeFiles) {
					const fileData = await zip.files[codeFile].async("string");
					const ext = path.extname(codeFile).substring(1); // Remove the dot
					mdContent += `\`\`\`${ext}\n${fileData}\n\`\`\`\n\n`;
				}

				await fsPromises.writeFile(mdPath, mdContent, "utf-8");
			}
		}
		console.info("Code extraction and Markdown file creation complete.");
		return mdPaths[0];
	} catch (error) {
		console.error("Error processing zip files:", error);
		// res.status(500).send("Internal Server Error");
	}
}

const codeExtensions = new Set([
	".py",
	".go",
	".java",
	".md",
	".html",
	".js",
	".cjs",
	".jsx",
	".mjs",
	".json",
	".css",
	".yml",
	".scss",
	".tsx",
	".ts",
	".cts",
	".mts",
]);

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
	} catch (error) {
		console.error("Error fetching contribution data:", error);
		// Handle the error, return or do something else
		res.status(500).send("Error fetching contribution data.");
	}
});

async function tokenizeAndSplitMarkdown(mdPath, tokenPerPage = 4000) {
	return new Promise((resolve, reject) => {
		fs.readFile(mdPath, "utf-8", (err, data) => {
			if (err) {
				console.log(`Encountered an error reading the md file: ${err}`);
				reject(err); // Reject the promise if there's an error
				return;
			}
			//number of words / tokens exist in the md file
			const contentTokens = data.trim().split(/\s+/);
			let mdContents = [];
			for (let i = 0; i < contentTokens.length; i += tokenPerPage) {
                // Slice the tokens to get the current chunk based on tokenPerPage
                const chunkTokens = contentTokens.slice(i, i + tokenPerPage);
                // Join the chunk tokens back into a string
                mdContents.push(chunkTokens.join(' '));
            }
			resolve(mdContents); // Resolve the promise with the processed content
		});
	});
}

app.post("/github_repo_2_md_file", async (req, res) => {
	const { urls, page = 1, perPage = 4000 } = req.body;
	console.log(`urls:${urls}`); // TEST: remove it after the testing
	const uniqueKey4ThisRequst = uuidv4(); //TODO: to delete the directory after a while (~ n hours)
	const saveDir = `${process.env.STATIC_DIR}downloaded_files_${uniqueKey4ThisRequst}`; // Directory to save the downloaded files

	await downloadFilesConcurrently(urls, saveDir);
	const mdPath = await readZipFilesToMarkdown(saveDir);

	const contentParts = await tokenizeAndSplitMarkdown(mdPath, perPage);

	const totalPages = contentParts.length

	// Select the requested page (part)
    const selectedContentPart = contentParts[page - 1] || '';

	res.json({
        contentParts: [selectedContentPart], // Return the selected part
        totalPages: totalPages,
        currentPage: page,
    });
});

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
