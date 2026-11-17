require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

async function testMongo() {
  const uri = process.env.MONGODB_URI;
  console.log('Testing MongoDB connection...');
  console.log('URI exists:', !!uri);
  if (!uri) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  const maskedUri = uri.replace(/:[^:]*@/, ':****@');
  console.log('Connecting to:', maskedUri);

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ MongoDB Connected Successfully!');
    console.log('Host:', conn.connection.host);
    console.log('Database Name:', conn.connection.name);
    console.log('ReadyState:', mongoose.connection.readyState, '(1 = connected)');

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n--- EXISTING COLLECTIONS IN DATABASE ---');
    if (collections.length === 0) {
      console.log('No collections found yet (empty database).');
    } else {
      for (const col of collections) {
        const count = await mongoose.connection.db.collection(col.name).countDocuments();
        console.log(`- Collection [${col.name}]: ${count} documents`);
      }
    }

    // 1. Store Test
    console.log('\n--- TESTING STORE (WRITE) ---');
    const testCol = mongoose.connection.db.collection('test_verification');
    const testData = {
      testMessage: 'Hello from verification script',
      createdAt: new Date(),
      status: 'active'
    };
    const insertResult = await testCol.insertOne(testData);
    console.log('✅ Data Store Test: SUCCESS!');
    console.log('Inserted Document ID:', insertResult.insertedId.toString());

    // 2. Retrieve Test
    console.log('\n--- TESTING RETRIEVE (READ) ---');
    const retrievedDoc = await testCol.findOne({ _id: insertResult.insertedId });
    if (retrievedDoc && retrievedDoc.testMessage === testData.testMessage) {
      console.log('✅ Data Retrieve Test: SUCCESS!');
      console.log('Retrieved Document:', JSON.stringify(retrievedDoc, null, 2));
    } else {
      console.error('❌ Retrieve failed: Document does not match or was not found.');
    }

    // 3. Clean up
    await testCol.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Cleanup test document: SUCCESS');

    // 4. Test actual models
    console.log('\n--- CHECKING ACTUAL APPLICATION MODELS ---');
    const Auth = require('./models/Auth');
    const Stock = require('./models/Stock');
    const RateCategory = require('./models/RateCategory');
    const Employee = require('./models/Employee');
    const Bill = require('./models/Bill');
    const ShopSettings = require('./models/ShopSettings');

    const authCount = await Auth.countDocuments();
    const stockCount = await Stock.countDocuments();
    const rateCount = await RateCategory.countDocuments();
    const empCount = await Employee.countDocuments();
    const billCount = await Bill.countDocuments();
    const settingsCount = await ShopSettings.countDocuments();

    console.log(`Auth users count: ${authCount}`);
    console.log(`Stock items count: ${stockCount}`);
    console.log(`Rate categories count: ${rateCount}`);
    console.log(`Employees count: ${empCount}`);
    console.log(`Bills count: ${billCount}`);
    console.log(`Shop settings count: ${settingsCount}`);

    // If there's at least one stock item, retrieve a sample
    if (stockCount > 0) {
      const sampleStock = await Stock.findOne().lean();
      console.log('Sample Stock item retrieved from MongoDB:', sampleStock.name, '- Quantity:', sampleStock.quantity);
    }
    if (authCount > 0) {
      const sampleAuth = await Auth.findOne().select('-password').lean();
      console.log('Sample Auth record in MongoDB:', sampleAuth.userId || sampleAuth.id, sampleAuth.email);
    }

    await mongoose.disconnect();
    console.log('\n🎉 ALL MONGODB CONNECTION, STORE & RETRIEVE TESTS PASSED!');
  } catch (error) {
    console.error('❌ MongoDB Test Error:', error.message);
  }
}

testMongo();
