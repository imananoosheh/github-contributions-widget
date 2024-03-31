# GitHub Contribution Calendar Widget

Welcome to the GitHub Contribution Calendar Widget! This widget allows you to display a GitHub-like contribution calendar on your website, showcasing a user's activity over the past year. It also shows where you have gone beyond!

## Demo Screenshot

![Demo Screenshot Image](https://raw.githubusercontent.com/imananoosheh/github-contributions-fetch/main/Screenshot_2024-01-04_at_12-44-28_Iman_Anoosheh_Portfolio.png)

## Frontend Usage (github_calendar_widget.js)

To include the GitHub Contribution Calendar Widget on your webpage, follow these steps:

1. **Include the Script:**

   Add the following script tag to the `<head>` section of your HTML file. This will include the GitHub Contribution Calendar Widget script hosted on jsDelivr.

   ```html
   <script type="module" defer src="https://cdn.jsdelivr.net/gh/imananoosheh/github-contributions-fetch@latest/github_calendar_widget.js"></script>
   ```

2. **Create a Container:**

   Add a container `<div>` in the body of your HTML to hold the calendar. Provide an `id` for the container and specify the GitHub username using the `username` attribute:

   ```html
   <div id="calendar-component" username="<your-github-username>"></div>
   ```

3. **Customization (Optional):**

   You can customize the appearance of the calendar by adding optional attributes to the container `<div>`. For example, to set the theme color, use the `theme-color` attribute:

   ```html
   <div id="calendar-component" username="<your-github-username>" theme-color="#4285f4"></div>
   ```

   Available attributes:
   - `theme-color`: The main color of the calendar.
   - `background-color`: The background color of the calendar.

## Server Deployment (OPTIONAL - for curious developers!)

If you want to deploy the backend server on your own server, follow these steps:

1. **Configure Environment Variables:**

   Create a `.env` file in the project root and set your GitHub access token:

   ```env
   GITHUB_ACCESS_TOKEN=your-github-access-token
   SERVER_PORT=3003
   STATIC_DIR=/usr/src/app/public/
   ```

2. **Run install script**

   By running the `install.sh` a docker image will be built and run based on the latest version of GitHub Calendar Widget

   ```bash
   ./install.sh
   ```

3. **API Endpoint:**

   Your API endpoint will be accessible at `http://your-server-domain-or-ip/github_calendar/:username`. Make sure to update your GitHub widget script with this URL.

---
Now, you can deploy the backend server on your own server to provide the necessary data. Happy coding!
