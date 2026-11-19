#!/usr/bin/env python3
"""Builds apps/web/src/data/agpeya/agpeya.json from the SQLite file of github.com/abanoubha/agpeya
(app/src/main/assets/agpeya, MIT-licensed repository) and applies two documented, source-backed edits:
 1. scripts/agpeya-refrain-expansions.json: the Coptic-letter refrains the DB abbreviates are written out as on the
    St-Takla.org Agpeya pages (the exact page is in each entry).
 2. TYPO_FIXES: one DB misspelling confirmed against the Van Dyck Arabic Bible.
Everything else is the DB text unchanged. Usage: python3 scripts/agpeya-export.py /path/to/agpeya-sqlite"""
import re
import json, os, sqlite3, sys
src = sys.argv[1]
c = sqlite3.connect(src)
texts = {k: (t, body) for k, t, body in c.execute("select prayer_key,title,content from prayers")}
order = {}
for p, key in c.execute("select prayer,prayer_key from prayers_order order by prayer,prayer_order"):
    order.setdefault(p, []).append(key)
# Midnight watch 3: the DB's own order omits three prayers that the same DB holds (and uses in Prime/Compline/Veil):
# holy_god, hail_you, creed_strart. The Arabic order at stmaryseattle.org/Agbeya/Nesfellel_3.aspx places them right after
# the concluding gospel (Luke 2:29-32, Simeon's song) and before the creed; wording is the DB text unchanged (284/284 words equal).
_m3 = order["Midnight_3"]
_i = _m3.index("midnight_gospel")
order["Midnight_3"] = _m3[:_i + 1] + ["holy_god", "hail_you", "creed_strart"] + _m3[_i + 1:]

DIA = re.compile(r"[\u064B-\u0652\u0670\u0640]")
MAP = {"\u0671": "\u0627", "\u0623": "\u0627", "\u0625": "\u0627", "\u0622": "\u0627", "\u0649": "\u064a", "\u0629": "\u0647", "\u0624": "\u0648", "\u0626": "\u064a", "\u0621": ""}
def nw(tok):
    t = DIA.sub("", tok)
    for a, b in MAP.items(): t = t.replace(a, b)
    return re.sub(r"[^\u0621-\u064A ]", " ", t).split()

EXP = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "agpeya-refrain-expansions.json"), encoding="utf-8"))["entries"]
# Psalm 141:2 (Van Dyck, https://free.bible/vandyck/psalms/141/): "لتستقم صلاتي"; the DB has "لتسقم".
TYPO_FIXES = {"psalm_140": [("\u0644\u062a\u0633\u0642\u0645", "\u0644\u062a\u0633\u062a\u0642\u0645")]}
applied = {"expansions": 0, "typos": 0}

# The DB, like St-Takla, ends many blocks with the cue "أبانا الذي في السموات..." and prints the full Lord's Prayer once (key lords_prayer).
# For a pray-through the cue is written out with that same DB text (unchanged), on its own line.
_lp = texts["lords_prayer"][1].replace("\\n", "\n")
LORDS = _lp[_lp.index("أبانا الذي في السموات."):].strip()
assert LORDS.endswith("آمين.") and "لأن لك الملك" in LORDS or "لان لك الملك" in LORDS, LORDS
CUE = re.compile(r"\s*(?:أبانا|ابانا) الذ[يى] (?:في|فى) السموات\s*(?:\.\.\.+|…)\s*$", re.M)
TITLE_FIXES = {"midnight_gospel": "إنجيل الختام"}  # the label of this block on https://www.stmaryseattle.org/Agbeya/Nesfellel_3.aspx ("إنجيل الختام وقانون الإيمان"); DB heading was "الانجيل"
applied_lp = [0]

