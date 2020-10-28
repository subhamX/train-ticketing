import { Router } from "express";
import { verifyToken } from "../auth/verifyToken";
import db from "../db/index";

const app = Router();

app.get("/", verifyToken, (req, res) => {
  res.json({
    user_name: req.body.user_name,
    message: "Successfully logged into private route",
  });
});

export default app;
