// Authentication Manager for Claulancer
// Manages user authentication state and role-based access

class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.userRole = null; // 'freelancer' or 'client'
        this.userData = null;
        this.init();
    }

    // Initialize authentication on page load
    init() {
        const token = localStorage.getItem('authToken');
        const user = this.getUserFromStorage();
        
        if (token && user) {
            this.isAuthenticated = true;
            this.userRole = user.role;
            this.userData = user;
            this.updateUI();
        }
    }

    // Login function
    login(token, userData) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        this.isAuthenticated = true;
        this.userRole = userData.role;
        this.userData = userData;
        this.updateUI();
        return true;
    }

    // Logout function
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.isAuthenticated = false;
        this.userRole = null;
        this.userData = null;
        this.updateUI();
        window.location.reload();
    }

    // Get user from localStorage
    getUserFromStorage() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Update UI based on authentication state
    updateUI() {
        const profileSection = document.getElementById('profile-section');
        const authButtons = document.getElementById('authButtons');
        const userInfo = document.getElementById('userInfo');

        if (this.isAuthenticated) {
            // Hide profile section if not authenticated
            if (profileSection) {
                profileSection.style.display = 'block';
                this.renderProfile();
            }
            
            // Update auth buttons
            if (authButtons) {
                authButtons.style.display = 'none';
            }
            
            // Show user info
            if (userInfo) {
                userInfo.style.display = 'flex';
                const userName = document.getElementById('userName');
                if (userName && this.userData) {
                    userName.textContent = this.userData.name || 'User';
                }
            }
        } else {
            // Hide profile for non-authenticated users
            if (profileSection) {
                profileSection.style.display = 'none';
            }
            
            // Show auth buttons
            if (authButtons) {
                authButtons.style.display = 'flex';
            }
            
            // Hide user info
            if (userInfo) {
                userInfo.style.display = 'none';
            }
        }
    }

    // Render appropriate profile based on user role
    renderProfile() {
        const profileSection = document.getElementById('profile-section');
        if (!profileSection || !this.isAuthenticated) return;

        if (this.userRole === 'freelancer') {
            this.renderFreelancerProfile();
        } else if (this.userRole === 'client') {
            this.renderClientProfile();
        }
    }

    // Render Freelancer Profile
    renderFreelancerProfile() {
        const profileSection = document.getElementById('profile-section');
        if (!profileSection) return;

        profileSection.innerHTML = `
            <h2>Your Freelancer Profile</h2>
            
            <div class="profile-header" style="display: flex; gap: 30px; margin-bottom: 30px;">
                <div class="avatar" style="width: 150px; height: 150px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; font-weight: bold;">
                    ${this.userData.name ? this.userData.name.substring(0, 2).toUpperCase() : 'FL'}
                </div>
                
                <div class="profile-info" style="flex: 1;">
                    <h3 style="font-size: 28px; margin-bottom: 10px;">${this.userData.name || 'Freelancer Name'}</h3>
                    <p style="font-size: 18px; color: #666; margin-bottom: 15px;">${this.userData.title || 'Professional Title'}</p>
                    
                    <div class="availability" style="display: flex; gap: 15px; margin-bottom: 15px;">
                        <span style="padding: 5px 15px; background-color: #10b981; color: white; border-radius: 20px; font-size: 14px;">Available for Hire</span>
                        <span style="color: #666;">⭐ ${this.userData.rating || '5.0'} (${this.userData.reviews || '0'} reviews)</span>
                    </div>
                    
                    <div class="rates" style="display: flex; gap: 20px;">
                        <div><strong>Hourly Rate:</strong> $${this.userData.hourlyRate || '50'}/hr</div>
                        <div><strong>Project Rate:</strong> $${this.userData.projectRate || '500'}+</div>
                    </div>
                </div>
            </div>

            <div class="skills-section" style="margin-bottom: 30px;">
                <h4 style="font-size: 20px; margin-bottom: 15px;">💼 Skills & Expertise</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${(this.userData.skills || ['React', 'Node.js', 'Python', 'AWS', 'MongoDB']).map(skill => 
                        `<span style="padding: 8px 16px; background-color: #e0e7ff; color: #4f46e5; border-radius: 8px; font-size: 14px;">${skill}</span>`
                    ).join('')}
                </div>
            </div>

            <div class="education-section" style="margin-bottom: 30px;">
                <h4 style="font-size: 20px; margin-bottom: 15px;">🎓 Education</h4>
                <div style="padding: 15px; background-color: white; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <p><strong>${this.userData.education?.degree || 'B.Tech in Computer Science'}</strong></p>
                    <p style="color: #666;">${this.userData.education?.institution || 'IIT Delhi'} | ${this.userData.education?.year || '2018'}</p>
                </div>
            </div>

            <div class="ai-suggestions" style="padding: 20px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <h4 style="font-size: 18px; margin-bottom: 15px;">🤖 AI Suggestions for You</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 10px;"><strong>Project Takeover:</strong> E-commerce Platform Redesign - $5,000</li>
                    <li style="margin-bottom: 10px;"><strong>Skills Learning:</strong> Consider learning Kubernetes</li>
                    <li><strong>Recommended:</strong> Complete AWS certification for higher rates</li>
                </ul>
            </div>
        `;
    }

    // Render Client Profile
    renderClientProfile() {
        const profileSection = document.getElementById('profile-section');
        if (!profileSection) return;

        profileSection.innerHTML = `
            <h2>Your Client Profile</h2>
            
            <div class="profile-header" style="display: flex; gap: 30px; margin-bottom: 30px;">
                <div class="company-logo" style="width: 150px; height: 150px; border-radius: 12px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; font-weight: bold;">
                    ${this.userData.company ? this.userData.company.substring(0, 2).toUpperCase() : 'CO'}
                </div>
                
                <div class="company-info" style="flex: 1;">
                    <h3 style="font-size: 28px; margin-bottom: 10px;">${this.userData.company || 'Company Name'}</h3>
                    <p style="font-size: 18px; color: #666; margin-bottom: 15px;">${this.userData.industry || 'Technology & Software'}</p>
                    
                    <div class="stats" style="display: flex; gap: 20px; margin-bottom: 15px;">
                        <div><strong>Posted Jobs:</strong> ${this.userData.postedJobs || '12'}</div>
                        <div><strong>Active Hires:</strong> ${this.userData.activeHires || '5'}</div>
                        <div><strong>Total Spent:</strong> $${this.userData.totalSpent || '25,000'}</div>
                    </div>
                    
                    <div class="rating">
                        <span style="color: #666;">⭐ ${this.userData.rating || '4.9'} Client Rating (${this.userData.reviews || '0'} reviews)</span>
                    </div>
                </div>
            </div>

            <div class="company-details" style="margin-bottom: 30px;">
                <h4 style="font-size: 20px; margin-bottom: 15px;">🏢 Company Information</h4>
                <div style="padding: 20px; background-color: white; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <div style="margin-bottom: 15px;"><strong>Industry:</strong> ${this.userData.industry || 'Technology'}</div>
                    <div style="margin-bottom: 15px;"><strong>Company Size:</strong> ${this.userData.companySize || '50-200 employees'}</div>
                    <div style="margin-bottom: 15px;"><strong>Location:</strong> ${this.userData.location || 'San Francisco, CA'}</div>
                    <div><strong>About:</strong> ${this.userData.about || 'We are looking for talented freelancers.'}</div>
                </div>
            </div>

            <div class="ai-suggestions" style="padding: 20px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <h4 style="font-size: 18px; margin-bottom: 15px;">🤖 AI Recommendations</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 10px;"><strong>Top Talent:</strong> 5 highly-rated developers available</li>
                    <li style="margin-bottom: 10px;"><strong>Average Cost:</strong> $3,500 per project</li>
                    <li><strong>Best Time to Post:</strong> Today 2-5 PM for maximum visibility</li>
                </ul>
            </div>
        `;
    }

    // Check if user is authenticated
    checkAuth() {
        return this.isAuthenticated;
    }

    // Get current user role
    getRole() {
        return this.userRole;
    }

    // Get user data
    getUser() {
        return this.userData;
    }
}

