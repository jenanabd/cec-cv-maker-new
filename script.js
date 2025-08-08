// Global variables
let photoDataURL = '';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('CV Maker initialized');
    addAnimationDelays();
});

// Add staggered animation delays to form elements
function addAnimationDelays() {
    const formElements = document.querySelectorAll('input, textarea, button, h2');
    formElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
}

// Photo preview function with improved error handling
function previewPhoto(event) {
    const file = event.target.files[0];
    const img = document.getElementById('photo-preview');
    
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showMessage('Please select a valid image file.', 'error');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showMessage('Image size should be less than 5MB.', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            photoDataURL = e.target.result;
            img.src = photoDataURL;
            img.style.display = 'block';
            
            // Add loading animation
            img.style.opacity = '0';
            setTimeout(() => {
                img.style.transition = 'opacity 0.5s ease';
                img.style.opacity = '1';
            }, 100);
        };
        reader.readAsDataURL(file);
    }
}

// Add education entry with animation
function addEducation() {
    const container = document.getElementById('education-container');
    const newEntry = document.createElement('div');
    newEntry.className = 'education-entry';
    newEntry.style.opacity = '0';
    newEntry.style.transform = 'translateY(20px)';
    
    newEntry.innerHTML = `
        <hr style="margin: 20px 0;">
        <input type="text" placeholder="Degree/Certificate" class="degree">
        <input type="text" placeholder="Institution" class="school">
        <input type="text" placeholder="Year/Duration" class="year">
        <input type="text" placeholder="Grade/GPA (optional)" class="grade">
        <button type="button" onclick="removeEntry(this)" class="remove-btn" style="background: #e74c3c; padding: 5px 10px; font-size: 12px;">Remove</button>
    `;
    
    container.appendChild(newEntry);
    
    // Animate the new entry
    setTimeout(() => {
        newEntry.style.transition = 'all 0.5s ease';
        newEntry.style.opacity = '1';
        newEntry.style.transform = 'translateY(0)';
    }, 100);
    
    showMessage('Additional education entry added! Fill it out to include in your CV.', 'success');
}

// Add experience entry with animation
function addExperience() {
    const container = document.getElementById('experience-container');
    const newEntry = document.createElement('div');
    newEntry.className = 'experience-entry';
    newEntry.style.opacity = '0';
    newEntry.style.transform = 'translateY(20px)';
    
    newEntry.innerHTML = `
        <hr style="margin: 20px 0;">
        <input type="text" placeholder="Job Title" class="job-title">
        <input type="text" placeholder="Company" class="company">
        <input type="text" placeholder="Period" class="period">
        <textarea placeholder="Description" class="job-description" rows="2"></textarea>
        <button type="button" onclick="removeEntry(this)" class="remove-btn" style="background: #e74c3c; padding: 5px 10px; font-size: 12px;">Remove</button>
    `;
    
    container.appendChild(newEntry);
    
    // Animate the new entry
    setTimeout(() => {
        newEntry.style.transition = 'all 0.5s ease';
        newEntry.style.opacity = '1';
        newEntry.style.transform = 'translateY(0)';
    }, 100);
    
    showMessage('Additional experience entry added! Fill it out to include in your CV.', 'success');
}

// Remove entry function
function removeEntry(button) {
    const entry = button.closest('.education-entry, .experience-entry');
    entry.style.transition = 'all 0.3s ease';
    entry.style.opacity = '0';
    entry.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        entry.remove();
    }, 300);
    
    showMessage('Entry removed successfully!', 'success');
}

// Generate CV with improved validation and formatting
function generateCV() {
    // Show loading state
    const generateBtn = document.querySelector('button[onclick="generateCV()"]');
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = 'Generating CV <div class="loading"></div>';
    generateBtn.disabled = true;
    
    setTimeout(() => {
        try {
            // Get form data with validation
            const formData = getFormData();
            
            if (!validateFormData(formData)) {
                return;
            }
            
            // Generate CV HTML
            const cvHTML = generateCVHTML(formData);
            
            // Display the CV
            const preview = document.getElementById('cv-preview');
            preview.innerHTML = cvHTML;
            preview.className = 'preview-container cv-content';
            
            // Show download button with animation
            const downloadBtn = document.getElementById('download-btn');
            downloadBtn.style.display = 'block';
            downloadBtn.style.opacity = '0';
            downloadBtn.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                downloadBtn.style.transition = 'all 0.5s ease';
                downloadBtn.style.opacity = '1';
                downloadBtn.style.transform = 'scale(1)';
            }, 100);
            
            showMessage('CV generated successfully!', 'success');
            
            // Debug: Log the generated content
            console.log('CV HTML generated:', cvHTML.substring(0, 200) + '...');
            console.log('Preview element content length:', preview.innerHTML.length);
            
        } catch (error) {
            console.error('Error generating CV:', error);
            showMessage('An error occurred while generating the CV. Please try again.', 'error');
        } finally {
            // Reset button state
            generateBtn.innerHTML = originalText;
            generateBtn.disabled = false;
        }
    }, 1000);
}

