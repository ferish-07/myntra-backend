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
  } else {
    await Counter.create({
      unique_id: 1,
      category_id: 100,
    });
    counter_id = 100;
  }
  console.log("----------------------------", category_name, counter_id);
  await MainCategory.create({
    category_id: counter_id,
    category_name: category_name,
  })
    .then(() => {
      console.log("---");
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
    // {
    //   $addFields: {
    //     "sections.sub_sections": {
    //       $ifNull: ["$sub_sections", []],
    //     },
    //   },
    // },

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

  console.log("--arrrr-", JSON.stringify(array));
  res.send({
    error_status: false,
    message: "Data Fetched Successfully",
    data: array,
  });
});

//DELETE

router.post("/delete/section", async (req, res) => {
  const { category_id } = req.body;

  let category = await MainCategory.findOne({ category_id: category_id });

  if (category) {
    await MainCategory.deleteOne({ category_id: category_id })
      .then(() => {
        return res.send({
          error_status: false,
          message: "Data Deleted Successfully",
        });
      })
      .catch((err) => {
        console.log("0-------errr Delete brand", err);
        return res.send({
          error_status: true,
          message: "Something Went Wrong",
        });
      });
  } else {
    return res.send({
      error_status: true,
      message: "Brand Not found",
    });
  }
});

module.exports = router;
