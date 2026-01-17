import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load pages
const Home = lazy(() => import("../pages/Home"));
const Lesson = lazy(() => import("../pages/Lesson"));
const Review = lazy(() => import("../pages/Review"));
const ReviewVocabPage = lazy(() => import("../pages/ReviewVocab/ReviewVocabPage"));

const ReviewSession = lazy(() => import("../pages/ReviewVocab/ReviewSession"));


const VocabularyTable = lazy(() => import("../pages/SettingVocab/VocabularyTable"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        }
      />

      <Route
        path="/lesson/:lessonNumber"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Lesson />
          </Suspense>
        }
      />
      <Route
        path="/vocabulary"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <ReviewVocabPage />
          </Suspense>
        }
      />

      <Route
        path="/review-session"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <ReviewSession />
          </Suspense>
        }
      />
      <Route
        path="/vocab-table"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <VocabularyTable />
          </Suspense>
        }
      />

    </Routes>
  );
}
