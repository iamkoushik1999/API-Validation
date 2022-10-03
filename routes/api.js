const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const StudentModel = require("../models/student");
const multer = require("multer");
const UserModel = require("../models/user");
const bcryptJs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");

mongoose
  .connect("mongodb://127.0.0.1:27017/testDb", {
    useNewUrlParser: true,
    useUnifiedtopology: true,
  })
  .then(() => {
    console.log("mongoDb connected");
  })
  .catch((err) => {
    console.log(err);
  });

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    let ext = file.mimetype.split("/");
    cb(null, Date.now() + "." + ext[1]);
  },
  destination: "public/uploads/",
});

const upload = multer({ storage: storage });

//for image upload
router.post("/upload", upload.single("img"), (req, res) => {
  res.status(202).json({
    userInfo: {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
    },
    status: true,
    iPath: "http://localhost:4000/uploads/" + req.file.filename,
  });
});

// CRUD

router.post("/addStudent", checkAuth, (req, res) => {
  let newStudentModel = new StudentModel();
  newStudentModel.name = req.body.name;
  newStudentModel.age = req.body.age;
  newStudentModel.add = req.body.add;
  newStudentModel.class1 = req.body.class1;

  newStudentModel
    .save()
    .then(() => {
      res.status(200).json({ message: "Student Data Added", status: true });
    })
    .catch((err) => {
      res.status(400).json({ err: err, status: false });
    });
});

router.get("/getStudentDetails", checkAuth, (req, res) => {
  StudentModel.find({})
    .then((data) => {
      res.status(200).json({ studentList: data, status: true });
    })
    .catch((err) => {
      res.status(400).json({ err: err, status: false });
    });
});

// get particular data using _ID field
router.get("/getStudentDetailsById/:id", checkAuth, (req, res) => {
  StudentModel.findById(req.params.id)
    .exec()
    .then((data) => {
      res.status(200).json({ studentList: data, status: true });
    })
    .catch((err) => {
      res.status(400).json({ err: err, status: false });
    });
});

//PUT
router.put("/updateStudent/:id", checkAuth, (req, res) => {
  StudentModel.findByIdAndUpdate(req.params.id, {
    $set: {
      name: req.body.name,
      age: req.body.age,
      class1: req.body.class1,
      add: req.body.add,
    },
  })
    .then(() => {
      res.status(200).json({ message: "student data updated", status: true });
    })
    .catch((err) => {
      res.status(400).json({ err: err, status: false });
    });
});

//PATCH
router.patch("/updateStudent/:id", checkAuth, (req, res) => {
  console.log(req.body, req.params.id);
  StudentModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .then(() => {
      res.status(200).json({ message: "Student Data Updated", status: true });
    })
    .catch((err) => {
      res.status(400).json({ err: err, status: false });
    });
});

//Delete
router.delete("/deleteStudent/:id", checkAuth, (req, res) => {
  StudentModel.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({ message: "Student Data Deletedd", status: true });
    })
    .catch((err) => {
      res.status(400).json({ err: err, status: false });
    });
});

// for user signUp
router.post("/userAdd", (req, res) => {
  let password = req.body.password;
  let name = req.body.name;

  let newUserModel = new UserModel();
  newUserModel.name = name;
  newUserModel.email = req.body.email;
  let saltRounds = 12;

  bcryptJs.genSalt(saltRounds, (err, salt) => {
    bcryptJs.hash(password, salt, (err, hash) => {
      newUserModel.password = hash;
      newUserModel
        .save()
        .then(() => {
          res
            .status(200)
            .json({
              message: `Dear ${name} SignUp Successfully`,
              status: true,
            });
        })
        .catch((err) => {
          res.status(200).json({ message: err, status: false });
        });
    });
  });
});

// for LogIn
router.post("/userLogin", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  UserModel.findOne({ email: email }).then((user) => {
    if (user === null) {
      res
        .status(400)
        .json({
          message: "user not found in our system. please signup",
          status: false,
        });
    } else {
      const hashPass = user.password;
      bcryptJs.compare(password, hashPass, (err, result) => {
        if (result) {
          const token = jwt.sign(
            {
              userName: user.name,
              userEmail: user.email,
            },
            "mernStack",
            { expiresIn: "1h" }
          );
          console.log(user);
          res
            .status(202)
            .json({
              message: "Logged in successfully",
              name: user.name,
              email: user.email,
              status: true,
              token: token,
            });
        } else {
          res.status(400).json({ message: "Invalid password", status: false });
        }
      });
    }
  });
});

module.exports = router;
