import { Prisma } from 'prisma-binding';
import { parseTypeReference } from 'graphql/language/parser';

const PRISMA = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
});

// 1. Create a new post
// 2. Fetch all of the info the user (author)
const createPostForUser = async (authorId, data) => {
    const userExists = await PRISMA.exists.User({ id: authorId });
    
    if (!userExists) throw new Error('User not found!');
    // 1.
    const post = await PRISMA.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
        // 2.
    }, '{ id author { id name posts { id title published } } }');
    
    return post.author;
}

// createPostForUser('cjykgb3gb000b0803agt3uxa2', {
//     title: 'HQs super boas',
//     body: 'The Dark Knights Returns',
//     published: true
// }).then(user => {
//     console.log(JSON.stringify(user, undefined, 4));
// }).catch(error => {
//     console.log(error);
// })

// 1. Update a post and get the author id back
// 2. Fetch the user associated with the post and return it's data
const updatePostForUser = async (postId, data) => {
    const postExists = await PRISMA.exists.Post({ id: postId });
    
    if(!postExists) throw new Error('Post not found');
    // 1.
    const post = await PRISMA.mutation.updatePost({
        where: {
            id: postId
        },
        data: {
            ...data,
        }
        // 2.
    }, '{ id author { name email posts { id title published } } }');
    
    return post.author;
}

// updatePostForUser('cjz462kkn00gc0903nunasub5', {
//     title: 'Filmes incrivelmente bons',
//     body: 'Interstellar'
// }).then(post => {
//     console.log(JSON.stringify(post, undefined, 4));
// }).catch(error => console.log(error.message));

// PRISMA.exists.Post({
//     id: "cjz462kkn00gc0903nunasub5"
// }).then(exists => {
//     console.log(exists);
// });
