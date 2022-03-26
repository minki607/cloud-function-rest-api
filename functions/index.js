const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();
const app = express();
const movieApp = express();

// 해당 부분에 영화 CRUD 라우트 설정

app.use(express.json());
app.use("/api", movieApp);

exports.movieAPI = functions.region("asia-northeast3").https.onRequest(app);
