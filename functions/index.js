const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();
const app = express();
const movieApp = express();

const db = admin.firestore();
const reviewCollection = "reviews";

// 새로운 영화 리뷰 추가
movieApp.post("/reviews", async (req, res) => {
  try {
    const review = {
      title: req.body.title,
      rating: req.body.rating,
      comment: req.body.comment,
    };
    const reviewDoc = await db.collection(reviewCollection).add(review);
    res.status(200).send(`새로운 영화 추가 ID: ${reviewDoc.id}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// 기존 영화 리뷰 수정
movieApp.patch("/reviews/:reviewId", async (req, res) => {
  try {
    const updatedReviewDoc = await db
      .collection(reviewCollection)
      .doc(req.params.reviewId)
      .update(req.body);
    res.status(204).send(`${updatedReviewDoc} 영화 리뷰 수정 완료`);
  } catch (error) {
    res.status(400).send(`영화 리뷰를 수정하는 도중 오류가 발생했습니다`);
  }
});

// ID로 영화 리뷰 불러오기
movieApp.get("/reviews/:reviewId", async (req, res) => {
  try {
    const reviewDoc = await db
      .collection(reviewCollection)
      .doc(req.params.reviewId)
      .get();
    res.status(200).send({ id: reviewDoc.id, ...reviewDoc.data() });
  } catch (error) {
    res.status(400).send("영화 리뷰를 불러오는데 실패하였습니다");
  }
});

// 아이디로 기존 영화 리뷰 삭제
movieApp.delete("/reviews/:reviewId", async (req, res) => {
  try {
    const deletedReviewDoc = await db
      .collection(reviewCollection)
      .doc(req.params.reviewId)
      .delete();
    res.status(204).send(`정상적으로 삭제 ID: ${deletedReviewDoc.id}`);
  } catch (error) {
    res.status(400).send("영화 리뷰를 삭제하는데 실패하였습니다");
  }
});

// 등록된 영화 리뷰 모두 조회
movieApp.get("/reviews", async (req, res) => {
  try {
    const reviewDocs = await db.collection(reviewCollection).get();
    const reviews = reviewDocs.docs.map((reviewDoc) => ({
      id: reviewDoc.id,
      ...reviewDoc.data(),
    }));
    res.status(200).send(reviews);
  } catch (error) {
    res.status(400).send("전체 영화 리뷰를 불러오는데 실패하였습니다");
  }
});

app.use(express.json());
app.use("/api", movieApp);

exports.movieAPI = functions.region("asia-northeast3").https.onRequest(app);
