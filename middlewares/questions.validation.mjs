const validateQuestion = (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).json({
      message: "Title is required",
    });
  } else if (typeof req.body.title !== "string") {
    return res.status(400).json({
      message: "Invalid request data. : Title must be a string",
    });
  }

  if (!req.body.description) {
    return res.status(400).json({
      message: "Invalid request data. : Description is required",
    });
  } else if (typeof req.body.description !== "string") {
    return res.status(400).json({
      message: "Invalid request data. : Description must be a string",
    });
  }

  if (!req.body.category) {
    return res.status(400).json({
      message: "Invalid request data. : Category is required",
    });
  } else if (typeof req.body.category !== "string") {
    return res.status(400).json({
      message: "Invalid request data. : Category must be a string",
    });
  }

  next();
};

export default validateQuestion;
