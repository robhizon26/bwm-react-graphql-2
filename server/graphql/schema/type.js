const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLInputObjectType
} = graphql;

const RentalType = new GraphQLObjectType({
  name: "Rental",
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    category: { type: new GraphQLNonNull(GraphQLString) },
    numOfRooms: { type: new GraphQLNonNull(GraphQLInt) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    dailyPrice: { type: new GraphQLNonNull(GraphQLFloat) },
    shared: { type: new GraphQLNonNull(GraphQLBoolean) },
    image: { type: new GraphQLNonNull(CloudinaryImageType) },
    owner: { type: new GraphQLNonNull(UserType) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const CloudinaryImageType = new GraphQLObjectType({
  name: "CloudinaryImage",
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    url: { type: new GraphQLNonNull(GraphQLString) },
    cloudinaryId: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString },
  }),
});

const BookingType = new GraphQLObjectType({
  name: "Booking",
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    startAt: { type: new GraphQLNonNull(GraphQLString) },
    endAt: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    nights: { type: new GraphQLNonNull(GraphQLInt) },
    guests: { type: new GraphQLNonNull(GraphQLInt) },
    user: { type: new GraphQLNonNull(UserType) },
    rental: { type: new GraphQLNonNull(RentalType) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const StatusType = new GraphQLObjectType({
  name: "Status",
  fields: () => ({
    status: { type: GraphQLString },
    id: { type: GraphQLString },
  }),
});

const AuthDataType = new GraphQLObjectType({
  name: "AuthData",
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLID) },
    token: { type: new GraphQLNonNull(GraphQLString) },
    tokenExpiration: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const UserInput = new GraphQLInputObjectType({
  name: "UserInput",
  fields: () => ({
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    passwordConfirmation: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const CreateRentalInput = new GraphQLInputObjectType({
  name: "CreateRentalInput",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    category: { type: new GraphQLNonNull(GraphQLString) },
    numOfRooms: { type: new GraphQLNonNull(GraphQLInt) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    dailyPrice: { type: new GraphQLNonNull(GraphQLFloat) },
    shared: { type: GraphQLBoolean },
    image: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const UpdateRentalInput = new GraphQLInputObjectType({
  name: "UpdateRentalInput",
  fields: () => ({
    rentalId: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLString },
    city: { type: GraphQLString },
    street: { type: GraphQLString },
    category: { type: GraphQLString },
    numOfRooms: { type: GraphQLInt },
    description: { type:GraphQLString },
    dailyPrice: { type: GraphQLFloat},
    shared: { type: GraphQLBoolean},
    image: { type: GraphQLString },
  }),
});
 
const CreateBookingInput = new GraphQLInputObjectType({
  name: "CreateBookingInput",
  fields: () => ({
    startAt: { type: new GraphQLNonNull(GraphQLString) },
    endAt: { type: new GraphQLNonNull(GraphQLString) },
    nights: { type: new GraphQLNonNull(GraphQLInt) },
    guests: { type: new GraphQLNonNull(GraphQLInt) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    rentalId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
 
module.exports = {
  RentalType,
  CloudinaryImageType,
  UserType,
  BookingType,
  StatusType,
  AuthDataType,
  UserInput,
  CreateRentalInput,
  UpdateRentalInput,
  CreateBookingInput
};
