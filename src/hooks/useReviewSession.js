
import {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import { identifyTypingSession, migrateTypingSnapshot } from "../utils/typingSession";
import {
  createExamAttempt,
  isSouMatomeExam,
  readExamSnapshot,
  resolveExamConfig,
  saveExamSnapshot,
} from "../utils/typingExam";

import {
  getReviewSession as getSavedSession,
  getReviewConfig,
  saveReviewSession,
  clearFlashcardProgress,
  clearReviewSession,
  clearN3ReviewSession,
  getN3ReviewSession,
  saveN3ReviewSession,
  clearN3FlashcardProgress,
  resolveReviewConfig,
} from "../utils/reviewStorage";

import {
  getReviewSession,
} from "../services/vocab.service";

import {
  getKanjiSession,
} from "../services/kanjiCurriculum.service";

import {
  getN3KanjiSelectionPayload,
  normalizeN3KanjiReviewSession,
} from "../adapters/n3KanjiReviewAdapter";


function prepareSession(data, config, examStartId) {
  if (config.mode !== "typing") return data;

  const session = identifyTypingSession(data, examStartId);
  if (config.typingMode !== "exam") return session;
  if (!session.questions.length) throw new Error("Không có câu hỏi để bắt đầu kiểm tra.");

  return {
    ...session,
    exam: createExamAttempt(session.typingSessionId, config.examDurationMinutes),
  };
}

export default function useReviewSession() {
  const { state } = useLocation();
  const [session, setSession] = useState(null);
  const [sessionConfig, setSessionConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializedRef = useRef(false);

  const [draftConfig] = useState(getReviewConfig);
  const reviewConfig = sessionConfig ?? draftConfig;
  const examStart = state?.examStart;

  const isN3Kanji =
    state?.resumeN3Kanji ??
    (resolveExamConfig(examStart?.config ?? draftConfig)?.n3Source === "sou-matome-kanji");

  /* =========================================
     GET SAVED SESSION
  ========================================= */

  const getCurrentSavedSession = useCallback(() => {
    return isN3Kanji
      ? getN3ReviewSession()
      : getSavedSession();
  }, [isN3Kanji]);


  /* =========================================
     SAVE SESSION
  ========================================= */

  const persistSession = useCallback(
    async (config, data, progress, reviewId) => {
      const payload = {
        config,
        progress: {
          ...progress,
          completed: progress?.completed ?? false,
        },
        reviewId,
        session: data,
      };

      const save = config?.n3Source === "sou-matome-kanji"
        ? saveN3ReviewSession
        : saveReviewSession;

      if (data.exam) {
        const snapshot = await saveExamSnapshot(payload);
        save({ examSessionId: snapshot.session.exam.examSessionId, progress: snapshot.progress });
        return snapshot;
      }

      save(payload);
      return payload;
    },
    []
  );


  /* =========================================
     LOAD SESSION FROM API
     Chỉ gọi khi chưa có phiên đã lưu
  ========================================= */

  const loadSession = useCallback(
    async ({
      config: requestedConfig,
      reviewId = "",
      examStartId,
    }) => {
      try {
        setLoading(true);
        setError(null);
        const config = resolveExamConfig(requestedConfig);
        const souMatomeExam = isSouMatomeExam(config);
        setSessionConfig(config);

        const {
          lessons = [],
          topics = [],
          units = [],
          n3Topics = [],
          n3KanjiPairs = [],
          partsOfSpeech = [],
          mode = "flashcard",
          directions = ["jp_vi"],
          limit = null,
        } = config;

        const source = config?.n3Source ?? "unknown";

        const isSouMatome = source === "sou-matome-kanji" &&
          (souMatomeExam || (Array.isArray(n3KanjiPairs) && n3KanjiPairs.length > 0));

        if (
          config?.curriculumTab === "n3" &&
          !["sou-matome-kanji", "mimi-kara"].includes(source)
        ) {
          throw new Error(
            "Vui lòng chọn nguồn ôn tập N3."
          );
        }

        let data;
        let res;

        /* =====================================
           SOU MATOME KANJI
        ===================================== */

        if (isSouMatome) {
          const selection =
            getN3KanjiSelectionPayload(n3KanjiPairs);

          if (!selection.weeks || !selection.days) {
            throw new Error(
              "Chưa chọn bài Sou Matome N3 nào."
            );
          }

          const validDirections = [
            "kanji",
            "kanji_meaning",
            "meaning_kanji",
            "onyomi",
            "kunyomi",
            "hanviet",
            "kanji_reading",
            "reading_kanji",
            "vocab_meaning",
            "meaning_vocab",
          ];

          res = await getKanjiSession({
            curriculum: "sou-matome-n3-kanji",
            weeks: selection.weeks,
            days: selection.days,
            contentType: "both",
            mode,
            directions: souMatomeExam ? directions.join(",") : Array.isArray(directions)
              ? directions
                  .filter((item) =>
                    validDirections.includes(item)
                  )
                  .join(",")
              : directions,
            limit: limit ?? null,
            reviewId,
          });

          data = normalizeN3KanjiReviewSession(res);

          data = prepareSession(data, config, examStartId);

          const snapshot = await persistSession(
            config,
            data,
            res.progress,
            res.reviewId
          );
          setSessionConfig(snapshot.config);
          setSession(snapshot.session);
          return snapshot.session;
        }

        /* =====================================
           MINNA / MIMI KARA
        ===================================== */

        res = await getReviewSession({
          lessons: lessons.join(","),
          topics: topics.join(","),
          units: units.join(","),
          n3Topics: n3Topics.join(","),
          partsOfSpeech: partsOfSpeech.join(","),
          mode,
          directions: directions.join(","),
          limit: limit ?? "",
          reviewId,
        });

        data = res.data;

        if (!data) {
          throw new Error(
            "API không trả về dữ liệu phiên ôn."
          );
        }

        data = prepareSession(data, config, examStartId);

        const snapshot = await persistSession(
          config,
          data,
          res.progress,
          res.reviewId
        );
        setSessionConfig(snapshot.config);
        setSession(snapshot.session);
        return snapshot.session;

      } catch (err) {
        console.error("loadReviewSession:", err);

        setError(
          err.message || "Không tải được phiên ôn tập."
        );

        throw err;

      } finally {
        setLoading(false);
      }
    },
    [persistSession]
  );


  /* =========================================
     INITIAL LOAD
     Ưu tiên LocalStorage, không gọi API nếu có
  ========================================= */

  useEffect(() => {
    if (initializedRef.current) return;

    initializedRef.current = true;

    const initialize = async () => {
      const latest = getCurrentSavedSession();
      const examId = examStart?.id ?? state?.resumeExamId ?? latest?.examSessionId;
      const saved = examId ? readExamSnapshot(examId) : latest;

      /* Có phiên đã lưu */
      if (
        saved?.session &&
        Array.isArray(
          saved.session.questions ??
          saved.session.cards ??
          []
        )
      ) {
        console.log(
          "Restored review session from LocalStorage"
        );

        const config = resolveReviewConfig(saved.config) ?? draftConfig;
        try {
          const restored = (saved.session.mode || config?.mode) === "typing"
            ? migrateTypingSnapshot(saved, config ?? {})
            : saved;

          if (restored !== saved) {
            if (isN3Kanji) saveN3ReviewSession(restored);
            else saveReviewSession(restored);
          }

          setSessionConfig(resolveReviewConfig(restored.config) ?? config);
          setSession(restored.session);
          setError(null);
        } catch (err) {
          console.error("Restore typing session:", err);
          setError("Không thể khôi phục tiến độ ôn tập. Vui lòng thử lại.");
        } finally {
          setLoading(false);
        }

        return;
      }

      const config = resolveReviewConfig(examStart?.config) ?? draftConfig;
      if (!config || state?.resumeN3Kanji !== undefined || (examId && !examStart)) {
        if (examId) setError("Không tìm thấy bài kiểm tra đã lưu.");
        setLoading(false);
        return;
      }

      /* Chưa có phiên thì mới gọi API */
      if (!examStart) {
        if (isN3Kanji) {
          clearN3FlashcardProgress();
        } else {
          clearFlashcardProgress();
        }
      }

      try {
        await loadSession({
          config,
          examStartId: examStart?.id,
        });
      } catch {
        // Error đã được cập nhật trong loadSession.
      }
    };

    initialize();

  }, [draftConfig, examStart, getCurrentSavedSession, isN3Kanji, loadSession, state]);


  /* =========================================
     CONTINUE REVIEW

     TYPING:
     Không gọi API, dùng session đã lưu.

     FLASHCARD / QUIZ:
     Giữ nguyên cơ chế cũ.
  ========================================= */

  const continueReview = useCallback(async () => {
    const saved = getCurrentSavedSession();

    if (!saved) {
      setError("Không tìm thấy phiên ôn tập.");
      return;
    }

    const config = saved.config || reviewConfig;

    const savedMode =
      saved.session?.mode ||
      config?.mode;

    /* =====================================
       TYPING: KHÔI PHỤC TẠI CHỖ
    ===================================== */

    if (
      savedMode === "typing" &&
      saved.session?.questions?.length
    ) {
      setLoading(false);
      setError(null);

      setSession(saved.session);

      console.log(
        "Continue typing session from LocalStorage"
      );

      return saved.session;
    }

    /* =====================================
       OTHER MODES: GIỮ CƠ CHẾ CŨ
    ===================================== */

    if (!saved.reviewId) {
      setError(
        "Không tìm thấy reviewId của phiên ôn."
      );
      return;
    }

    const reviewId = saved.reviewId;

    if (isN3Kanji) {
      clearN3FlashcardProgress();
      clearN3ReviewSession();
    } else {
      clearFlashcardProgress();
      clearReviewSession();
    }

    return loadSession({
      config,
      reviewId,
    });

  }, [
    getCurrentSavedSession,
    reviewConfig,
    isN3Kanji,
    loadSession,
  ]);


  /* =========================================
     RETURN
  ========================================= */

  return {
    reviewConfig,
    session,
    loading,
    error,
    continueReview,
  };
}
