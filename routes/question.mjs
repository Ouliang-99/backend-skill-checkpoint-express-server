import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import validateQuestion from "../middlewares/questions.validation.mjs";

const questionRouter = Router();

questionRouter.post("/", [validateQuestion], async (req, res) => {
  try {
    const newQuestion = {
      ...req.body,
    };

    const result = await connectionPool.query(
      "INSERT INTO questions (title, description, category) VALUES ($1, $2, $3) RETURNING id",
      [newQuestion.title, newQuestion.description, newQuestion.category]
    );

    const createdQuestionId = result.rows[0].id;

    return res.status(201).json({
      message: `Created question id (${createdQuestionId}) successfully`,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message:
        "Server could not create question id (${createdQuestionId}) because of a database connection issue",
    });
  }
});

questionRouter.get("/", async (req, res) => {
  try {
    const questionResult = await connectionPool.query(
      "SELECT * FROM questions"
    );
    return res.status(200).json(questionResult.rows);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: `Server could not read question id (${questionId}) because database connection issue`,
    });
  }
});

questionRouter.get("/:questionId", async (req, res) => {
  const questionId = req.params.questionId;
  try {
    const questionResult = await connectionPool.query(
      "SELECT * FROM questions WHERE id = $1",
      [questionId]
    );
    return res.status(200).json(questionResult.rows[0]);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: `Server could not read question id (${questionId}) because database connection issue`,
    });
  }
});

questionRouter.put("/:questionId", [validateQuestion], async (req, res) => {
  const questionIdFromClient = req.params.questionId;
  try {
    const newQuestion = {
      ...req.body,
    };

    await connectionPool.query(
      "UPDATE questions SET title = $2 ,description = $3 ,category = $4 where id = $1",
      [
        questionIdFromClient,
        newQuestion.title,
        newQuestion.description,
        newQuestion.category,
      ]
    );

    return res.status(201).json({
      message: `Updated question id (${questionId}) successfully`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: `Server could not update question id (${questionId}) because database connection`,
    });
  }
});

questionRouter.delete("/:questionId", async (req, res) => {
  const questionId = req.params.questionId;
  try {
    await connectionPool.query("DELETE FROM questions WHERE id = $1", [
      questionId,
    ]);
    return res.status(200).json({
      message: `Deleted question id (${questionId}) successfully`,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: `Server could not delete question id (${questionId}) because database connection issue`,
    });
  }
});

export default questionRouter;
