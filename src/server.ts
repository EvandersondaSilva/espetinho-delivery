import cors from "cors";
import "dotenv/config";
import express, { NextFunction } from "express";
import routes from "./routes";
import { Request, Response } from "express";

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

app.use((error: Error, _: Request, res: Response, _next: NextFunction) => {
    if (error instanceof Error) {
        return res.status(400).json({
            error: error.message
        })
    }

    return res.status(500).json({
        error: "Internal server error!"
    })
})

const PORT = process.env.PORT! || 3333;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/", (_: Request, res: Response) => {
    res.send("API rodando 🚀");
});

