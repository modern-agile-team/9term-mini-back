const PostStorage = require('../storages/postStorage');

class Post {
    constructor({ content, post_img }, user_id) {
        this.user_id = user_id || null;
        this.content = content;
        this.post_img = post_img;
    }

    // 게시물의 유효성 검사
    validate(isUpdate = false) {
        if (!isUpdate && !this.user_id) {
            throw new Error("user_id는 필수입니다.");
        }
        if (!this.post_img && this.post_img.startsWith('http')) {
            throw new Error("유효하지 않은 이미지 URL입니다.");
        }
        return true;
    }
    static async getAllPosts() {
            return await PostStorage.getAllPosts();   
    }
    
    // 게시물 생성
    async createPost() {
        this.validate();
        const postData = { user_id: this.user_id, content: this.content, post_img: this.post_img };

        return await PostStorage.createPost(postData);
    }

    // 게시물 수정
    async updatePost(post_id) {
        this.validate(true);
        const postData = { post_id, content: this.content, post_img: this.post_img };

        return await PostStorage.updatePost(post_id, postData);
    }

    // 게시물 삭제
    async deletePost(post_id) {
        // DB에서 게시물 삭제 (Storage 호출)
        return await PostStorage.deletePost(post_id);
    }
}

module.exports = Post;