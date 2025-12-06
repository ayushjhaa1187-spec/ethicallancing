// Main Application Logic
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    renderFeatures();
    renderJobs();
    renderStats();
    setupModalListeners();
});

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    if (sectionId === 'jobs-section') renderJobs();
}

function openModal(modalId) {
    const currentUser = API.auth.getCurrentUser();
    if (modalId === 'postJobModal' && !currentUser) {
        showToast('Please login to post a job', 'error');
        openModal('loginModal');
        return;
    }
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

function setupModalListeners() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal.id);
        });
    });
}

function renderFeatures() {
    const grid = document.getElementById('featuresGrid');
    grid.innerHTML = DB.features.map(f => `
        <div class="feature-card">
            <div class="feature-icon">${f.icon}</div>
            <h3>${f.title}</h3>
            <p>${f.desc}</p>
        </div>
    `).join('');
}

async function renderJobs(filters = {}) {
    const result = await API.jobs.getAll(filters);
    const grid = document.getElementById('jobsGrid');
    if (!result.success || result.jobs.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No jobs found</p>';
        return;
    }
    grid.innerHTML = result.jobs.map(job => `
        <div class="job-card">
            <h3>${escapeHtml(job.title)}</h3>
            <p class="company">${escapeHtml(job.company)}</p>
            <div class="job-meta">
                <span class="category">${escapeHtml(job.category)}</span>
                <span class="rate">${escapeHtml(job.rate)}</span>
                <span class="location">\uD83D\uDCCD ${escapeHtml(job.location)}</span>
            </div>
            <div class="job-skills">
                ${job.skills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
            </div>
            <p class="job-description">${escapeHtml(job.description)}</p>
            <button class="btn btn-primary" onclick="applyToJob(${job.id})">Apply Now</button>
        </div>
    `).join('');
}

function renderStats() {
    const grid = document.getElementById('statsGrid');
    grid.innerHTML = DB.stats.map(s => `
        <div class="stat-card">
            <div class="stat-number">${s.number}</div>
            <div class="stat-label">${s.label}</div>
        </div>
    `).join('');
}

function filterJobs() {
    const category = document.getElementById('categoryFilter').value;
    const search = document.getElementById('searchJobs').value;
    renderJobs({ category, search });
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    errorEl.textContent = '';
    if (!email || !password) {
        errorEl.textContent = 'Please fill in all fields';
        return;
    }
    const result = await API.auth.login(email, password);
    if (result.success) {
        closeModal('loginModal');
        checkAuthState();
        showToast('Logged in successfully!', 'success');
    } else {
        errorEl.textContent = result.error;
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const accountType = document.getElementById('accountType').value;
    const errorEl = document.getElementById('signupError');
    errorEl.textContent = '';
    if (!name || !email || !password) {
        errorEl.textContent = 'Please fill in all fields';
        return;
    }
    if (password.length < CONFIG.SETTINGS.MIN_PASSWORD_LENGTH) {
        errorEl.textContent = `Password must be at least ${CONFIG.SETTINGS.MIN_PASSWORD_LENGTH} characters`;
        return;
    }
    if (!email.includes('@')) {
        errorEl.textContent = 'Please enter a valid email';
        return;
    }
    const result = await API.auth.signup({ name, email, password, accountType });
    if (result.success) {
        closeModal('signupModal');
        checkAuthState();
        showToast('Account created successfully!', 'success');
    } else {
        errorEl.textContent = result.error;
    }
}

function handleLogout() {
    API.auth.logout();
    checkAuthState();
    showToast('Logged out successfully', 'success');
    showSection('home-section');
}

function checkAuthState() {
    const user = API.auth.getCurrentUser();
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfo');
    if (user) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        document.getElementById('userName').textContent = user.name;
    } else {
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
    }
}

async function handlePostJob(e) {
    e.preventDefault();
    const jobData = {
        title: document.getElementById('jobTitle').value,
        company: document.getElementById('jobCompany').value,
        category: document.getElementById('jobCategory').value,
        rate: document.getElementById('jobRate').value,
        location: document.getElementById('jobLocation').value,
        description: document.getElementById('jobDescription').value,
        skills: document.getElementById('jobSkills').value.split(',').map(s => s.trim())
    };
    const errorEl = document.getElementById('postJobError');
    errorEl.textContent = '';
    if (!jobData.title || !jobData.company || !jobData.rate) {
        errorEl.textContent = 'Please fill in all required fields';
        return;
    }
    const result = await API.jobs.create(jobData);
    if (result.success) {
        closeModal('postJobModal');
        showToast('Job posted successfully!', 'success');
        renderJobs();
    } else {
        errorEl.textContent = result.error;
    }
}

async function applyToJob(jobId) {
    if (!API.auth.isLoggedIn()) {
        showToast('Please login to apply for jobs', 'error');
        openModal('loginModal');
        return;
    }
    const result = await API.jobs.apply(jobId);
    if (result.success) {
        showToast('Application submitted successfully!', 'success');
    } else {
        showToast(result.error, 'error');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}
