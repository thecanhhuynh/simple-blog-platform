import test, { expect } from "@playwright/test";
import { LoginPage } from "./pages/Login";
import { ProfilePage } from "./pages/Profile";

test.describe('Test đăng nhập', () => {
    let loginPage: LoginPage;
    let profilePage: ProfilePage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        profilePage = new ProfilePage(page);
        await loginPage.goTo();
    })

    test('TC_01: Đăng nhập thành công, kiểm tra profile hợp lệ', async ({ page }) => {
        await loginPage.login('canhhuynh', '123456');
        await expect(page).toHaveURL('/');

        await profilePage.goTo();

        await expect(profilePage.getProfileName()).toHaveText('Thế Cảnh');
    })

    test('TC_02: Đăng nhập thất bại, kiểm tra thông báo lỗi', async ({ page }) => {
        await loginPage.login('canhhuynh', 'wrongpassword');
        await expect(loginPage.getErrorMessage()).toHaveText('Sai tên đăng nhập hoặc mật khẩu!');
    })

    test('TC_03: Gõ mô phỏng người dùng thật và submit bằng phím Enter', async ({ page }) => {
        await loginPage.loginWithKeyboard('canhhuynh', '123456', 100);

        await page.waitForURL('/');
        await expect(page).toHaveURL('/');
    })

    test('TC_04: Kiểm tra thuộc tính và giá trị trường dữ liệu bằng Getter', async ({ page }) => {
        const pwdType = await loginPage.getAttribute(
            loginPage.getPasswordInput(), 'type'
        )

        expect(pwdType).toBe('password');
        await loginPage.typing(loginPage.getUsernameInput(), 'canhhuynh');
        const usernameValue = await loginPage.getInputValue(loginPage.getUsernameInput());
        expect(usernameValue).toBe('canhhuynh');

        await expect(loginPage.getUsernameInput()).toHaveValue('canhhuynh');

    })

    test('TC_05: Điều hướng Navigation (Reload, GoBack, GoForward)', async ({ page }) => {
        await loginPage.navigateTo('/');
        await loginPage.goTo();

        await loginPage.typing(loginPage.getUsernameInput(), 'canhhuynh');
        await loginPage.reloadPage();
        await expect(loginPage.getUsernameInput()).toHaveValue('');

        await loginPage.goBackPage();
        await expect(page).toHaveURL('/');

        await loginPage.goForwardPage();
        await expect(page).toHaveURL('/login');
    })


});