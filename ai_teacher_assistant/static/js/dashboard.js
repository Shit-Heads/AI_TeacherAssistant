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
    const navLinks = document.querySelectorAll('.nav-links li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') {
                e.preventDefault();
                navLinks.forEach(l => l.parentElement.classList.remove('active'));
                this.parentElement.classList.add('active');

                // Here you would typically load the appropriate content
                // For demo purposes, we'll just console log
                console.log('Navigated to:', this.textContent.trim());
            } else {
                // Allow default behavior for valid href
                navLinks.forEach(l => l.parentElement.classList.remove('active'));
                this.parentElement.classList.add('active');
                // Navigate to the URL
                window.location.href = href;
            }
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



// Initialize application when DOM is fully loaded


//ai_grading
document.getElementById('upload-button').addEventListener('click', function () {
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        // Show loading state
        const elementsToUpdate = [
            'content-knowledge-score',
            'analysis-score',
            'organization-score',
            'plagiarism-percentage',
            'suggested-grade',
            'suggested-feedback'
        ];
        elementsToUpdate.forEach(id => document.getElementById(id).innerText = 'Analyzing...');

        fetch('/ai/process_json/', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Error: ' + data.error);
                console.error('AI Response Error:', data.raw_response || data.error);
                return;
            }

            console.log('AI Response:', data);  // Debugging

            // Ensure JSON parsing is correct
            let responseData;
            try {
                responseData = typeof data === 'string' ? JSON.parse(data) : data;
            } catch (e) {
                console.error("Invalid JSON received:", data);
                alert("AI returned an invalid JSON format.");
                return;
            }

            // Update UI with extracted data
            document.getElementById('content-knowledge-score').innerText = responseData.content_knowledge_score || 'N/A';
            document.getElementById('analysis-score').innerText = responseData.analysis_score || 'N/A';
            document.getElementById('organization-score').innerText = responseData.organization_score || 'N/A';
            document.getElementById('plagiarism-percentage').innerText = 
            responseData.plagiarism_percentage !== undefined 
            ? `${responseData.plagiarism_percentage}%`
            : 'N/A';
            document.getElementById('suggested-grade').innerText = responseData.suggested_grade || 'N/A';
            document.getElementById('suggested-feedback').innerText = responseData.suggested_feedback || 'No feedback provided.';
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            alert('An error occurred. Please try again.');
        });
    } else {
        alert('Please select a JSON file to upload.');
    }
});

document.getElementById('approve-send').addEventListener('click', () => {
    alert('Feedback Approved & Sent!');
});
