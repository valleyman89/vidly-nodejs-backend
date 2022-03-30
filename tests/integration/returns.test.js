const { Movie } = require("../../models/movie");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const moment = require("moment");
const mongoose = require("mongoose");
const request = require("supertest");

describe("/api/returns", () => {
  let customerId;
  let movie;
  let movieId;
  let rental;
  let server;
  let token;
  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    server = require("../../index");
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: { name: "12345" },
      numberInStock: 10,
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: { _id: movieId, title: "12345", dailyRentalRate: 2 },
    });

    await rental.save();
  });

  afterEach(async () => {
    await Rental.deleteMany({});
    await Movie.deleteMany({});
    await server.close();
  });

  afterAll((done) => {
    mongoose.disconnect();
    done();
  });

  // POST
  describe("POST /", () => {
    it("should return 401 is client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if customerId is not provided", async () => {
      customerId = "";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if movieID is not provided", async () => {
      movieId = "";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if no rental found for this customer/movie", async () => {
      await Rental.deleteMany({});
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if rental already processed", async () => {
      rental.dateReturned = new Date();
      await rental.save();
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if valid request", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });
    it("should set the returnDate if valid request", async () => {
      const res = await exec();
      const rentalInDb = await Rental.findById(rental._id);
      const diff = new Date() - rentalInDb.dateReturned;
      expect(diff).toBeLessThan(10 * 1000);
    });

    it("should calculate the rental fee if valid request", async () => {
      rental.dateOut = moment().add(-7, "days").toDate();
      await rental.save();
      const res = await exec();
      const rentalInDb = await Rental.findById(rental._id);
      expect(rentalInDb.rentalFee).toBe(14);
    });

    it("should increase the stock if valid request", async () => {
      const res = await exec();
      const movieInDb = await Movie.findById(movieId);
      expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it("should return the rental if valid request", async () => {
      const res = await exec();
      const rentalInDb = await Rental.findById(rental._id);
      expect(Object.keys(res.body)).toEqual(
        expect.arrayContaining([
          "dateOut",
          "dateReturned",
          "rentalFee",
          "customer",
          "movie",
        ])
      );
    });
  });
});
