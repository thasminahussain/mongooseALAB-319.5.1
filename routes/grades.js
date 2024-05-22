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
router.post("/addGrade", async (req, res) => {

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
router.patch("/addScore/:id", async(req, res) => {
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
router.patch("/removeScore/:id", async(req, res) => {
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
router.patch("/deleteScore/:id", async(req, res) => {
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
router.delete("/deleteGrade/:id", async (req, res) => {
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
router.get("/student/:student_id", async (req, res) => {

  try {
    const studentExists = await Grades.find({student_id: req.params.student_id}); 

    // find always returns an empty array if the item is not found

    if (studentExists.length === 0) {
      return res.send("Student does not exist!"); 
    }
    else {
      res.send(studentExists); 
    }
  } 
  catch (error) {
    console.log(error);
  }

}); 

// Delete a learner's grade data
router.delete("/student/deleteGrade/:student_id", async(req, res) => {
  try {
    const studentExists = await Grades.find({student_id: req.params.student_id}); 

     // find always returns an empty array if the item is not found
    if (studentExists.length === 0) {
      return res.send("Student does not exist!"); 
    }

    else {
      const studentData = await Grades.deleteMany({student_id: req.params.student_id}); 
      res.send(studentData); 
    }
  } 
  
  catch (error) {
    console.log(error);
  }
}); 

// Get a class's grade data

router.get("/class/:class_id", async (req, res) => {
  try {

    const classExists = await Grades.find({class_id: req.params.class_id}); 
    
    
    // find always returns an empty array if the item is not found

    if (classExists.length === 0) {
      return res.send("Invalid ID!"); 
    }

    else {
      res.send(classExists); 
    }
    
  } 
  catch (error) {
    console.log(error);
  }
}); 

// Update a class id

router.patch("/class/updateClassID/:class_id", async(req, res) => {

  try {
    const classExists = await Grades.find({class_id: req.params.class_id}); 

    if (classExists.length === 0) {
      return res.send("Invalid ID!"); 
    }

    else {
      const update = {$set: {class_id: req.body.class_id}}
      const updateClass = await Grades.updateMany({class_id: req.params.class_id}, update, {new: true}); 
      res.send(updateClass); 
    }
  } 
  
  catch (error) {
    console.log(error);
  }
}); 

// Delete a class
router.delete("/class/deleteClass/:class_id", async (req, res) => {

  try {

    const classExists = await Grades.find({class_id: req.params.class_id}); 

    if (classExists.length === 0) {
      return res.send("Invalid ID!")
    }
    else {
      const deleteClass = await Grades.deleteMany({class_id: req.params.class_id}); 
      res.send("Succesfully deleted!")
    }
    
  } 
  
  catch (error) {
    console.log(error);
  }
}); 



export default router;