// Get form data
function getFormData() {
    return {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        professionalTitle: document.getElementById('professional-title').value.trim(),
        aboutMe: document.getElementById('about-me').value.trim(),
        skills: document.getElementById('skills').value.trim(),
        languages: document.getElementById('languages').value.trim(),
        interests: document.getElementById('interests').value.trim(),
        photo: photoDataURL,
        education: getEducationData(),
        experience: getExperienceData()
    };
}

// Get education data
function getEducationData() {
    const degrees = document.querySelectorAll('#education-container .degree');
    const schools = document.querySelectorAll('#education-container .school');
    const years = document.querySelectorAll('#education-container .year');
    const grades = document.querySelectorAll('#education-container .grade');
    
    const education = [];
    for (let i = 0; i < degrees.length; i++) {
        const degree = degrees[i].value.trim();
        const school = schools[i].value.trim();
        const year = years[i].value.trim();
        const grade = grades[i] ? grades[i].value.trim() : '';
        
        if (degree || school || year) {
            education.push({ degree, school, year, grade });
        }
    }
    return education;
}

// Get experience data
function getExperienceData() {
    const titles = document.querySelectorAll('#experience-container .job-title');
    const companies = document.querySelectorAll('#experience-container .company');
    const periods = document.querySelectorAll('#experience-container .period');
    const descriptions = document.querySelectorAll('#experience-container .job-description');
    
    const experience = [];
    for (let i = 0; i < titles.length; i++) {
        const title = titles[i].value.trim();
        const company = companies[i].value.trim();
        const period = periods[i].value.trim();
        const description = descriptions[i].value.trim();
        
        if (title || company || period || description) {
            experience.push({ title, company, period, description });
        }
    }
    return experience;
}

