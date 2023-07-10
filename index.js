const epxress = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require("@apollo/server/express4")
const bodyParser = require("body-parser");
const cors = require('cors');
const { default: axios } = require('axios');
const { USERS } = require('./user');
const { TODOS } = require('./todo');
const PORT = 8000;

async function startServer() {

    const app = epxress();
    const server = new ApolloServer({
        typeDefs: `
        type User {
            id  :ID!
            name : String
            email:String!
            phone:String!
            website:String!
        }
        type Todo {
            id : ID!
            title : String!
            completed : Boolean!
            user:User
        }
        type Query {
            getTodos : [Todo]
            getUser:[User]
            getSingleUser(id:ID!):User
        }

        `,
        resolvers: {
            Todo: {
                user: async (todo) => {
                    return USERS.find(e => todo.id == e.id);
                }
            },
            Query: {
                getTodos: () => {
                    return TODOS;
                },
                getUser: async () => {

                    return USERS;
                },
                getSingleUser: async (parent, { id }) => {

                    return USERS.find(e => id == e.id);
                }
            }
        }
    });
    app.use(bodyParser.json());
    app.use(cors());
    await server.start();
    app.use('/graphql', expressMiddleware(server));

    app.listen(PORT, () => {
        console.log(`App listening on the port ${PORT}`);
    })
}

startServer();