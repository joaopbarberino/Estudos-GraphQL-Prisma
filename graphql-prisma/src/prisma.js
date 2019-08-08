import { Prisma } from 'prisma-binding';
import { parseTypeReference } from 'graphql/language/parser';

const PRISMA = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
});

// PRISMA.query.users(null, `
//     { 
//         id 
//         name 
//         email 
//         posts { 
//             id 
//             title 
//         }
//     } 
// `).then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
// });

// //console.log(PRISMA.query)
// const fetchComments = `
// {
//     id
//     text
//     author {
//         id
//         name
//     }
// }
// `;

// PRISMA.query.comments(null, fetchComments).then((data) => {
//     console.log(JSON.stringify(data, undefined, 4));
// });

// PRISMA.mutation.createPost({
//     data: {
//         title: "Challeng post 2",
//         body: "",
//         published: false,
//         author: {
//             connect: {
//                 id: "cjykgvzhr00cs08031019iso9"
//             }
//         }
//     }
// }, '{ id title body published }').then((data) => {
//     console.log(data);
//     return PRISMA.query.users(null, '{ id name posts { id title } }')
// }).then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
// });

// PRISMA.mutation.updatePost({
//     data: {
//         body: "existsssss",
//         published: true
//     },
//     where: {
//         id: "cjz338fe4001n0803udecr95n"
//     }
// }, '{ id title body published }').then(data => {
//     console.log(data);
//     return PRISMA.query.posts(null, '{ id title body published }')
// }).then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
// });

