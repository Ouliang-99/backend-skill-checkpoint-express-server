
# Question and Answer API

This is an API for a simple question and answer system. It allows users to create, read, update, and delete questions and answers, as well as interact with questions and answers through voting.

## Features

- **CRUD operations** for questions and answers: Create, retrieve, update, and delete questions and answers.
- **Search functionality**: Search questions by category and keywords.
- **Vote on questions and answers**: Users can upvote or downvote questions and answers.
- **Nested answers**: Each question can have multiple answers, and answers can also be voted on.

## Status Response

- **200 OK**: Returns matched questions.
- **404 Not Found**: No questions found.
- **500 Server Error**: Unable to process the request due to server error.

## Endpoints for Questions

### POST `/questions` 
_Create a new question._

**Request body:**

```json
{
  "title": "How to learn API?",
  "description": "Looking for resources to learn APIs.",
  "category": "Programming"
}
```

### GET `/questions`
_Retrieve all questions._

### GET `/questions/search`
_Search questions by category or keywords._

**Query parameters:**
- `category` (optional): Category to filter questions.
- `keywords` (optional): Search term to match in the question title or description. 

### GET `/questions/{question id}`
_Retrieve a single question by its ID._

### PUT `/questions/{question id}`
_Update an existing question by its ID._

**Request body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "Updated category"
}
```

### DELETE `/questions/{question id}`
_Delete a question by its ID._

### GET `/questions/{question id}/answers`
_Retrieve all answers for a specific question._

## Endpoints for Answers

### POST `/questions/{question id}/answers`
_Create a new answer for a specific question._

**Request body:**

```json
{
  "content": "This is an answer."
}
```

### DELETE `/questions/{question id}/answers`
_Delete all answers for a specific question._

## Endpoints for Voting

### PUT `/questions/{question id}/vote`
_Vote on a question._

**Request body:**

```json
{
  "vote": 1  // or -1
}
```

### PUT `/questions/answers/{answer id}/vote`
_Vote on an answer._

**Request body:**

```json
{
  "vote": 1  // or -1
}
```

---

## Setup Instructions

To set up this API for local development, follow the steps below:

### Prerequisites
Before you begin, make sure you have the following installed:

1. **Node.js** (version 14 or higher)
   - Download Node.js from [here](https://nodejs.org/).
   
2. **npm** (Node Package Manager)
   - npm comes bundled with Node.js, but if you need to install it separately, visit [npm](https://www.npmjs.com/get-npm).

3. **PostgreSQL** (or any compatible relational database)
   - Install PostgreSQL from [here](https://www.postgresql.org/download/).
   - You need to have a database set up for the API to interact with.

4. **Git** (optional, for cloning the repository)
   - If you don't have Git installed, download it from [here](https://git-scm.com/).

### 1. Clone the repository
Clone the repository to your local machine:

```bash
git clone https://github.com/Ouliang-99/backend-skill-checkpoint-express-server.git
```

### 2. Navigate to the project folder
Go to the project folder:

```bash
cd backend-skill-checkpoint-express-server
```

### 3. Install dependencies
Install the necessary dependencies:

```bash
npm install
```

### 4. Set up the environment variables
Create a `.env` file in the root directory or copy `.env.example` to `.env` and modify the settings according to your configuration.

Here is an example of the required environment variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
```

### 5. Set up the database
Set up PostgreSQL and create a database for the application:

```sql
CREATE DATABASE your-db-name;
```

### 6. Start the server
Once the setup is complete, you can start the server:

```bash
npm run start
```

This will start the server at `http://localhost:4001`. You can now test the API using tools like Postman or Swagger at `http://localhost:4001/api-docs`.

### 7. Test the API
You can test the API endpoints using:

- **Postman**: Import the API documentation or manually test each endpoint.
- **Swagger UI**: Access the Swagger UI at `http://localhost:4001/api-docs` to interact with the API directly from your browser.

---

Feel free to fork this project and submit pull requests. If you encounter any issues or have suggestions for features, please open an issue!
