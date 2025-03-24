// EduAssist AI - Teacher Assistant JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Navigation event listeners
    setupNavigation();
    
    // Grade now button handlers
    setupGradingButtons();
    
    // Toggle AI assist
    setupAIToggle();
    
    // Simulate data loading
    simulateDataLoading();
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links li');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Here you would typically load the appropriate content
            // For demo purposes, we'll just console log
            console.log('Navigated to:', this.querySelector('a').textContent.trim());
        });
    });
}

function setupGradingButtons() {
    const gradeButtons = document.querySelectorAll('.btn-primary:not(.disabled)');
    
    gradeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // For demo purposes, we'll just scroll to the grading interface
            const gradingInterface = document.querySelector('.grading-interface');
            if (gradingInterface) {
                gradingInterface.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Feedback action buttons
    const feedbackButtons = document.querySelectorAll('.feedback-actions button');
    feedbackButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent.includes('Approve')) {
                showNotification('Feedback sent to student successfully!');
            } else {
                // Edit feedback logic would go here
                console.log('Edit feedback clicked');
            }
        });
    });
}

function setupAIToggle() {
    const aiToggle = document.querySelector('.toggle-container input');
    
    aiToggle.addEventListener('change', function() {
        if (this.checked) {
            showNotification('AI Assist enabled - automatic grading and feedback generation active');
        } else {
            showNotification('AI Assist disabled - manual grading mode activated');
        }
    });
}

function simulateDataLoading() {
    // Simulate loading statistics data
    setTimeout(() => {
        animateStatNumbers();
    }, 500);
}

function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-details h3');
    
    statNumbers.forEach(stat => {
        const targetValue = stat.textContent;
        let startValue = 0;
        
        // Parse the target value
        let endValue;
        if (targetValue.includes('%')) {
            endValue = parseFloat(targetValue);
        } else if (targetValue.includes('hrs')) {
            endValue = parseFloat(targetValue);
        } else {
            endValue = parseInt(targetValue);
        }
        
        // Animation duration in milliseconds
        const duration = 1500;
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        
        let frame = 0;
        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentValue = Math.round(endValue * progress);
            
            if (targetValue.includes('%')) {
                stat.textContent = `${currentValue}%`;
            } else if (targetValue.includes('hrs')) {
                stat.textContent = `${currentValue} hrs`;
            } else {
                stat.textContent = currentValue;
            }
            
            if (frame === totalFrames) {
                clearInterval(counter);
                stat.textContent = targetValue; // Ensure final value is exactly as defined
            }
        }, frameDuration);
    });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles to notification
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-md)',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'all 0.3s ease'
    });
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        // Remove from DOM after animation
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add new assignment functionality
document.addEventListener('DOMContentLoaded', function() {
    const newAssignmentButton = document.querySelector('.btn-primary i.fas.fa-plus').parentElement;
    
    newAssignmentButton.addEventListener('click', function() {
        showNewAssignmentForm();
    });
});

function showNewAssignmentForm() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: '1000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    });
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'modal';
    Object.assign(modal.style, {
        backgroundColor: 'var(--bg-card)',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '600px',
        boxShadow: 'var(--shadow-md)',
        animation: 'fadeIn 0.3s ease-out'
    });
    
    // Modal header
    const header = document.createElement('div');
    header.innerHTML = `
        <h2 style="margin-bottom: 20px; font-size: 20px; font-weight: 600;">Create New Assignment</h2>
    `;
    
    // Modal form
    const form = document.createElement('form');
    form.innerHTML = `
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Assignment Title</label>
            <input type="text" placeholder="Enter assignment title" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); font-family: 'Poppins', sans-serif;">
        </div>
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Class/Grade</label>
            <select style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); font-family: 'Poppins', sans-serif;">
                <option>Grade 9</option>
                <option>Grade 10</option>
                <option>Grade 11</option>
                <option>Grade 12</option>
            </select>
        </div>
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Due Date</label>
            <input type="date" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); font-family: 'Poppins', sans-serif;">
        </div>
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Assignment Description</label>
            <textarea rows="4" placeholder="Enter assignment description" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); font-family: 'Poppins', sans-serif; resize: vertical;"></textarea>
        </div>
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Grading Rubric</label>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <input type="text" placeholder="Criterion name" style="flex: 1; padding: 8px; border-radius: 8px; border: 1px solid var(--border-color); margin-right: 8px;">
                <input type="number" placeholder="Points" style="width: 80px; padding: 8px; border-radius: 8px; border: 1px solid var(--border-color);">
            </div>
            <button type="button" style="background: none; border: none; color: var(--primary-color); cursor: pointer; font-size: 14px;">+ Add Criterion</button>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
            <button type="button" class="cancel-btn" style="padding: 10px 16px; border-radius: 8px; border: 1px solid var(--border-color); background: none; cursor: pointer; font-family: 'Poppins', sans-serif;">Cancel</button>
            <button type="submit" style="padding: 10px 16px; border-radius: 8px; border: none; background-color: var(--primary-color); color: white; cursor: pointer; font-family: 'Poppins', sans-serif;">Create Assignment</button>
        </div>
    `;
    
    // Add content to modal
    modal.appendChild(header);
    modal.appendChild(form);
    overlay.appendChild(modal);
    
    // Add to DOM
    document.body.appendChild(overlay);
    
    // Handle close modal
    const cancelBtn = overlay.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('New assignment created successfully!');
        document.body.removeChild(overlay);
        
        // In a real application, we would save the assignment data here
        // and update the UI with the new assignment
        addNewAssignmentToUI();
    });
}

