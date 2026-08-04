import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

// Connect to MongoDB
await connectDB();

// Start server
const server = app.listen(config.port, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🌾 DigiKheti Backend Server                    ║
║                                                   ║
║   Environment: ${config.nodeEnv.padEnd(35)}║
║   Port: ${config.port.toString().padEnd(42)}║
║   URL: http://localhost:${config.port.toString().padEnd(31)}║
║                                                   ║
║   Status: ✅ Server is running                   ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
