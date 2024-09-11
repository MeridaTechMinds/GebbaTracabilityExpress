import { Router } from "express";
import { userRouter } from "./userRouter.mjs";
import { orderRouter } from "./orderRouter.mjs";
import { machineryRouter } from "./machinerayModel.mjs";

export const indexRouter = Router()


indexRouter.use(userRouter)
indexRouter.use(orderRouter)
indexRouter.use(machineryRouter)