// Initialize auth manager when DOM is loaded
let authManager;
document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();
    
    // Setup logout handler
    const logoutBtn = document.querySelector('[onclick="handleLogout()"]');
    if (logoutBtn) {
        logoutBtn.onclick = () => authManager.logout();
    }
});

// Mock login function for testing
function mockLogin(role = 'freelancer') {
    const mockData = role === 'freelancer' ? {
        name: 'Alex Kumar',
        title: 'Full Stack Developer',
        role: 'freelancer',
        rating: '5.0',
        reviews: '24',
        hourlyRate: '75',
        projectRate: '1500',
        skills: ['React', 'Node.js', 'Python', 'AWS', 'MongoDB', 'Docker'],
        education: {
            degree: 'B.Tech in Computer Science',
            institution: 'IIT Delhi',
            year: '2018'
        }
    } : {
        name: 'Tech Corp',
        company: 'Tech Corp',
        role: 'client',
        industry: 'Technology & Software',
        rating: '4.9',
        reviews: '56',
        postedJobs: '24',
        activeHires: '8',
        totalSpent: '45000',
        companySize: '100-500 employees',
        location: 'San Francisco, CA',
        about: 'Leading technology company seeking top talent'
    };
    
    authManager.login('mock-token-' + Date.now(), mockData);
}