function addNewAssignmentToUI() {
    // Get the assignments list container
    const assignmentsList = document.querySelector('.assignments-list');
    
    // Create new assignment card
    const newAssignment = document.createElement('div');
    newAssignment.className = 'assignment-card';
    newAssignment.innerHTML = `
        <div class="assignment-info">
            <h3>New Assignment</h3>
            <p>Grade 9 • Due Apr 05</p>
            <div class="progress-container">
                <div class="progress-bar" style="width: 0%"></div>
            </div>
            <div class="assignment-meta">
                <span><i class="fas fa-user-graduate"></i> 0/30 submitted</span>
                <span><i class="fas fa-check-circle"></i> 0 graded</span>
            </div>
        </div>
        <div class="assignment-actions">
            <button class="btn btn-secondary">Manage</button>
        </div>
    `;
    
    // Add to the beginning of the list
    assignmentsList.insertBefore(newAssignment, assignmentsList.firstChild);
    
    // Add animation
    newAssignment.style.animation = 'fadeIn 0.5s ease-out';
}

// Initialize insights interaction
document.addEventListener('DOMContentLoaded', function() {
    setupInsightsButtons();
});

function setupInsightsButtons() {
    const insightButtons = document.querySelectorAll('.insight-content .btn-text');
    
    insightButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            
            if (action.includes('Generate Review')) {
                showNotification('Generating review materials for Newton\'s Third Law concepts...');
                // In a real app, this would trigger an AI generation process
                setTimeout(() => {
                    showNotification('Review materials ready! Sent to your email.');
                }, 2000);
            } else if (action.includes('Encouragement')) {
                showNotification('Sending encouragement notes to 5 students');
                // In a real app, this would schedule messages to be sent
                setTimeout(() => {
                    showNotification('Encouragement notes scheduled for delivery!');
                }, 1500);
            }
        });
    });
}

// Add search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-container input');
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim().toLowerCase();
            if (searchTerm) {
                showNotification(`Searching for "${searchTerm}"...`);
                // In a real app, this would filter results
                simulateSearch(searchTerm);
            }
        }
    });
});

function simulateSearch(term) {
    // Simulate loading
    const assignmentCards = document.querySelectorAll('.assignment-card');
    
    // Hide all cards with a fade effect
    assignmentCards.forEach(card => {
        card.style.opacity = '0.3';
        card.style.transform = 'scale(0.95)';
    });
    
    // After a delay, show only "matching" cards
    setTimeout(() => {
        let foundAny = false;
        
        assignmentCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            
            if (cardText.includes(term)) {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
                foundAny = true;
            }
        });
        
        if (!foundAny) {
            showNotification('No assignments found matching your search');
            // Reset all cards
            setTimeout(() => {
                assignmentCards.forEach(card => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                });
            }, 1000);
        }
    }, 800);
}

// Handle window resize events for responsive design
window.addEventListener('resize', function() {
    // Check if we need to adjust the UI for mobile
    adjustForMobileView();
});

function adjustForMobileView() {
    const isMobile = window.innerWidth < 768;
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (isMobile) {
        // Mobile optimizations
        sidebar.style.height = 'auto';
        mainContent.style.marginTop = '0';
    } else {
        // Desktop layout
        sidebar.style.height = '100vh';
        mainContent.style.marginTop = '0';
    }
}

