import { Injectable, OnModuleInit } from '@nestjs/common';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbService implements OnModuleInit {
  private client: MongoClient;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const dbUrl = this.configService.get<string>('DATABASE_URL');

    if (!dbUrl) {
      throw new Error('❌ DATABASE_URL is not defined in environment variables!');
    }

    this.client = new MongoClient(dbUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await this.run();
  }

  private async run() {
    try {
      console.log('🔄 Connecting to MongoDB...');
      await this.client.connect();
      await this.client.db('myDatabase').command({ ping: 1 });
      console.log('✅ Successfully connected to MongoDB!');
    } catch (err) {
      console.error('❌ MongoDB connection failed', err);
    }
  }

  getDb(dbName: string) {
    if (!this.client) {
      throw new Error('❌ MongoClient not initialized yet!');
    }
    return this.client.db(dbName);
  }
}
