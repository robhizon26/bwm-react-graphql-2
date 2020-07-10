const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const config = require("../../config/dev");
const { AuthDataType, UserType, UserInput } = require("../schema/type");
const graphql = require("graphql");
const { GraphQLString, GraphQLNonNull } = graphql;

module.exports = {
  login: {
    type: new GraphQLNonNull(AuthDataType),
    args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
    async resolve(parent, { email, password }) {
      if (!password || !email) {
        throw new Error("Email or password is missing!");
      }
      const foundUser = await User.findOne({ email });
      if (!foundUser) {
        throw new Error("User with provided email doesn't exists");
      }
      if (foundUser.hasSamePassword(password)) {
        const token = jwt.sign(
          {
            sub: foundUser.id,
            username: foundUser.username,
          },
          config.JWT_SECRET,
          { expiresIn: "2h" }
        );
        return { userId: foundUser.id, token: token, tokenExpiration: 2 };
      } else {
        throw new Error("User with provided email doesnt exists");
      }
    },
  },
  register: {
    type: new GraphQLNonNull(UserType),
    args: { userInput: { type: new GraphQLNonNull(UserInput) } },
    async resolve(parent, args, req) {
      try {
        const {
          username,
          email,
          password,
          passwordConfirmation,
        } = args.userInput;
        if (!password || !email) {
          throw new Error("Email or password is missing!");
        }
        if (password !== passwordConfirmation) {
          throw new Error("Password is not maching confirmation password!");
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("User with provided email already exists!");
        }
        const user = new User({ username, email, password });
        const result = await user.save();
        return { ...result._doc, password: null, _id: result.id };
      } catch (err) {
        throw err;
      }
    },
  },
};