// Initialize charts and data visualization
// This would typically use a library like Chart.js
function initializeCharts() {
    // For this demo, we'll just simulate this functionality
    console.log('Charts initialized');
}

// Export functionality for reports
function exportReport(type) {
    switch(type) {
        case 'pdf':
            showNotification('Generating PDF report...');
            setTimeout(() => {
                showNotification('PDF report ready for download!');
            }, 1500);
            break;
        case 'csv':
            showNotification('Exporting data as CSV...');
            setTimeout(() => {
                showNotification('CSV export completed!');
            }, 1000);
            break;
        default:
            showNotification('Export initiated');
    }
}

// Load more assignments when needed
function loadMoreAssignments() {
    // In a real app, this would fetch more data from the server
    showNotification('Loading more assignments...');
    
    // Simulate network delay
    setTimeout(() => {
        const assignmentsList = document.querySelector('.assignments-list');
        
        // Sample new assignment
        const newAssignment = document.createElement('div');
        newAssignment.className = 'assignment-card';
        newAssignment.innerHTML = `
            <div class="assignment-info">
                <h3>Mathematics: Algebraic Equations</h3>
                <p>Grade 10 • Due Apr 10</p>
                <div class="progress-container">
                    <div class="progress-bar" style="width: 25%"></div>
                </div>
                <div class="assignment-meta">
                    <span><i class="fas fa-user-graduate"></i> 8/32 submitted</span>
                    <span><i class="fas fa-check-circle"></i> 8 graded</span>
                </div>
            </div>
            <div class="assignment-actions">
                <button class="btn btn-secondary">Grade</button>
            </div>
        `;
        
        // Add to the list
        assignmentsList.appendChild(newAssignment);
        
        // Add animation
        newAssignment.style.animation = 'fadeIn 0.5s ease-out';
    }, 1200);
}

// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check for mobile view on initial load
    adjustForMobileView();
    
    // Set up "View All" buttons
    document.querySelectorAll('.btn-text').forEach(btn => {
        if (btn.textContent.includes('View All')) {
            btn.addEventListener('click', function() {
                loadMoreAssignments();
            });
        }
    });
    
    // Initialize any charts or data visualizations
    initializeCharts();
    
    // Show welcome notification after a delay
    setTimeout(() => {
        showNotification('Welcome back to EduAssist AI! You have 24 assignments pending review.');
    }, 1000);
});

document.getElementById('upload-button').addEventListener('click', function () {
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        // Show loading state
        const elementsToUpdate = ['content-knowledge-score', 'analysis-score', 'organization-score', 'suggested-grade', 'suggested-feedback'];
        elementsToUpdate.forEach(id => document.getElementById(id).innerText = 'Analyzing...');

        fetch('/ai/process_json/', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.response) {
                try {
                    const responseText = data.response;

                    // Improved regex patterns for grading details
                    const contentKnowledgeScore = responseText.match(/Content Knowledge Score:\s*(\d+\/\d+)/i)?.[1] || 'N/A';
                    const analysisScore = responseText.match(/Analysis Score:\s*(\d+\/\d+)/i)?.[1] || 'N/A';
                    const organizationScore = responseText.match(/Organization Score:\s*(\d+\/\d+)/i)?.[1] || 'N/A';
                    const suggestedGrade = responseText.match(/Suggested Grade:\s*([A-F][+-]?(?:\s*\(\d+%\))?)/i)?.[1] || 'N/A';

                    // Display extracted grading scores
                    document.getElementById('content-knowledge-score').innerText = contentKnowledgeScore;
                    document.getElementById('analysis-score').innerText = analysisScore;
                    document.getElementById('organization-score').innerText = organizationScore;
                    document.getElementById('suggested-grade').innerText = suggestedGrade;

                    // Improved feedback extraction
                    const feedbackMatch = responseText.match(/Suggested Feedback:\n?\s*(.*?)(?=\n[A-Za-z ]+:|$)/is);
                    const feedback = feedbackMatch && feedbackMatch[1].trim() ? feedbackMatch[1].trim() : 'No feedback provided.';
                    document.getElementById('suggested-feedback').innerText = feedback;

                } catch (error) {
                    console.error('Error displaying AI response:', error);
                    alert('Error displaying the AI response. Please try again.');
                }
            } else if (data.error) {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Please select a JSON file to upload.');
    }
});

document.getElementById('approve-send').addEventListener('click', () => {
    alert('Feedback Approved & Sent!');
});