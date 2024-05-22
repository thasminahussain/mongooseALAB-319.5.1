import express, { response } from "express";
import db from "../db/conn.js";
import Grades from "../model/Grades.js"
import mongoose from "mongoose";

const router = new express.Router();

// get all users
router.get("/", async(req, res) => {
  
  try {
    const grades = await Grades.find(); 
    res.send(grades);

  } 
  
  catch (error) {
    console.log(error);
    res.send({error: 'Error, invalid data!'})
  }
}); 

// Create a single grade entry
router.post("/", async (req, res) => {

  try {
    const newDocument= await Grades.create(req.body)
    res.send(newDocument);
    
  } 

  catch (error) {

    console.log(error);
    
  }
});

// get user by id
router.get("/:id", async (req, res) => {

  try {
    const gradeexists = await Grades.findById(req.params.id); 

    if (!gradeexists) {
      res.send("Grade with the given id doesn't exist!")
    }
  
    else {
      res.send(gradeexists); 
    }
  } 
  catch (error) {
    console.log(error);
  }
}); 

// add a score to a grade entry
router.patch("/:id", async(req, res) => {
  try {
    const gradeExists = await Grades.findById(req.params.id); 
    if (!gradeExists) {
      res.send("Invalid ID!");
    }
    else {
      const add = {$push: {scores: req.body}}
      const addGrade = await Grades.findByIdAndUpdate(req.params.id, add, {new: true});
      res.send(addGrade)
    }
  } 
  catch (error) {
    console.log(error);
  }
});

//remove a score from the grade entry. ONLY WORKS ON ID 
router.patch("/remove/:id", async(req, res) => {
  try {
    const gradeExists = await Grades.findById(req.params.id); 

    if (!gradeExists) {
      return res.send("Invalid ID!"); 
    }

    else {
      
      await gradeExists.scores.pull(req.body._id); 
      res.send(gradeExists); 
    }
  } 
  catch (error) {
    console.log(error);
  }
}); 

// this is a better method to remove 
router.patch("/delete/:id", async(req, res) => {
  try {
    const gradeExists = await Grades.findById(req.params.id); 

    if (!gradeExists) {
      return res.send("Invalid ID!"); 
    }

    else {
      const remove = {$pull: {scores: req.body}}; 
      const updateGrade = await Grades.findByIdAndUpdate(req.params.id, remove, {new: true}); 
      res.send(updateGrade); 

    }
  } 
  catch (error) {
    console.log(error);
  }
}); 

// delete a single grade entry
router.delete("/:id", async (req, res) => {
  try {
    const gradeExists = await Grades.findById(req.params.id); 
    if (!gradeExists) {
      return res.send("Invalid ID!"); 
    }

    else {
      const gradesAfter = await Grades.findByIdAndDelete(req.params.id); 
      res.send("Successfully Deleted!"); 

    }
  } 
  catch (error) {
    console.log(error);
  }
}); 

// Get a student's grade data
router.get("/student/:id", async (req, res) => {

  try {
    const studentExists = await Grades.findById(req.params.id); 

    if (!studentExists) {
      return res.send("Student does not exist!"); 
    }
    else {
      const studentData = await Grades.findById(req.params.id).toArray(); 
      res.send(studentData); 
    }
  } 
  catch (error) {
    
  }

}); 



// // Get a learner's grade data
// router.get("/learner/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { learner_id: Number(req.params.id) };

//   // Check for class_id parameter
//   if (req.query.class) query.class_id = Number(req.query.class);

//   let result = await collection.find(query).toArray();

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// // Delete a learner's grade data
// router.delete("/learner/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { learner_id: Number(req.params.id) };

//   let result = await collection.deleteOne(query);

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// // Get a class's grade data
// router.get("/class/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { class_id: Number(req.params.id) };

//   // Check for learner_id parameter
//   if (req.query.learner) query.learner_id = Number(req.query.learner);

//   let result = await collection.find(query).toArray();

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// // Update a class id
// router.patch("/class/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { class_id: Number(req.params.id) };

//   let result = await collection.updateMany(query, {
//     $set: { class_id: req.body.class_id },
//   });

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// // Delete a class
// router.delete("/class/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { class_id: Number(req.params.id) };

//   let result = await collection.deleteMany(query);

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

export default router;
