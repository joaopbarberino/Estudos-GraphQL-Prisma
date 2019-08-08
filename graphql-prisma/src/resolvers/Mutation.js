import uuidv4 from 'uuid/v4';

const Mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some((user) => user.email === args.data.email);

        if (emailTaken) throw new Error('Email already in use.');

        const user = {
            id: uuidv4(),
            ...args.data
        };

        db.users.push(user);

        return user;
    },

    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex((user) => user.id === args.id);
        if (userIndex === -1) throw new Error('User does not exists.');

        const deletedUsers = db.users.splice(userIndex, 1);

        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id;
            if (match) {
                db.comments = db.comments.filter((comment) => comment.post !== post.id)
            }
            return !match;
        });
        db.comments = db.comments.filter((comment) => comment.author !== args.id)
        return deletedUsers[0];
    },

    updateUser(parent, args, ctx, info) {
        const { id, data } = args;
        const { db } = ctx;

        const user = db.users.find((user) => user.id === id);

        if (!user) throw new Error('User does not exists.');

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => user.email === data.email);

            if (emailTaken) throw new Error('This email is already in use.');

            user.email = data.email;
        }

        if (typeof data.name === 'string') {
            user.name = data.name;
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age;
        }

        return user;
    },

    createPost(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => user.id === args.post.author);

        if (!userExists) throw new Error('User does not exists.');

        const post = {
            id: uuidv4(),
            ...args.post
        };

        db.posts.push(post);

        post.published ? pubsub.publish('post', {
            post: {
                mutation: 'CREATED',
                data: post
            }
        }) : '';

        return post;
    },

    deletePost(parent, args, { db, pubsub }, info) {
        const postIndex = db.posts.findIndex((post) => post.id === args.id);

        if (postIndex === -1) throw new Error('Post does not exists.');

        const [post] = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter((comment) => comment.post !== args.id);

        post.published ? pubsub.publish('post', {
            post: {
                mutation: 'DELETED',
                data: post
            }
        }) : ''

        return post;
    },

    updatePost(parent, args, ctx, info) {
        const { db, pubsub } = ctx;
        const { id, data } = args;

        const post = db.posts.find(post => post.id === id);
        const originalPost = { ...post }

        if (!post) throw new Error('Post does not exists.');

        if (typeof data.title === 'string') {
            post.title = data.title;
        }

        if (typeof data.body === 'string') {
            post.body = data.body;
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published;

            if (originalPost.published && !post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if (!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }
        return post;
    },

    createComment(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => user.id === args.comment.author);
        if (!userExists) throw new Error('User does not exists.');
        const postExists = db.posts.some((post) => post.id === args.comment.post && post.published);
        if (!postExists) throw new Error('Post does not exist or is not published.');
        const comment = {
            id: uuidv4(),
            ...args.comment
        }
        db.comments.push(comment);
        pubsub.publish(`comment ${args.comment.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        });
        return comment;
    },

    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);

        if (commentIndex === -1) throw new Error('Comment does not exists.');

        const [comment] = db.comments.splice(commentIndex, 1);
        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: comment
            }
        });

        return comment;
    },

    updateComment(parent, args, ctx, info) {
        const { id, data } = args;
        const { db, pubsub } = ctx;
        const comment = db.comments.find(comment => comment.id === id);

        if (!comment) throw new Error('Comment does not exists');

        if (data.text) {
            comment.text = data.text;
            pubsub.publish(`comment ${comment.post}`, {
                comment: {
                    mutation: 'UPDATED',
                    data: comment
                }
            })
        }

        return comment;
    }
}

export { Mutation as default }
