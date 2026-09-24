const express = require("express");

const Student = require("../models/Student");

const router = express.Router();


// ==========================================
// CREATE STUDENT
// POST /api/students
// ==========================================

router.post("/", async (req, res) => {

    try {

        const student = await Student.create(req.body);

        res.status(201).json(student);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});


// ==========================================
// GET ALL STUDENTS
// GET /api/students
// ==========================================

router.get("/", async (req, res) => {

    try {

        const students = await Student.find();

        res.status(200).json(students);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch students",
            error: error.message
        });

    }

});


// ==========================================
// UPDATE STUDENT
// PUT /api/students/:id
// ==========================================

router.put("/:id", async (req, res) => {

    try {

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );


        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        res.status(200).json(student);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});


// ==========================================
// DELETE STUDENT
// DELETE /api/students/:id
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        const student = await Student.findByIdAndDelete(
            req.params.id
        );


        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        res.status(200).json({
            message: "Student deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete student",
            error: error.message
        });

    }

});


module.exports = router;