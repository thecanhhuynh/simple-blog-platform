import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class RegisterPage extends BasePage {
    private readonly nameInput: Locator;
    private readonly usernameInput: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly confirmPasswordInput: Locator;
    private readonly avatarInput: Locator;
    private readonly registerButton: Locator;
    private readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.nameInput = page.locator('#name');
        this.usernameInput = page.locator('#username');
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#pwd');
        this.confirmPasswordInput = page.locator('#confirm');
        this.avatarInput = page.locator('#avatar');
        this.registerButton = page.locator('button[type="submit"]');
        this.errorMessage = page.locator('.alert-danger');
    }

    async goTo() {
        await this.navigateTo('/register');
    }

    async uploadFile(target: string | Locator, filePath: string): Promise<void> {
        if (typeof target === 'string')
            await this.find(target).setInputFiles(filePath);
        else
            await target.setInputFiles(filePath);
    }
    async register(name: string, username: string, email: string, password: string, confirmPassword: string, avatarFilePath: string) {
        await this.typing(this.nameInput, name);
        await this.typing(this.usernameInput, username);
        await this.typing(this.emailInput, email);
        await this.typing(this.passwordInput, password);
        await this.typing(this.confirmPasswordInput, confirmPassword);
        await this.uploadFile(this.avatarInput, avatarFilePath);
        await this.click(this.registerButton);
    }

    async getAllFormInputs(): Promise<Locator[]> {
        return await this.finds('form input');
    }

    async expectErrorVisible(messageSnippet?: string) {
        await expect(this.errorMessage).toBeVisible();
        if (messageSnippet) {
            await expect(this.errorMessage).toContainText(messageSnippet);
        }
    }

    getNameInput(): Locator {
        return this.nameInput;
    }

    getUsernameInput(): Locator {
        return this.usernameInput;
    }

    getEmailInput(): Locator {
        return this.emailInput;
    }

    getPasswordInput(): Locator {
        return this.passwordInput;
    }

    getConfirmPasswordInput(): Locator {
        return this.confirmPasswordInput;
    }

    getAvatarInput(): Locator {
        return this.avatarInput;
    }

    getRegisterButton(): Locator {
        return this.registerButton;
    }

    getErrorMessage(): Locator {
        return this.errorMessage;
    }

}