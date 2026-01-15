"use client";
import React, { useEffect, useState } from "react";

const trainingTranslations: any = {
  en: {
    title: "Training",
    description:
      "GEOTUCO offers specialized training programs in geotechnical engineering, laboratory testing, and field investigation techniques. Our courses are designed for engineers, technicians, and students seeking to enhance their practical skills and theoretical knowledge in the geotechnical field.",
    bullets: [
      "Hands-on training in soil and rock testing",
      "Workshops on geotechnical investigation methods",
      "Software training for geotechnical analysis",
      "Customized courses for organizations and universities",
      "Certification upon completion",
    ],
  },
  fr: {
    title: "Formation",
    description:
      "GEOTUCO propose des programmes de formation spécialisés en génie géotechnique, essais en laboratoire et techniques d’investigation sur le terrain. Nos cours sont conçus pour les ingénieurs, techniciens et étudiants souhaitant renforcer leurs compétences pratiques et leurs connaissances théoriques dans le domaine géotechnique.",
    bullets: [
      "Formation pratique aux essais sur sols et roches",
      "Ateliers sur les méthodes d’investigation géotechnique",
      "Formation aux logiciels d’analyse géotechnique",
      "Cours personnalisés pour entreprises et universités",
      "Certification à l’issue de la formation",
    ],
  },
  ar: {
    title: "التدريب",
    description: "تقدم GEOTUCO برامج تدريبية متخصصة في الهندسة الجيوتقنية والاختبارات المعملية وتقنيات التحقيق الميداني. تم تصميم دوراتنا للمهندسين والفنيين والطلاب الساعين لتعزيز مهاراتهم العملية ومعرفتهم النظرية في المجال الجيوتقني.",
    bullets: [
      "تدريب عملي على اختبارات التربة والصخور",
      "ورش عمل حول طرق التحقيق الجيوتقني",
      "تدريب على البرمجيات للتحليل الجيوتقني",
      "دورات مخصصة للمؤسسات والجامعات",
      "شهادة عند الانتهاء"
    ]
  },
  es: {
    title: "Formación",
    description: "GEOTUCO ofrece programas de formación especializados en ingeniería geotécnica, pruebas de laboratorio y técnicas de investigación de campo. Nuestros cursos están diseñados para ingenieros, técnicos y estudiantes que buscan mejorar sus habilidades prácticas y conocimientos teóricos en el campo geotécnico.",
    bullets: [
      "Formación práctica en pruebas de suelo y roca",
      "Talleres sobre métodos de investigación geotécnica",
      "Formación de software para análisis geotéco",
      "Cursos personalizados para organizaciones y universidades",
      "Certificación al finalizar"
    ]
  },
  de: {
    title: "Schulung",
    description: "GEOTUCO bietet spezialisierte Schulungsprogramme in Geotechnik, Laborversuchen und Felduntersuchungstechniken an. Unsere Kurse richten sich an Ingenieure, Techniker und Studenten, die ihre praktischen Fähigkeiten und theoretischen Kenntnisse im geotechnischen Bereich erweitern möchten.",
    bullets: [
      "Praktische Ausbildung in Boden- und Gesteinsprüfungen",
      "Workshops zu geotechnischen Untersuchungsmethoden",
      "Software-Schulung für geotechnische Analysen",
      "Maßgeschneiderte Kurse für Organisationen und Universitäten",
      "Zertifizierung nach Abschluss"
    ]
  },
  it: {
    title: "Formazione",
    description: "GEOTUCO offre programmi di formazione specializzati in ingegneria geotecnica, test di laboratorio e tecniche di indagine sul campo. I nostri corsi sono progettati per ingegneri, tecnici e studenti che cercano di migliorare le loro competenze pratiche e conoscenze teoriche nel campo geotecnico.",
    bullets: [
      "Formazione pratica su test di suolo e roccia",
      "Workshop sui metodi di indagine geotecnica",
      "Formazione software per analisi geotecnica",
      "Corsi personalizzati per organizzazioni e università",
      "Certificazione al completamento"
    ]
  },
  zh: {
    title: "培训",
    description: "GEOTUCO 提供岩土工程、实验室测试和现场调查技术的专业培训课程。我们的课程专为寻求提高岩土领域实践技能和理论知识的工程师、技术人员和学生设计。",
    bullets: [
      "土壤和岩石测试的实践培训",
      "岩土调查方法研讨会",
      "岩土分析软件培训",
      "为组织和大学定制课程",
      "结业证书"
    ]
  },
  sw: {
    title: "Mafunzo",
    description: "GEOTUCO inatoa programu maalum za mafunzo katika uhandisi wa jioteknolojia, vipimo vya maabara, na mbinu za uchunguzi wa nyanjani. Kozi zetu zimeundwa kwa ajili ya wahandisi, mafundi, na wanafunzi wanaotaka kuboresha ujuzi wao wa vitendo na maarifa ya kinadharia katika uwanja wa jioteknolojia.",
    bullets: [
      "Mafunzo ya vitendo katika vipimo vya udongo na miamba",
      "Warsha juu ya njia za uchunguzi wa jioteknolojia",
      "Mafunzo ya programu kwa uchambuzi wa jioteknolojia",
      "Kozi zilizobinafsishwa kwa mashirika na vyuo vikuu",
      "Vyeti baada ya kukamilika"
    ]
  },
  yo: {
    title: "Ikẹkọ",
    description: "GEOTUCO nfunni ni awọn eto ikẹkọ amọja ni imọ-ẹrọ geotechnical, idanwo yàrá, ati awọn ilana iwadii aaye. Awọn iṣẹ ikẹkọ wa jẹ apẹrẹ fun awọn onimọ-ẹrọ, awọn onimọ-ẹrọ, ati awọn ọmọ ile-iwe ti n wa lati mu awọn ọgbọn iṣe wọn pọ si ati imọ-jinlẹ ni aaye geotechnical.",
    bullets: [
      "Ikẹkọ ọwọ-lori ni idanwo ile ati apata",
      "Awọn idanileko lori awọn ọna iwadii geotechnical",
      "Ikẹkọ sọfitiwia fun itupalẹ geotechnical",
      "Awọn iṣẹ adani fun awọn ajo ati awọn ile-ẹkọ giga",
      "Ijẹrisi lori ipari"
    ]
  },
  am: {
    title: "ስልጠና",
    description: "GEOTUCO በጂኦቴክኒካል ምህንድስና ፣ በቤተመህኮ ሙከራ እና በመስክ ምርመራ ቴክኒኮች ላይ ልዩ የስልጠና ፕሮግራሞችን ይሰጣል። ኮርሶቻችን የተነደፉት በጂኦቴክኒካል መስክ ተግባራዊ ክህሎቶቻቸውን እና ቲዎሬቲካዊ እውቀታቸውን ለማሳደግ ለሚፈልጉ መሐንዲሶች ፣ ቴክኒሻኖች እና ተማሪዎች ነው።",
    bullets: [
      "በአፈር እና በድንጋይ ሙከራ ላይ ተግባራዊ ስልጠና",
      "በጂኦቴክኒካል ምርመራ ዘዴዎች ላይ ወርክሾፖች",
      "ለጂኦቴክኒካል ትንተና የሶፍትዌር ስልጠና",
      "ለድርጅቶች እና ለዩኒቨርሲቲዎች ብጁ ኮርሶች",
      "ሲጠናቀቅ የምስክር ወረቀት"
    ]
  },
  ha: {
    title: "Horarwa",
    description: "GEOTUCO tana ba da shirye-shiryen horo na musamman a cikin injiniyan geotechnical, gwajin dakin gwaje-gwaje, da dabarun binciken filin. An tsara kwasa-kwasan mu don injiniyoyi, masu fasaha, da ɗalibai masu neman haɓaka ƙwarewar aiki da ilimin ka'idar su a fagen geotechnical.",
    bullets: [
      "Horon hannu a cikin gwajin ƙasa da dutse",
      "Taron bita kan hanyoyin binciken geotechnical",
      "Horon software don binciken geotechnical",
      "Kwasa-kwasai na musamman don ƙungiyoyi da jami'o'i",
      "Takaddar shaida bayan kammalawa"
    ]
  }
};

export default function Training() {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const l = localStorage.getItem("lang") || "en";
      setLang(l);
      document.title = `${trainingTranslations[l]?.title || trainingTranslations.en.title} | GEOTUCO`;
    }
  }, []);
  const t = trainingTranslations[lang] || trainingTranslations.en;
  return (
    <>
      <title>{t.title} | GEOTUCO</title>
      <main
        style={{
          padding: "2rem",
          fontFamily: "sans-serif",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "2.2rem",
            color: "#2a4d69",
            fontWeight: 800,
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          {t.title}
        </h1>
        <div
          style={{
            color: "#444",
            fontSize: "1.15rem",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          {t.description}
        </div>
        <ul
          style={{
            color: "#4b5d67",
            fontSize: "1rem",
            maxWidth: 600,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          {t.bullets.map((b, i) => (
            <li key={i}>✔️ {b}</li>
          ))}
        </ul>
      </main>
    </>
  );
}
