import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await client.connect();
      const database = client.db('noise-signal');
      const collection = database.collection('countdown');
      
      const result = await collection.findOne({});
      res.json({ targetTime: result ? result.targetTime : null });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch countdown' });
    } finally {
      await client.close();
    }
  } else if (req.method === 'POST') {
    try {
      await client.connect();
      const database = client.db('noise-signal');
      const collection = database.collection('countdown');
      
      await collection.updateOne(
        {},
        { $set: { targetTime: req.body.targetTime } },
        { upsert: true }
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update countdown' });
    } finally {
      await client.close();
    }
  }
}
