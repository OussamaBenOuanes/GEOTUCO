"use client";
import React, { useEffect, useState } from "react";

// Translations for the Mission page
const missionTranslations: Record<string, { title: string; content: string[]; references: string }> = {
    en: {
        title: "Our Mission",
        content: [
            "Since its creation in 2008, GEOTUCO has established itself as an essential player in the development of geotechnical, geological and environmental studies to optimize, manage hazards and provide solutions for adapting projected structures to site and soil support conditions.",
            "With a team of specialized academics and professionals, GEOTUCO maintains its discipline of innovation and regulatory and normative design trends, supervision and expertise of geotechnical structures and provides, under a contractual or ad hoc framework, targeted missions according to project phases.",
            "GEOTUCO's references in Tunisia and abroad reflect the trust placed by our satisfied clients and our reputation for professionalism and rigor in project management."
        ],
        references: "#References_GEOTUCO"
    },
    fr: {
        title: "Notre Mission",
        content: [
            "Depuis sa création depuis 2008, GEOTUCO s'impose en tant que acteur indispensable dans l'élaboration des études géotechniques, géologiques et environnementales en vue d'optimiser, gérer les aléas et apporter les solutions d'adaptation des structures projetées aux conditions du site et au sol support.",
            "Dotée d'une équipe d'académiciens spécialisés et de professionnels, GEOTUCO garde sa discipline d'innovation et de tendance règlementaire et normative de conception, de supervision et d'expertise des ouvrages géotechniques et assure, suivant un cadre contractuel ou ponctuel, des missions ciblées suivant les phases des projets.",
            "Les références de GEOTUCO en Tunisie ou à l'étranger reflète la confiance accordée par nos clients satisfaits et notre réputation de professionnalisme et de rigueur dans la gestion des projets."
        ],
        references: "#References_GEOTUCO"
    },
    ar: {
        title: "مهمتنا",
        content: [
            "منذ تأسيسها في عام 2008، أصبحت GEOTUCO لاعباً أساسياً في إعداد الدراسات الجيوتقنية والجيولوجية والبيئية بهدف تحسين وإدارة المخاطر وتقديم حلول لتكييف الهياكل المخططة مع ظروف الموقع والتربة.",
            "بفضل فريق من الأكاديميين المتخصصين والمهنيين، تحافظ GEOTUCO على انضباطها في الابتكار والاتجاهات التنظيمية والمعيارية في التصميم والإشراف والخبرة في المنشآت الجيوتقنية، وتوفر مهام موجهة وفقاً لمراحل المشاريع ضمن إطار تعاقدي أو مخصص.",
            "تعكس مراجع GEOTUCO في تونس والخارج الثقة الممنوحة من عملائنا الراضين وسمعتنا في الاحترافية والصرامة في إدارة المشاريع."
        ],
        references: "#References_GEOTUCO"
    },
    es: {
        title: "Nuestra Misión",
        content: [
            "Desde su creación en 2008, GEOTUCO se ha establecido como un actor esencial en el desarrollo de estudios geotécnicos, geológicos y ambientales para optimizar, gestionar riesgos y proporcionar soluciones para adaptar las estructuras proyectadas a las condiciones del sitio y del suelo.",
            "Con un equipo de académicos especializados y profesionales, GEOTUCO mantiene su disciplina de innovación y tendencias regulatorias y normativas de diseño, supervisión y experiencia en estructuras geotécnicas y proporciona, bajo un marco contractual o puntual, misiones específicas según las fases del proyecto.",
            "Las referencias de GEOTUCO en Túnez y en el extranjero reflejan la confianza depositada por nuestros clientes satisfechos y nuestra reputación de profesionalismo y rigor en la gestión de proyectos."
        ],
        references: "#References_GEOTUCO"
    },
    de: {
        title: "Unsere Mission",
        content: [
            "Seit ihrer Gründung im Jahr 2008 hat sich GEOTUCO als unverzichtbarer Akteur bei der Entwicklung geotechnischer, geologischer und umweltbezogener Studien etabliert, um Risiken zu optimieren und zu managen und Lösungen zur Anpassung geplanter Strukturen an Standort- und Bodenbedingungen bereitzustellen.",
            "Mit einem Team spezialisierter Akademiker und Fachleute pflegt GEOTUCO ihre Innovationsdisziplin und regulatorische und normative Designtrends, Überwachung und Expertise geotechnischer Strukturen und bietet im vertraglichen oder punktuellen Rahmen gezielte Missionen entsprechend den Projektphasen.",
            "Die Referenzen von GEOTUCO in Tunesien und im Ausland spiegeln das Vertrauen unserer zufriedenen Kunden und unseren Ruf für Professionalität und Strenge im Projektmanagement wider."
        ],
        references: "#References_GEOTUCO"
    },
    it: {
        title: "La Nostra Missione",
        content: [
            "Dalla sua creazione nel 2008, GEOTUCO si è affermata come attore essenziale nello sviluppo di studi geotecnici, geologici e ambientali per ottimizzare, gestire i rischi e fornire soluzioni per adattare le strutture progettate alle condizioni del sito e del terreno.",
            "Con un team di accademici specializzati e professionisti, GEOTUCO mantiene la sua disciplina di innovazione e tendenze normative e regolamentari di progettazione, supervisione ed esperienza di strutture geotecniche e fornisce, in un quadro contrattuale o puntuale, missioni mirate secondo le fasi del progetto.",
            "I riferimenti di GEOTUCO in Tunisia e all'estero riflettono la fiducia accordata dai nostri clienti soddisfatti e la nostra reputazione di professionalità e rigore nella gestione dei progetti."
        ],
        references: "#References_GEOTUCO"
    },
    zh: {
        title: "我们的使命",
        content: [
            "自2008年成立以来,GEOTUCO已成为岩土工程、地质和环境研究开发的关键参与者,致力于优化、管理风险并提供解决方案,使规划结构适应场地和土壤支撑条件。",
            "凭借专业学者和专业人员团队,GEOTUCO保持其创新纪律以及设计、监督和岩土工程结构专业知识的监管和规范趋势,并根据合同或临时框架,按项目阶段提供有针对性的任务。",
            "GEOTUCO在突尼斯和国外的参考项目反映了满意客户对我们的信任,以及我们在项目管理方面的专业性和严谨性声誉。"
        ],
        references: "#References_GEOTUCO"
    },
    sw: {
        title: "Dhamira Yetu",
        content: [
            "Tangu kuanzishwa kwake mwaka 2008, GEOTUCO imejiimarisha kama mchezaji muhimu katika maendeleo ya masomo ya jioteknolojia, jiolojia na mazingira ili kuboresha, kudhibiti hatari na kutoa suluhisho za kurekebisha miundo iliyopangwa kwa hali ya tovuti na udongo.",
            "Na timu ya wasomi maalum na wataalamu, GEOTUCO inadumisha nidhamu yake ya uvumbuzi na mwelekeo wa udhibiti na kawaida wa kubuni, usimamizi na utaalamu wa miundo ya jioteknolojia na kutoa, chini ya mfumo wa mkataba au wa wakati huo, misheni lengwa kulingana na awamu za mradi.",
            "Marejeleo ya GEOTUCO nchini Tunisia na nje ya nchi yanaonyesha imani iliyowekwa na wateja wetu wenye kuridhika na sifa yetu ya utaalamu na ukali katika usimamizi wa miradi."
        ],
        references: "#References_GEOTUCO"
    },
    yo: {
        title: "Iṣẹ Apinfunni Wa",
        content: [
            "Lati igba ti o ti da ni ọdun 2008, GEOTUCO ti fi idi rẹ múlẹ gẹgẹbi oṣere pataki ninu idagbasoke ti awọn iwadi geotechnical, geological ati ayika lati munadoko, ṣakoso awọn ewu ati pese awọn ojutu fun ṣiṣatunṣe awọn ẹya ti a gbero si awọn ipo aaye ati ile.",
            "Pẹlu ẹgbẹ ti awọn ọmọ ile-ẹkọ giga alamọdaju ati awọn akosemose, GEOTUCO n pa ibawi rẹ ti imotuntun ati awọn aṣa ilana ati iwuwasi ti apẹrẹ, abojuto ati imọran ti awọn ẹya geotechnical ati pese, labẹ ilana adehun tabi akoko, awọn iṣẹ apinfunni ti a fojusi gẹgẹ bi awọn ipele iṣẹ akanṣe.",
            "Awọn itọkasi GEOTUCO ni Tunisia ati ni okeere ṣe afihan igbẹkẹle ti awọn alabara wa ti o ni itẹlọrun fi ati orukọ rere wa fun iṣẹ alaṣẹ ati pipe ni iṣakoso iṣẹ akanṣe."
        ],
        references: "#References_GEOTUCO"
    },
    am: {
        title: "ተልዕኳችን",
        content: [
            "ከ2008 ጀምሮ ከተመሰረተበት ጊዜ ጀምሮ፣ GEOTUCO የጂኦቴክኒካል፣ የጂኦሎጂካል እና የአካባቢ ጥናቶችን በማዘጋጀት ላይ አስፈላጊ ተዋናይ ሆኖ ራሱን አረጋግጧል - አደጋዎችን ለማመቻቸት፣ ለማስተዳደር እና ታቅደው ያሉ መዋቅሮችን ከጣቢያ እና የአፈር ድጋፍ ሁኔታዎች ጋር ለማስማማት መፍትሄዎችን ለማቅረብ።",
            "የልዩ ምሁራን እና ባለሙያዎች ቡድን ያለው፣ GEOTUCO የፈጠራ ዲሲፕሊኑን እና የቁጥጥር እና ደንባዊ ዲዛይን አዝማሚያዎችን፣ ቁጥጥርን እና የጂኦቴክኒካል መዋቅሮች እውቀትን ይጠብቃል እና በውል ወይም ጊዜያዊ ማዕቀፍ ስር በፕሮጀክት ደረጃዎች መሰረት የታለሙ ተልዕኮዎችን ያቀርባል።",
            "በቱኒዚያ እና በውጭ አገር ያሉ የGEOTUCO ማጣቀሻዎች በፕሮጀክት አስተዳደር ውስጥ ያለንን ሙያዊነት እና ጥብቅነት ስም እና የደስተኛ ደንበኞቻችን ያደረጉትን እምነት ያንጸባርቃሉ።"
        ],
        references: "#References_GEOTUCO"
    },
    ha: {
        title: "Manufarmu",
        content: [
            "Tun lokacin da aka kafa shi a cikin 2008, GEOTUCO ya zama muhimmin mai taimakawa wajen haɓaka nazarin geotechnical, geological da muhalli don ingantawa, sarrafa haɗari da samar da mafita don daidaita tsarin da aka shirya zuwa yanayin wurin da ƙasa.",
            "Tare da ƙungiyar masana ilimi da kwararru, GEOTUCO yana kiyaye ladabinsa na ƙirƙira da yanayin tsari da daidaitawa na zane, kulawa da kwarewa na tsarin geotechnical kuma yana bayarwa, a ƙarƙashin tsarin kwantiragi ko na lokaci, ayyuka na musamman bisa ga matakai na aikin.",
            "Nassoshi na GEOTUCO a Tunisiya da ƙasashen waje suna nuna amincin da abokan cinikinmu masu gamsuwa suka sanya da kuma sunanmu na ƙwarewa da ƙwazo a cikin gudanar da ayyuka."
        ],
        references: "#References_GEOTUCO"
    }
};

