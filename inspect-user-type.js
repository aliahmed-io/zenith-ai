const { MongoClient } = require('mongodb');
require('dotenv').config();

async function run() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const user = await client.db().collection('user').findOne({});
    console.log("USER _ID TYPE:", typeof user._id, user._id.constructor.name);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
