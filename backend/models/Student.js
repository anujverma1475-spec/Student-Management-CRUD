const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true
    },

    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [1, "Age must be at least 1"],
        max: [100, "Age cannot be more than 100"]
    },

    course: {
        type: String,
        required: [true, "Course is required"],
        trim: true
    }

});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;