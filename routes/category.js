const express = require("express");
const Counter = require("../modals/Counter");
const MainCategory = require("../modals/MainCategory");
const Section = require("../modals/Section");
const SubSection = require("../modals/SubSection");
const router = express.Router();

router.post("/add/main/category", async (req, res) => {
  const { category_name } = req.body;
  console.log(category_name);
  const counter = await Counter.findOne({ unique_id: 1 });
  let counter_id;
  if (counter) {
    await Counter.findByIdAndUpdate(
      counter._id,
      { $inc: { category_id: 1 } },
      { new: true, upsert: true }
    ).then((res) => {
      counter_id = res.category_id;
    });
  }
  console.log("----------------------------", category_name);
  await MainCategory.create({
    category_id: counter_id,
    category_name: category_name,
  })
    .then(() => {
      return res.send({
        error_status: false,
        message: "Data inserted Successfully",
      });
    })
    .catch((err) => {
      console.log("-------err----", err);
      return res.send({
        error_status: true,
        message: "Technical error occured",
      });
    });
});

router.post("/add/section", async (req, res) => {
  const { category_id, section_name, column_number } = req.body;

  const counter = await Counter.findOne({ unique_id: 1 });
  let counter_id;
  if (counter) {
    await Counter.findByIdAndUpdate(
      counter._id,
      { $inc: { section_id: 1 } },
      { new: true, upsert: true }
    ).then((res) => {
      counter_id = res.section_id;
    });
  }

  await Section.create({
    section_id: counter_id,
    section_name: section_name,
    category_id: category_id,
    column_no: column_number,
  })
    .then(() => {
      return res.send({
        error_status: false,
        message: "Data inserted successfully",
      });
    })
    .catch((err) => {
      console.log("-------err----", err);
      return res.send({
        error_status: true,
        message: "Technical error occured",
      });
    });
});

router.post("/add/sub/section", async (req, res) => {
  const { category_id, sub_section_name, section_id } = req.body;

  const counter = await Counter.findOne({ unique_id: 1 });
  let counter_id;
  if (counter) {
    await Counter.findByIdAndUpdate(
      counter._id,
      { $inc: { sub_section_id: 1 } },
      { new: true, upsert: true }
    ).then((res) => {
      counter_id = res.sub_section_id;
    });
  }

  await SubSection.create({
    sub_section_id: counter_id,
    sub_section_name: sub_section_name,
    section_id: section_id,
    category_id: category_id,
  })
    .then(() => {
      return res.send({
        error_status: false,
        message: "Data inserted successfully",
      });
    })
    .catch((err) => {
      console.log("-------err----", err);
      return res.send({
        error_status: true,
        message: "Technical error occured",
      });
    });
});

router.get("/getSectionData", async (req, res) => {
  let array = await MainCategory.aggregate([
    {
      $lookup: {
        from: "section_masters",
        localField: "category_id",
        foreignField: "category_id",
        as: "sections",
      },
    },
    {
      $unwind: {
        path: "$sections",
        preserveNullAndEmptyArrays: true, // Preserve documents without sections
      },
    },

    {
      $lookup: {
        from: "sub_section_masters",
        localField: "sections.section_id",
        foreignField: "section_id",
        as: "sections.sub_sections",
      },
    },

    {
      $group: {
        _id: "$_id",
        category_id: { $first: "$category_id" },
        category_name: { $first: "$category_name" },
        sections: { $push: "$sections" },
      },
    },
    { $sort: { category_id: 1 } },
  ]);
  array.map((i) => {
    if (i.sections[0].sub_sections.length == 0) {
      i.sections = [];
    }
  });
  res.send({
    error_status: false,
    message: "Data Fetched Successfully",
    data: array,
  });
});

module.exports = router;