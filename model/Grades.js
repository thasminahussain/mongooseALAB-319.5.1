import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
    type: {
        type: String, 
        required: true
    }, 

    score: {
        type: Number,
        required: true
    }

}); 

const gradeSchema = new mongoose.Schema({

    student_id : {
        type: Number,
        required: true
    },
    scores: {
        type: [scoreSchema],
        required: true
    }, 
    class_id: {
        type: Number,
        required: true
    }
}); 

export default new mongoose.model("Grades", gradeSchema); 