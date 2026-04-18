const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'references_data.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Common terms mapping
const terms = {
    "Campagne géotechnique": {
        en: "Geotechnical campaign",
        es: "Campaña geotécnica",
        ar: "حملة جيوتقنية",
        de: "Geotechnische Kampagne",
        it: "Campagna geotecnica",
        zh: "岩土工程勘察",
        sw: "Kampeni ya Jioteknolojia",
        yo: "Ipolongo Geotechnical"
    },
    "Etude de Fondations": {
        en: "Foundation study",
        es: "Estudio de cimentaciones",
        ar: "دراسة الأساسات",
        de: "Gründungsstudie",
        it: "Studio delle fondazioni",
        zh: "基础研究",
        sw: "Utafiti wa Msingi",
        yo: "Iwadi Ipilẹ"
    },
    "Etude d'Amélioration du sol/Préchargement": {
        en: "Soil improvement/Preloading study",
        es: "Estudio de mejora del suelo/Precarga",
        ar: "دراسة تحسين التربة/التحميل المسبق",
        de: "Bodenverbesserungsstudie/Vorbelastung",
        it: "Studio di miglioramento del suolo/Precarico",
        zh: "地基改良/预压研究",
        sw: "Utafiti wa Uboreshaji wa Udongo/Upakiaji wa mapema",
        yo: "Imudara ile/Iwadi iṣaaju-ikojọpọ"
    },
    "Supervision géotechnique": {
        en: "Geotechnical supervision",
        es: "Supervisión geotécnica",
        ar: "إشراف جيوتقني",
        de: "Geotechnische Überwachung",
        it: "Supervisione geotecnica",
        zh: "岩土工程监管",
        sw: "Usimamizi wa Jioteknolojia",
        yo: "Abojuto Geotechnical"
    },
    "Contrôle interne": {
        en: "Internal control",
        es: "Control interno",
        ar: "رقابة داخلية",
        de: "Interne Kontrolle",
        it: "Controllo interno",
        zh: "内部控制",
        sw: "Udhibiti wa Ndani",
        yo: "Iṣakoso inu"
    },
    "Assistance technique": {
        en: "Technical assistance",
        es: "Asistencia técnica",
        ar: "مساعدة فنية",
        de: "Technische Unterstützung",
        it: "Assistenza tecnica",
        zh: "技术援助",
        sw: "Msaada wa Kiufundi",
        yo: "Iranlọwọ Imọ-ẹrọ"
    },
    "Etude d'éxécution géotechnique": {
        en: "Geotechnical execution study",
        es: "Estudio de ejecución geotécnica",
        ar: "دراسة تنفيذ جيوتقنية",
        de: "Geotechnische Ausführungsstudie",
        it: "Studio di esecuzione geotecnica",
        zh: "岩土工程施工研究",
        sw: "Utafiti wa Utekelezaji wa Jioteknolojia",
        yo: "Iwadi Iṣe Geotechnical"
    },
    "Etude de fondations des ouvrages OH et OA": {
        en: "Foundation study for hydraulic and art structures",
        es: "Estudio de cimentación de obras hidráulicas y de arte",
        ar: "دراسة أساسات المنشآت الهيدروليكية والفنية",
        de: "Gründungsstudie für Wasser- und Ingenieurbauwerke",
        it: "Studio delle fondazioni di opere idrauliche e d'arte",
        zh: "水利和艺术结构基础研究",
        sw: "Utafiti wa Msingi kwa Miundo ya Maji na Sanaa",
        yo: "Iwadi Ipilẹ fun Awọn ẹya Hydraulic ati Iṣẹ-ọnà"
    },
    "Analyse des tassements des sections en remblais": {
        en: "Settlement analysis of embankment sections",
        es: "Análisis de asentamientos de secciones en terraplén",
        ar: "تحليل هبوط مقاطع الردم",
        de: "Setzungsanalyse von Dammabschnitten",
        it: "Analisi dei cedimenti delle sezioni in rilevato",
        zh: "路堤段沉降分析",
        sw: "Uchambuzi wa Kutulia kwa Sehemu za Tutu",
        yo: "Itupalẹ ti ibugbe ti awọn apakan embankment"
    },
    "Etude de stabilité des sections en remblais": {
        en: "Stability study of embankment sections",
        es: "Estudio de estabilidad de secciones en terraplén",
        ar: "دراسة استقرار مقاطع الردم",
        de: "Stabilitätsstudie von Dammabschnitten",
        it: "Studio di stabilità delle sezioni in rilevato",
        zh: "路堤段稳定性研究",
        sw: "Utafiti wa Uthabiti wa Sehemu za Tutu",
        yo: "Iwadi iduroṣinṣin ti awọn apakan embankment"
    },
    "Assiatance technique": {
        en: "Technical assistance",
        es: "Asistencia técnica",
        ar: "مساعدة فنية",
        de: "Technische Unterstützung",
        it: "Assistenza tecnica",
        zh: "技术援助",
        sw: "Msaada wa Kiufundi",
        yo: "Iranlọwọ Imọ-ẹrọ"
    },
    "Etude de Fondations-soutènements": {
        en: "Foundation and retaining wall study",
        es: "Estudio de cimentaciones y muros de contención",
        ar: "دراسة الأساسات والجدران الساندة",
        de: "Gründungs- und Stützwandstudie",
        it: "Studio di fondazioni e muri di sostegno",
        zh: "基础和挡土墙研究",
        sw: "Utafiti wa Msingi na Ukuta wa Kuzuia",
        yo: "Ipilẹ ati Iwadi Ogiri Iduro"
    },
    "Etude de Fondations-Soutènements": {
        en: "Foundation and retaining wall study",
        es: "Estudio de cimentaciones y muros de contención",
        ar: "دراسة الأساسات والجدران الساندة",
        de: "Gründungs- und Stützwandstudie",
        it: "Studio di fondazioni e muri di sostegno",
        zh: "基础和挡土墙研究",
        sw: "Utafiti wa Msingi na Ukuta wa Kuzuia",
        yo: "Ipilẹ ati Iwadi Ogiri Iduro"
    },
    "Supervion géotechnique": {
        en: "Geotechnical supervision",
        es: "Supervisión geotécnica",
        ar: "إشراف جيوتقني",
        de: "Geotechnische Überwachung",
        it: "Supervisione geotecnica",
        zh: "岩土工程监管",
        sw: "Usimamizi wa Jioteknolojia",
        yo: "Abojuto Geotechnical"
    },
    "Supervion géotechnique ": {
        en: "Geotechnical supervision",
        es: "Supervisión geotécnica",
        ar: "إشراف جيوتقني",
        de: "Geotechnische Überwachung",
        it: "Supervisione geotecnica",
        zh: "岩土工程监管",
        sw: "Usimamizi wa Jioteknolojia",
        yo: "Abojuto Geotechnical"
    },
    "Enquête documentaire": {
        en: "Documentary survey",
        es: "Investigación documental",
        ar: "مسح وثائقي",
        de: "Dokumentarische Untersuchung",
        it: "Indagine documentale",
        zh: "文件调查",
        sw: "Utafiti wa Hati",
        yo: "Iwadi Iwe-ipamọ"
    },
    "Etude de faisabilité géotechnique": {
        en: "Geotechnical feasibility study",
        es: "Estudio de viabilidad geotécnica",
        ar: "دراسة الجدوى الجيوتقنية",
        de: "Geotechnische Machbarkeitsstudie",
        it: "Studio di fattibilità geotecnica",
        zh: "岩土工程可行性研究",
        sw: "Utafiti wa Uwezekano wa Jioteknolojia",
        yo: "Iwadi iṣeeṣe Geotechnical"
    },
    "Expertise et controle des ouvrages géotechniques réalisés": {
        en: "Expertise and control of geotechnical works",
        es: "Peritaje y control de obras geotécnicas realizadas",
        ar: "الخبرة والرقابة على الأعمال الجيوتقنية المنجزة",
        de: "Expertise und Kontrolle durchgeführter geotechnischer Arbeiten",
        it: "Perizia e controllo delle opere geotecniche realizzate",
        zh: "已完成岩土工程的鉴定与控制",
        sw: "Utaalamu na Udhibiti wa Kazi za Jioteknolojia",
        yo: "Imọran ati Iṣakoso ti awọn iṣẹ geotechnical ti a ṣe"
    },
    "Analyse rapports géotechniques": {
        en: "Analysis of geotechnical reports",
        es: "Análisis de informes geotécnicos",
        ar: "تحليل التقارير الجيوتقنية",
        de: "Analyse geotechnischer Berichte",
        it: "Analisi dei rapporti geotecnici",
        zh: "岩土报告分析",
        sw: "Uchambuzi wa Ripoti za Jioteknolojia",
        yo: "Itupalẹ awọn iroyin geotechnical"
    },
    "Examen et contrôle des études d'exécution": {
        en: "Review and control of execution studies",
        es: "Revisión y control de estudios de ejecución",
        ar: "مراجعة ومراقبة دراسات التنفيذ",
        de: "Prüfung und Kontrolle von Ausführungsstudien",
        it: "Revisione e controllo degli studi di esecuzione",
        zh: "施工研究的审查与控制",
        sw: "Mapitio na Udhibiti wa Tafiti za Utekelezaji",
        yo: "Atunyẹwo ati Iṣakoso ti awọn iwadi iṣẹ"
    },
    "Etude d'exécution/Fondations-Soutènements": {
        en: "Execution study/Foundations-Retaining walls",
        es: "Estudio de ejecución/Cimentaciones-Muros de contención",
        ar: "دراسة التنفيذ/الأساسات والجدران الساندة",
        de: "Ausführungsstudie/Gründungen-Stützwände",
        it: "Studio di esecuzione/Fondazioni-Muri di sostegno",
        zh: "施工研究/基础-挡土墙",
        sw: "Utafiti wa Utekelezaji/Misingi-Kuta za Kuzuia",
        yo: "Iwadi Iṣẹ/Awọn ipilẹ-Awọn ogiri Iduro"
    },
    "PONTS PK…..": {
        en: "Bridges PK…..",
        es: "Puentes PK…..",
        ar: "جسور PK…..",
        de: "Brücken PK…..",
        it: "Ponti PK…..",
        zh: "桥梁 PK…..",
        sw: "Madaraja PK…..",
        yo: "Afara PK….."
    },
    "Capacité de 50 000 m3/j": {
        en: "Capacity of 50,000 m3/d",
        es: "Capacidad de 50.000 m3/d",
        ar: "سعة 50,000 م3/يوم",
        de: "Kapazität von 50.000 m3/T",
        it: "Capacità di 50.000 m3/g",
        zh: "日处理能力 50,000 立方米",
        sw: "Uwezo wa 50,000 m3/siku",
        yo: "Agbara ti 50,000 m3/ọjọ"
    },
    "Divers structures": {
        en: "Various structures",
        es: "Varias estructuras",
        ar: "هياكل متنوعة",
        de: "Verschiedene Strukturen",
        it: "Diverse strutture",
        zh: "各种结构",
        sw: "Miundo mbalimbali",
        yo: "Orisirisi awọn ẹya"
    },
    "Ligne T.G.M": {
        en: "T.G.M Line",
        es: "Línea T.G.M",
        ar: "خط T.G.M",
        de: "T.G.M-Linie",
        it: "Linea T.G.M",
        zh: "T.G.M 线",
        sw: "Laini ya T.G.M",
        yo: "Laini T.G.M"
    },
    "Linéaire-630ml/Tunnel-260ml": {
        en: "Linear-630ml/Tunnel-260ml",
        es: "Lineal-630ml/Túnel-260ml",
        ar: "طولي-630م/نفق-260م",
        de: "Linear-630ml/Tunnel-260ml",
        it: "Lineare-630ml/Tunnel-260ml",
        zh: "线性-630米/隧道-260米",
        sw: "Linear-630ml/Tunnel-260ml",
        yo: "Linear-630ml/Tunnel-260ml"
    },
    "OUVRAGES HYDRAULIQUES-OUVRAGES D'ART/REMBLAIS": {
        en: "Hydraulic Structures/Art Structures/Embankments",
        es: "Obras Hidráulicas/Obras de Arte/Terraplenes",
        ar: "منشآت هيدروليكية/منشآت فنية/ردميات",
        de: "Wasserbauwerke/Kunstbauten/Dämme",
        it: "Opere Idrauliche/Opere d'Arte/Rilevati",
        zh: "水工结构/艺术结构/路堤",
        sw: "Miundo ya Maji/Miundo ya Sanaa/Tutuw",
        yo: "Awọn ẹya Hydraulic/Awọn ẹya Iṣẹ-ọnà/Awọn embankments"
    },
    "BASSINS-RESERVOIS-RESEAUX-STATIONS DE POMPAGE": {
        en: "Basins-Reservoirs-Networks-Pumping Stations",
        es: "Cuencas-Embalses-Redes-Estaciones de Bombeo",
        ar: "أحواض-خزانات-شبكات-محطات ضخ",
        de: "Becken-Reservoirs-Netzwerke-Pumpstationen",
        it: "Bacini-Serbatoi-Reti-Stazioni di Pompaggio",
        zh: "盆地-水库-网络-泵站",
        sw: "Mabwawa-Viwanda-Mitandao-Vituo vya Kusukuma",
        yo: "Awọn agbada-Awọn ifiomipamo-Awọn nẹtiwọki-Awọn ibudo fifa"
    },
    "BASSINS-RESERVOIS-RESEAUX": {
        en: "Basins-Reservoirs-Networks",
        es: "Cuencas-Embalses-Redes",
        ar: "أحواض-خزانات-شبكات",
        de: "Becken-Reservoirs-Netzwerke",
        it: "Bacini-Serbatoi-Reti",
        zh: "盆地-水库-网络",
        sw: "Mabwawa-Viwanda-Mitandao",
        yo: "Awọn agbada-Awọn ifiomipamo-Awọn nẹtiwọki"
    },
    "Aérogare/ Bloc Technique/Tour de contrôle/Hangar fret…": {
        en: "Terminal/Technical Block/Control Tower/Freight Hangar…",
        es: "Terminal/Bloque Técnico/Torre de Control/Hangar de Carga…",
        ar: "محطة/كتلة فنية/برج مراقبة/حظيرة شحن…",
        de: "Terminal/Technikblock/Kontrollturm/Frachthangar…",
        it: "Terminale/Blocco Tecnico/Torre di Controllo/Hangar Merci…",
        zh: "航站楼/技术大楼/控制塔/货运机库…",
        sw: "Kituo/Kizuizi cha Kiufundi/Mnara wa Kudhibiti/Hangar ya Mizigo…",
        yo: "Ebute/Idina Imọ-ẹrọ/Ile-iṣọ Iṣakoso/Hangar Ẹru…"
    },
    "10 SITES PROPOSES": {
        en: "10 Proposed Sites",
        es: "10 Sitios Propuestos",
        ar: "10 مواقع مقترحة",
        de: "10 Vorgeschlagene Standorte",
        it: "10 Siti Proposti",
        zh: "10 个建议地点",
        sw: "Maeneo 10 Yaliyopendekezwa",
        yo: "Awọn aaye 10 ti a dabaa"
    }
};

