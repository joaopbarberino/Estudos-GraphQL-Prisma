
const users = [
    {
        id: "1234",
        name: "Moly",
        email: "moly@ebay.com",
        age: "25"
    },
    {
        id: "1235",
        name: "Afonso",
        email: "afonso@yahoo.com.br",
        age: "25"
    },
    {
        id: "1236",
        name: "Roberval",
        email: "the_robs@ig.com.br",
        age: "25"
    },
];

const posts = [
    {
        id: '10238',
        title: "A importância da música",
        body: "A música...",
        published: true,
        author: '1235'
    },
    {
        id: '48390',
        title: "Projeto React",
        body: "Precisávamos de velocidade...",
        published: true,
        author: '1234'
    },
    {
        id: '20399',
        title: "Projeto GraphQL",
        body: "Precisávamos gastar menos dados...",
        published: true,
        author: '1235'
    },
]

const comments = [
    {
        id: '392930',
        author: '1235',
        post: '20399',
        text: "Algum texto legal!"
    },
    {
        id: '391839',
        author: '1234',
        post: '10238',
        text: "Outro texto legal!"
    },
    {
        id: '482930',
        author: '1235',
        post: '48390',
        text: "Mais outro texto legal!"
    },
    {
        id: '310302',
        author: '1236',
        post: '20399',
        text: "O super texto legal!"
    }
]

const db = {
    users,
    posts,
    comments
}

export default db;
