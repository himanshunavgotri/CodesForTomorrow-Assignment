import express from "express"
const router = express.Router();
import {getCitiesAnalytics, getCityAnalytics} from '../controllers/weatherController'

router.post("/cities", getCitiesAnalytics)
router.get("/city/:name", getCityAnalytics)

export default router;