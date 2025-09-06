import { EventHelper } from '../Helpers/EventHelper';
import { MongoHelper } from '../Helpers/MongoHelper';

export class DatabaseLifecycle {
  private static mongoHelper: MongoHelper;

  static async initialize(): Promise<void> {
    await EventHelper.track('Initialize MongoDB', async () => {
      DatabaseLifecycle.mongoHelper = await MongoHelper.getInstance();
    });
  }

  static async cleanup(): Promise<void> {
    await EventHelper.track('Cleanup MongoDB', async () => {
      if (DatabaseLifecycle.mongoHelper) {
        await DatabaseLifecycle.mongoHelper.close();
      }
    });
  }
}
