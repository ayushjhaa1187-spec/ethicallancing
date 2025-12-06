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
        { icon: '💼', title: 'Enterprise Clients', desc: 'Connect with Fortune 500 companies and startups' },
        { icon: '⚡', title: 'Instant Matching', desc: 'AI-powered job recommendations based on your skills' },
        { icon: '🔒', title: 'Escrow Protection', desc: 'Milestone-based payments held securely until completion' },
        { icon: '🎯', title: 'Quality Projects', desc: 'Vetted opportunities with competitive rates' },
        { icon: '📈', title: 'Career Growth', desc: 'Build your portfolio with high-impact projects' },
        { icon: '🌟', title: 'Top 3% Talent', desc: 'Join an elite network of verified professionals' }
    ],
    
    // Platform stats
    stats: [
    stats: [
        { number: '50K+', label: 'Projects Completed' },
        { number: '$25M+', label: 'Earned by Freelancers' },
        { number: '15K+', label: 'Active Freelancers' },
        { number: '95%', label: 'Client Satisfaction' }
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
