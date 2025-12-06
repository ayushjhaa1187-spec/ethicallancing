// Configuration and Constants
const CONFIG = {
    APP_NAME: 'EthicalFreelance',
    VERSION: '1.0.0',
    
    // API Configuration (Mock - using localStorage instead)
    API: {
        BASE_URL: '/api',
        ENDPOINTS: {
            AUTH: {
                LOGIN: '/auth/login',
                SIGNUP: '/auth/signup',
                LOGOUT: '/auth/logout'
            },
            JOBS: {
                LIST: '/jobs',
                CREATE: '/jobs/create',
                APPLY: '/jobs/apply'
            },
            USERS: {
                PROFILE: '/users/profile',
                UPDATE: '/users/update'
            }
        }
    },
    
    // API Keys (Not used in this mock version)
    KEYS: {
        STRIPE_PUBLIC_KEY: 'pk_test_example',
        GOOGLE_MAPS_API: 'AIzaSyExample',
        GA_TRACKING_ID: 'UA-XXXXXXX-X'
    },
    
    // App Settings
    SETTINGS: {
        JOBS_PER_PAGE: 10,
        SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        MIN_PASSWORD_LENGTH: 6,
        CATEGORIES: ['Development', 'Design', 'Marketing', 'Writing', 'Support']
    },
    
    // Feature Flags
    FEATURES: {
        ENABLE_PAYMENTS: false,
        ENABLE_CHAT: false,
        ENABLE_NOTIFICATIONS: true
    }
};

// Freeze the config object to prevent modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.API);
Object.freeze(CONFIG.KEYS);
Object.freeze(CONFIG.SETTINGS);
Object.freeze(CONFIG.FEATURES);
