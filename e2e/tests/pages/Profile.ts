import { Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProfilePage extends BasePage{
    
    private readonly profileName = this.find('body > section h4');
    async goTo(){
        await this.navigateTo('/profile');
    }

    getProfileName(): Locator{
        return this.profileName;
    }
}