// API Layer - Business Logic
const API = {
    // Generic request handler (mock implementation)
    async request(endpoint, options = {}) {
        // In a real app, this would make HTTP requests
        // For now, we'll simulate API calls with promises
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 100);
        });
    },
    
    // Authentication API
    auth: {
        async login(email, password) {
            const users = DB.getAll('USERS') || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                const { password, ...userWithoutPassword } = user;
                DB.setCurrentUser(userWithoutPassword);
                return { success: true, user: userWithoutPassword };
            }
            
            return { success: false, error: 'Invalid email or password' };
        },
        
        async signup(userData) {
            const users = DB.getAll('USERS') || [];
            
            // Check if user already exists
            if (users.find(u => u.email === userData.email)) {
                return { success: false, error: 'Email already registered' };
            }
            
            // Create new user
            const newUser = {
                id: Date.now(),
                ...userData,
                createdAt: new Date().toISOString()
            };
            
            DB.add('USERS', newUser);
            
            const { password, ...userWithoutPassword } = newUser;
            DB.setCurrentUser(userWithoutPassword);
            
            return { success: true, user: userWithoutPassword };
        },
        
        logout() {
            DB.clearCurrentUser();
            return { success: true };
        },
        
        isLoggedIn() {
            return DB.getCurrentUser() !== null;
        },
        
        getCurrentUser() {
            return DB.getCurrentUser();
        }
    },
    
    // Jobs API
    jobs: {
        async getAll(filters = {}) {
            let jobs = DB.getAll('JOBS') || [];
            
            // Apply filters
            if (filters.category && filters.category !== 'all') {
                jobs = jobs.filter(job => job.category === filters.category);
            }
            
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                jobs = jobs.filter(job => 
                    job.title.toLowerCase().includes(searchLower) ||
                    job.company.toLowerCase().includes(searchLower) ||
                    job.skills.some(skill => skill.toLowerCase().includes(searchLower))
                );
            }
            
            return { success: true, jobs };
        },
        
        async create(jobData) {
            const currentUser = DB.getCurrentUser();
            
            if (!currentUser) {
                return { success: false, error: 'Must be logged in to post jobs' };
            }
            
            const newJob = {
                id: Date.now(),
                ...jobData,
                postedBy: currentUser.email,
                postedAt: new Date().toISOString()
            };
            
            DB.add('JOBS', newJob);
            
            return { success: true, job: newJob };
        },
        
        async apply(jobId) {
            const currentUser = DB.getCurrentUser();
            
            if (!currentUser) {
                return { success: false, error: 'Must be logged in to apply' };
            }
            
            const applications = DB.getAll('APPLICATIONS') || [];
            
            // Check if already applied
            if (applications.find(app => app.jobId === jobId && app.userId === currentUser.id)) {
                return { success: false, error: 'Already applied to this job' };
            }
            
            const application = {
                id: Date.now(),
                jobId,
                userId: currentUser.id,
                appliedAt: new Date().toISOString()
            };
            
            DB.add('APPLICATIONS', application);
            
            return { success: true, application };
        }
    }
};
