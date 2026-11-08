import api from './api';
const CLIENT_KEY = 'souMatome.client.v1';
function headers() {
  let client = localStorage.getItem(CLIENT_KEY);
  if (!client) { client = crypto.randomUUID(); localStorage.setItem(CLIENT_KEY, client); }
  return { 'X-Kanji-Client': client };
}
export const getCurriculum = () => api.get('/kanji-curriculum');
export const getCurriculumEntries = params => api.get('/kanji-curriculum/entries', { params });
export const getKanjiSession = params => api.get('/kanji/review-session', { params, headers: headers() });
export const completeKanjiQuestion = body => api.post('/kanji/review-session/complete', body, { headers: headers() });
