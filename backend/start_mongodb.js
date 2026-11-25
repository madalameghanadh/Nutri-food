/**
 * Local MongoDB Server Runner for NutriRoute
 * Powers local development and MongoDB Compass connection on mongodb://127.0.0.1:27017/nutriroute
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

async function startServer() {
    console.log("====================================================");
    console.log("🍃 Starting Local MongoDB Server for NutriRoute...");
    console.log("====================================================");

    try {
        const dbPath = path.join(__dirname, '..', '.mongodb_data');
        if (!fs.existsSync(dbPath)) {
            fs.mkdirSync(dbPath, { recursive: true });
        }

        const mongod = await MongoMemoryServer.create({
            instance: {
                port: 27017,
                dbName: 'nutriroute',
                dbPath: dbPath,
                storageEngine: 'wiredTiger'
            }
        });

        const uri = mongod.getUri();
        console.log(`\n====================================================`);
        console.log(`✅ LOCAL MONGODB SERVER IS RUNNING!`);
        console.log(`====================================================`);
        console.log(`📍 Connection URI : mongodb://127.0.0.1:27017/nutriroute`);
        console.log(`🧭 MongoDB Compass: Open MongoDB Compass and click 'Connect'`);
        console.log(`====================================================\n`);

        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            console.log("\n🍃 Stopping MongoDB Server...");
            await mongod.stop();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            console.log("\n🍃 Stopping MongoDB Server...");
            await mongod.stop();
            process.exit(0);
        });

        // Keep process alive
        setInterval(() => {}, 10000);
    } catch (err) {
        console.error("❌ Failed to start MongoDB server:", err);
        process.exit(1);
    }
}

startServer();
