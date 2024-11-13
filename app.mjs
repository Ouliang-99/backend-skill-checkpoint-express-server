import express from "express";
import cors from "cors";
import questionRouter from "./routes/question.mjs";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = 4001;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "API for Question and Answer Interaction",
      description:
        "This API allows users to interact through questions and answers. It also supports voting on both questions and answers to facilitate engagement and interaction.",
      contact: {
        name: "GitHub Ouliang-99",
      },
      servers: ["http://localhost:4001"],
    },
  },
  apis: ["./routes/question.mjs", "app.mjs"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(express.json());
app.use("/questions", questionRouter);

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
