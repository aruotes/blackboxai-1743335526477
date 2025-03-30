// Form Handling
document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('formSuccess').classList.remove('hidden');
            contactForm.reset();
        });
    }

    // Initialize localStorage for registrations if not exists
    if (!localStorage.getItem('registrations')) {
        localStorage.setItem('registrations', JSON.stringify([]));
    }

    // Countdown Timer for Event Date (April 5, 2025)
    const eventDate = new Date('April 5, 2025 18:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = eventDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update countdown every second
    if (document.getElementById('countdown')) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Registration Form Submission
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                collegeId: document.getElementById('collegeId').value,
                diet: document.getElementById('diet').value,
                status: 'Pending', // Default status
                registrationDate: new Date().toISOString()
            };
            
            // Save to localStorage
            const registrations = JSON.parse(localStorage.getItem('registrations'));
            registrations.push(formData);
            localStorage.setItem('registrations', JSON.stringify(registrations));
            
            // Show success message
            document.getElementById('successMessage').classList.remove('hidden');
            registrationForm.reset();
            
            // Redirect to home after 3 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        });
    }

    // Admin Login Functionality
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Check credentials (username: bca, password: madhusudan)
            if (username === 'bca' && password === 'madhusudan') {
                // Set session
                sessionStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'admin-dashboard.html';
            } else {
                alert('Invalid credentials!');
            }
        });
    }
});

// Admin Dashboard Functions
function loadRegistrations() {
    if (!sessionStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin-login.html';
        return;
    }

    const registrations = JSON.parse(localStorage.getItem('registrations'));
    const tableBody = document.getElementById('registrationsTableBody');
    
    if (tableBody) {
        tableBody.innerHTML = '';
        
        registrations.forEach((reg, index) => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200 hover:bg-gray-50';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${reg.name}</td>
                <td class="px-6 py-4 whitespace-nowrap">${reg.email}</td>
                <td class="px-6 py-4 whitespace-nowrap">${reg.phone}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${reg.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                        ${reg.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <button onclick="toggleApproval(${index})" class="text-blue-600 hover:text-blue-800 font-medium">
                        ${reg.status === 'Approved' ? 'Revoke' : 'Approve'}
                    </button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${reg.status === 'Approved' ? 
                        `<button onclick="generatePass(${index})" class="text-green-600 hover:text-green-800 font-medium mr-2">
                            Generate Pass
                        </button>` : 
                        '<span class="text-gray-400 mr-2">Approve first</span>'}
                    <button onclick="deleteRegistration(${index})" class="text-red-600 hover:text-red-800 font-medium">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
}

function toggleApproval(index) {
    const registrations = JSON.parse(localStorage.getItem('registrations'));
    registrations[index].status = registrations[index].status === 'Approved' ? 'Pending' : 'Approved';
    localStorage.setItem('registrations', JSON.stringify(registrations));
    loadRegistrations();
}

function generatePass(index) {
    const registration = JSON.parse(localStorage.getItem('registrations'))[index];
    
    // In a real implementation, we would generate a PDF here
    // For demo purposes, we'll just show an alert with pass details
    alert(`Pass generated for: ${registration.name}\nEmail: ${registration.email}\nStatus: ${registration.status}`);
    
    // In a full implementation, we would use jsPDF to create a downloadable PDF
    // This would include university branding, QR code, etc.
}

function deleteRegistration(index) {
    if (confirm('Are you sure you want to delete this registration?')) {
        const registrations = JSON.parse(localStorage.getItem('registrations'));
        registrations.splice(index, 1);
        localStorage.setItem('registrations', JSON.stringify(registrations));
        loadRegistrations();
    }
}

// Client Login Functionality
const clientLoginForm = document.getElementById('clientLoginForm');
if (clientLoginForm) {
    clientLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('clientEmail').value;
        const registrations = JSON.parse(localStorage.getItem('registrations'));
        const user = registrations.find(reg => reg.email === email);

        const errorElement = document.getElementById('clientError');
        
        if (user) {
            if (user.status === 'Approved') {
                sessionStorage.setItem('clientLoggedIn', 'true');
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'client-pass.html';
            } else {
                errorElement.textContent = 'Your registration is not yet approved by admin.';
                errorElement.classList.remove('hidden');
            }
        } else {
            errorElement.textContent = 'No registration found with this email. Please check your email or register first.';
            errorElement.classList.remove('hidden');
        }
    });
}

function generateClientPass(user) {
    // Create a simple pass (in real implementation, use jsPDF for PDF generation)
    const passContent = `
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-8">
            <div class="bg-blue-800 p-4 text-white text-center">
                <h2 class="text-2xl font-bold">BCA Freshers' Party 2024</h2>
                <p class="text-sm">April 5, 2025 | IPS Auditorium</p>
            </div>
            <div class="p-8">
                <div class="flex items-center mb-6">
                    <img src="https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg" alt="University Logo" class="h-16 w-16 rounded-full mr-4">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">${user.name}</h3>
                        <p class="text-gray-600">${user.collegeId}</p>
                    </div>
                </div>
                <div class="mb-6">
                    <p class="text-gray-700 mb-2"><span class="font-bold">Email:</span> ${user.email}</p>
                    <p class="text-gray-700 mb-2"><span class="font-bold">Status:</span> <span class="text-green-600 font-bold">${user.status}</span></p>
                    <p class="text-gray-700"><span class="font-bold">Dietary:</span> ${user.diet}</p>
                </div>
                <div class="text-center mt-8">
                    <button onclick="window.print()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                        <i class="fas fa-download mr-2"></i>Download Pass
                    </button>
                    <button onclick="clientLogout()" class="ml-4 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium">
                        <i class="fas fa-sign-out-alt mr-2"></i>Logout
                    </button>
                </div>
            </div>
        </div>
    `;
    return passContent;
}

function clientLogout() {
    sessionStorage.removeItem('clientLoggedIn');
    sessionStorage.removeItem('currentUser');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function adminLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}
