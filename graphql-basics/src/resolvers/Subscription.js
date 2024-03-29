const Subscription = {
    comment: {
        subscribe(parent, { postId }, { pubsub, db }, info) {
            const post = db.posts.find(post => post.id === postId && post.published)

            if (!post) throw new Error('Post does not exist or is not published.');

            return pubsub.asyncIterator(`comment ${postId}`);
        }
    },

    post: {
        subscribe(parent, args, { pubsub }, info) {
            return pubsub.asyncIterator('post');
        }
    }
}

export default Subscription;
