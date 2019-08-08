const Query = {
    greeting(parent, args, ctx, info) {
        return args.name ? `Hello ${args.name}!` : `Hello world!`
    },

    users(parent, args, { db }, info) {
        if (!args.query) return db.users;
        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase());
        });

    },

    posts(parent, args, { db }, info) {
        return args.query ?
            db.posts.filter((post) => {
                return post.title.toLowerCase().includes(args.query.toLowerCase()) ||
                    post.body.toLowerCase().includes(args.query.toLowerCase())
            }) :
            db.posts;
    },

    comments(parent, args, { db }, info) {
        return db.comments;
    },

    grades(parent, args, ctx, info) {
        return [20, 10, 15, 40, 20]
    },

    me() {
        return {
            id: 121,
            name: 'João Barberino',
            email: 'joao.p.barberino@gmail.com',
            age: 18,
        }
    },

    guitar() {
        return {
            id: 122,
            title: 'Violão Giannini Brasil',
            price: 800.50,
            releaseYear: null,
            rating: 4.99,
            inStock: true,
            owner: null
        }
    },
}

export { Query as default }
