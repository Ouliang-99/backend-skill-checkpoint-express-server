* Question and Answer API
    This is an API for a simple question and answer system. It allows users to create, read, update, 
and delete questions and answers, as well as interact with questions and answers through voting.

* Features
- CRUD operations for questions and answers: Create, retrieve, update, and delete questions and answers.
- Search functionality: Search questions by category and keywords.
- Vote on questions and answers: Users can upvote or downvote questions and answers.
- Nested answers: Each question can have multiple answers, and answers can also be voted on.

* Status Response:
200 OK: Returns matched questions.
404 Not Found: No questions found.
500 Server Error: Unable to process the request due to server error.

* Endpoints for questions

- POST /questions (Create a new question.)
example Request body:
{
  "title": "How to learn API?",
  "description": "Looking for resources to learn APIs.",
  "category": "Programming"
}

- GET /questions (Retrieve all questions.)

- GET /questions/search (Search questions by category or keywords.)
Query parameters:
category (optional): Category to filter questions.
keywords (optional): Search term to match in the question title or description. 

- GET /questions/{question id} (Retrieve a single question by its ID.)

- PUT /questions/ (Update an existing question by its ID.)
example Request body:
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "Updated category"
}

- DELETE /questions/{question id} (Delete a question by its ID.)

- GET /questions/{question id}/answers (Retrieve all answers for a specific question.)

* Endpoints for answers

- POST /questions/{question id}/answers
{Create a new answer for a specific question.}
example Request body:
{
  "content": "This is an answer."
}

- DELETE /questions/{question id}/answers (Delete all answers for a specific question.)

* Endpoints for Voting
- PUT /questions/{question id}/vote (Vote on a question.)
{
  "vote": must be number -1 //or 1
}

- PUT questions/answers/{answer id}/vote (Vote on an answer.)
Request body:
{
  "vote": must be number -1 //or 1
}

## Setup Instructions

To set up this API for local development, follow the steps below:

### Prerequisites
Before you begin, make sure you have the following installed:

1. **Node.js** (version 14 or higher)
   - You can download Node.js from [here](https://nodejs.org/).

2. **npm** (Node Package Manager)
   - npm comes bundled with Node.js, but if you need to install it separately, you can find it [here](https://www.npmjs.com/get-npm).

3. **PostgreSQL** (or any compatible relational database)
   - Install PostgreSQL from [here](https://www.postgresql.org/download/).
   - You need to have a database set up for the API to interact with.

4. **Git** (optional, for cloning the repository)
   - If you don't have Git installed, you can download it from [here](https://git-scm.com/).

### 1. Clone the repository
Start by cloning the repository to your local machine using the following command:

git clone https://github.com/Ouliang-99/backend-skill-checkpoint-express-server.git

2. Navigate to the project folder
Go into the project folder:

cd your-repository-name

3. Install dependencies
To install all necessary dependencies, run the following command:

npm install

This will install all the required Node.js packages listed in the package.json file.

4. Set up the environment variables
Create a .env file in the root directory of the project, or copy the .env.example file and modify it according to your setup.

Here’s an example of the variables you'll need to configure:
DB_HOST=localhost
DB_PORT=5432
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-db-name

5. Set up the database

6. Start the server
Once everything is set up, you can start the server using the following command:

npm run start (you can change it in file package.json line: 7 )

This will start the server on http://localhost:4001. You can now test the API using Postman or by visiting the Swagger API documentation at http://localhost:4001/api-docs to interact with the endpoints.

7. Test the API
You can test the API endpoints using tools like:

- Postman: Import the API documentation or manually test each endpoint.
- Swagger UI: Open the Swagger UI at http://localhost:4001/api-docs to interact with the API directly from your browser.

* Feel free to fork this project and submit pull requests. If you encounter any bugs or have feature suggestions, please open an issue!.