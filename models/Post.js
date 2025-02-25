const PostStorage = require('../storages/postStorage');

class Post {
    constructor({ content, post_img }, user_id) {
        this.user_id = user_id;
        this.content = content;
        this.post_img = post_img;
    }

    static async getAllPosts() {
        return PostStorage.getAllPosts();   
    }
    
    // 게시물 생성
    async createPost() {
        const postData = { user_id: this.user_id, content: this.content, post_img: this.post_img };
        return PostStorage.createPost(postData);
    }

    // 게시물 수정
    async updatePost(post_id) {
        const postData = { post_id, content: this.content, post_img: this.post_img };
        return PostStorage.updatePost(post_id, postData);
    }

    // 게시물 삭제
    static async deletePost(post_id) {
        return PostStorage.deletePost(post_id);
    }
}

module.exports = Post;