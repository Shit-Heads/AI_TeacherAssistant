document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("gradeButton").addEventListener("click", uploadJsonFile);
    fetchSubmissions(); // Load existing submissions when the page loads
});


// ✅ Upload JSON file to Firestore
function uploadJsonFile() {
    const fileInput = document.getElementById("jsonFileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a JSON file.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch("/ai/submissions_view/upload-submission/", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Upload failed:", data.error);
            alert("Error uploading submission: " + data.error);
        } else {
            console.log("Upload successful:", data);
            alert("Submission uploaded successfully!");
            fetchSubmissions(); // Refresh submissions list
        }
    })
    .catch(error => console.error("Error uploading JSON:", error));
}

// ✅ Fetch all submissions from Firestore and display them
function fetchSubmissions() {
    fetch("/ai/submissions_view/get-submissions/")
        .then(response => response.json())
        .then(data => {
            if (data.submissions) {
                renderSubmissions(data.submissions);
            }
        })
        .catch(error => console.error("Error fetching submissions:", error));
}

// ✅ Render submissions in the UI
function renderSubmissions(submissions) {
    const submissionsContainer = document.getElementById("assignments-content");
    submissionsContainer.innerHTML = submissions.length > 0
        ? submissions.map(submission => `
            <div class="submission-card p-4 border rounded-lg shadow-md bg-white" data-id="${submission.id}">
                <div class="submission-details">
                    <h3 class="text-lg font-semibold">${submission.student_name}</h3>
                    <p><strong>Subject:</strong> ${submission.subject}</p>
                    <p><strong>Class:</strong> ${submission.class}</p>
                    <p><strong>Assignment:</strong> ${submission.assignment}</p>
                    <p><strong>Content:</strong> ${submission.content.substring(0, 150)}...</p>
                </div>
            </div>`).join("")
        : "<p class='text-gray-500'>No submissions available.</p>";
}

// ✅ Show grading modal
document.addEventListener("DOMContentLoaded", () => {
    const gradeButton = document.getElementById("gradeButton");
    const gradingModal = document.getElementById("gradingModal");
    const closeModal = document.getElementById("closeModal");
    const selectAllCheckbox = document.getElementById("selectAll");
    const submissionsList = document.getElementById("submissionsList");
    const submitGradingButton = document.getElementById("submitGrading");

    // Open modal when "Grade" button is clicked
gradeButton.addEventListener("click", () => {
    fetch("/ai/submissions_view/get-submissions/")
        .then(response => response.json())
        .then(data => {
            if (data.submissions) {
                submissionsList.innerHTML = data.submissions.map(submission => `
                    <div class="submission-item">
                        <div class="submission-info">
                            <h3 class="font-semibold">${submission.student_name}</h3>
                            <p><strong>Subject:</strong> ${submission.subject}</p>
                            <p><strong>Assignment:</strong> ${submission.assignment}</p>
                        </div>
                        <input type="checkbox" class="submission-checkbox" data-id="${submission.id}">
                    </div>
                `).join("");
                gradingModal.classList.remove("hidden");
            }
        })
        .catch(error => console.error("Error fetching submissions:", error));
});

// Update the "Select All" checkbox in the header too
const modalHeader = document.querySelector(".modal-header");
if (modalHeader && !modalHeader.querySelector(".select-all-container")) {
    const selectAllLabel = document.querySelector("label[for='selectAll']");
    const selectAllContainer = document.createElement("div");
    selectAllContainer.className = "select-all-container";
    
    // Move elements into the container if they exist
    if (selectAllLabel && selectAllCheckbox) {
        selectAllContainer.appendChild(selectAllCheckbox);
        selectAllContainer.appendChild(selectAllLabel);
        modalHeader.appendChild(selectAllContainer);
    }
}

    // Close modal
    closeModal.addEventListener("click", () => {
        gradingModal.classList.add("hidden");
    });

    // Handle "Select All" functionality
    selectAllCheckbox.addEventListener("change", (e) => {
        const checkboxes = document.querySelectorAll(".submission-checkbox");
        checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
    });

    // Submit selected assignments for grading
    submitGradingButton.addEventListener("click", () => {
        const selectedSubmissions = Array.from(document.querySelectorAll(".submission-checkbox:checked"))
            .map(checkbox => checkbox.dataset.id);

        if (selectedSubmissions.length === 0) {
            alert("Please select at least one submission.");
            return;
        }

        // Fetch submission data and send to AI grading endpoint
        Promise.all(selectedSubmissions.map(id => {
            return fetch(`/ai/submissions_view/get-submissions/`)
                .then(response => response.json())
                .then(data => data.submissions.find(submission => submission.id === id));
        })).then(submissions => {
            submissions.forEach(submission => {
                fetch("/ai/process_json/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(submission),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.error("Error grading submission:", data.error);
                    } else {
                        console.log("Grading successful:", data);
                    }
                })
                .catch(error => console.error("Error grading submission:", error));
            });

            alert("Grading process initiated for selected submissions.");
            gradingModal.classList.add("hidden");
        }).catch(error => console.error("Error fetching submission data:", error));
    });
});