// Regex Replacements (Extend for new languages)
const replacements = [
    {
        regex: /(\d+)\s*SOUS-SOL[S]?/gi,
        replace: {
            en: "$1 Basement(s)",
            es: "$1 Sótano(s)",
            ar: "$1 طابق سفلي",
            de: "$1 Untergeschoss(e)",
            it: "$1 Seminterrato(i)",
            zh: "$1 层地下室",
            sw: "$1 Sakafu ya chini",
            yo: "$1 Ipilẹ ile"
        }
    },
    {
        regex: /RDC/gi,
        replace: {
            en: "Ground Floor",
            es: "Planta Baja",
            ar: "طابق أرضي",
            de: "Erdgeschoss",
            it: "Piano Terra",
            zh: "底层",
            sw: "Ghorofa ya chini",
            yo: "Ipilẹ Ilẹ"
        }
    },
    {
        regex: /(\d+)\s*ETAGES/gi,
        replace: {
            en: "$1 Floors",
            es: "$1 Pisos",
            ar: "$1 طوابق",
            de: "$1 Etagen",
            it: "$1 Piani",
            zh: "$1 层楼",
            sw: "$1 Ghorofa",
            yo: "$1 Awọn ilẹ ipakà"
        }
    },
    {
        regex: /(\d+)\s*NIVEAUX/gi,
        replace: {
            en: "$1 Levels",
            es: "$1 Niveles",
            ar: "$1 مستويات",
            de: "$1 Ebenen",
            it: "$1 Livelli",
            zh: "$1 层",
            sw: "$1 Ngazi",
            yo: "$1 Awọn ipele"
        }
    },
    {
        regex: /SUPERFICIE/gi,
        replace: {
            en: "Area",
            es: "Área",
            ar: "مساحة",
            de: "Fläche",
            it: "Superficie",
            zh: "面积",
            sw: "Eneo",
            yo: "Agbegbe"
        }
    },
    {
        regex: /Capacité de/gi,
        replace: {
            en: "Capacity of",
            es: "Capacidad de",
            ar: "سعة",
            de: "Kapazität von",
            it: "Capacità di",
            zh: "容量",
            sw: "Uwezo wa",
            yo: "Agbara ti"
        }
    },
    {
        regex: /La plus haute tour d'Afrique/gi,
        replace: {
            en: "The highest tower in Africa",
            es: "La torre más alta de África",
            ar: "أعلى برج في أفريقيا",
            de: "Der höchste Turm Afrikas",
            it: "La torre più alta d'Africa",
            zh: "非洲最高塔",
            sw: "Mnara mrefu zaidi barani Afrika",
            yo: "Ile-iṣọ ti o ga julọ ni Afirika"
        }
    },
    {
        regex: /mètres/gi,
        replace: {
            en: "meters",
            es: "metros",
            ar: "متر",
            de: "Meter",
            it: "metri",
            zh: "米",
            sw: "mita",
            yo: "mita"
        }
    },
    {
        regex: /Ligne/gi,
        replace: {
            en: "Line",
            es: "Línea",
            ar: "خط",
            de: "Linie",
            it: "Linea",
            zh: "线",
            sw: "Laini",
            yo: "Laini"
        }
    },
    {
        regex: /TUNISIE/gi,
        replace: {
            en: "Tunisia",
            es: "Túnez",
            ar: "تونس",
            de: "Tunesien",
            it: "Tunisia",
            zh: "突尼斯",
            sw: "Tunisia",
            yo: "Tunisia"
        }
    },
    {
        regex: /MAROC/gi,
        replace: {
            en: "Morocco",
            es: "Marruecos",
            ar: "المغرب",
            de: "Marokko",
            it: "Marocco",
            zh: "摩洛哥",
            sw: "Morocco",
            yo: "Morocco"
        }
    },
    {
        regex: /TCHAD/gi,
        replace: {
            en: "Chad",
            es: "Chad",
            ar: "تشاد",
            de: "Tschad",
            it: "Ciad",
            zh: "乍得",
            sw: "Chad",
            yo: "Chad"
        }
    },
    {
        regex: /GUINEE/gi,
        replace: {
            en: "Guinea",
            es: "Guinea",
            ar: "غينيا",
            de: "Guinea",
            it: "Guinea",
            zh: "几内亚",
            sw: "Guinea",
            yo: "Guinea"
        }
    },
    {
        regex: /CONGO/gi,
        replace: {
            en: "Congo",
            es: "Congo",
            ar: "الكونغو",
            de: "Kongo",
            it: "Congo",
            zh: "刚果",
            sw: "Congo",
            yo: "Kongo"
        }
    }
];

