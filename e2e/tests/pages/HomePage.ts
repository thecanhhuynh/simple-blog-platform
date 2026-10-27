import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class HomePage extends BasePage{

    private readonly postListContainer: Locator;


    constructor(page: Page){
        super(page);
        this.postListContainer = page.locator('#post-list-container');
    }

    async goTo(){
        await this.navigateTo('/') 
    }

    getPost(postId: number): Locator{
        return this.postListContainer.locator(`#post-${postId}`);
    }

    getPostByTitle(title: string): Locator{
        return this.page.getByRole('heading', {name: title});
    }

}