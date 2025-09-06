import { Selectors } from '../Selectors/Selectors';
import {
  TestUtils,
  NativeElement,
  PopupType,
  NavigationDestination,
  ElementOptions,
  PopupOptions,
  SelectorOptions,
  WaitForOptions,
} from '../Utils/Utils';

class Page {
  protected static selectors = Selectors;

  protected static $(testID: string, options: SelectorOptions = {}): NativeElement {
    return TestUtils.Elements.$(testID, options);
  }

  protected static async click(element: NativeElement, options: ElementOptions = {}): Promise<void> {
    await TestUtils.Elements.click(element, options);
  }

  protected static async type(element: NativeElement, text: string, options: ElementOptions = {}): Promise<void> {
    await TestUtils.Elements.type(element, text, options);
  }

  protected static async checkbox(element: NativeElement, toggleValue: boolean): Promise<void> {
    await TestUtils.Elements.checkbox(element, toggleValue);
  }

  protected static async waitForElementToExist(element: NativeElement, options: WaitForOptions = {}): Promise<void> {
    await TestUtils.Elements.waitForElementToExist(element, options);
  }

  protected static async waitForElementToBeVisible(
    element: NativeElement,
    options: WaitForOptions = {},
  ): Promise<void> {
    await TestUtils.Elements.waitForElementToBeVisible(element, options);
  }

  protected static async waitForElementToBeClickable(
    element: NativeElement,
    options: WaitForOptions = {},
  ): Promise<void> {
    await TestUtils.Elements.waitForElementToBeClickable(element, options);
  }

  protected static async isAndroid(): Promise<boolean> {
    return await TestUtils.Device.isAndroid();
  }

  protected static async sleep(timeInSeconds: number): Promise<void> {
    await TestUtils.Device.sleep(timeInSeconds);
  }

  protected static async screenshot(screenshotName: string): Promise<void> {
    await TestUtils.Device.screenshot(screenshotName);
  }

  protected static async pressBack(options: { isButton?: boolean } = {}): Promise<void> {
    await TestUtils.Device.pressBack(options);
  }

  protected static async navigate<T extends NavigationDestination>(
    navigationDestination: T,
    destination: keyof T,
  ): Promise<void> {
    await TestUtils.Navigation.navigate(navigationDestination, destination);
  }

  protected static async waitForLoad(
    containerSelector: string,
    options: { additionalSelectors?: string[] } = {},
  ): Promise<void> {
    await TestUtils.Navigation.waitForLoad(containerSelector, options);
  }

  protected static async popup(type: PopupType, options: PopupOptions = {}): Promise<void> {
    await TestUtils.Popup.handlePopup(type, options);
  }
}

export default Page;
