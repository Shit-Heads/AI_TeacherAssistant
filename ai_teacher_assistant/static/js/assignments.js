document.addEventListener('DOMContentLoaded', () => {
    const newAssignmentBtn = document.getElementById('new-assignment-btn');
    const newAssignmentModal = document.getElementById('new-assignment-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-btn');
    const assignmentForm = document.getElementById('assignment-form');

    // Open New Assignment Modal
    newAssignmentBtn.addEventListener('click', () => {
        newAssignmentModal.style.display = 'flex';
    });

    // Close Modal Functions
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            newAssignmentModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === newAssignmentModal) {
            newAssignmentModal.style.display = 'none';
        }
    });

    // Handle Assignment Form Submission
    assignmentForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Collect form data
        const subject = document.getElementById('subject').value;
        const title = document.getElementById('assignment-title').value;
        const description = document.getElementById('assignment-description').value;
        const gradeLevel = document.getElementById('grade-level').value;
        const dueDate = document.getElementById('due-date').value;

        // Create assignment card
        const assignmentsList = document.querySelector('.assignments-list');
        const newAssignmentCard = document.createElement('div');
        newAssignmentCard.classList.add('assignment-card');
        newAssignmentCard.innerHTML = `
            <div class="assignment-header">
                <h3>${title}</h3>
                <span class="badge badge-primary">Grade ${gradeLevel}</span>
            </div>
            <div class="assignment-details">
                <p><i class="fas fa-calendar-alt"></i> Due: ${new Date(dueDate).toLocaleDateString()}</p>
                <p><i class="fas fa-book"></i> ${subject.charAt(0).toUpperCase() + subject.slice(1)}</p>
            </div>
            <div class="assignment-actions">
                <button class="btn btn-secondary">View Details</button>
                <button class="btn btn-outline">Edit</button>
            </div>
        `;

        assignmentsList.prepend(newAssignmentCard);

        // Reset form and close modal
        assignmentForm.reset();
        newAssignmentModal.style.display = 'none';
    });
});