import { Db, MongoClient, MongoClientOptions } from 'mongodb';

interface OTPResult {
  phoneCode?: string;
  emailCode?: string;
}

export class MongoHelper {
  private static instance: MongoHelper | null = null;

  private db: Db | null = null;

  private client: MongoClient | null = null;

  private readonly dbUri: string;

  private readonly dbOptions: MongoClientOptions;

  private constructor() {
    this.dbUri = MongoHelper.buildDbUri();
    this.dbOptions = MongoHelper.buildDbOptions();
  }

  private static buildDbUri(): string {
    const { DB_ACCOUNT_NAME, DB_PORT, DB_NAME } = process.env;

    return `mongodb://${DB_ACCOUNT_NAME}.sanitized.com:${DB_PORT}/${DB_NAME}?ssl=true`;
  }

  private static buildDbOptions(): MongoClientOptions {
    return {
      auth: {
        user: process.env.DB_USER ?? '',
        password: process.env.DB_PASSWORD ?? '',
      },
      connectTimeoutMS: 10000,
      useUnifiedTopology: true,
    };
  }

  public static async getInstance(): Promise<MongoHelper> {
    if (!MongoHelper.instance) {
      MongoHelper.instance = new MongoHelper();
    }

    return MongoHelper.instance;
  }

  private async connect(): Promise<void> {
    if (this.db) return;

    try {
      this.client = await MongoClient.connect(this.dbUri, this.dbOptions);
      this.db = this.client.db(process.env.DB_NAME);
    } catch (error) {
      throw new Error(`MongoDB connection failed: ${error}`);
    }
  }

  private getCollection(collectionName: string) {
    if (!this.db) {
      throw new Error('Database connection not established');
    }

    return this.db.collection(collectionName);
  }

  private async getCode(collectionName: string, query: object, codeKey: string): Promise<string | undefined> {
    try {
      const collection = this.getCollection(collectionName);
      const documents = await collection.find(query).sort({ _id: -1 }).limit(1).toArray();

      return documents[0]?.[codeKey];
    } catch (error) {
      throw new Error(`Failed to retrieve code from ${collectionName}: ${error}`);
    }
  }

  public async getOTP(phoneNumber?: string, emailAddress?: string): Promise<OTPResult | undefined> {
    if (!phoneNumber && !emailAddress) {
      throw new Error('Either phone number or email address must be provided');
    }

    await this.connect();
    const result: OTPResult = {};

    if (phoneNumber) {
      result.phoneCode = await this.getCode(process.env.DB_COLLECTION_PHONE ?? '', { phoneNumber }, 'phoneCode');
    }

    if (emailAddress) {
      result.emailCode = await this.getCode(
        process.env.DB_COLLECTION_EMAIL ?? '',
        { email: emailAddress },
        'emailCode',
      );
    }

    return Object.keys(result).length > 0 ? result : undefined;
  }

  public async close(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
        this.db = null;
      }
    } catch (error) {
      throw new Error(`Failed to close MongoDB connection: ${error}`);
    }
  }
}
