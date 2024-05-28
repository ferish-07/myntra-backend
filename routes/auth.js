const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../modals/User");
const Counter = require("../modals/Counter");
const { body, validationResult } = require("express-validator");
const Token = require("../modals/Token");
const JWT_SECRET = "CLONE_MYNTRA";

//REGISTER
router.post(
  "/register",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isStrongPassword(),
    body("phone", "Please Enter Valid Phone Number").isLength({ min: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let error_msg = "";
      errors.array().map((i) => {
        if (error_msg.length == 0) {
          error_msg = i.msg;
        } else {
          error_msg = error_msg + "," + i.msg;
        }
      });
      return res.status(400).json({ errors: error_msg });
    }

    let listCounters = await Counter.findOne({ unique_id: 1 });
    let seq_id;
    if (listCounters) {
      await Counter.findByIdAndUpdate(
        listCounters._id,
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      ).then((response) => {
        seq_id = response.sequence_value;
      });
    } else {
      await Counter.create({
        unique_id: 1,
        sequence_value: 100,
        category_id: 100,
        section_id: 100,
        sub_section_id: 100,
      });
      seq_id = 100;
    }

    try {
      let isUser = await User.findOne({ email: req.body.email });
      if (isUser) {
        return res.send({
          error_status: true,
          message: "User with email id Already exists",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password, salt);
        await User.create({
          user_id: seq_id,
          user_name: req.body.full_name,
          password: securePassword,
          email: req.body.email,
          phone_number: req.body.phone,
          user_category: "USER",
        })
          .then((response) => {
            return res.send({
              error_status: false,
              messgae: "User registered Successfull",
            });
          })
          .catch((err) => {
            return res.send({
              error_status: true,
              message: err,
            });
          });
      }
    } catch (error) {
      console.log("--------registration error----", error);
      return res.send({
        error_status: true,
        messgae: "Some technical error occurred",
      });
    }
  }
);

//LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user_details = await User.findOne({ email: email });

  console.log("----------userDetails----", user_details);
  if (!user_details) {
    return res.send({
      error_status: true,
      message: "User with this email/phone number doesn't exists",
    });
  }

  const passwordCompare = await bcrypt.compare(password, user_details.password);
  if (!passwordCompare) {
    return res.send({
      error_status: true,
      message: "Invalid email or Password",
    });
  }

  res.send({
    error_status: false,
    message: "Login Successfull",
    user_details: await User.findOne({ email: email }).select(
      "-__v -_id -password"
    ),
  });

  const jwt_data = {
    user: {
      id: User.user_id,
    },
  };
  const authToken = jwt.sign(jwt_data, JWT_SECRET, { expiresIn: "1h" });
  let tokens = await Token.findOne({ user_id: user_details.user_id });

  if (tokens) {
    await Token.updateOne(
      { user_id: user_details.user_id },
      { $set: { auth_token: authToken } }
    );
  } else {
    await Token.create({
      user_id: user_details.user_id,
      user_name: user_details.user_name,
      auth_token: authToken,
    });
  }
});

module.exports = router;
