# GitHub Contribution Calendar Widget

Welcome to the GitHub Contribution Calendar Widget! This widget allows you to display a GitHub-like contribution calendar on your website, showcasing a user's activity over the past year.

## Frontend Usage (github_calendar_widget.js)

To include the GitHub Contribution Calendar Widget on your webpage, follow these steps:

1. **Include the Script:**

   Add the following script tag to the `<head>` section of your HTML file. This will include the GitHub Contribution Calendar Widget script hosted on jsDelivr.

   ```html
   <script defer src="https://cdn.jsdelivr.net/gh/imananoosheh/github-contributions-fetch@latest/github_calendar_widget.js"></script>
   ```

2. **Create a Container:**

   Add a container `<div>` in the body of your HTML to hold the calendar. Provide an `id` for the container and specify the GitHub username using the `username` attribute:

   ```html
   <div id="calendar-component" username="github-username"></div>
   ```

3. **Customization (Optional):**

   You can customize the appearance of the calendar by adding optional attributes to the container `<div>`. For example, to set the theme color, use the `theme-color` attribute:

   ```html
   <div id="calendar-component" username="github-username" theme-color="#4285f4"></div>
   ```

   Available attributes:
   - `theme-color`: The main color of the calendar.
   - `background-color`: The background color of the calendar.

## Backend Deployment (server.js)

If you want to deploy the backend server on your own server, follow these steps:

1. **Clone the Repository:**

   Clone this repository to your server:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```

2. **Install Dependencies:**

   Navigate to the project folder and install the required dependencies:

   ```bash
   cd your-repo
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the project root and set your GitHub access token:

   ```env
   GITHUB_ACCESS_TOKEN=your-github-access-token
   SERVER_PORT=3000
   ```

4. **Start the Server:**

   Run the following command to start the Express server:

   ```bash
   npm start
   ```

   The server will be running on the specified port (default is 3000).

5. **API Endpoint:**

   Your API endpoint will be accessible at `http://your-server-domain-or-ip/github_calendar/:username`. Make sure to update your GitHub widget script with this URL.

---
Now, users can import your GitHub Contribution Calendar Widget script on their webpage and customize the appearance as needed. Additionally, you can deploy the backend server on your own server to provide the necessary data. Happy coding!