def block(key, hid, n, db):
    title, body = texts[key]
    title = TITLE_FIXES.get(key, title)
    for a, b in TYPO_FIXES.get(key, []):
        if a in body: body = body.replace(a, b); applied["typos"] += 1
    raw = body.replace("\\n", "\n")
    ents = sorted([e for e in EXP if e["section"] == db and e["key"] == key], key=lambda e: -e["db_word_index"])
    if ents:
        toks = [(l, t) for l, line in enumerate(raw.split("\n")) for t in line.split()]
        counts = [len(nw(t)) for _, t in toks]
        words = [w for _, t in toks for w in nw(t)]
        starts = [sum(counts[:i]) for i in range(len(toks))]
        for e in ents:
            i = e["db_word_index"]
            assert words[max(0, i - 4):i] == e["db_context_before"].split(), (key, i, e["db_context_before"])
            k = max(x for x, s0 in enumerate(starts) if s0 < i) if e["op"] == "insert" else next(x for x, s0 in enumerate(starts) if s0 == i)
            if e["op"] == "replace": assert words[i:i + 1] == e["db_words_replaced"].split()
            # The cue as the DB writes it, e.g. "(ذكصاسي…)." or "(كى نين.. ) .": rewritten as "(cue written-out text)" + trailing dot.
            PUNCT = re.compile(r"^[.\u2026\s]*\)?[.]*$")
            s = k
            if e["text"].startswith("كي آ إي") and k > 0 and re.sub(r"[(]", "", toks[k - 1][1]) in ("كى", "كي"): s = k - 1
            first = toks[s][1]
            pre = first[:first.index("(")] if "(" in first else ""
            if not pre and s > 0 and toks[s - 1][1] == "(": s -= 1
            end = k; close = ")" in toks[k][1]
            while not close and end + 1 < len(toks) and toks[end + 1][0] == toks[k][0] and PUNCT.match(toks[end + 1][1]):
                end += 1; close = ")" in toks[end][1]
            if close and end + 1 < len(toks) and toks[end + 1][0] == toks[k][0] and toks[end + 1][1] == ".": end += 1
            span = " ".join(t for _, t in toks[s:end + 1])
            tail = span[span.rindex(")") + 1:].strip() if ")" in span else ""
            cue = "" if e["op"] == "replace" else re.sub(r"[().\u2026]+", " ", span.replace(pre, "", 1) if pre else span).strip()
            toks[s:end + 1] = [(toks[s][0], pre + "(" + (cue + " " if cue else "") + e["text"] + ")" + tail)]
            applied["expansions"] += 1
        out = {}
        for l, t in toks: out.setdefault(l, []).append(t)
        raw = "\n".join(" ".join(v) for _, v in sorted(out.items()))
    if key == "psalm_118": raw = raw.replace("فيلا نيثروبي ... المجد", "فيلا نيثروبي: المجد")  # DB's own first stanza; same wording as St-Takla
    raw, nsub = CUE.subn("\n" + LORDS, raw)
    applied_lp[0] += nsub
    lines = [l.strip() for l in raw.split("\n") if l.strip()]
    if not lines:
        raise SystemExit(f"empty text for {key}")
    return {"type": "prose", "id": f"{hid}-{n}-{key}", "kind": "psalm" if key.startswith("psalm_") else "prayer", "title": title.strip(), "lines": [{"text": l} for l in lines]}

# Rubric found in the St-Takla.org page of all 7 hours, immediately before the final "قدوس قدوس قدوس" block: "كيرياليسون (يا رب ارحم) 41 مرة".
# Only the instruction and the count are added (no prayer text); the reader turns it into a tap counter.
KYRIE = {"type": "prose", "kind": "repeat", "title": "كيرياليسون (يا رب ارحم)", "rubric": "٤١ مرة", "repeat": 41, "lines": []}

def with_kyrie(blocks, hid):
    i = max(n for n, b in enumerate(blocks) if b["id"].endswith("-holy3"))
    return blocks[:i] + [dict(KYRIE, id=f"{hid}-kyrie41")] + blocks[i:]

HOURS = {"prime": ("Prime", "صلاة باكر"), "terce": ("Terce", "الساعة الثالثة"), "sext": ("Sext", "الساعة السادسة"),
         "none": ("None", "الساعة التاسعة"), "vespers": ("Vespers", "الغروب"), "compline": ("Compline", "النوم"), "veil": ("Viel", "صلاة الستار")}
out = {}
for hid, (db, name) in HOURS.items():
    out[hid] = {"id": hid, "name": name, "items": with_kyrie([block(k, hid, i, db) for i, k in enumerate(order[db])], hid)}
watches = [("Midnight_1", "الخدمة الأولى"), ("Midnight_2", "الخدمة الثانية"), ("Midnight_3", "الخدمة الثالثة")]
out["midnight"] = {"id": "midnight", "name": "نصف الليل", "items": [
    {"type": "watch", "id": f"midnight-{i}", "title": t, "blocks": with_kyrie([block(k, f"midnight-{i}", n, db) for n, k in enumerate(order[db])], f"midnight-{i}")}
    for i, (db, t) in enumerate(watches, 1)]}
dest = os.path.join(os.path.dirname(__file__), "..", "src", "data", "agpeya", "agpeya.json")
os.makedirs(os.path.dirname(dest), exist_ok=True)
json.dump(out, open(dest, "w", encoding="utf-8"), ensure_ascii=False)
assert applied["expansions"] == len(EXP) and applied["typos"] == 3, applied
print(applied, "lords_prayer cues written out:", applied_lp[0], "wrote", os.path.normpath(dest), {k: len(v["items"]) for k, v in out.items()})
