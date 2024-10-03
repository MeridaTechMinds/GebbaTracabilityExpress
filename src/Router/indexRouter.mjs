import { Router } from "express";
import { userRouter } from "./userRouter.mjs";
import { orderRouter } from "./orderRouter.mjs";
import { machineryRouter } from "./machinerayRouter.mjs";
import { stageNameRouter } from "./stageNameRouter.mjs";

export const indexRouter = Router()


indexRouter.use(userRouter)
indexRouter.use(orderRouter)
indexRouter.use(machineryRouter)
indexRouter.use('/stageName', stageNameRouter)