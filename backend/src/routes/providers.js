import express from "express"
import providersController from "../controllers/providersController.js"
import upload from "../utils/cloudinaryConfig.js"

const router = express.Router()

router.route("/")
.get(providersController.getAllProviders)
.post(upload.single("image"), providersController.insertProvider);

router.route("/:id")
.put(upload.single("image"), providersController.deleteProvider)
.delete(providersController.deleteProvider);

export default router;