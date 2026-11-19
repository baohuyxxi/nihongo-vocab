
import {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

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
  getN3ReviewConfig,
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


export default function useReviewSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializedRef = useRef(false);

  const reviewConfig = getReviewConfig();

  const currentSource =
    reviewConfig?.n3Source ?? null;

  const isN3Kanji =
    currentSource === "sou-matome-kanji";

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
    (config, data, progress, reviewId) => {
      const payload = {
        config,
        progress: {
          ...progress,
          completed: progress?.completed ?? false,
        },
        reviewId,
        session: data,
      };

      if (config?.n3Source === "sou-matome-kanji") {
        saveN3ReviewSession(payload);
      } else {
        saveReviewSession(payload);
      }
    },
    []
  );


  /* =========================================
     LOAD SESSION FROM API
     Chỉ gọi khi chưa có phiên đã lưu
  ========================================= */

  const loadSession = useCallback(
    async ({
      config,
      reviewId = "",
    }) => {
      try {
        setLoading(true);
        setError(null);

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

        const isSouMatome =
          source === "sou-matome-kanji" &&
          Array.isArray(n3KanjiPairs) &&
          n3KanjiPairs.length > 0;

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
            directions: Array.isArray(directions)
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

          setSession(data);

          persistSession(
            config,
            data,
            res.progress,
            res.reviewId
          );

          return data;
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

        setSession(data);

        persistSession(
          config,
          data,
          res.progress,
          res.reviewId
        );

        return data;

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
      if (!reviewConfig) {
        setLoading(false);
        return;
      }

      const saved = getCurrentSavedSession();

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

        setSession(saved.session);
        setError(null);
        setLoading(false);

        return;
      }

      /* Chưa có phiên thì mới gọi API */
      if (isN3Kanji) {
        clearN3FlashcardProgress();
      } else {
        clearFlashcardProgress();
      }

      try {
        await loadSession({
          config: reviewConfig,
        });
      } catch {
        // Error đã được cập nhật trong loadSession.
      }
    };

    initialize();

  }, []);


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
