document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("gradeButton").addEventListener("click", showGradingModal);
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
                <button class="view-button bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-3" data-id="${submission.id}">
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

// ✅ Render submissions in the grading modal
function renderSubmissionsInModal(submissions) {
    const submissionsList = document.getElementById("submissionsList");
    submissionsList.innerHTML = "";
    
    submissions.forEach(submission => {
        const submissionItem = document.createElement("div");
        submissionItem.className = "submission-item";
        submissionItem.innerHTML = `
            <input type="checkbox" id="submission-${submission.id}" class="submission-checkbox" data-id="${submission.id}">
            <div class="student-info">
                <h4>${submission.student_name}</h4>
                <p><strong>Subject:</strong> ${submission.subject}</p>
                <p><strong>Assignment:</strong> ${submission.assignment}</p>
            </div>
        `;
        submissionsList.appendChild(submissionItem);
    });
}

// ✅ Show grading modal
function showGradingModal() {
    const gradingModal = document.getElementById("gradingModal");
    
    fetch("/ai/submissions_view/get-submissions/")
        .then(response => response.json())
        .then(data => {
            if (data.submissions) {
                renderSubmissionsInModal(data.submissions);
                gradingModal.classList.remove("hidden");
            }
        })
        .catch(error => console.error("Error fetching submissions:", error));
}

// ✅ Modal event handlers
document.addEventListener("DOMContentLoaded", () => {
    const closeModal = document.getElementById("closeModal");
    const selectAllCheckbox = document.getElementById("selectAll");
    const submitGradingButton = document.getElementById("submitGrading");
    const gradingModal = document.getElementById("gradingModal");

    // Close modal
    if (closeModal) {
        closeModal.addEventListener("click", () => {
            gradingModal.classList.add("hidden");
        });
    }

    // Handle "Select All" functionality
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener("change", (e) => {
            const checkboxes = document.querySelectorAll(".submission-checkbox");
            checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
        });
    }

    // Submit selected assignments for grading
    if (submitGradingButton) {
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
    }
});

// Fetch AI grading details for a submission
function fetchAIDetails(submissionId) {
    console.log("Fetching AI grading details for submission ID:", submissionId);
    fetch(`/ai/submissions_view/get-ai-grading/${submissionId}/`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Error fetching AI grading details: " + data.error);
                return;
            }
    
            // Populate the modal with AI grading details
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