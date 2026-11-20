/**
 * ترانيم — ألبومات استماع أونلاين من أرشيف سانت تكلا (روابط MP3 مباشرة من صفحات الألبومات).
 * التنزيل داخل التطبيق غير متاح لهذه التسجيلات عمدًا: لا يُفعَّل إلا بإذن صريح يشمل إعادة التوزيع.
 * دور هذه المجموعات هو نفسه في المشغّل: c = معرّف الألبوم.
 */
import { TASBEHA_COLLECTION_ID, TASBEHA_COLLECTION_TITLE, TASBEHA_PERFORMER, TASBEHA_SOURCE, tasbehaSunday, type StreamTrack } from "./tasbeha";

export interface StreamCollection {
  id: string;
  title: string;
  performer: string;
  /** وصف دقيق لعدد المقاطع (يميّز المقدمة عن الترانيم) */
  countLabel: string;
  sourceName: string;
  sourceUrl: string;
  tracks: StreamTrack[];
}

const ST_TAKLA_SOURCE = "سانت تكلا";

export const AGRAS_COLLECTION: StreamCollection = {
  id: "trn-agras",
  title: "أجراس أجراس",
  performer: "فريق القطيع الصغير",
  countLabel: "مقدمة + ١٠ ترانيم",
  sourceName: ST_TAKLA_SOURCE,
  sourceUrl: "https://st-takla.org/Multimedia/01-Carols/00001-b-Taraneem/El-Katea-Al-Shaghir__Agras-Agraas_Bells.html",
  tracks: [
  { id: "agr-001", title: "مقدمة شريط أجراس اجراس", group: "أجراس أجراس",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/01-Al-Katee3-El-Saghir-04-Agraas-Agras/www.St-Takla.org__Agras__01-Intro.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/00001-b-Taraneem/El-Katea-Al-Shaghir__Agras-Agraas_Bells.html" },
  { id: "agr-002", title: "أجراس.. أجراس", group: "أجراس أجراس",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/01-Al-Katee3-El-Saghir-04-Agraas-Agras/www.St-Takla.org__Agras__02-Agras-Agraas.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/00001-b-Taraneem/El-Katea-Al-Shaghir__Agras-Agraas_Bells.html" },
  { id: "agr-003", title: "مين ساكن في قلبك؟", group: "أجراس أجراس",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/01-Al-Katee3-El-Saghir-04-Agraas-Agras/www.St-Takla.org__Agras__03-Meen-Saken-Fi-Albak.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/00001-b-Taraneem/El-Katea-Al-Shaghir__Agras-Agraas_Bells.html" },
  { id: "agr-004", title: "أنا باحبك يا ربي", group: "أجراس أجراس",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/01-Al-Katee3-El-Saghir-04-Agraas-Agras/www.St-Takla.org__Agras__04-Ana-Bahebak-Ya-Rabby.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/00001-b-Taraneem/El-Katea-Al-Shaghir__Agras-Agraas_Bells.html" },
  { id: "agr-005", title: "علشان يسوع", group: "أجراس أجراس",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/01-Al-Katee3-El-Saghir-04-Agraas-Agras/www.St-Takla.org__Agras__05-3alashan-Yasou3.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/00001-b-Taraneem/El-Katea-Al-Shaghir__Agras-Agraas_Bells.html" },
  { id: "agr-006", title: "أنا مسيحي", group: "أجراس أجراس",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/01-Al-Katee3-El-Saghir-04-Agraas-Agras/www.St-Takla.org__Agras__06-Ana-Masee7y.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/00001-b-Taraneem/El-Katea-Al-Shaghir__Agras-Agraas_Bells.html" },
  { id: "agr-007", title: "حاحكيلكم عن حبيبي", group: "أجراس أجراس",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/01-Al-Katee3-El-Saghir-04-Agraas-Agras/www.St-Takla.org__Agras__07-Ha-A7kilkom-3an-7abiby.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/00001-b-Taraneem/El-Katea-Al-Shaghir__Agras-Agraas_Bells.html" },
  { id: "agr-008", title: "بين صخور البحر الأحمر", group: "أجراس أجراس",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/01-Al-Katee3-El-Saghir-04-Agraas-Agras/www.St-Takla.org__Agras__08-Bein-Sokhoor-El-Ba7r-El-A7mar.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/00001-b-Taraneem/El-Katea-Al-Shaghir__Agras-Agraas_Bells.html" },
  { id: "agr-009", title: "فادينا إدانا أقوى سلاح", group: "أجراس أجراس",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/01-Al-Katee3-El-Saghir-04-Agraas-Agras/www.St-Takla.org__Agras__09-Fadina-Eddana-A2wa-Sela7.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/00001-b-Taraneem/El-Katea-Al-Shaghir__Agras-Agraas_Bells.html" },
  { id: "agr-010", title: "يا رسل المسيح", group: "أجراس أجراس",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/01-Al-Katee3-El-Saghir-04-Agraas-Agras/www.St-Takla.org__Agras__10-Ya-Rosol-El-Masi7.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/00001-b-Taraneem/El-Katea-Al-Shaghir__Agras-Agraas_Bells.html" },
  { id: "agr-011", title: "يا بخت اللي يكون سهران", group: "أجراس أجراس",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/01-Al-Katee3-El-Saghir-04-Agraas-Agras/www.St-Takla.org__Agras__11-Ya-Bakht-Elly-Yekoun-Sahran.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/00001-b-Taraneem/El-Katea-Al-Shaghir__Agras-Agraas_Bells.html" }
  ],
};

export const FAIROUZ_COLLECTION: StreamCollection = {
  id: "trn-fairouz-salb",
  title: "الصلب والقيامة",
  performer: "فيروز",
  countLabel: "١٠ ترانيم",
  sourceName: ST_TAKLA_SOURCE,
  sourceUrl: "https://st-takla.org/Multimedia/01-Carols/01-Carols-14-Fairouz_Al-Salb-Wal-Keyama.html",
  tracks: [
  { id: "frz-001", title: "اليوم علق على خشبة", group: "الصلب والقيامة",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/Fayrouz-Holy-Lent-Album/www.St-Takla.org__Fairouz_01-El-Yom-Ollika.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/01-Carols-14-Fairouz_Al-Salb-Wal-Keyama.html" },
  { id: "frz-002", title: "أنا الأم الحزينة", group: "الصلب والقيامة",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/Fayrouz-Holy-Lent-Album/www.St-Takla.org__Fairouz_02-Anal-Oum-El-Hazina.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/01-Carols-14-Fairouz_Al-Salb-Wal-Keyama.html" },
  { id: "frz-003", title: "يا شعبي وصحبي", group: "الصلب والقيامة",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/Fayrouz-Holy-Lent-Album/www.St-Takla.org__Fairouz_03-Ya-Chabi-ou-Sahbi.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/01-Carols-14-Fairouz_Al-Salb-Wal-Keyama.html" },
  { id: "frz-004", title: "قامت مريم", group: "الصلب والقيامة",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/Fayrouz-Holy-Lent-Album/www.St-Takla.org__Fairouz_04-Kamat-Mariyam.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/01-Carols-14-Fairouz_Al-Salb-Wal-Keyama.html" },
  { id: "frz-005", title: "واحبيبي", group: "الصلب والقيامة",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/Fayrouz-Holy-Lent-Album/www.St-Takla.org__Fairouz_05-Wa-Habibi.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/01-Carols-14-Fairouz_Al-Salb-Wal-Keyama.html" },
  { id: "frz-006", title: "كامل الأجيال", group: "الصلب والقيامة",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/Fayrouz-Holy-Lent-Album/www.St-Takla.org__Fairouz_06-Kamel-El-Ajyale.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/01-Carols-14-Fairouz_Al-Salb-Wal-Keyama.html" },
  { id: "frz-007", title: "طرق أورشليم", group: "الصلب والقيامة",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/Fayrouz-Holy-Lent-Album/www.St-Takla.org__Fairouz_07-Torok-Ourashaleem.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/01-Carols-14-Fairouz_Al-Salb-Wal-Keyama.html" },
  { id: "frz-008", title: "المسيح قام", group: "الصلب والقيامة",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/Fayrouz-Holy-Lent-Album/www.St-Takla.org__Fairouz_08-El-Massih-Kaam.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/01-Carols-14-Fairouz_Al-Salb-Wal-Keyama.html" },
  { id: "frz-009", title: "إستنيري (إن الملاك تفوه)", group: "الصلب والقيامة",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/Fayrouz-Holy-Lent-Album/www.St-Takla.org__Fairouz_09-Estanere.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/01-Carols-14-Fairouz_Al-Salb-Wal-Keyama.html" },
  { id: "frz-010", title: "يا يسوع الحياة نعظمك", group: "الصلب والقيامة",
    src: "https://st-takla.org/Multimedia/00-St-Takla.org_Coptic-Audio-Files/01-Taraniem/Fayrouz-Holy-Lent-Album/www.St-Takla.org__Fairouz_10-Ya-Yassouh-El-Hayat-Nouazimak.mp3",
    sourcePage: "https://st-takla.org/Multimedia/01-Carols/01-Carols-14-Fairouz_Al-Salb-Wal-Keyama.html" }
  ],
};

export const TARANEEM_COLLECTIONS: StreamCollection[] = [AGRAS_COLLECTION, FAIROUZ_COLLECTION];

const tasbehaCollection: StreamCollection = {
  id: TASBEHA_COLLECTION_ID,
  title: TASBEHA_COLLECTION_TITLE,
  performer: TASBEHA_PERFORMER,
  countLabel: `${tasbehaSunday.length} لحن`,
  sourceName: TASBEHA_SOURCE.name,
  sourceUrl: TASBEHA_SOURCE.url,
  tracks: tasbehaSunday,
};

export const streamCollections: StreamCollection[] = [tasbehaCollection, ...TARANEEM_COLLECTIONS];

export const findStreamCollection = (id: string | null): StreamCollection | undefined =>
  id ? streamCollections.find((c) => c.id === id) : undefined;

export const findStreamTrack = (id: string | null | undefined): StreamTrack | undefined =>
  id ? streamCollections.flatMap((c) => c.tracks).find((t) => t.id === id) : undefined;
