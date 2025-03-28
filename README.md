Centralized Tech Blog Backend

A backend system for aggregating and categorizing blog articles from major software companies. This system organizes content by topics such as AI, Software Engineering, Backend, DevOps, Cloud, and more.

Features

Fetches blog articles from top tech companies.

Categorizes articles by content topics.

Provides API endpoints to retrieve categorized blogs.

Built with Node.js, Express, MongoDB (or other backend stack).

Supports REST API for frontend integration.

Installation

1️⃣ Clone the Repository

git clone https://github.com/yourusername/centralized-tech-blog.git
cd centralized-tech-blog

2️⃣ Install Dependencies

npm install  # or yarn install

3️⃣ Set Up Environment Variables

Create a .env file in the root directory and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

4️⃣ Start the Server

npm start  # or nodemon server.js

API Endpoints

📝 Get All Blogs

GET /api/blogs

Response:

[
  {
    "title": "Uber's Advanced Settlement Accounting System",
    "link": "https://www.uber.com/en-IN/blog/...",
    "author": "Unknown",
    "publishedDate": "2024-10-24",
    "categories": "Backend"
  }
]

🔍 Get Blogs by Category

GET /api/blogs?category=AI

Response: Blogs filtered by AI.
