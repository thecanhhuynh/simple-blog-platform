import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#pwd');
        this.loginButton = page.locator('button[type="submit"]');
        this.errorMessage = page.locator('#login-error');
    }


    async login(username: string, password: string) {
        await this.typing(this.usernameInput, username);
        await this.typing(this.passwordInput, password);
        await this.click(this.loginButton);
    }

    async goTo() {
        await this.navigateTo('/login');
    }

    async loginWithKeyboard(username: string, pass: string, delay?: number) {
        await this.pressSequentially(this.usernameInput, username, delay);
        await this.typing(this.passwordInput, pass);
        await this.pressKey(this.passwordInput, 'Enter');
    }

    async expectErrorVisible(message?: string) {
        await expect(this.errorMessage).toBeVisible();
        if (message)
            await expect(this.errorMessage).toContainText(message);
    }

    getErrorMessage(): Locator {
        return this.errorMessage
    }

    getUsernameInput(): Locator {
        return this.usernameInput;
    }

    getPasswordInput(): Locator {
        return this.passwordInput;
    }

    getLoginButton(): Locator {
        return this.loginButton;
    }

}