import Page from '../Page';

class Home extends Page {
  private homeSelectors = Page.selectors.home;

  public async waitForLoad(): Promise<void> {
    const { containerView } = this.homeSelectors;
    await Page.waitForLoad(containerView);
  }
}

export default new Home();
