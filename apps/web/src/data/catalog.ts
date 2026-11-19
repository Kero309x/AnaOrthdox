/**
 * Demo catalog. Every item is a clearly labelled design sample (`demo: true`)
 * so each screen has a complete journey before a content backend exists.
 * Replace this module with a repository backed by the API; screens only
 * read through these types. No item is approved liturgical or teaching text.
 */
export interface AudioTrack { id: string; title: string; artist: string; kind: "taranem" | "alhan"; seconds: number; hz: number; demo: true }
export interface VideoClip { id: string; title: string; channel: string; kind: "ezat" | "taranem"; demo: true }
export interface BookItem { id: string; title: string; author: string; dark: boolean; popular: boolean; pages: string[]; demo: true }
export interface StudyLesson { id: string; title: string; points: string[]; question: { text: string; options: string[]; answer: number } }
export interface StudyItem { id: string; title: string; subtitle: string; lessons: StudyLesson[]; demo: true }
export interface KidsActivity { id: string; title: string; hint: string; kind: "story" | "taranem" | "color" | "game"; pages: string[]; demo: true }

export const audioTracks: AudioTrack[] = [
  { id: "t1", title: "ترنيمة تجريبية ١", artist: "فريق تجريبي", kind: "taranem", seconds: 24, hz: 392, demo: true },
  { id: "h1", title: "لحن تجريبي ١", artist: "مرنم تجريبي", kind: "alhan", seconds: 30, hz: 330, demo: true },
  { id: "t2", title: "ترنيمة تجريبية ٢", artist: "فريق تجريبي", kind: "taranem", seconds: 20, hz: 440, demo: true },
  { id: "h2", title: "لحن تجريبي ٢", artist: "مرنم تجريبي", kind: "alhan", seconds: 28, hz: 294, demo: true },
  { id: "t3", title: "ترنيمة تجريبية ٣", artist: "فريق تجريبي", kind: "taranem", seconds: 22, hz: 349, demo: true },
];

export const videoClips: VideoClip[] = [
  { id: "v1", title: "عظة تجريبية ١", channel: "قناة تجريبية", kind: "ezat", demo: true },
  { id: "v2", title: "ترنيمة مصوّرة تجريبية", channel: "قناة تجريبية", kind: "taranem", demo: true },
  { id: "v3", title: "اجتماع تجريبي ٢", channel: "قناة تجريبية", kind: "ezat", demo: true },
];

const ar = (n: number) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
const filler = (n: number) =>
  `هذه الصفحة ${ar(n)} من نص تجريبي لعرض شكل القراءة فقط. تقدر تكبّر الخط أو تصغّره، وتحط علامة على الصفحة، والتطبيق يفتكر آخر صفحة وصلت لها. النص الفعلي هيتضاف من مصدر مرخّص ومعتمد.`;

export const books: BookItem[] = [
  { id: "b1", title: "كتاب تجريبي ١", author: "كاتب تجريبي", dark: false, popular: true, pages: [1, 2, 3, 4].map(filler), demo: true },
  { id: "b2", title: "كتاب تجريبي ٢", author: "كاتب تجريبي", dark: true, popular: true, pages: [1, 2, 3].map(filler), demo: true },
  { id: "b3", title: "كتاب تجريبي ٣", author: "كاتب تجريبي", dark: false, popular: false, pages: [1, 2, 3, 4, 5].map(filler), demo: true },
  { id: "b4", title: "كتاب تجريبي ٤", author: "كاتب تجريبي", dark: true, popular: false, pages: [1, 2].map(filler), demo: true },
];

const lesson = (n: number): StudyLesson => ({
  id: `l${n}`,
  title: `الدرس ${n} (تجريبي)`,
  points: ["نقطة أولى للقراءة والتأمل (نص تجريبي).", "نقطة ثانية توضّح فكرة الدرس (نص تجريبي).", "سؤال للتفكير تقدر تكتب إجابتك عليه في ملاحظاتك."],
  question: { text: "ده سؤال تجريبي لاختبار شكل الإجابة. اختار الإجابة الأولى.", options: ["الإجابة الأولى", "الإجابة الثانية", "الإجابة الثالثة"], answer: 0 },
});

export const studies: StudyItem[] = [
  { id: "s1", title: "دراسة تجريبية ١", subtitle: "٣ دروس", lessons: [lesson(1), lesson(2), lesson(3)], demo: true },
  { id: "s2", title: "دراسة تجريبية ٢", subtitle: "٢ دروس", lessons: [lesson(1), lesson(2)], demo: true },
  { id: "s3", title: "دراسة تجريبية ٣", subtitle: "٤ دروس", lessons: [lesson(1), lesson(2), lesson(3), lesson(4)], demo: true },
];

const kidsPage = (n: number) => `الصفحة ${ar(n)} من نشاط تجريبي للأطفال. الحكاية الفعلية هتتضاف من مصدر موثوق.`;
export const kidsActivities: KidsActivity[] = [
  { id: "k1", title: "قصة تجريبية", hint: "قصص مبسطة بأسلوب محبب", kind: "story", pages: [1, 2, 3].map(kidsPage), demo: true },
  { id: "k2", title: "ترنيمة أطفال تجريبية", hint: "ألحان سهلة وفرحة", kind: "taranem", pages: [kidsPage(1)], demo: true },
  { id: "k3", title: "نشاط تلوين تجريبي", hint: "وقت مفيد وممتع", kind: "color", pages: [kidsPage(1)], demo: true },
  { id: "k4", title: "لعبة الذاكرة", hint: "لعب آمن من غير مشتريات", kind: "game", pages: [], demo: true },
];

/** Clear marker for any list that mixes demo and real items later. */
export const CATALOG_IS_DEMO = true;
