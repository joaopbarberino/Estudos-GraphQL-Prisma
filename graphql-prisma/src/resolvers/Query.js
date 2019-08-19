const Query = {
    users(parent, args, { PRISMA }, info) {
        const operationalArgs = {};
        if (args.query) {
            operationalArgs.where = {
                OR: [{
                    name_contains: args.query
                }, {
                    email_contains: args.query
                }]
            }
        }
        return PRISMA.query.users(operationalArgs, info);
    },

    posts(parent, args, { PRISMA }, info) {
        const operationalArgs = {};
        if (args.query) {
            operationalArgs.where = {
                OR: [{
                    title_contains: args.query
                }, {
                    body_contains: args.query
                }]
            }
        }
        return PRISMA.query.posts(operationalArgs, info);
    },

    comments(parent, args, { PRISMA }, info) {
        const operationalArgs = {};
        if(args.query) {
            operationalArgs.where = {
                text_contains: args.query
            }
        }
        return PRISMA.query.comments(operationalArgs, info);
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