// Validate form data
function validateFormData(data) {
    if (!data.name) {
        showMessage('Please enter your full name.', 'error');
        document.getElementById('name').focus();
        return false;
    }
    
    if (!data.email) {
        showMessage('Please enter your email address.', 'error');
        document.getElementById('email').focus();
        return false;
    }
    
    if (!isValidEmail(data.email)) {
        showMessage('Please enter a valid email address.', 'error');
        document.getElementById('email').focus();
        return false;
    }
    
    if (!data.phone) {
        showMessage('Please enter your phone number.', 'error');
        document.getElementById('phone').focus();
        return false;
    }
    
    // Check if at least some content is provided
    if (!data.aboutMe && data.experience.length === 0 && data.education.length === 0 && !data.skills) {
        showMessage('Please fill in at least your About Me, some experience, education, or skills to generate a meaningful CV.', 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Generate CV HTML with professional 2-column layout
function generateCVHTML(data) {
    let html = `
        <div style="
            max-width: 800px;
            margin: 0 auto;
            font-family: 'Georgia', 'Times New Roman', serif;
            background: #fff;
            display: flex;
            min-height: 90vh;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            font-size: 12px;
            line-height: 1.3;
        ">
            <!-- Left Column (Dark Blue) -->
            <div style="
                width: 35%;
                background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
                color: white;
                padding: 30px 25px;
                display: flex;
                flex-direction: column;
            ">
                <!-- Profile Photo and Name -->
                <div style="text-align: center; margin-bottom: 25px;">
                    ${data.photo ? `
                        <img src="${data.photo}" style="
                            width: 120px;
                            height: 120px;
                            border-radius: 50%;
                            object-fit: cover;
                            border: 4px solid white;
                            margin-bottom: 15px;
                        " alt="Profile Photo">
                    ` : ''}
                    <h1 style="
                        font-size: 24px;
                        font-weight: bold;
                        margin: 0;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        text-align: center;
                        line-height: 1.1;
                        color: #ffffff;
                    ">${data.name}</h1>
                    ${data.professionalTitle ? `
                        <p style="
                            font-size: 11px;
                            margin: 8px 0 0 0;
                            opacity: 0.9;
                            text-align: center;
                            color: white;
                        ">(${data.professionalTitle})</p>
                    ` : ''}
                </div>
                
                <!-- About Me -->
                ${data.aboutMe ? `
                    <div style="margin-bottom: 25px;">
                        <h2 style="
                            font-size: 14px;
                            font-weight: bold;
                            margin: 0 0 10px 0;
                            color: white;
                            border-bottom: 2px solid rgba(255,255,255,0.3);
                            padding-bottom: 5px;
                        ">About Me</h2>
                        <p style="
                            font-size: 10px;
                            line-height: 1.4;
                            margin: 0;
                            text-align: justify;
                            color: white;
                        ">${data.aboutMe}</p>
                    </div>
                ` : ''}
                
                <!-- Contact Info -->
                <div style="margin-bottom: 25px;">
                    <h2 style="
                        font-size: 14px;
                        font-weight: bold;
                        margin: 0 0 10px 0;
                        color: white;
                        border-bottom: 2px solid rgba(255,255,255,0.3);
                        padding-bottom: 5px;
                    ">Contact</h2>
                    <div style="font-size: 10px; line-height: 1.6; color: white;">
                        <p style="margin: 8px 0; display: flex; align-items: center; color: white;">
                            <strong style="color: white;">Email:</strong>&nbsp;${data.email}
                        </p>
                        <p style="margin: 8px 0; display: flex; align-items: center; color: white;">
                            <strong style="color: white;">Phone:</strong>&nbsp;${data.phone}
                        </p>
                        ${data.address ? `
                            <p style="margin: 8px 0; display: flex; align-items: flex-start; color: white;">
                                <strong style="color: white;">Address:</strong>&nbsp;${data.address}
                            </p>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Languages -->
                ${data.languages ? `
                    <div style="margin-bottom: 25px;">
                        <h2 style="
                            font-size: 14px;
                            font-weight: bold;
                            margin: 0 0 10px 0;
                            color: white;
                            border-bottom: 2px solid rgba(255,255,255,0.3);
                            padding-bottom: 5px;
                        ">Languages</h2>
                        <div style="font-size: 10px; line-height: 1.5; color: white;">
                            ${data.languages.split(',').map(lang => `
                                <p style="margin: 5px 0; color: white;">• ${lang.trim()}</p>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Interests -->
                ${data.interests ? `
                    <div>
                        <h2 style="
                            font-size: 14px;
                            font-weight: bold;
                            margin: 0 0 10px 0;
                            color: white;
                            border-bottom: 2px solid rgba(255,255,255,0.3);
                            padding-bottom: 5px;
                        ">Interests</h2>
                        <div style="font-size: 10px; line-height: 1.5; color: white;">
                            ${data.interests.split(',').map(interest => `
                                <p style="margin: 5px 0; color: white;">• ${interest.trim()}</p>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <!-- Right Column (White) -->
            <div style="
                width: 65%;
                background: white;
                color: #333;
                padding: 30px 25px;
            ">
                <!-- Experience Section -->
                ${data.experience.length > 0 ? `
                    <div style="margin-bottom: 30px;">
                        <h2 style="
                            font-size: 16px;
                            font-weight: bold;
                            color: #1e3a8a;
                            margin: 0 0 15px 0;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            border-bottom: 2px solid #1e3a8a;
                            padding-bottom: 5px;
                        ">Experience</h2>
                        ${data.experience.map(exp => {
                            if (exp.title || exp.company || exp.period || exp.description) {
                                return `
                                    <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                            <div>
                                                <h3 style="
                                                    font-size: 12px;
                                                    font-weight: bold;
                                                    margin: 0;
                                                    color: #1e3a8a;
                                                ">${exp.title || 'Position Not Specified'}</h3>
                                                <p style="
                                                    font-size: 11px;
                                                    margin: 2px 0;
                                                    color: #666;
                                                    font-style: italic;
                                                ">${exp.company || 'Company Not Specified'}</p>
                                            </div>
                                            ${exp.period ? `
                                                <span style="
                                                    font-size: 9px;
                                                    background: #f0f0f0;
                                                    color: #1e3a8a;
                                                    padding: 3px 8px;
                                                    border-radius: 10px;
                                                    font-weight: bold;
                                                ">${exp.period}</span>
                                            ` : ''}
                                        </div>
                                        ${exp.description ? `
                                            <p style="
                                                font-size: 10px;
                                                line-height: 1.4;
                                                margin: 0;
                                                text-align: justify;
                                                color: #444;
                                            ">${exp.description}</p>
                                        ` : ''}
                                    </div>
                                `;
                            }
                            return '';
                        }).join('')}
                    </div>
                ` : ''}
                
                <!-- Education Section -->
                ${data.education.length > 0 ? `
                    <div style="margin-bottom: 30px;">
                        <h2 style="
                            font-size: 16px;
                            font-weight: bold;
                            color: #1e3a8a;
                            margin: 0 0 15px 0;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            border-bottom: 2px solid #1e3a8a;
                            padding-bottom: 5px;
                        ">Education</h2>
                        ${data.education.map(edu => {
                            if (edu.degree || edu.school || edu.year) {
                                return `
                                    <div style="margin-bottom: 15px; padding-bottom: 12px; border-bottom: 1px solid #eee;">
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                            <div style="flex: 1;">
                                                <h3 style="
                                                    font-size: 12px;
                                                    font-weight: bold;
                                                    margin: 0;
                                                    color: #1e3a8a;
                                                ">${edu.degree || 'Degree Not Specified'}</h3>
                                                <p style="
                                                    font-size: 11px;
                                                    margin: 2px 0;
                                                    color: #666;
                                                    font-style: italic;
                                                ">${edu.school || 'Institution Not Specified'}</p>
                                                ${edu.grade ? `
                                                    <p style="
                                                        font-size: 10px;
                                                        margin: 2px 0;
                                                        color: #888;
                                                    ">Grade: ${edu.grade}</p>
                                                ` : ''}
                                            </div>
                                            ${edu.year ? `
                                                <span style="
                                                    font-size: 9px;
                                                    background: #f0f0f0;
                                                    color: #1e3a8a;
                                                    padding: 3px 8px;
                                                    border-radius: 10px;
                                                    font-weight: bold;
                                                ">${edu.year}</span>
                                            ` : ''}
                                        </div>
                                    </div>
                                `;
                            }
                            return '';
                        }).join('')}
                    </div>
                ` : ''}
                
                <!-- Skills Summary -->
                ${data.skills ? `
                    <div style="margin-bottom: 30px;">
                        <h2 style="
                            font-size: 16px;
                            font-weight: bold;
                            color: #1e3a8a;
                            margin: 0 0 15px 0;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            border-bottom: 2px solid #1e3a8a;
                            padding-bottom: 5px;
                        ">Skills Summary</h2>
                        <div style="
                            display: flex;
                            flex-wrap: wrap;
                            gap: 8px;
                        ">
                            ${data.skills.split(',').map(skill => `
                                <span style="
                                    background: #f0f4ff;
                                    color: #1e3a8a;
                                    padding: 5px 12px;
                                    border-radius: 15px;
                                    font-size: 10px;
                                    font-weight: bold;
                                    border: 1px solid #e0e7ff;
                                ">${skill.trim()}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    return html;
}

// Download CV as PDF - SIMPLE AND RELIABLE METHOD
function downloadCV() {
    const downloadBtn = document.querySelector('#download-btn button');
    const originalText = downloadBtn.innerHTML;
    
    downloadBtn.innerHTML = 'Creating PDF...';
    downloadBtn.disabled = true;
    
    const element = document.getElementById('cv-preview');
    
    if (!element || !element.innerHTML.trim() || element.innerHTML.includes('Preview will appear here')) {
        showMessage('Please generate your CV first before downloading!', 'error');
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        return;
    }
    
    // Create a new window for PDF generation with optimized styling
    const printWindow = window.open('', '_blank');
    const cvContent = element.innerHTML;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CV_${new Date().toISOString().split('T')[0]}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Georgia', 'Times New Roman', serif; 
                    background: white;
                    color: black;
                    font-size: 11px;
                    line-height: 1.2;
                }
                @media print {
                    body { 
                        margin: 0; 
                        font-size: 10px;
                    }
                    .cv-container { 
                        max-width: none; 
                        height: 100vh;
                        display: flex !important;
                    }
                    /* Preserve background colors in print */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
                @page {
                    margin: 10mm;
                    size: A4;
                }
                h1, h2, h3 { 
                    color: inherit;
                    page-break-after: avoid;
                }
                div { 
                    page-break-inside: avoid;
                }
                img {
                    max-width: 100px;
                    height: auto;
                }
                /* Ensure background colors are preserved */
                * {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                    print-color-adjust: exact;
                }
            </style>
        </head>
        <body>
            ${cvContent}
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        setTimeout(function() { window.close(); }, 1000);
                    }, 500);
                }
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    showMessage('PDF print dialog opened! Make sure to enable "Background graphics" in print options to preserve the blue background color.', 'success');
    
    setTimeout(() => {
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }, 1000);
}

// Show success/error messages
function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(-20px)';
    
    // Insert message at the top of the form container
    const formContainer = document.querySelector('.form-container');
    formContainer.insertBefore(messageDiv, formContainer.firstChild);
    
    // Animate message
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.5s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 100);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.transition = 'all 0.5s ease';
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 500);
        }
    }, 5000);
}

