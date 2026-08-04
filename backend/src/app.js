import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import cropRoutes from './routes/crop.routes.js';
import journalRoutes from './routes/journal.routes.js';
import alertRoutes from './routes/alert.routes.js';
import advisoryRoutes from './routes/advisory.routes.js';
import chatRoutes from './routes/chat.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import mspRoutes from './routes/msp.routes.js';
import discoverRoutes from './routes/discover.routes.js';
import schemesRoutes from './routes/schemes.routes.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: config.frontendUrl,
        credentials: true,
    })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (config.nodeEnv === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'DigiKheti Backend is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/msp', mspRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/schemes', schemesRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
