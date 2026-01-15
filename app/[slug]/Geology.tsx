"use client";
import React, { useEffect, useState } from "react";

const geologyTranslations: any = {
  en: {
    title: "Geology",
    description:
      "Our Geology services provide expert analysis of rock formations, soil composition, and geological hazards to support your engineering and construction projects. We deliver detailed geological surveys, mapping, and risk assessments to ensure informed decision-making and project safety.",
    bullets: [
      "Geological mapping and site characterization",
      "Rock and soil sampling and analysis",
      "Assessment of geological hazards (landslides, earthquakes, etc.)",
      "Hydrogeological studies",
      "Support for mining and tunneling projects",
    ],
  },
  fr: {
    title: "Géologie",
    description:
      "Nos services de géologie offrent une analyse experte des formations rocheuses, de la composition des sols et des risques géologiques pour accompagner vos projets d’ingénierie et de construction. Nous réalisons des études géologiques détaillées, des cartographies et des évaluations des risques pour garantir une prise de décision éclairée et la sécurité des projets.",
    bullets: [
      "Cartographie géologique et caractérisation des sites",
      "Échantillonnage et analyse des roches et des sols",
      "Évaluation des risques géologiques (glissements de terrain, séismes, etc.)",
      "Études hydrogéologiques",
      "Assistance pour les projets miniers et de tunnels",
    ],
  },
  ar: {
    title: "الجيولوجيا",
    description: "توفر خدمات الجيولوجيا لدينا تحليلاً خبيراً لتكوينات الصخور وتكوين التربة والمخاطر الجيولوجية لدعم مشاريع الهندسة والبناء الخاصة بك. نقدم مسوحات جيولوجية مفصلة ورسم خرائط وتقييمات للمخاطر لضمان اتخاذ قرارات مستنيرة وسلامة المشروع.",
    bullets: [
      "رسم الخرائط الجيولوجية وتوصيف الموقع",
      "أخذ عينات من الصخور والتربة وتحليلها",
      "تقييم المخاطر الجيولوجية (الانهيارات الأرضية، الزلازل، إلخ)",
      "دراسات هيدروجيولوجية",
      "دعم مشاريع التعدين والأنفاق"
    ]
  },
  es: {
    title: "Geología",
    description: "Nuestros servicios de geología proporcionan un análisis experto de formaciones rocosas, composición del suelo y peligros geológicos para apoyar sus proyectos de ingeniería y construcción. Ofrecemos estudios geológicos detallados, cartografía y evaluaciones de riesgos para garantizar una toma de decisiones informada y la seguridad del proyecto.",
    bullets: [
      "Mapeo geológico y caracterización del sitio",
      "Muestreo y análisis de rocas y suelos",
      "Evaluación de peligros geológicos (deslizamientos, terremotos, etc.)",
      "Estudios hidrogeológicos",
      "Apoyo para proyectos de minería y túneles"
    ]
  },
  de: {
    title: "Geologie",
    description: "Unsere Geologie-Dienstleistungen bieten Expertenanalysen von Gesteinsformationen, Bodenzusammensetzung und geologischen Gefahren, um Ihre Ingenieur- und Bauprojekte zu unterstützen. Wir liefern detaillierte geologische Untersuchungen, Kartierungen und Risikobewertungen.",
    bullets: [
      "Geologische Kartierung und Standortcharakterisierung",
      "Gesteins- und Bodenprobenahme und -analyse",
      "Bewertung geologischer Gefahren (Erdrutsche, Erdbeben usw.)",
      "Hydrogeologische Studien",
      "Unterstützung bei Bergbau- und Tunnelbauprojekten"
    ]
  },
  it: {
    title: "Geologia",
    description: "I nostri servizi di geologia forniscono analisi esperte di formazioni rocciose, composizione del suolo e rischi geologici per supportare i tuoi progetti di ingegneria e costruzione. Forniamo indagini geologiche dettagliate, mappatura e valutazioni del rischio.",
    bullets: [
      "Mappatura geologica e caratterizzazione del sito",
      "Campionamento e analisi di rocce e suoli",
      "Valutazione dei rischi geologici (frane, terremoti, ecc.)",
      "Studi idrogeologici",
      "Supporto per progetti minerari e di tunnel"
    ]
  },
  zh: {
    title: "地质学",
    description: "我们的地质服务提供岩层、土壤成分和地质灾害的专家分析，以支持您的工程和建设项目。我们提供详细的地质调查、测绘和风险评估，以确保明智的决策和项目安全。",
    bullets: [
      "地质测绘和场地特征描述",
      "岩石和土壤取样及分析",
      "地质灾害评估（滑坡、地震等）",
      "水文地质研究",
      "采矿和隧道项目支持"
    ]
  },
  sw: {
    title: "Jiolojia",
    description: "Huduma zetu za Jiolojia hutoa uchambuzi wa kitaalamu wa miundo ya miamba, muundo wa udongo, na hatari za kijiolojia kusaidia miradi yako ya uhandisi na ujenzi. Tunatoa uchunguzi wa kina wa kijiolojia ili kuhakikisha usalama wa mradi.",
    bullets: [
      "Ramani ya kijiolojia na sifa za tovuti",
      "Sampuli za miamba na udongo na uchambuzi",
      "Tathmini ya hatari za kijiolojia (maporomoko ya ardhi, matetemeko, nk)",
      "Masomo ya haidrojiolojia",
      "Msaada kwa miradi ya uchimbaji madini na handaki"
    ]
  },
  yo: {
    title: "Jioloji",
    description: "Awọn iṣẹ Jioloji wa pese itupalẹ amoye ti awọn idasile apata, akopọ ile, ati awọn eewu ti ẹkọ-aye lati ṣe atilẹyin awọn iṣẹ imọ-ẹrọ ati ikole rẹ. A pese awọn iwadii alaye, aworan agbaye, ati awọn igbelewọn eewu.",
    bullets: [
      "Maapu ti ẹkọ-aye ati isedaaye aaye",
      "Apata ati yiyewo ile ati itupalẹ",
      "Igbelewọn awọn eewu ti ẹkọ-aye (ilẹ-ilẹ, jigijigi, ati bẹbẹ lọ)",
      "Awọn ẹkọ Hydrogeological",
      "Atilẹyin fun iwakusa ati awọn iṣẹ eefin"
    ]
  },
  am: {
    title: "ጂኦሎጂ",
    description: "የእኛ የጂኦሎጂ አገልግሎቶች የምህንድስና እና የግንባታ ፕሮጀክቶችዎን ለመደገፍ የድንጋይ አወቃቀሮችን ፣ የአፈር ስብጥርን እና የጂኦሎጂካል አደጋዎችን የባለሙያ ትንተና ይሰጣሉ ።",
    bullets: [
      "የጂኦሎጂካል ካርታ እና የጣቢያ ባህሪ",
      "የድንጋይ እና የአፈር ናሙና እና ትንተና",
      "የጂኦሎጂካል አደጋዎች ግምገማ (የመሬት መንሸራተት ፣ የመሬት መንቀጥቀጥ ፣ ወዘተ)",
      "የሃይድሮጂኦሎጂካል ጥናቶች",
      "ለማዕድን እና ለዋሻ ፕሮጀክቶች ድጋፍ"
    ]
  },
  ha: {
    title: "Ilimin Ƙasa (Geology)",
    description: "Ayyukanmu na ilimin ƙasa suna ba da kwararrun bincike kan samuwar dutse, hada-hadar ƙasa, da hatsarori na ƙasa don tallafawa ayyukan injiniya da gini. Muna isar da cikakken binciken yanayin ƙasa.",
    bullets: [
      "Taswirar yanayin ƙasa da kuma sifa ta shafi",
      "Samfurin dutse da ƙasa da bincike",
      "Kimanin hatsarori na ƙasa (zazaɓewar ƙasa, girgizar ƙasa, da sauransu)",
      "Nazarin Hydrogeological",
      "Taimako ga ayyukan hakar ma'adinai da rami"
    ]
  }
};

export default function Geology() {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const l = localStorage.getItem("lang") || "en";
      setLang(l);
      document.title = `${geologyTranslations[l]?.title || geologyTranslations.en.title} | GEOTUCO`;
    }
  }, []);
  const t = geologyTranslations[lang] || geologyTranslations.en;
  return (
    <>
      <title>{t.title} | GEOTUCO</title>
      <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.2rem", color: "#2a4d69", fontWeight: 800, marginBottom: "2rem", textAlign: "center" }}>
          {t.title}
        </h1>
        <div style={{ color: "#444", fontSize: "1.15rem", marginBottom: "1.5rem", textAlign: "center" }}>
          {t.description}
        </div>
        <ul style={{ color: "#4b5d67", fontSize: "1rem", maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
          {t.bullets.map((b, i) => (
            <li key={i}>✔️ {b}</li>
          ))}
        </ul>
      </main>
    </>
  );
}