export default function Mission() {
    const [lang, setLang] = useState("en");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const l = localStorage.getItem("lang") || "en";
            setLang(l);
        }
    }, []);

    const t = missionTranslations[lang] || missionTranslations.en;
    const isRtl = lang === "ar";

    return (
        <main
            style={{
                padding: "2rem",
                fontFamily: "sans-serif",
                maxWidth: 1000,
                margin: "0 auto",
                color: "#333",
                lineHeight: 1.8,
                direction: isRtl ? "rtl" : "ltr",
            }}
        >
            <title>{t.title} | GEOTUCO</title>

            {/* Header Section */}
            <section style={{ marginBottom: "3rem", textAlign: "center" }}>
                <h1
                    style={{
                        fontSize: "2.5rem",
                        fontWeight: 800,
                        marginBottom: "1rem",
                        background: "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {t.title}
                </h1>
                <div
                    style={{
                        width: 80,
                        height: 4,
                        background: "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)",
                        margin: "0 auto",
                        borderRadius: 2,
                    }}
                />
            </section>

            {/* Content Section */}
            <section
                style={{
                    background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
                    borderRadius: 20,
                    padding: "2.5rem",
                    marginBottom: "2rem",
                }}
            >
                {t.content.map((paragraph, index) => (
                    <p
                        key={index}
                        style={{
                            fontSize: "1.1rem",
                            color: "#444",
                            marginBottom: index < t.content.length - 1 ? "1.5rem" : 0,
                            textAlign: "justify",
                        }}
                    >
                        {paragraph}
                    </p>
                ))}
            </section>

            {/* References Link */}
            <section style={{ textAlign: "center", marginTop: "3rem" }}>
                <a
                    href="/career"
                    style={{
                        display: "inline-block",
                        background: "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)",
                        color: "#fff",
                        padding: "1rem 2.5rem",
                        borderRadius: 8,
                        textDecoration: "none",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        boxShadow: "0 4px 15px rgba(0,51,101,0.2)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,51,101,0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,51,101,0.2)";
                    }}
                >
                    {t.references}
                </a>
            </section>
        </main>
    );
}
