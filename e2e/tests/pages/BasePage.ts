import { expect, Locator, Page } from "@playwright/test";


export abstract class BasePage {
    readonly page: Page;
    private readonly navbarBrand: Locator;
    constructor(page: Page) {
        this.page = page;
        this.navbarBrand = page.locator('.navbar-brand');
    }

    getNav(): Locator{
        return this.navbarBrand;
    }
    find(selector: string): Locator {
        return this.page.locator(selector);
    }

    async finds(selector: string): Promise<Locator[]> {
        return await this.page.locator(selector).all();
    }

    async click(target: string | Locator): Promise<void> {
        if (typeof target === 'string')
            await this.find(target).click();
        else
            await target.click();
    }

    async dblclick(target: string | Locator): Promise<void> {
        if (typeof target === 'string')
            await this.find(target).dblclick();
        else
            await target.dblclick();
    }

    async hover(target: string | Locator): Promise<void> {
        if (typeof target === 'string')
            await this.find(target).hover();
        else
            await target.hover();
    }

    async typing(target: string | Locator, text: string): Promise<void> {
        if (typeof target === 'string')
            await this.find(target).fill(text);
        else
            await target.fill(text);
    }

    async pressSequentially(target: string | Locator, text: string, delay: number = 50): Promise<void> {
        const locator = typeof target === 'string' ? this.find(target) : target;
        await locator.pressSequentially(text, { delay });
    }

    async pressKey(target: string | Locator, key: string): Promise<void> {
        const loc = typeof target === 'string' ? this.find(target) : target;
        await loc.press(key);
    }

    async getInputValue(target: string | Locator): Promise<string> {
        const locator = typeof target === 'string' ? this.find(target) : target;
        return await locator.inputValue();
    }

    async getAttribute(target: string | Locator, attrName: string): Promise<string | null> {
        const loc = typeof target === 'string' ? this.find(target) : target;
        return await loc.getAttribute(attrName);
    }

    async getText(target: string | Locator): Promise<string> {
        const loc = typeof target === 'string' ? this.find(target) : target;
        return (await loc.innerText()).trim();
    }

    async navigateTo(path: string = ''): Promise<void> {
        await this.page.goto(path);
    }

    async checkMessageError(locator: string, expectedMessage: string): Promise<void> {
        await expect(this.find(locator)).toHaveText(expectedMessage);
    }

    async reloadPage(): Promise<void> {
    await this.page.reload();
  }

  async goBackPage(): Promise<void> {
    await this.page.goBack();
  }

  async goForwardPage(): Promise<void> {
    await this.page.goForward();
  }

  async waitForURLPattern(urlPattern: string): Promise<void> {
    await this.page.waitForURL(urlPattern);
  }
}