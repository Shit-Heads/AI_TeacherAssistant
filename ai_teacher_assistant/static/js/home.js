document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const openGradingBtn = document.getElementById('open-grading-modal');
    const cancelGradingBtn = document.getElementById('cancelGrading');
    const startGradingBtn = document.getElementById('startGrading');
    const gradingModal = document.getElementById('gradingModal');
    const progressModal = document.getElementById('progressModal');
    const resultsModal = document.getElementById('resultsModal');
    const closeBtns = document.querySelectorAll('.close-modal');
    
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    // File upload
    const dropZone = document.getElementById('dropZone');
    const fileUpload = document.getElementById('fileUpload');
    
    // Tabs functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab content
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Show selected tab content
            const targetTab = this.getAttribute('data-tab');
            document.getElementById(targetTab + 'Tab').classList.remove('hidden');
        });
    });
    
    // Open grading modal
    if (openGradingBtn) {
        openGradingBtn.addEventListener('click', function() {
            gradingModal.classList.add('active');
        });
    }
    
    // Close modal buttons
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.remove('active');
        });
    });
    
    // Cancel grading
    if (cancelGradingBtn) {
        cancelGradingBtn.addEventListener('click', function() {
            gradingModal.classList.remove('active');
        });
    }
    
    // Start grading process
    if (startGradingBtn) {
        startGradingBtn.addEventListener('click', function() {
            gradingModal.classList.remove('active');
            progressModal.classList.add('active');
            
            // Simulate grading progress
            let progress = 0;
            const progressBar = document.getElementById('gradingProgress');
            const progressPercentage = document.getElementById('progressPercentage');
            const processingSteps = document.querySelectorAll('.processing-steps .step');
            
            const interval = setInterval(() => {
                progress += 5;
                progressBar.style.width = progress + '%';
                progressPercentage.textContent = progress + '%';
                
                // Update steps
                if (progress >= 25 && progress < 50) {
                    processingSteps[0].classList.remove('current');
                    processingSteps[1].classList.add('current');
                    processingSteps[1].querySelector('i').classList.add('fa-spinner', 'fa-spin');
                    processingSteps[1].querySelector('i').classList.remove('fa-circle');
                } else if (progress >= 50 && progress < 75) {
                    processingSteps[1].classList.remove('current');
                    processingSteps[1].querySelector('i').classList.remove('fa-spinner', 'fa-spin');
                    processingSteps[1].querySelector('i').classList.add('fa-check-circle');
                    processingSteps[2].classList.add('current');
                    processingSteps[2].querySelector('i').classList.add('fa-spinner', 'fa-spin');
                    processingSteps[2].querySelector('i').classList.remove('fa-circle');
                } else if (progress >= 75 && progress < 100) {
                    processingSteps[2].classList.remove('current');
                    processingSteps[2].querySelector('i').classList.remove('fa-spinner', 'fa-spin');
                    processingSteps[2].querySelector('i').classList.add('fa-check-circle');
                    processingSteps[3].classList.add('current');
                    processingSteps[3].querySelector('i').classList.add('fa-spinner', 'fa-spin');
                    processingSteps[3].querySelector('i').classList.remove('fa-circle');
                }
                
                if (progress >= 100) {
                    clearInterval(interval);
                    processingSteps[3].querySelector('i').classList.remove('fa-spinner', 'fa-spin');
                    processingSteps[3].querySelector('i').classList.add('fa-check-circle');
                    
                    // Show results after a brief delay
                    setTimeout(() => {
                        progressModal.classList.remove('active');
                        resultsModal.classList.add('active');
                        initCharts();
                    }, 1000);
                }
            }, 150);
        });
    }
    
    // File upload functionality
    if (dropZone && fileUpload) {
        dropZone.addEventListener('click', () => {
            fileUpload.click();
        });
        
        fileUpload.addEventListener('change', handleFiles);
        
        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('active');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('active');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('active');
            if (e.dataTransfer.files.length) {
                fileUpload.files = e.dataTransfer.files;
                handleFiles();
            }
        });
        
        function handleFiles() {
            // In a real app, you would process the files here
            console.log('Files selected:', fileUpload.files);
        }
    }
    
    // Remove file button functionality
    const removeFileBtns = document.querySelectorAll('.remove-file');
    removeFileBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const fileItem = this.closest('.file-item');
            fileItem.remove();
        });
    });
    
    // Initialize charts
    function initCharts() {
        // Feedback overview chart
        if (document.getElementById('feedbackChart')) {
            const ctx1 = document.getElementById('feedbackChart').getContext('2d');
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    datasets: [{
                        label: 'Feedback Points',
                        data: [12, 19, 15, 22, 18],
                        borderColor: '#4a6cf7',
                        backgroundColor: 'rgba(74, 108, 247, 0.1)',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        // Grading results chart
        if (document.getElementById('gradingChart')) {
            const ctx2 = document.getElementById('gradingChart').getContext('2d');
            new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ['Content', 'Organization', 'Grammar', 'Citations'],
                    datasets: [{
                        label: 'Average Score',
                        data: [85, 78, 92, 65],
                        backgroundColor: [
                            'rgba(74, 108, 247, 0.8)',
                            'rgba(74, 108, 247, 0.6)',
                            'rgba(74, 108, 247, 0.4)',
                            'rgba(74, 108, 247, 0.2)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
        
        // Student progress chart
        if (document.getElementById('studentProgressChart')) {
            const ctx3 = document.getElementById('studentProgressChart').getContext('2d');
            new Chart(ctx3, {
                type: 'line',
                data: {
                    labels: ['Essay 1', 'Essay 2', 'Essay 3', 'Current'],
                    datasets: [{
                        label: 'Overall Score',
                        data: [75, 82, 80, 87],
                        borderColor: '#4a6cf7',
                        backgroundColor: 'transparent',
                        tension: 0.3
                    },
                    {
                        label: 'Content & Ideas',
                        data: [70, 78, 85, 92],
                        borderColor: '#22c55e',
                        backgroundColor: 'transparent',
                        tension: 0.3
                    },
                    {
                        label: 'Organization',
                        data: [68, 75, 72, 80],
                        borderColor: '#f59e0b',
                        backgroundColor: 'transparent',
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 50,
                            max: 100
                        }
                    }
                }
            });
        }
    }
    
    // Student selection in individual tab
    const studentSelect = document.getElementById('studentSelect');
    if (studentSelect) {
        studentSelect.addEventListener('change', function() {
            console.log('Selected student:', this.value);
            // In a real app, you would update the student report here
        });
    }
    
    // Initialize charts if on the results page initially
    if (document.getElementById('resultsModal').classList.contains('active')) {
        initCharts();
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
});