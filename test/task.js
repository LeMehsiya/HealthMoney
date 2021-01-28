var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

app.get("/api/tasks" , (request, response) => {
  response.send(tasks);
});

  let server = require("../task");
  let chai = require("chai");
  let chaiHttp = require("chai-http");

  chai.should();
  chai.use(chaiHttp);

  describe('Task APIs', () => {

    describe("Test GET route /api/tasks", (done) => {
      it("It should return all task", (done) => {
        chai.request(server)
        .get("/api/tasks")
        .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('array');
            response.body.length.should.not.be.eq(0);
            done();
        });
      });
    });
  });