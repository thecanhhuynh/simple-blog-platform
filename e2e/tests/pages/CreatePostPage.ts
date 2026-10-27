import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CreatePostPage extends BasePage {
    private readonly title: Locator;
    private readonly content: Locator;
    private readonly image: Locator;
    private readonly submitBtn: Locator;
    private readonly cancelBtn: Locator;
    private readonly modalCreatePost: Locator;
    private readonly openModalBtn: Locator;
    private readonly postError: Locator;
    readonly titleError: Locator;
    readonly contentError: Locator;

    constructor(page: Page) {
        super(page);
        this.title = page.locator('#title');
        this.content = page.locator('#content');
        this.image = page.locator('#image');
        this.submitBtn = page.locator('button[type="submit"]');
        this.cancelBtn = page.locator('button[data-bs-dismiss="modal"]');
        this.openModalBtn = page.locator('a[data-bs-target="#createPostModal"]');
        this.modalCreatePost = page.locator('#createPostModal');
        this.postError = page.locator('#post-error');
        this.titleError = this.modalCreatePost.locator('#title-error');
        this.contentError = this.modalCreatePost.locator('#content-error');
    }

    async goTo() {
        await this.openModalBtn.click()
        await expect(this.modalCreatePost).toBeVisible();
    }

    async uploadFile(target: string | Locator, filePath: string): Promise<void> {
        if (typeof target === 'string')
            await this.find(target).setInputFiles(filePath);
        else
            await target.setInputFiles(filePath);
    }

    async createPost(title: string, content: string, image?: string): Promise<void> {
        if (!await this.modalCreatePost.isVisible()) {
            await this.goTo();
        }
        await this.typing(this.title, title);
        await this.typing(this.content, content);
        if (image != undefined)
            await this.uploadFile(this.image, image);
        await this.submitBtn.click();
    }


    getTitle(): Locator {
        return this.title;
    }

    getContent(): Locator {
        return this.content;
    }

    getImage(): Locator {
        return this.image;
    }

    getSubmitBtn(): Locator {
        return this.submitBtn;
    }

    getCancelBtn(): Locator {
        return this.cancelBtn;
    }

    getModalCreatePost(): Locator {
        return this.modalCreatePost;
    }

    getPostError(): Locator {
        return this.postError;
    }
}