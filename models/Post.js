const PostStorage = require('../storages/postStorage');

class Post {
    constructor({ content, postImg }, userId, existingImg) {
        this.userId = userId;
        this.content = content;
        this.postImg = postImg || existingImg;
    }
    
    static async getAllPosts() {
        return PostStorage.getAllPosts();   
    }

    static async getPost(postId) {
        return PostStorage.getPost(postId);
    }

    // 게시물 생성
    async createPost() {
        const postData = { userId: this.userId, content: this.content, postImg: this.postImg };
        return PostStorage.createPost(postData);
    }

    // 게시물 수정
    async updatePost(postId) {
        const postData = { content: this.content, postImg: this.postImg };
        return PostStorage.updatePost(postId, this.userId, postData);
    }

    // 게시물 삭제
    static async deletePost(postId, userId) {
        return PostStorage.deletePost(postId, userId);
    }

   
}


module.exports = Post;