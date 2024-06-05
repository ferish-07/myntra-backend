const express = require("express");
const Counter = require("../modals/Counter");
const Brands = require("../modals/Brands");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { brand_name } = req.body;
  console.log("---HITT-");
  let brand = await Brands.findOne({
    brand_name: { $regex: new RegExp(`^${brand_name}$`, "i") },
  });
  if (brand) {
    return res.send({
      error_status: true,
      message: `Brand with brand name: ${brand_name.toLowerCase()} already exits`,
    });
  }

  const counter = await Counter.findOne({ unique_id: 1 });
  let counter_id;
  if (counter) {
    await Counter.findByIdAndUpdate(
      counter._id,
      { $inc: { brand_id: 1 } },
      { new: true, upsert: true }
    ).then((res) => (counter_id = res.brand_id));
  } else {
    await Counter.create({
      unique_id: 1,
      //   sequence_value: 100,
      //   category_id: 100,
      //   section_id: 100,
      //   sub_section_id: 100,
      brand_id: 1,
    });
    counter_id = 1;
  }

  await Brands.create({
    brand_id: counter_id,
    brand_name: brand_name,
  })
    .then(() =>
      res.send({ error_status: false, message: "Data Added Successfully" })
    )
    .catch((errr) => {
      console.log("--errrrrrrrrrr brand counter--", errr);
      res.send({ error_status: true, message: "Something went wrong" });
    });

  //   console.log("----COUNTER--", counter, brand_name, counter_id);
});

router.post("/delete", async (req, res) => {
  const { brand_id } = req.body;

  let brand = await Brands.findOne({ brand_id: brand_id });

  if (brand) {
    await Brands.deleteOne({ brand_id: brand_id })
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
