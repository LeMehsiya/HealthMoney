let http = require("http");
let url = require("url");
let fs = require("fs");
let mongoose = require("mongoose");

// Database connection.
let dbUrl = "mongodb://localhost:27017/unidb";
mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true});

// Database schema.
let lecturerSchema = new mongoose.Schema({name: String, age: Number});
let Lecturer = mongoose.model("lecturer", lecturerSchema);

async function listAllLecturers() {
  let lecturers = await Lecturer.find({});
  return lecturers;
}

async function allLecturersRoute(response) {
  let lecturers = await listAllLecturers();
  response.write(JSON.stringify(lecturers));
  response.end();
}

function templateRoute(response) {
  fs.readFile("template.html", function(err, contents) {
    response.writeHeader(200, {"Content-Type": "text/html"});
    response.write(contents);
    response.end();
  });
}

let server = http.createServer(function(request, response) {
  let reqUrl = url.parse(request.url, true);

  if (reqUrl.path == "/") {
    templateRoute(response);
  } else if (reqUrl.path == "/lecturers") {
    allLecturersRoute(response);
  }
});

server.listen(9000, function() {
  console.log("Listening on 9000");
});