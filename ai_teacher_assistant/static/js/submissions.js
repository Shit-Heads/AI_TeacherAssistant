document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("uploadJsonButton").addEventListener("click", uploadJsonFile);
    fetchSubmissions(); // Load existing submissions when the page loads
});

// ✅ Upload JSON file
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
            alert("Error uploading: " + data.error);
        } else {
            alert("Submission uploaded successfully!");
            fetchSubmissions(); // Refresh submissions list
        }
    })
    .catch(error => console.error("Upload error:", error));
}

// ✅ Fetch submissions
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

// ✅ Render submissions in UI
function renderSubmissions(submissions) {
    const container = document.getElementById("assignments-content");
    container.innerHTML = submissions.length > 0
        ? submissions.map(sub => `
            <div class="submission-card p-4 border rounded-lg shadow-md bg-white" data-id="${sub.id}">
                <h3 class="text-lg font-semibold">${sub.student_name}</h3>
                <p><strong>Subject:</strong> ${sub.subject}</p>
                <p><strong>Class:</strong> ${sub.class}</p>
                <p><strong>Assignment:</strong> ${sub.assignment}</p>
                <p><strong>Content:</strong> ${sub.content.substring(0, 150)}...</p>
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
                    submissionsList.innerHTML = data.submissions.map(sub => `
                        <div class="flex items-center">
                            <input type="checkbox" class="submission-checkbox mr-2" data-id="${sub.id}">
                            <div>
                                <h3 class="font-semibold">${sub.student_name}</h3>
                                <p><strong>Subject:</strong> ${sub.subject}</p>
                                <p><strong>Assignment:</strong> ${sub.assignment}</p>
                            </div>
                        </div>
                    `).join("");
                    gradingModal.style.display = "block";
                }
            })
            .catch(error => console.error("Error fetching submissions:", error));
    });

    // Close modal
    closeModal.addEventListener("click", () => {
        gradingModal.style.display = "none";
    });

    // Handle "Select All"
    selectAllCheckbox.addEventListener("change", (e) => {
        document.querySelectorAll(".submission-checkbox").forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    });

    // Submit for grading
    submitGradingButton.addEventListener("click", () => {
        const selectedIds = Array.from(document.querySelectorAll(".submission-checkbox:checked"))
            .map(checkbox => checkbox.dataset.id);

        if (selectedIds.length === 0) {
            alert("Please select at least one submission.");
            return;
        }

        // Fetch only selected submissions
        Promise.all(selectedIds.map(id =>
            fetch(`/ai/submissions_view/get-submission/${id}`)
                .then(response => response.json())
        )).then(submissions => {
            return Promise.all(submissions.map(submission =>
                fetch("/ai/process_json/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(submission),
                })
                .then(response => response.json())
            ));
        }).then(results => {
            console.log("Grading completed:", results);
            alert("Grading process initiated.");
            fetchSubmissions(); // Refresh submissions
            gradingModal.style.display = "none";
        }).catch(error => console.error("Error grading submissions:", error));
    });
});
