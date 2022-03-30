const request = require("supertest");
const { Movie } = require("../../models/movie");
const mongoose = require("mongoose");
const { User } = require("../../models/user");

let server;

describe("/api/movies,", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Movie.deleteMany({});
    await User.deleteMany({});
    await server.close();
  });
  afterAll((done) => {
    mongoose.disconnect();
    done();
  });

  // GET TEST
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Movie.collection.insertMany([{ title: "movie1", title: "movie2" }]);
      const res = await request(server).get("/api/movies");
      expect(res.status).toBe(200);
    });
  });
  describe("GET /:id", () => {
    it("should return a valid genre via id", async () => {
      const id = mongoose.Types.ObjectId();
      const movie = new Movie({
        title: "movie1",
        dailyRentalRate: 1,
        numberInStock: 1,
        genre: { name: "genre1", _id: id },
      });
      await movie.save();
      const res = await request(server).get("/api/movies/" + movie._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", movie.title);
    });
  });
  // POST TEST
  describe("POST /", () => {
    let token;
    let title;

    const exec = async () => {
      return await request(server)
        .post("/api/movies")
        .set("x-auth-token", token)
        .send();
    };
    beforeEach(() => {
      token = new User().generateAuthToken();
      title = "movie1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should save movie if it is valid", async () => {
      await exec();
      const id = mongoose.Types.ObjectId();
      const movie = new Movie({
        title: "movie1",
        dailyRentalRate: 1,
        numberInStock: 1,
        genre: { name: "genre1", _id: id },
      });
      await movie.save();
      expect(movie).not.toBeNull();
    });

    // it("should return the movie if it is valid", async () => {
    //   const res = await exec();
    //   expect(res.status).toBe(200);
    //expect(res.body).toHaveProperty("title", "movie1");
    //});

    // it("should return 400 is movie title is less than 5 characters", async () => {
    //   title = "1234";
    //   const res = await exec();
    //   expect(res.status).toBe(400);
    // });
  });
  // PUT TEST
  //   describe("PUT /", () => {
  //     let token;
  //     let title;

  //     const exec = async () => {
  //       return await request(server)
  //         .put("/api/movies")
  //         .set("x-auth-token", token)
  //         .send({ title });
  //     };
  //     beforeEach(() => {
  //       token = new User().generateAuthToken();
  //       title = "movie1";
  //     });

  //     it("should return 401 if client is not logged in", async () => {
  //       token = "";
  //       const res = await exec();
  //       expect(res.status).toBe(401);
  //     });
  //   });
  // DELETE TEST
  //   describe("DELETE /", () => {
  //     let token;
  //     let title;

  //     const exec = async () => {
  //       return await request(server)
  //         .delete("/api/movies")
  //         .set("x-auth-token", token)
  //         .send({ title });
  //     };
  //     beforeEach(() => {
  //       token = new User().generateAuthToken();
  //       title = "movie1";
  //     });

  //     it("should return 401 if client is not logged in", async () => {
  //       token = "";
  //       const res = await exec();
  //       expect(res.status).toBe(401);
  //     });
  //   });
});
