const Rental = require("../../models/rental");
const Booking = require("../../models/booking");
const { transformRental } = require("./merge");
const {
  RentalType,
  StatusType,
  CreateRentalInput,
  UpdateRentalInput,
} = require("../schema/type");
const graphql = require("graphql");
const { GraphQLString, GraphQLList, GraphQLNonNull } = graphql;

module.exports = {
  getRentals: {
    type: new GraphQLNonNull(new GraphQLList(RentalType)),
    args: { city: { type: GraphQLString } },
    async resolve(parent, { city }) {
      const query = city ? { city: city.toLowerCase() } : {};
      try {
        const rentals = await Rental.find(query).populate("image");
        return rentals.map((rental) => {
          return transformRental(rental);
        });
      } catch (error) {
        throw error;
      }
    },
  },
  getUserRentals: {
    type: new GraphQLNonNull(new GraphQLList(RentalType)),
    async resolve(parent, args, req) {
      if (!req.isAuth) {
        throw new Error("Unauthenticated!");
      }
      const { user } = req;
      try {
        const rentals = await Rental.find({ owner: user }).populate("image");
        return rentals.map((rental) => {
          return transformRental(rental);
        });
      } catch (error) {
        throw error;
      }
    },
  },
  getRentalById: {
    type: new GraphQLNonNull(RentalType),
    args: { rentalId: { type: new GraphQLNonNull(GraphQLString) } },
    async resolve(parent, { rentalId }, req) {
      try {
        const rental = await Rental.findById(rentalId).populate("image");
        return transformRental(rental);
      } catch (error) {
        throw new Error("Rental not found!");
      }
    },
  },
  verifyUser: {
    type: StatusType,
    args: { rentalId: { type: new GraphQLNonNull(GraphQLString) } },
    async resolve(parent, { rentalId }, req) {
      if (!req.isAuth) {
        throw new Error("Unauthenticated!");
      }
      const { user } = req;
      try {
        const rental = await Rental.findById(rentalId).populate("owner");
        if (rental.owner.id !== user.id) {
          throw new Error("You are not owner of this rental!");
        }
        return { status: "verified" };
      } catch (error) {
        throw error;
      }
    },
  },
  createRental: {
    type: new GraphQLNonNull(RentalType),
    args: {
      createRentalInput: { type: new GraphQLNonNull(CreateRentalInput) },
    },
    async resolve(parent, args, req) {
      if (!req.isAuth) {
        throw new Error("Unauthenticated!");
      }
      const { user } = req;
      try {
        const rentalData = {
          ...args.createRentalInput,
          owner: user,
        };
        const createdRental = (await Rental.create(rentalData)).populate(
          "owner"
        );
        return transformRental(createdRental);
      } catch (error) {
        throw error;
      }
    },
  },
  updateRental: {
    type: new GraphQLNonNull(RentalType),
    args: {
      updateRentalInput: { type: new GraphQLNonNull(UpdateRentalInput) },
    },
    async resolve(parent, args, req) {
      if (!req.isAuth) {
        throw new Error("Unauthenticated!");
      }
      const { user } = req;
      const {
        rentalId,
        title,
        city,
        street,
        category,
        numOfRooms,
        description,
        dailyPrice,
        shared,
        image,
      } = args.updateRentalInput;
      try {
        const rental = await Rental.findById(rentalId).populate("owner");
        if (rental.owner.id !== user.id) {
          throw new Error("You are not owner of this rental!");
        }
        let rentalData = {};
        if (title) rentalData.title = title;
        if (city) rentalData.city = city;
        if (street) rentalData.street = street;
        if (category) rentalData.category = category;
        if (numOfRooms) rentalData.numOfRooms = numOfRooms;
        if (description) rentalData.description = description;
        if (shared) rentalData.shared = shared;
        if (dailyPrice) rentalData.dailyPrice = dailyPrice;
        if (image) rentalData.image = image;
        rental.set(rentalData);
        await rental.save();
        const updatedRental = await Rental.findById(rentalId)
          .populate("owner")
          .populate("image");
        return transformRental(updatedRental);
      } catch (error) {
        throw error;
      }
    },
  },
  deleteRental: {
    type: StatusType,
    args: { rentalId: { type: new GraphQLNonNull(GraphQLString) } },
    async resolve(parent, { rentalId }, req) {
      if (!req.isAuth) {
        throw new Error("Unauthenticated!");
      }
      const { user } = req;
      try {
        const rental = await Rental.findById(rentalId).populate("owner");
        if (rental.owner.id !== user.id) {
          throw new Error("You are not owner of this rental!");
        }
        const bookings = await Booking.find({ rental });
        if (bookings && bookings.length > 0) {
          throw new Error("Cannot delete rental with active booking!");
        }
        await rental.remove();
        return { status: "deleted", id: rentalId };
      } catch (error) {
        throw error;
      }
    },
  },
};
