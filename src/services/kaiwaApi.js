import api from "./api";

async function data(request) {
  const response = await request;
  if (response?.success !== true || !Object.hasOwn(response, "data")) {
    throw new Error("Phản hồi Kaiwa không hợp lệ.");
  }
  return response.data;
}

const sessions = "/kaiwa/practice-sessions";
const practice = (sessionId) => `${sessions}/${encodeURIComponent(sessionId)}`;
const auth = (token, signal) => ({ signal, headers: { Authorization: `Bearer ${token}` } });

export const listDialogues = (params, signal) => data(api.get("/kaiwa/dialogues", { params, signal }));
export const getDialogue = (id, signal) =>
  data(api.get(`/kaiwa/dialogues/${encodeURIComponent(id)}`, { signal }));
export const listQuestions = (params, signal) => data(api.get("/kaiwa/questions", { params, signal }));
export const createPractice = (body, signal) => data(api.post(sessions, body, { signal }));
export const getPractice = ({ sessionId, token }, signal) =>
  data(api.get(practice(sessionId), auth(token, signal)));
export const saveAssessment = ({ sessionId, token }, body, signal) =>
  data(api.patch(practice(sessionId), body, auth(token, signal)));
export const completePractice = ({ sessionId, token }, signal) =>
  data(api.post(`${practice(sessionId)}/complete`, undefined, auth(token, signal)));

export const kaiwaStatus = (error) => error?.response?.status;
export const isInvalidPractice = (error) => [401, 403, 404].includes(kaiwaStatus(error));

export function kaiwaError(error) {
  switch (kaiwaStatus(error)) {
    case 401:
    case 403: return "Phiên luyện tập không còn quyền truy cập.";
    case 404: return "Không tìm thấy nội dung hoặc phiên đã hết hạn.";
    case 409: return "Phiên luyện tập vừa thay đổi. Hãy thử lại.";
    default: return kaiwaStatus(error) >= 500
      ? "Máy chủ Kaiwa đang gặp lỗi. Hãy thử lại."
      : "Không tải hoặc lưu được dữ liệu Kaiwa. Hãy thử lại.";
  }
}
