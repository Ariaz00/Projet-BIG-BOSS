const { Prisma } = require("@prisma/client")
const bcrypt = require("bcrypt")

module.exports = Prisma.defineExtension({
    query:{
        entreprise:{
            create: async({args, query})=>{ //model, operation : on peut les rajouter, il y en a 4
                try {
                    const hash = await bcrypt.hash(args.data.password, 10) // attend que ce soit hashé
                    args.data.password = hash
                    return query(args)
                } catch (error) {
                    throw error
                }
            }
        }
    }
})