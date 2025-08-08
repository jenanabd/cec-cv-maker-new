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
        <input type="text" placeholder="Degree" class="degree">
        <input type="text" placeholder="Institution" class="school">
        <input type="text" placeholder="Year" class="year">
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
        skills: document.getElementById('skills').value.trim(),
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
    
    const education = [];
    for (let i = 0; i < degrees.length; i++) {
        const degree = degrees[i].value.trim();
        const school = schools[i].value.trim();
        const year = years[i].value.trim();
        
        if (degree || school || year) {
            education.push({ degree, school, year });
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
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Generate CV HTML with professional layout
function generateCVHTML(data) {
    let html = `
        <div style="
            max-width: 800px;
            margin: 0 auto;
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            padding: 40px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        ">
            <!-- Header Section -->
            <div style="
                text-align: center;
                border-bottom: 3px solid #2c3e50;
                padding-bottom: 30px;
                margin-bottom: 40px;
            ">
                ${data.photo ? `
                    <img src="${data.photo}" style="
                        width: 150px;
                        height: 150px;
                        border-radius: 50%;
                        object-fit: cover;
                        border: 4px solid #2c3e50;
                        margin-bottom: 20px;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    " alt="Profile Photo">
                ` : ''}
                <h1 style="
                    color: #2c3e50;
                    font-size: 2.5em;
                    margin: 10px 0;
                    font-weight: bold;
                    letter-spacing: 1px;
                ">${data.name}</h1>
                <div style="
                    font-size: 1.1em;
                    color: #666;
                    margin-top: 15px;
                ">
                    <span style="margin: 0 15px;"><strong>📧</strong> ${data.email}</span>
                    <span style="margin: 0 15px;"><strong>📱</strong> ${data.phone}</span>
                    ${data.address ? `<br><span style="margin-top: 10px; display: inline-block;"><strong>📍</strong> ${data.address}</span>` : ''}
                </div>
            </div>
    `;
    
    // Education section
    if (data.education.length > 0) {
        html += `
            <div style="margin-bottom: 40px;">
                <h2 style="
                    color: #2c3e50;
                    font-size: 1.8em;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #ff0000;
                    display: flex;
                    align-items: center;
                ">
                    <span style="margin-right: 10px;">🎓</span> EDUCATION
                </h2>
        `;
        data.education.forEach(edu => {
            if (edu.degree || edu.school || edu.year) {
                html += `
                    <div style="
                        margin-bottom: 20px;
                        padding: 15px;
                        background: #f8f9fa;
                        border-left: 4px solid #ff0000;
                        border-radius: 0 8px 8px 0;
                    ">
                        <h3 style="
                            color: #2c3e50;
                            margin: 0 0 5px 0;
                            font-size: 1.2em;
                        ">${edu.degree || 'Degree Not Specified'}</h3>
                        <p style="
                            margin: 5px 0;
                            color: #666;
                            font-style: italic;
                        ">${edu.school || 'Institution Not Specified'}</p>
                        ${edu.year ? `<p style="
                            margin: 5px 0;
                            color: #ff0000;
                            font-weight: bold;
                        ">${edu.year}</p>` : ''}
                    </div>
                `;
            }
        });
        html += '</div>';
    }
    
    // Experience section
    if (data.experience.length > 0) {
        html += `
            <div style="margin-bottom: 40px;">
                <h2 style="
                    color: #2c3e50;
                    font-size: 1.8em;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #ff0000;
                    display: flex;
                    align-items: center;
                ">
                    <span style="margin-right: 10px;">💼</span> PROFESSIONAL EXPERIENCE
                </h2>
        `;
        data.experience.forEach(exp => {
            if (exp.title || exp.company || exp.period || exp.description) {
                html += `
                    <div style="
                        margin-bottom: 25px;
                        padding: 20px;
                        background: #f8f9fa;
                        border-left: 4px solid #ff0000;
                        border-radius: 0 8px 8px 0;
                    ">
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: start;
                            margin-bottom: 10px;
                        ">
                            <div>
                                <h3 style="
                                    color: #2c3e50;
                                    margin: 0;
                                    font-size: 1.3em;
                                ">${exp.title || 'Position Not Specified'}</h3>
                                <p style="
                                    margin: 5px 0;
                                    color: #666;
                                    font-style: italic;
                                    font-size: 1.1em;
                                ">${exp.company || 'Company Not Specified'}</p>
                            </div>
                            ${exp.period ? `<span style="
                                color: #ff0000;
                                font-weight: bold;
                                background: #fff;
                                padding: 5px 10px;
                                border-radius: 15px;
                                font-size: 0.9em;
                            ">${exp.period}</span>` : ''}
                        </div>
                        ${exp.description ? `<p style="
                            margin: 15px 0 0 0;
                            color: #444;
                            line-height: 1.6;
                            text-align: justify;
                        ">${exp.description}</p>` : ''}
                    </div>
                `;
            }
        });
        html += '</div>';
    }
    
    // Skills section
    if (data.skills) {
        const skillsArray = data.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        if (skillsArray.length > 0) {
            html += `
                <div style="margin-bottom: 30px;">
                    <h2 style="
                        color: #2c3e50;
                        font-size: 1.8em;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #ff0000;
                        display: flex;
                        align-items: center;
                    ">
                        <span style="margin-right: 10px;">🚀</span> SKILLS & EXPERTISE
                    </h2>
                    <div style="
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                        padding: 20px;
                        background: #f8f9fa;
                        border-radius: 8px;
                        border-left: 4px solid #ff0000;
                    ">
            `;
            skillsArray.forEach(skill => {
                html += `
                    <span style="
                        background: linear-gradient(45deg, #ff0000, #cc0000);
                        color: white;
                        padding: 8px 15px;
                        border-radius: 20px;
                        font-size: 0.9em;
                        font-weight: bold;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    ">${skill}</span>
                `;
            });
            html += `
                    </div>
                </div>
            `;
        }
    }
    
    html += `
            <!-- Footer -->
            <div style="
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                color: #666;
                font-size: 0.9em;
            ">
                <p>Generated with CEC CV Maker</p>
            </div>
        </div>
    `;
    
    return html;
}

// Download CV as PDF with proper error handling
function downloadCV() {
    const downloadBtn = document.querySelector('#download-btn button');
    const originalText = downloadBtn.innerHTML;
    
    try {
        downloadBtn.innerHTML = 'Preparing PDF <div class="loading"></div>';
        downloadBtn.disabled = true;
        
        const element = document.getElementById('cv-preview');
        
        if (!element || !element.innerHTML.trim()) {
            throw new Error('No CV content to download');
        }
        
        // Configure PDF options
        const opt = {
            margin: 10,
            filename: 'my_cv.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                allowTaint: true
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };
        
        // Generate and download PDF
        html2pdf().set(opt).from(element).save().then(() => {
            showMessage('CV downloaded successfully!', 'success');
        }).catch((error) => {
            console.error('PDF generation error:', error);
            showMessage('Failed to download PDF. Please try again.', 'error');
        }).finally(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
        });
        
    } catch (error) {
        console.error('Download error:', error);
        showMessage('Failed to download CV. Please try again.', 'error');
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }
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