function translateText(text, lang) {
    if (!text) return text;
    let t = text.trim();

    // Direct dictionary match
    if (terms[t]) return terms[t][lang] || t;
    if (terms[t.replace(/\s+$/, '')]) return terms[t.replace(/\s+$/, '')][lang] || t;

    // Regex replacements
    let result = t;
    replacements.forEach(r => {
        if (r.replace[lang]) {
            result = result.replace(r.regex, r.replace[lang]);
        }
    });

    return result;
}

function processProjects(list) {
    list.forEach(p => {
        // Init fields if missing for all langs
        const langs = ['es', 'ar', 'de', 'it', 'zh', 'sw', 'yo'];

        langs.forEach(lang => {
            if (!p.structure[lang]) p.structure[lang] = "";
            if (!p.mission[lang]) p.mission[lang] = "";
            if (!p.site[lang]) p.site[lang] = "";
            if (!p.details[lang]) p.details[lang] = [];
            if (!p.name[lang]) p.name[lang] = p.name.fr; // Name fallback
        });

        const sourceStr = p.structure.fr || p.structure.en;
        const sourceMis = p.mission.fr || p.mission.en;
        const sourceSite = p.site.fr || p.site.en;

        // Apply translations
        langs.forEach(lang => {
            if (!p.structure[lang]) p.structure[lang] = translateText(sourceStr, lang);
            if (!p.mission[lang]) p.mission[lang] = translateText(sourceMis, lang);
            if (!p.site[lang]) p.site[lang] = translateText(sourceSite, lang);
            // Translate details
            if (p.details.fr) {
                p.details[lang] = p.details.fr.map(d => translateText(d, lang));
            }
        });
    });
}

processProjects(data.tunisia);
if (data.international) processProjects(data.international);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Applied AR, ES, DE, IT, ZH, SW, YO translations.");
