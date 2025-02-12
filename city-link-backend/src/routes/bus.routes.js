import express from "express";
import AppError from "../utils/error.utils.js";
import { Bus } from "../models/bus.model.js";

const busRouter = express.Router();

busRouter.post("/add-bus", async (req, res, next) => {
    try {
        const { busNo, routes, time } = req.body;

        if (!busNo || !routes || !time) {
            return next(new AppError("Please provide busNo, routes and time.", 400));
        }

        const bus = await Bus.create({
            busNo,
            routes,
            time,
        });

        res.status(201).json({
            success: true,
            data: bus,
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
});

busRouter.get("/searchBuses", async (req, res, next) => {
    try {
        const { source, destination } = req.query;
    
        if (!source || !destination) {
          return res
            .status(400)
            .send('Please provide both source and destination query parameters.');
        }
    
        const buses = await Bus.aggregate([
          {
            $addFields: {
              sourceIndex: { $indexOfArray: ['$routes', source] },
              destinationIndex: { $indexOfArray: ['$routes', destination] },
            },
          },
          {
            $match: {
              sourceIndex: { $gte: 0 },
              destinationIndex: { $gte: 0 },
              $expr: { $lt: ['$sourceIndex', '$destinationIndex'] },
            },
          },
        ]);
    
        res.status(200).json({ 
            success: true,
            data: buses,
        });
      } catch (error) {
        return next(new AppError(error.message, 400));
      }
});

export default busRouter;
