import test, { expect } from "@playwright/test";
import { RegisterPage } from "./pages/Register";
import path from "path";
import { LoginPage } from "./pages/Login";


test.describe('Test đăng ký', () => {
    let registerPage: RegisterPage;
    let loginPage: LoginPage

    test.beforeEach(async ({page}) =>{
        registerPage = new RegisterPage(page);
        loginPage = new LoginPage(page);
        await registerPage.goTo();
    });

    test('TC_01: Đăng ký thành công', async ({page}) => {
        const filePath = path.resolve(__dirname, '../../blogapp/static/img/lucasimg.jpg');
        await registerPage.register(
            'test',
            `testuser_${Date.now()}`,
            'test@example.com',
            'Password123',
            'Password123',
            filePath
        )
        await expect(page).toHaveURL('/login');
    })

    test('TC_02: Đăng ký username tồn tại, kiểm tra thông báo lỗi', async () => {
        const filePath = path.resolve(__dirname, '../../blogapp/static/img/lucasimg.jpg');
        await registerPage.register(
            'test',
            'canhhuynh',
            'test@example.com',
            'Password123',
            'Password123',
            filePath
        )
        await registerPage.expectErrorVisible('Username đã tồn tại!')
    })

    test('TC_03: Kiểm tra trạng thái element và cơ chế Waiting', async () => {
        await loginPage.goTo();

        await expect(loginPage.getLoginButton()).toBeEnabled();
        await loginPage.getLoginButton().waitFor({state: 'visible', timeout: 5000});
        await expect(loginPage.getErrorMessage()).toBeHidden();
    })

    test('TC_04: Thao tác chuột Hover và dblclick', async() =>{
        await registerPage.navigateTo('/');

        await registerPage.hover(registerPage.getNav())
    })

    test('TC_05: Quét và kiểm tra nhiều elements', async () =>{
        const allInputs = await registerPage.getAllFormInputs();

        expect(allInputs.length).toBeGreaterThan(0);

        for(const input of allInputs){
            await expect(input).toBeVisible();
        }
    })
})