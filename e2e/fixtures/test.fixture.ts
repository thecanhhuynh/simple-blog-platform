import { CreatePostPage } from "../tests/pages/CreatePostPage"
import { HomePage } from "../tests/pages/HomePage";
import { LoginPage } from "../tests/pages/Login";
import { test as baseTest, expect } from '@playwright/test';

type MyFixtures = {
    createPostModal: CreatePostPage;
    homePage: HomePage;
    loginPage: LoginPage;
    loggedInHomePage: HomePage;

    postCleaner: {
        track: (postId: number | string) => void;
    };
}

export const test = baseTest.extend<MyFixtures>({
    createPostModal: async ({ page }, use) => {
        const createPostModal = new CreatePostPage(page);
        await use(createPostModal);
    },

    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    loggedInHomePage: async ({ page, loginPage, homePage }, use) => {
        await loginPage.goTo();
        await loginPage.login('ngocson', '123456');
        await homePage.goTo();

        await use(homePage);
    },
    postCleaner: async ({ page }, use) => {
        const postIds: (number | string)[] = [];

        await use({
            track: (postId: number | string) => {
                postIds.push(postId);
            }
        })

        // TEARDOWN
        for (const id of postIds) {
            try {
                const res = await page.request.delete(`/api/posts/${id}`);

                if (res.ok()) {
                    console.log(`[CLEANUP] Đã xóa bài viết rác ID: ${id}`);
                } else {
                    console.warn(`[CLEANUP] Không xóa được bài ID: ${id}, status: ${res.status()}`);
                }
            }catch (error){
                console.error(`[CLEANUP ERROR] Lỗi khi dọn dẹp bài ID ${id}:`, error);
            }
        }
    }
})

export { expect };