const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { assert } = require("chai");


const { expect } = chai;
chai.use(chaiHttp);
describe("Server!", () => {
  it("welcomes user to the api", done => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals("success");
        expect(res.body.message).to.equals("Welcome To Testing API");
        done();
      });
  });

  it("adds 2 numbers", done => {
    chai
      .request(app)
      .post("/add")
      .send({ num1: 5, num2: 5 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals("success");
        expect(res.body.result).to.equals(10);
        done();
      });
  });
});


const User = require("../app");

describe("create records", () => {
  it("create a user in DB", () => {
    const world = new User({username: "world"});
    world.save()
    .then(() => {
      assert(!world.isNew)
    })
    .catch(() => {
      console.log("error");
    })
    
  })





describe('it should get user account from the API', function () {
  it('should be able to access passport authenticate', function(){
      var reqUserObject = {
          body: { username: 'helloworld', password: 'hello' }
      }
      var requestPromiseStub = chai.stub

      requestPromiseStub.onCall(0).returns(Promise.resolve('{"userId": 138}'))
              .onCall(1).returns(Promise.resolve('{"userName": "helloworld", "status": 0}'))

      var passportTest = proxyquire('passport', {
          'request-promise': requestPromiseStub
        });

      var passportStub = sinon.stub(passportTest, "authenticate");

      var response = passportStub.calledWith('localLogin', reqUserObject);
      console.log(response);
      expect.response.to.be.true;


   });

  });





describe('Functional Test <Sessions>:', function () {
  it('should create user session for valid user', function (done) {
    request(app)
      .post('/v1/sessions')
      .set('Accept','application/json')
      .send({"email": "user_test@example.com", "password": "123"})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.body.id.should.equal('1');
        res.body.short_name.should.equal('Test user');
        res.body.email.should.equal('user_test@example.com');
        // Save the cookie to use it later to retrieve the session
        Cookies = res.headers['set-cookie'].pop().split(';')[0];
        done();
      });
  });
  it('should get user session for current user', function (done) {
    var req = request(app).get('/v1/sessions');
    // Set cookie to get saved user session
    req.cookies = Cookies;
    req.set('Accept','application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.body.id.should.equal('1');
        res.body.short_name.should.equal('Test user');
        res.body.email.should.equal('user_test@example.com');
        done();
      });
  });
});





describe('GET /profile', function(done){
  //addresses 1st bullet point: if the user is logged in we should get a 200 status code
    it('should return a 200 response if the user is logged in', function(done){
      authenticatedUser.get('/profile')
      .expect(200, done);
    });
  //addresses 2nd bullet point: if the user is not logged in we should get a 302 response code and be directed to the /login page
    it('should return a 302 response and redirect to /login', function(done){
      request(app).get('/profile')
      .expect('Location', '/login')
      .expect(302, done);
    });
  });
});
