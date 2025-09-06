# Detox E2E Architecture - Showcase (React Native)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Detox](https://img.shields.io/badge/Detox-00D2FF?style=for-the-badge&logo=detox&logoColor=white)](https://github.com/wix/Detox)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## **Purpose**
This repository showcases **my approach to E2E test automation architecture and design** for a **React Native app** using **Detox**, developed in late 2024.

**⚠️ Confidentiality Note:** Application-specific business logic, actual UI selectors, and proprietary workflows have been carefully abstracted while preserving the technical architecture that demonstrates my work on this project.

## **Technologies**
- **TypeScript** - Type-safe implementation
- **Detox** - Gray box E2E testing for React Native
- **Jest** - Test framework with custom reporters and lifecycle hooks
- **MongoDB** - Database integration for test data management

## **Highlights**

### **1. Hierarchical Event Logging System**
A custom logging system that provides detailed insights into test execution:

```typescript
export class EventHelper {
  public static async track<T>(
    description: string, 
    action: () => Promise<T>, 
    options: EventOptions = {}
  ): Promise<T> {
    const start = performance.now();
    const record = this.createEventRecord(description, start);
    
    try {
      this.log('info', `${this.getIndent()}▶ ${description}`);
      this.depth += 1;
      
      const result = await action();
      
      this.depth -= 1;
      record.succeeded = true;
      record.duration = performance.now() - record.startTime;
      
      return result;
    } catch (error) {
      this.logError(error, description, start);
      throw error;
    }
  }
}
```

**Sample Output:**
```
▶ Sign In Flow
  ▶ Setup
    ✓ Initialize App (1,247ms)
  ▶ Authentication Process  
    ▶ Navigate to Sign In (89ms)
    ▶ Fill Credentials (156ms)
    ▶ Submit Form (1,034ms)
    ✓ Verify Home Screen Load (445ms)
  ✓ Sign In Flow completed (3,283ms)
```

### **2. Type-Safe Page Object Architecture**
Demonstrates TypeScript usage with strict typing and inheritance patterns:

```typescript
interface HomeNavigationDestination extends NavigationDestination {
  readonly primaryAction: string;
  readonly secondaryFeature: string;
  readonly accountSettings: string;
  readonly helpCenter: string;
}

class Home extends Page {
  private readonly navigationDestination: HomeNavigationDestination = {
    primaryAction: this.homeSelectors.primaryActionButton,
    secondaryFeature: this.homeSelectors.secondaryFeatureButton,
    accountSettings: this.homeSelectors.accountSettingsButton,
    helpCenter: this.homeSelectors.helpCenterButton,
  };

  public async navigate(destination: keyof HomeNavigationDestination): Promise<void> {
    const element = Page.$(this.navigationDestination[destination]);
    
    await Page.waitForElementToBeClickable(element);
    await Page.navigate(this.navigationDestination, destination);
  }
}
```

### **3. Test Flow System**
Reusable workflows with comprehensive error handling and lifecycle management:

```typescript
export async function authenticationFlow(
  params: AuthParams,
  options: FlowOptions = DefaultOptions
): Promise<void> {
  try {
    const { setup } = options;

    if (setup) {
      await EventHelper.track('Setup', setup);
    }

    await EventHelper.track('Authentication Flow', async () => {
      validateParams(params);
      
      await LandingScreen.navigate('signIn');
      await SignIn.waitForLoad();
      await SignIn.fillCredentials(params);
      
      await verifySuccessfulAuthentication();
    });
  } finally {
    const { teardown } = options;
    if (teardown) {
      await EventHelper.track('Teardown', teardown);
    }
  }
}
```

---