// Form validation on input
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
});

// Individual input validation
function validateInput(input) {
    const value = input.value.trim();
    
    // Remove existing validation classes
    input.classList.remove('valid', 'invalid');
    
    if (input.hasAttribute('required') && !value) {
        input.classList.add('invalid');
        return false;
    }
    
    if (input.type === 'email' && value && !isValidEmail(value)) {
        input.classList.add('invalid');
        return false;
    }
    
    if (value) {
        input.classList.add('valid');
    }
    
    return true;
}

// Add CSS for validation states
const style = document.createElement('style');
style.textContent = `
    input.valid, textarea.valid {
        border-color: #27ae60;
        background-color: #f8fff8;
    }
    
    input.invalid, textarea.invalid {
        border-color: #e74c3c;
        background-color: #fff8f8;
    }
`;
document.head.appendChild(style);

// Alternative download method using print
function printCV() {
    const element = document.getElementById('cv-preview');
    if (!element || !element.innerHTML.trim() || element.innerHTML.includes('Preview will appear here')) {
        showMessage('Please generate your CV first before printing!', 'error');
        return;
    }
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    const cvContent = element.innerHTML;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CV - Print</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                    print-color-adjust: exact;
                }
                body {
                    font-family: 'Georgia', 'Times New Roman', serif;
                    margin: 0;
                    padding: 15mm;
                    line-height: 1.4;
                    color: #000;
                    background: white;
                }
                h1 { font-size: 24px; margin-bottom: 10px; }
                h2 { font-size: 18px; margin: 15px 0 10px 0; }
                h3 { font-size: 16px; margin: 10px 0 5px 0; }
                p { margin: 5px 0; }
                img { max-width: 120px; height: auto; }
                @media print {
                    body { 
                        margin: 0; 
                        padding: 15mm;
                        font-size: 12px;
                    }
                    .no-print { display: none; }
                    h1 { font-size: 20px; }
                    h2 { font-size: 16px; }
                    h3 { font-size: 14px; }
                    /* Force background colors to print */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
                @page {
                    margin: 15mm;
                    size: A4;
                }
            </style>
        </head>
        <body>
            ${cvContent}
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                    }, 1000);
                };
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    showMessage('Print window opened. Use "Save as PDF" in print options to download as PDF.', 'success');
}

// Simple download as HTML file
function downloadAsHTML() {
    const element = document.getElementById('cv-preview');
    if (!element || !element.innerHTML.trim() || element.innerHTML.includes('Preview will appear here')) {
        showMessage('Please generate your CV first!', 'error');
        return;
    }
    
    const cvContent = element.innerHTML;
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>My CV</title>
    <style>
        * {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            print-color-adjust: exact;
        }
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            margin: 20px;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        h1 { color: #2c3e50; font-size: 2em; margin-bottom: 10px; }
        h2 { color: #2c3e50; font-size: 1.5em; margin: 20px 0 10px 0; border-bottom: 2px solid #ff0000; padding-bottom: 5px; }
        h3 { color: #2c3e50; margin: 10px 0 5px 0; }
        p { margin: 5px 0; }
        img { max-width: 150px; height: auto; border-radius: 50%; }
        .center { text-align: center; }
        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
    </style>
</head>
<body>
    ${cvContent}
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showMessage('CV downloaded as HTML file! You can open it in any browser and print as PDF.', 'success');
}
