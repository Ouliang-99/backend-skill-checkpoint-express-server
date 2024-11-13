import express from "express";
import cors from "cors"
import questionRouter from "./routes/question.mjs";

const app = express();
const port = 4001;

app.use(cors());
app.use(express.json());
app.use("/questions", questionRouter);

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
