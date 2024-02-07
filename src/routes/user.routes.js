import { Router } from "express";

import * as userController from "../controllers/user.controller"
// controllers user

const router = Router();

router.get("/", userController.getAllUsers);

router.get("/:user", userController.findOneUser);

router.post("/login", userController.loginUser);

router.post("/", userController.createUser);

router.delete("/:id", userController.deleteUser)

export default router;