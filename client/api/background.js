import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await client.connect();
      const database = client.db('noise-signal');
      const collection = database.collection('background');
      
      const result = await collection.findOne({});
      res.json({ imageData: result ? result.imageData : null });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch background' });
    } finally {
      await client.close();
    }
  } else if (req.method === 'POST') {
    try {
      await client.connect();
      const database = client.db('noise-signal');
      const collection = database.collection('background');
      
      await collection.updateOne(
        {},
        { $set: { imageData: req.body.imageData } },
        { upsert: true }
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update background' });
    } finally {
      await client.close();
    }
  } else if (req.method === 'DELETE') {
    try {
      await client.connect();
      const database = client.db('noise-signal');
      const collection = database.collection('background');
      
      await collection.deleteOne({});
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete background' });
    } finally {
      await client.close();
    }
  }
}
