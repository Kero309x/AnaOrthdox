# Alexandrian Paschalion & Computus Paschalis Research

## Tabular Ecclesiastical Metonic Cycles vs Astronomical Moon Phases

**Document ID:** RES-CAL-002  
**Status:** APPROVED RESEARCH BASELINE  
**Author:** Principal Software Architect, Church History & Chronology Researcher  
**Target Release:** Phase 2B.2 (Alexandrian Paschal Computus Engine)  
**Related Documents:** ADR-0008.md, ARCHITECTURE.md, DOMAIN_BOUNDARIES.md

---

## 1. Theological and Historical Foundation

At the First Ecumenical Council of Nicaea (325 AD), the universal Church resolved that all Christians should celebrate the Holy Feast of the Resurrection (Pascha) on the same day throughout the world. Because the See of Alexandria possessed the most advanced astronomical academy in antiquity, the Council entrusted the Patriarch of Alexandria with the canonical responsibility to calculate the exact date of Easter each year and announce it to the universal episcopate via the annual **Festal / Paschal Letters** (_Epistolae Festales_ / الرسائل الفصحية).

### Canonical Criteria of Nicaea:

1. Pascha must occur on a Sunday.
2. It must follow the first full moon occurring on or after the Vernal Equinox (fixed by the Council as 21 Baramhat / March 21 Julian).
3. It must strictly follow the Jewish Passover (14 Nisan) to preserve the historical salvation timeline attested in the Holy Gospels.

---

## 2. The Crucial Distinction: Tabular Ecclesiastical Moon vs Astronomical Moon

A foundational architectural distinction in historical Christian chronometry is the difference between the **Tabular (Ecclesiastical) Moon** and the **Astronomical Moon**:

### 2.1 Tabular Ecclesiastical Moon (القمر الحسابي / البدر الكنسي)

- **Nature:** Deterministic, cyclical integer arithmetic governed by the 19-year Metonic cycle (دورة ميتون).
- **Purpose:** To provide a single, universal, pre-computable date that can be calculated centuries in advance without requiring physical telescopes, atmospheric clearance, or local observational consensus.
- **Independence:** The calculation is purely mathematical and invariant across geographical longitudes.

### 2.2 Real Astronomical Moon (القمر الفلكي الحقيقي)

- **Nature:** Physical celestial body whose orbital velocity fluctuates due to solar perturbations, tidal friction, Earth's oblate shape, and general relativity.
- **Why the Council of Nicaea Did Not Adopt Astronomical Observation:**
  If the Church had relied on actual astronomical sightings or modern astronomical zenith timestamps:
  1. A full moon occurring at 23:45 UTC on a Saturday would be Saturday in Alexandria, but Sunday 01:45 in Jerusalem and Monday 08:45 in Tokyo, fracturing the unity of Pascha across dioceses.
  2. Adverse weather (overcast skies) would create regional disagreements regarding whether the crescent or full moon had appeared.
  3. Consequently, the Alexandrian fathers codified a **closed tabular mathematical model (Computus)** that guarantees absolute ecclesial consensus.

---

## 3. The Alexandrian Epact (الأبقطي) Mathematical Model

The traditional Coptic computus was codified by medieval Coptic scholars, notably **Abu Shakir ibn al-Rahib** (_Kitab al-Tawarikh_, 13th c.) and **Ibn Kabar** (_Misbah al-Zulmah fi Idah al-Khidmah_):

### 3.1 The Cycles

- **Solar Cycle (الدورة الشمسية):** 28 years ($4 \times 7$), after which weekday occurrences on specific dates repeat identically.
- **Lunar Metonic Cycle (الدورة القمرية):** 19 Julian years ($19 \times 365.25 = 6939.75$ days), very closely approximating 235 synodic lunar months ($235 \times 29.53059 = 6939.69$ days). The discrepancy is only about 1 hour and 28 minutes every 19 years.

### 3.2 The Epact (الأبقطي)

The Epact denotes the age of the moon (in days) on the first day of the civil year (1 Thout):
$$\text{Golden Number } G = ((\text{Year} - 1) \pmod{19}) + 1$$
$$\text{Epact} = (G - 1) \times 11 \pmod{30}$$

### 3.3 Determining Paschal Full Moon (ذبح الخروف)

The target full moon corresponding to the 14th of the Jewish Nisan is determined algebraically between 25 Baramhat and 23 Baramouda. Pascha is celebrated on the following Sunday.

---

## 4. Architectural Boundaries for Implementation in Phase 2B.2

In accordance with Phase 2B.1 boundaries:

1. **Zero Paschalion in Phase 2B.1:** The current phase (`@ana-orthodox/coptic-calendar`) strictly implements the **Coptic Civil Calendar** (fixed 365/366 day conversion).
2. **Phase 2B.2 Target:** Implement `calculateAlexandrianPascha(year)` as a pure function in `@ana-orthodox/coptic-calendar`, returning:
   - Pascha Sunday (Coptic & Gregorian dates).
   - Movable Feast dates:
     - Jonah's Fast (صوم يونان - 9 weeks before Pascha).
     - Great Lent (الصوم الكبير - 55 days before Pascha).
     - Palm Sunday (أحد الشعانين - 7 days before Pascha).
     - Holy Week (أسبوع الآلام).
     - Ascension (عيد الصعود - 40 days after Pascha).
     - Pentecost (عيد العنصرة - 50 days after Pascha).
     - Apostles' Fast duration (صوم الرسل).
