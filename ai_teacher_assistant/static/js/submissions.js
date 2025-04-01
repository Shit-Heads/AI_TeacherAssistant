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
                        <div class="flex items-center">
                            <input type="checkbox" class="submission-checkbox mr-2" data-id="${submission.id}">
                            <div>
                                <h3 class="font-semibold">${submission.student_name}</h3>
                                <p><strong>Subject:</strong> ${submission.subject}</p>
                                <p><strong>Assignment:</strong> ${submission.assignment}</p>
                            </div>
                        </div>
                    `).join("");
                    gradingModal.classList.remove("hidden");
                }
            })
            .catch(error => console.error("Error fetching submissions:", error));
    });

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
                <button class="view-button bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" data-id="${submission.id}" style="margin-top: 15px;">
                    View AI Grading
                </button>
            </div>`).join("")
        : "<p class='text-gray-500'>No submissions available.</p>";

    // Attach event listeners to "View" buttons
    document.querySelectorAll(".view-button").forEach(button => {
        button.addEventListener("click", (e) => {
            const submissionId = e.target.dataset.id;
            fetchAIDetails(submissionId);
        });
    });
}   

function fetchAIDetails(submissionId) {
    console.log("Fetching AI grading details for submission ID:", submissionId);
    fetch(`/ai/submissions_view/get-ai-grading/${submissionId}/`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Error fetching AI grading details: " + data.error);
                return;
            }
    
            // Populate the modal with AI grading details using the new structure
            document.getElementById("ai-student-name").textContent = data.student_name || "Unknown";
            document.getElementById("ai-subject").textContent = data.subject || "Unknown";
            document.getElementById("ai-assignment").textContent = data.assignment || "Unknown";
            document.getElementById("ai-content-score").textContent = data.content_knowledge_score || "N/A";
            document.getElementById("ai-analysis-score").textContent = data.analysis_score || "N/A";
            document.getElementById("ai-organization-score").textContent = data.organization_score || "N/A";
            document.getElementById("ai-plagiarism").textContent = data.plagiarism_percentage || "0";
            document.getElementById("ai-grade").textContent = data.suggested_grade || "N/A";
            document.getElementById("ai-feedback").textContent = data.suggested_feedback || "No feedback available.";
    
            // Show the modal
            const aiGradingModal = document.getElementById("aiGradingModal");
            aiGradingModal.classList.remove("hidden");
        })
        .catch(error => console.error("Error fetching AI grading details:", error));
}

// Add event listener for the Approve & Send button
document.addEventListener("DOMContentLoaded", () => {
    const approveButton = document.getElementById("approveAndSend");
    if (approveButton) {
        approveButton.addEventListener("click", () => {
            alert("Feedback approved and sent to student!");
            const aiGradingModal = document.getElementById("aiGradingModal");
            aiGradingModal.classList.add("hidden");
        });
    }
});

// Close the modal
document.getElementById("closeAIModal").addEventListener("click", () => {
    const aiGradingModal = document.getElementById("aiGradingModal");
    aiGradingModal.classList.add("hidden");
});