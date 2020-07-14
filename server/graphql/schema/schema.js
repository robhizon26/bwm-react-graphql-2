const {
  getRentals,
  getUserRentals,
  getRentalById,
  verifyUser,
  createRental,
  updateRental,
  deleteRental,
  getBookings,
  getReceivedBookings,
  getUserBookings,
  deleteBooking,
  createBooking,
  login,
  register,
} = require("../resolvers/index");
const graphql = require("graphql");

const { GraphQLObjectType, GraphQLSchema } = graphql;

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getRentals,
    getUserRentals,
    getRentalById,
    verifyUser,
    getBookings,
    getReceivedBookings,
    getUserBookings,
    login,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createRental,
    updateRental,
    deleteRental,
    deleteBooking,
    createBooking,
    register,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
 