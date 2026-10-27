import { test, expect } from "../fixtures/test.fixture"
import path from "path";


test.describe('Test create post', () => {

    test('TC_01: Create post success', async ({ page, loggedInHomePage, createPostModal, homePage, postCleaner }) => {
        const responsePromise = page.waitForResponse(response =>
            response.url().includes('/api/posts') &&
            response.request().method() === 'POST'
        );

        const title = `Các kỹ thuật kiểm thử phần mềm phổ biến ${Date.now()}`;
        const content =
            'Trong môn học Kiểm thử phần mềm, chúng ta cần nắm vững các kỹ thuật như Kiểm thử giá trị biên, Phân vùng tương đương và Kiểm thử tích hợp để đảm bảo chất lượng sản phẩm.';

        await createPostModal.createPost(title, content);

        const response = await responsePromise;
        expect(response.status()).toBe(200);
        
        const resData = await response.json();
        
        const postId = resData.id
        expect(postId, 'Bài viết phải tạo thành công và trả về ID').toBeDefined();

        postCleaner.track(postId);

        await page.goto(`/post-detail/${postId}`);
        await expect(page.getByRole('heading', { name: title })).toBeVisible();
    });
    test('TC_02: Create post without title', async ({ loggedInHomePage, createPostModal }) => {
        const title = '';
        const content =
            'Trong môn học Kiểm thử phần mềm, chúng ta cần nắm vững các kỹ thuật như Kiểm thử giá trị biên, Phân vùng tương đương và Kiểm thử tích hợp để đảm bảo chất lượng sản phẩm.';

        await createPostModal.createPost(title, content);
        await expect(createPostModal.titleError).toHaveText('Tiêu đề phải từ 10 đến 200 ký tự');
    });

    test('TC_03: Create post with max length title', async ({ loggedInHomePage, createPostModal }) => {
        const title = 'test1 '.repeat(200);
        const content =
            'Trong môn học Kiểm thử phần mềm, chúng ta cần nắm vững các kỹ thuật như Kiểm thử giá trị biên, Phân vùng tương đương và Kiểm thử tích hợp để đảm bảo chất lượng sản phẩm.';

        await createPostModal.createPost(title, content);
        await expect(createPostModal.getPostError()).toHaveText('Tiêu đề phải từ 10 đến 200 ký tự');
    });

    test('TC_04: Create post with max length content', async ({ loggedInHomePage, createPostModal }) => {
        const title = 'test1 '.repeat(10);
        const content =
            'Trong môn học Kiểm thử phần mềm, chúng ta cần nắm vững các kỹ thuật như Kiểm thử giá trị biên, Phân vùng tương đương và Kiểm thử tích hợp để đảm bảo chất lượng sản phẩm.'.repeat(2000);

        await createPostModal.createPost(title, content);
        await expect(createPostModal.getPostError()).toHaveText('Nội dung phải từ 50 đến 5000 ký tự');
    });

    test('TC_05: Create post with upload file', async ({ page, loggedInHomePage, createPostModal, postCleaner }) => {
        const responsePromise = page.waitForResponse(response =>
            response.url().includes('/api/posts') &&
            response.request().method() === 'POST'
        );

        const title = `Bài viết có ảnh đính kèm ${Date.now()}`;
        const content =
            'Trong môn học Kiểm thử phần mềm, chúng ta cần nắm vững các kỹ thuật như Kiểm thử giá trị biên, Phân vùng tương đương và Kiểm thử tích hợp để đảm bảo chất lượng sản phẩm.';
        const imagePath = path.resolve(__dirname, '../../blogapp/static/img/lucasimg.jpg');

        await createPostModal.createPost(title, content, imagePath);

        const res = await responsePromise;
        expect(res.status()).toBe(200);
        const post = await res.json();

        if (post?.id) {
            postCleaner.track(post.id);
        }
    });

    test('TC_06: Báo lỗi khi tiêu đề dưới 10 ký tự', async ({ loggedInHomePage, createPostModal }) => {
        await createPostModal.createPost(
            'Ngắn',
            'Nội dung kiểm thử phần mềm hợp lệ đạt yêu cầu tối thiểu hơn 50 ký tự cho hệ thống bài viết.'
        );

        await expect(createPostModal.titleError).toBeVisible();
        await expect(createPostModal.titleError).toHaveText('Tiêu đề phải từ 10 đến 200 ký tự');
    });

    test('TC_07: Báo lỗi khi nội dung vượt quá 5000 ký tự', async ({ loggedInHomePage, createPostModal }) => {
        const title = 'Tiêu đề bài viết kiểm tra độ dài';
        const longContent = 'Nội dung kiểm thử vượt quá giới hạn 5000 ký tự quy định. '.repeat(120);

        await createPostModal.createPost(title, longContent);
        await expect(createPostModal.getPostError()).toHaveText('Nội dung phải từ 50 đến 5000 ký tự');
    });
})