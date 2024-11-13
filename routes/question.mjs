import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import validateQuestion from "../middlewares/questions.validation.mjs";
import validateAnswer from "../middlewares/answers.validate.mjs";
import validateVote from "../middlewares/vote.validate.mjs";

const questionRouter = Router();

/**
 * @swagger
 * /questions:
 *   post:
 *     description: Create a question
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: "What is the capital of France?"
 *             description:
 *               type: string
 *               example: "This is a basic geography question asking about the capital city of France."
 *             category:
 *               type: string
 *               example: "Geography"
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
questionRouter.post("/", [validateQuestion], async (req, res) => {
  try {
    const newQuestion = { ...req.body };

    const result = await connectionPool.query(
      "INSERT INTO questions (title, description, category) VALUES ($1, $2, $3)",
      [newQuestion.title, newQuestion.description, newQuestion.category]
    );

    return res.status(201).json({
      message: "Question created successfully.",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Unable to create question.",
    });
  }
});

/**
 * @swagger
 * /questions:
 *   get:
 *     description: Fetch all questions from the database.
 *     responses:
 *       200:
 *         description: A list of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "How to learn API?"
 *                       description:
 *                         type: string
 *                         example: "I want to know the best resources to learn API."
 *                       category:
 *                         type: string
 *                         example: "Programming"
 *       404:
 *         description: No questions found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question not found."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to fetch questions."
 */
questionRouter.get("/", async (req, res) => {
  try {
    const questionResult = await connectionPool.query(
      "SELECT * FROM questions"
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    return res.status(200).json({ data: questionResult.rows });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: `Unable to fetch questions.`,
    });
  }
});

/**
 * @swagger
 * /questions/search:
 *   get:
 *     description: Search questions by category or keywords
 *     parameters:
 *       - name: category
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: keywords
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of questions matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       category:
 *                         type: string
 *       404:
 *         description: No questions found matching the search criteria
 *       500:
 *         description: Server error
 */
questionRouter.get("/search", async (req, res) => {
  try {
    const category = req.query.category ? req.query.category.trim() : null;
    const keywords = req.query.keywords ? req.query.keywords.trim() : null;

    let query = "SELECT * FROM questions";
    let values = [];

    if (keywords && category) {
      query +=
        " WHERE category = $1 AND (title ILIKE $2 OR description ILIKE $2)";
      values = [category, `%${keywords}%`];
    } else if (keywords) {
      query += " WHERE (title ILIKE $1 OR description ILIKE $1)";
      values = [`%${keywords}%`];
    } else if (category) {
      query += " WHERE category = $1";
      values = [category];
    }

    const questionResult = await connectionPool.query(query, values);

    if (questionResult.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    return res.status(200).json({ data: questionResult.rows });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message:
        "Server could not read question because of a database connection issue",
    });
  }
});

