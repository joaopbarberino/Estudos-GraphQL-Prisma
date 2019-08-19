import uuidv4 from 'uuid/v4';

const Mutation = {
    async createUser(parent, args, { PRISMA }, info) {
        const emailTaken = await PRISMA.exists.User({ email: args.data.email });

        if (emailTaken) throw new Error('Email already in use.');

        return await PRISMA.mutation.createUser({ data: args.data }, info);
    },

    async deleteUser(parent, args, { PRISMA }, info) {
        const userExists = await PRISMA.exists.User({ id: args.id });

        if (!userExists) throw new Error('User does not exists.');

        return PRISMA.mutation.deleteUser({
            where: {
                id: args.id
            }
        }, info);
    },

    async updateUser(parent, { id, data }, { PRISMA }, info) {
        return await PRISMA.mutation.updateUser({ where: { id }, data }, info);
    },

    async createPost(parent, args, { PRISMA }, info) {
        return PRISMA.mutation.createPost({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: args.data.author
                    }
                }
            }
        }, info);
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
