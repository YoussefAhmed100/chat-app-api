import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);

    if (!document) {
      return next(new ApiError(`No document for this id: ${id}`, 404));
    }

    await document.deleteOne();
    res.status(200).json({ message: "Document deleted successfully" });
  });

export const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id: ${req.params.id}`, 404)
      );
    }

    await document.save();
    res.status(200).json({
      message: "Document updated successfully",
      data: document,
    });
  });

export const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

export const getOne = (Model, populationOption) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    let query = Model.findById(id);
    if (populationOption) {
      query = query.populate(populationOption);
    }

    const document = await query;
    if (!document) {
      return next(new ApiError(`No document for this id: ${id}`, 404));
    }

    res.status(200).json({ data: document });
  });

export const getAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }

    const countDocuments = await Model.countDocuments();

    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(countDocuments)
      .filter()
      .limitFields()
      .sort()
      .search();

    const { mongooseQuery, paginateResult } = apiFeatures;
    const document = await mongooseQuery;

    res.status(200).json({
      results: document.length,
      paginateResult,
      data: document,
    });
  });
