# GitHub Contributions Fetcher

This Node.js script fetches GitHub contribution data using the GitHub GraphQL API, saves it to a local file, and pushes the updated data to a specified GitHub repository. The script is useful for tracking GitHub contributions over time.

## Prerequisites

Before running the script, make sure you have the following:

- Node.js installed
- GitHub personal access token with the necessary permissions

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/imananoosheh/github-contributions-fetch.git
    cd github-contributions-fetch
    ```

2. Create a `.env` file in the root directory with the following content:

    ```bash
    GITHUB_ACCESS_TOKEN=your-github-token
    GITHUB_USERNAME=your-github-username
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Run the script:

    ```bash
    node fetch_push_automation.js /path/to/your/repository/
    ```

    Replace `/path/to/your/repository/` with the path to the local repository where you want to store the contribution data.

## Features

- Fetches GitHub contribution data using the GitHub GraphQL API.
- Saves the data to a local JSON file (`gh-contributions.json`).
- Commits and pushes the updated file to a specified GitHub repository.

## Notes

- The script uses the provided GitHub personal access token for authentication.
- Make sure to keep your access token and repository information secure.
- Adjust the script as needed for your specific use case.

## Automate with Cron (optional)

Optionally, you can schedule the script to run at specified intervals using `cron`. Follow these steps to add the script to your crontab:

1. Open your crontab configuration:

   ```bash
   crontab -e
   ```

2. Add the following line to run the script every 12 hours:

   ```bash
   0 0,12 * * * /path/to/node /path/to/your/repository/fetch_push_automation.js /path/to/your/repository/
   ```

   - Replace `/path/to/node` with the path to your Node.js executable (you can find it by running `which node`).
   - Replace `/path/to/your/repository/` with the path to the local repository where you want to store the contribution data.

   You can customize the cron schedule according to your preferences. Use [Crontab Guru](https://crontab.guru/) to help you generate cron schedule expressions.

3. Save the crontab file.

   Note: Ensure that the user running the cron job has the necessary permissions to execute the script and write to the specified directory.

Now, the script will run automatically at the scheduled intervals, updating your GitHub contributions data without manual intervention.

Feel free to adjust the instructions based on your preferences and the specific needs of your project.

## License

This project is licensed under the [MIT License](LICENSE).

Feel free to customize the README to include more details about your project or additional instructions based on your use case.
