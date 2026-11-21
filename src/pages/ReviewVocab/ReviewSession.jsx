
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FlashcardReview from "./FlashcardReview";
import QuizReview from "./QuizReview";
import TypingReview from "./TypingReview";
import TypingExam from "./TypingExam";

import useReviewSession from "../../hooks/useReviewSession";
import {
  getReviewConfig,
  getN3ReviewConfig,
  saveReviewConfig,
  saveN3ReviewConfig,
} from "../../utils/reviewStorage";

import {
  completeKanjiQuestion,
} from "../../services/kanjiCurriculum.service";


export default function ReviewSession() {
  const navigate = useNavigate();

  const {
    reviewConfig,
    session,
    loading,
    error,
    continueReview,
  } = useReviewSession();

  const isN3KanjiSession =
    reviewConfig?.n3Source === "sou-matome-kanji";

  const mode = session?.mode || reviewConfig?.mode;
  const [furiganaOverride, setFuriganaOverride] = useState(null);
  const showFurigana = furiganaOverride ??
    getReviewConfig()?.showFurigana ??
    (reviewConfig?.showFurigana !== false);

  const setShowFurigana = (value) => {
    setFuriganaOverride(value);
    try {
      const draft = getReviewConfig();
      if (draft) {
        saveReviewConfig({ ...draft, showFurigana: value });
      }
      if (isN3KanjiSession) {
        saveN3ReviewConfig({
          ...(getN3ReviewConfig() ?? reviewConfig),
          showFurigana: value,
        });
      }
    } catch (error) {
      console.warn("Không thể lưu cài đặt Furigana:", error);
    }
  };

  const handleFlashcardResult = async (card, isKnown) => {
    if (
      !isN3KanjiSession ||
      !session?.reviewId ||
      !card?.itemType ||
      !card?.itemId ||
      !isKnown
    ) {
      return;
    }

    await completeKanjiQuestion({
      reviewId: session.reviewId,
      itemType: card.itemType,
      itemId: card.itemId,
    });
  };

  /* =========================================
     NO CONFIG
  ========================================= */

  if (!reviewConfig) {
    return (
      <div className="rounded-xl bg-white p-6 text-center shadow">
        <p className="mb-4">
          ⚠️ Không có cấu hình ôn tập
        </p>

        <button
          onClick={() => navigate("/vocabulary")}
          className="text-blue-600 underline"
        >
          ← Quay lại chọn bài
        </button>
      </div>
    );
  }

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center shadow">
        ⏳ Đang tải phiên ôn tập...
      </div>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error || !session) {
    return (
      <div className="rounded-xl bg-white p-6 text-center shadow">
        <p className="mb-4 text-red-600">
          {error || "Không tìm thấy phiên ôn tập"}
        </p>

        <button
          onClick={() => navigate("/vocabulary")}
          className="text-blue-600 underline"
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  /* =========================================
     MAIN
  ========================================= */

  return (
    <div
      className="
        mx-auto flex w-full max-w-6xl
        flex-col gap-2 rounded-xl
        bg-white p-3 shadow-sm
        sm:gap-3 sm:p-4
      "
    >
      {/* HEADER */}

      <div
        className="
          flex shrink-0 items-center
          justify-between gap-2
          border-b pb-2 text-xs sm:text-sm
        "
      >
        <button
          onClick={() => navigate("/vocabulary")}
          className="shrink-0 text-blue-600 hover:underline"
        >
          ← Thoát phiên
        </button>

        <div className="truncate text-right text-gray-500">
          🧠 {mode}

          {" • "}

          📚 {(reviewConfig.lessons || []).length} bài

          {" • "}

          🔁 {(reviewConfig.directions || []).join(", ")}
        </div>
      </div>

      {/* FLASHCARD */}

      {mode === "flashcard" && (
        <FlashcardReview
          cards={session.cards || []}
          onContinue={continueReview}
          onResult={handleFlashcardResult}
          progressKey={
            isN3KanjiSession
              ? "n3FlashcardProgress"
              : "flashcardProgress"
          }
          sessionStorageKey={
            isN3KanjiSession
              ? "n3ReviewSessionData"
              : "reviewSessionData"
          }
          showFurigana={showFurigana}
          setShowFurigana={setShowFurigana}
        />
      )}

      {/* QUIZ */}

      {mode === "quiz" && (
        <QuizReview
          questions={session.questions || []}
          showFurigana={showFurigana}
        />
      )}

      {/* TYPING */}

      {mode === "typing" && (
        session.exam ? (
          <TypingExam
            key={session.exam.examSessionId}
            session={session}
            onBack={() => navigate("/vocabulary")}
          />
        ) : (
          <TypingReview
            key={session.typingSessionId}
            questions={session.questions}
            sessionId={session.typingSessionId}
          />
        )
      )}
    </div>
  );
}
