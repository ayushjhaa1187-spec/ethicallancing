// Database Layer - LocalStorage Management
const DB = {
    KEYS: {
        USERS: 'ef_users',
        JOBS: 'ef_jobs',
        CURRENT_USER: 'ef_current_user',
        APPLICATIONS: 'ef_applications'
    },
    
    // Initialize default data
    init() {
        if (!this.getAll('JOBS') || this.getAll('JOBS').length === 0) {
            this.save('JOBS', this.defaultJobs);
        }
        if (!this.getAll('USERS')) {
            this.save('USERS', []);
        }
        if (!this.getAll('APPLICATIONS')) {
            this.save('APPLICATIONS', []);
        }
    },
    
    // Default jobs data
    defaultJobs: [
        {
            id: 1,
            title: 'Senior Frontend Developer',
            company: 'TechCorp',
            category: 'Development',
            rate: '$80-120/hr',
            skills: ['React', 'TypeScript', 'CSS'],
            location: 'Remote',
            description: 'Build modern web applications',
            postedBy: 'demo',
            postedAt: new Date().toISOString()
        },
        {
            id: 2,
            title: 'UI/UX Designer',
            company: 'DesignHub',
            category: 'Design',
            rate: '$60-90/hr',
            skills: ['Figma', 'Adobe XD', 'Prototyping'],
            location: 'Remote',
            description: 'Create beautiful user interfaces',
            postedBy: 'demo',
            postedAt: new Date().toISOString()
        },
        {
            id: 3,
            title: 'Content Writer',
            company: 'MediaWorks',
            category: 'Writing',
            rate: '$40-60/hr',
            skills: ['SEO', 'Copywriting', 'Research'],
            location: 'Remote',
            description: 'Write engaging blog posts and articles',
            postedBy: 'demo',
            postedAt: new Date().toISOString()
        },
        {
            id: 4,
            title: 'Digital Marketing Specialist',
            company: 'GrowthLabs',
            category: 'Marketing',
            rate: '$50-80/hr',
            skills: ['Google Ads', 'Facebook Ads', 'Analytics'],
            location: 'Remote',
            description: 'Drive growth through digital campaigns',
            postedBy: 'demo',
            postedAt: new Date().toISOString()
        }
    ],
    
    // Platform features
    features: [
        { icon: '🛡️', title: 'Verified Clients', desc: 'All clients are verified for your safety' },
        { icon: '💰', title: 'Secure Payments', desc: 'Payment protection for every project' },
        { icon: '🌍', title: 'Global Opportunities', desc: 'Work with clients worldwide' },
        { icon: '📊', title: 'Track Progress', desc: 'Monitor your projects and earnings' },
        { icon: '💬', title: '24/7 Support', desc: 'Get help whenever you need it' },
        { icon: '⭐', title: 'Build Reputation', desc: 'Grow your profile with reviews' }
    ],
    
    // Platform stats
    stats: [
        { number: '10,000+', label: 'Active Freelancers' },
        { number: '5,000+', label: 'Projects Completed' },
        { number: '$2M+', label: 'Paid to Freelancers' },
        { number: '98%', label: 'Satisfaction Rate' }
    ],
    
    // Generic CRUD operations
    getAll(key) {
        const data = localStorage.getItem(this.KEYS[key]);
        return data ? JSON.parse(data) : null;
    },
    
    save(key, data) {
        localStorage.setItem(this.KEYS[key], JSON.stringify(data));
    },
    
    add(key, item) {
        const items = this.getAll(key) || [];
        items.push(item);
        this.save(key, items);
        return item;
    },
    
    findById(key, id) {
        const items = this.getAll(key) || [];
        return items.find(item => item.id === id);
    },
    
    findByField(key, field, value) {
        const items = this.getAll(key) || [];
        return items.find(item => item[field] === value);
    },
    
    update(key, id, updates) {
        const items = this.getAll(key) || [];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            this.save(key, items);
            return items[index];
        }
        return null;
    },
    
    delete(key, id) {
        const items = this.getAll(key) || [];
        const filtered = items.filter(item => item.id !== id);
        this.save(key, filtered);
    },
    
    // User session management
    setCurrentUser(user) {
        localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
    },
    
    getCurrentUser() {
        const user = localStorage.getItem(this.KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
    },
    
    clearCurrentUser() {
        localStorage.removeItem(this.KEYS.CURRENT_USER);
    }
};

// Initialize database on load
DB.init();
