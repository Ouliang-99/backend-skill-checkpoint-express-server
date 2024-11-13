const validateAnswer = (req, res, next) => {
    if (!req.body.content) {
      return res.status(400).json({
        message: "Content is required for the answer.",
      });
    }
  
    if (req.body.content.length > 300) {
      return res.status(400).json({
        message: "Answer content must be less than 300 characters.",
      });
    }
  
    next();
  };
  
  export default validateAnswer;
  