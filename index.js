const http = require('http');
const { MongoClient } = require('mongodb');

const PORT = 3000;
const MONGO_URL = 'mongodb://admin:qwert@localhost:27018';

const createServer = async () => {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log('✅ Connected to MongoDB');

  const db = client.db('users');
  console.log(db);
  
  const users = db.collection('users');

  const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // GET /users
    if (req.method === 'GET' && req.url === '/users') {
      const allUsers = await users.find().toArray();
      console.log(allUsers);
      
      res.writeHead(200);
      res.end(JSON.stringify(allUsers));
    }

    // POST /users
    else if (req.method === 'POST' && req.url === '/users') {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', async () => {
        try {
          const newUser = JSON.parse(body);
          await users.insertOne(newUser);
          res.writeHead(201);
          res.end(JSON.stringify({ message: 'User added successfully', user: newUser }));
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON or DB error' }));
        }
      });
    }

    // Not Found
    else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Route not found' }));
    }
  });

  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

createServer().catch(err => {
  console.error('❌ MongoDB connection failed:', err);
});


// docker run -d -p8081:8081 --name mongo-express-doc -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin -e ME_CONFIG_MONGODB_ADMINPASSWORD=qwert -e ME_CONFIG_MONGODB_URL="mongodb://admin:qwert@mongo:27017" mongo-express