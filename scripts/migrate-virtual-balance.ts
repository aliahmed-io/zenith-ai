import { connectToDatabase } from "../database/mongoose";

async function main() {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if(!db) throw new Error('MongoDB connection not found');
    
    console.log("Starting migration: Adding virtualBalance to users");
    const result = await db.collection("user").updateMany(
      { virtualBalance: { $exists: false } },
      { $set: { virtualBalance: 100000 } }
    );
    
    console.log(`Migration completed. Modified ${result.modifiedCount} users.`);
    process.exit(0);
  } catch (err) {
    console.error("ERROR: Migration failed");
    console.error(err);
    process.exit(1);
  }
}

main();
