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
        if (!this.post_img) {
            throw new Error("게시물 내용 또는 이미지는 필수입니다.");
        }
        return true;
    }

    // 게시물 생성
    async createPost() {
        this.validate();
        // 이미지 URL이 존재하는 경우에만 비즈니스 로직 진행
        if (this.post_img && this.post_img.startsWith('http')) {
            return { user_id: this.user_id, content: this.content, post_img: this.post_img };
        } else {
            throw new Error("유효하지 않은 이미지 URL입니다.");
        }
    }

    // 게시물 수정
    async updatePost(post_id) {
        this.validate(true);
        if (this.post_img && this.post_img.starts) {
        return { post_id, content: this.content, post_img: this.post_img };
        } else {
            throw new Error("유효하지 않은 이미지 URL입니다.");
        }
    }
}

module.exports = Post;