/**
 * @swagger
 * /questions/{questionId}:
 *   get:
 *     description: Get a single question by ID
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     category:
 *                       type: string
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
questionRouter.get("/:questionId", async (req, res) => {
  const questionId = req.params.questionId;
  try {
    const questionResult = await connectionPool.query(
      "SELECT * FROM questions WHERE id = $1",
      [questionId]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    return res.status(200).json({ data: questionResult.rows[0] });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: `Unable to fetch questions.`,
    });
  }
});

/**
 * @swagger
 * /questions/{questionId}:
 *   put:
 *     description: Update an existing question by ID
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: "What is the capital of Germany?"
 *             description:
 *               type: string
 *               example: "Updated question asking about the capital city of Germany."
 *             category:
 *               type: string
 *               example: "Geography"
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
questionRouter.put("/:questionId", [validateQuestion], async (req, res) => {
  const questionIdFromClient = req.params.questionId;
  try {
    const newQuestion = { ...req.body };

    await connectionPool.query(
      "UPDATE questions SET title = $2 ,description = $3 ,category = $4 WHERE id = $1",
      [
        questionIdFromClient,
        newQuestion.title,
        newQuestion.description,
        newQuestion.category,
      ]
    );

    return res.status(200).json({
      message: `Updated question successfully`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: `Unable to fetch questions.`,
    });
  }
});

/**
 * @swagger
 * /questions/{questionId}:
 *   delete:
 *     description: Delete a question by ID
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
questionRouter.delete("/:questionId", async (req, res) => {
  const questionId = req.params.questionId;
  try {
    await connectionPool.query("DELETE FROM questions WHERE id = $1", [
      questionId,
    ]);

    return res.status(200).json({
      message: `Question post has been deleted successfully.`,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: `Unable to delete question.`,
    });
  }
});

/**
 * @swagger
 * /questions/{questionId}/answers:
 *   post:
 *     description: Add an answer to a question
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *               example: "The capital of France is Paris."
 *     responses:
 *       201:
 *         description: Answer created successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
questionRouter.post(
  "/:questionId/answers",
  [validateAnswer],
  async (req, res) => {
    const questionId = req.params.questionId;

    try {
      const questionResult = await connectionPool.query(
        "SELECT * FROM questions WHERE id = $1",
        [questionId]
      );

      if (questionResult.rows.length === 0) {
        return res.status(404).json({
          message: "Question not found.",
        });
      }

      const newAnswer = { ...req.body };

      await connectionPool.query(
        "INSERT INTO answers (question_id, content) VALUES ($1, $2)",
        [questionId, newAnswer.content]
      );

      return res.status(201).json({
        message: "Answer created successfully.",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Unable to create answers.",
      });
    }
  }
);

/**
 * @swagger
 * /questions/{questionId}/answers:
 *   get:
 *     description: Get answers for a question
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of answers for the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       content:
 *                         type: string
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
questionRouter.get("/:questionId/answers", async (req, res) => {
  const questionId = req.params.questionId;
  try {
    const answerResult = await connectionPool.query(
      "SELECT * FROM answers WHERE question_id = $1",
      [questionId]
    );

    if (answerResult.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    return res.status(200).json({ data: answerResult.rows[0] });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: `Unable to fetch questions.`,
    });
  }
});

/**
 * @swagger
 * /questions/{questionId}/answers:
 *   delete:
 *     description: Delete question with all answers for it
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Answers deleted successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
questionRouter.delete("/:questionId/answers", async (req, res) => {
  const questionId = req.params.questionId;

  try {
    const questionCheck = await connectionPool.query(
      "SELECT * FROM questions WHERE id = $1",
      [questionId]
    );

    if (questionCheck.rows.length === 0) {
      return res.status(404).json({
        message: `Question not found.`,
      });
    }

    await connectionPool.query("DELETE FROM answers WHERE question_id = $1", [
      questionId,
    ]);

    await connectionPool.query("DELETE FROM questions WHERE id = $1", [
      questionId,
    ]);

    return res.status(200).json({
      message: `All answers for the question have been deleted successfully.`,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: `Unable to delete answers.`,
    });
  }
});

/**
 * @swagger
 * /questions/{questionId}/vote:
 *   put:
 *     description: Vote on a question (must be number -1 or 1)
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             vote:
 *               type: integer
 *               example: choose -1 or 1
 *     responses:
 *       200:
 *         description: Vote recorded successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
questionRouter.put("/:questionId/vote", [validateVote], async (req, res) => {
  const questionIdFromClient = req.params.questionId;
  const vote = req.body.vote;

  try {
    const questionResult = await connectionPool.query(
      "SELECT * FROM questions WHERE id = $1",
      [questionIdFromClient]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({
        message: `Question not found.`,
      });
    }

    await connectionPool.query(
      "UPDATE question_votes SET vote = $1 WHERE question_id = $2",
      [vote, questionIdFromClient]
    );

    return res.status(200).json({
      message: `Vote on the question has been recorded successfully.`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Unable to vote question.",
    });
  }
});

/**
 * @swagger
 * /questions/answers/{answerId}/vote:
 *   put:
 *     description: Vote on an answer (must be number -1 or 1)
 *     parameters:
 *       - name: answerId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             vote:
 *               type: integer
 *               example: choose -1 or 1
 *     responses:
 *       200:
 *         description: Vote recorded successfully
 *       404:
 *         description: Answer not found
 *       500:
 *         description: Server error
 */
questionRouter.put(
  "/answers/:answerId/vote",
  [validateVote],
  async (req, res) => {
    const answerIdFromClient = req.params.answerId;
    const vote = req.body.vote;

    try {
      const answerResult = await connectionPool.query(
        "SELECT * FROM answers WHERE id = $1",
        [answerIdFromClient]
      );

      if (answerResult.rows.length === 0) {
        return res.status(404).json({
          message: `Answer not found.`,
        });
      }

      await connectionPool.query(
        "UPDATE answer_votes SET vote = $1 WHERE answer_id = $2",
        [vote, answerIdFromClient]
      );

      return res.status(200).json({
        message: `Vote on the Answer has been recorded successfully.`,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Unable to vote Answer.",
      });
    }
  }
);

export default questionRouter;
