const API_URL = "http://localhost:5000/api/students";

const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");

const submitButton = studentForm.querySelector("button");

const message = document.getElementById("message");

let editingStudentId = null;


// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(text) {

    message.textContent = text;
    message.style.display = "block";

}


// ==========================================
// GET ALL STUDENTS
// ==========================================

async function getStudents() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch students");
        }

        const students = await response.json();

        console.log("Students received:", students);

        displayStudents(students);

    } catch (error) {

        console.error("Error fetching students:", error);

        showMessage("Failed to load students.");

    }

}


// ==========================================
// DISPLAY STUDENTS
// ==========================================

function displayStudents(students) {

    studentTableBody.innerHTML = "";

    students.forEach((student) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.age}</td>
            <td>${student.course}</td>

            <td>
                <button onclick="editStudent('${student._id}')">
                    Edit
                </button>

                <button onclick="deleteStudent('${student._id}')">
                    Delete
                </button>
            </td>
        `;

        studentTableBody.appendChild(row);

    });

}


// ==========================================
// ADD / UPDATE STUDENT
// ==========================================

studentForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    // Get form values

    const studentData = {

        name: document.getElementById("name").value.trim(),

        email: document.getElementById("email").value.trim(),

        age: Number(document.getElementById("age").value),

        course: document.getElementById("course").value.trim()

    };


    // ======================================
    // FRONTEND VALIDATION
    // ======================================

    if (!studentData.name) {

        showMessage("Please enter student name.");

        return;

    }


    if (!studentData.email) {

        showMessage("Please enter email.");

        return;

    }


    if (!studentData.age || studentData.age < 1 || studentData.age > 100) {

        showMessage("Age must be between 1 and 100.");

        return;

    }


    if (!studentData.course) {

        showMessage("Please enter course.");

        return;

    }


    try {

        let response;


        // ==================================
        // UPDATE STUDENT
        // ==================================

        if (editingStudentId) {

            response = await fetch(
                `${API_URL}/${editingStudentId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(studentData)
                }
            );

        }


        // ==================================
        // ADD STUDENT
        // ==================================

        else {

            response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(studentData)
                }
            );

        }


        // Check response

        if (!response.ok) {

            const errorData = await response.json();

            throw new Error(
                errorData.message || "Request failed"
            );

        }


        const data = await response.json();

        console.log("Server response:", data);


        // Show success message

        if (editingStudentId) {

            showMessage("Student updated successfully!");

        } else {

            showMessage("Student added successfully!");

        }


        // Reset form

        studentForm.reset();


        // Exit edit mode

        editingStudentId = null;


        // Change button text

        submitButton.textContent = "Add Student";


        // Reload students

        getStudents();

    } catch (error) {

        console.error("Error saving student:", error);

        showMessage(error.message);

    }

});


// ==========================================
// EDIT STUDENT
// ==========================================

async function editStudent(id) {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error("Failed to load student");

        }

        const students = await response.json();


        // Find selected student

        const student = students.find(
            (student) => student._id === id
        );


        if (!student) {

            showMessage("Student not found.");

            return;

        }


        // Put student data into form

        document.getElementById("name").value = student.name;

        document.getElementById("email").value = student.email;

        document.getElementById("age").value = student.age;

        document.getElementById("course").value = student.course;


        // Save student ID

        editingStudentId = id;


        // Change button text

        submitButton.textContent = "Update Student";

    } catch (error) {

        console.error("Error loading student:", error);

        showMessage("Failed to load student.");

    }

}


// ==========================================
// DELETE STUDENT
// ==========================================

async function deleteStudent(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this student?"
    );


    if (!confirmed) {

        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            const errorData = await response.json();

            throw new Error(
                errorData.message || "Delete failed"
            );

        }


        const data = await response.json();

        console.log(data);


        showMessage("Student deleted successfully!");


        // Reload table

        getStudents();

    } catch (error) {

        console.error("Error deleting student:", error);

        showMessage(error.message);

    }

}


// ==========================================
// LOAD STUDENTS WHEN PAGE OPENS
// ==========================================

getStudents();