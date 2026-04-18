"use client";
import React, { useState, useEffect } from "react";
import { pagesTranslations } from "../../translations/pages";

// Helper to detect currency
const getCurrencyPrice = (currency: string) => {
    // Dictionary of prices ~ €5
    const prices: Record<string, number> = {
        'EUR': 5,
        'USD': 5.50,
        'GBP': 4.50,
        'TND': 17,
        'NGN': 9000,
        'XOF': 3300,
        'XAF': 3300
    };
    return prices[currency] || 5;
};

export default function Geodata() {
    const [lang, setLang] = useState("en");
    const [currency, setCurrency] = useState("EUR");
    const [amount, setAmount] = useState(5);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [selectedProvider, setSelectedProvider] = useState<'stripe' | 'paypal' | 'flutterwave' | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const l = localStorage.getItem("lang") || "en";
            setLang(l);

            // Detect user currency
            fetch('https://ipapi.co/json/')
                .then(res => res.json())
                .then(data => {
                    if (data.currency) {
                        setCurrency(data.currency);
                        setAmount(getCurrencyPrice(data.currency));
                    }
                })
                .catch(err => {
                    console.log("Currency fallback to EUR");
                });
        }
    }, []);

    // Form State
    const [formData, setFormData] = useState({
        // Section 1: Client
        raisonSociale: "",
        activite: "",
        nationalite: "",
        adresse: "",
        telephone: "",
        fax: "",
        email: "",
        commune: "",
        delegation: "",
        codePostal: "",
        qualiteClient: [] as string[],

        // Section 2: Type d'Ouvrage
        batimentsHabitation: [] as string[],
        batimentsFonctionnels: [] as string[]
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (group: "qualiteClient" | "batimentsHabitation" | "batimentsFonctionnels", value: string) => {
        setFormData(prev => {
            const current = prev[group];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [group]: updated };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowPayment(true);
        // Scroll to payment section
        setTimeout(() => {
            document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handlePayment = async (provider: 'stripe' | 'paypal' | 'flutterwave') => {
        setSelectedProvider(provider);
        setPaymentStatus('processing');

        try {
            // 1. Initiate Payment
            let paymentResult;

            if (provider === 'stripe') {
                const res = await fetch('/api/payment/stripe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currency })
                });

                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    paymentResult = await res.json();
                } else {
                    const text = await res.text();
                    console.error("Non-JSON response from Stripe:", text);
                    if (res.status === 404) throw new Error("Stripe API route not found.");
                    throw new Error("Payment service unavailable (Stripe). Check console for details.");
                }

                if (paymentResult.error) throw new Error(paymentResult.error);

                // In a real flow, we would load Stripe Elements here.
                // For this demo/first pass without client keys, we simulate success.
            } else if (provider === 'paypal') {
                const res = await fetch('/api/payment/paypal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currency })
                });

                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    paymentResult = await res.json();
                } else {
                    const text = await res.text();
                    console.error("Non-JSON response from PayPal:", text);
                    if (res.status === 404) throw new Error("PayPal API route not found.");
                    throw new Error("Payment service unavailable (PayPal). Possible missing configuration.");
                }

                if (paymentResult.error) throw new Error(paymentResult.error);
            } else if (provider === 'flutterwave') {
                const res = await fetch('/api/payment/flutterwave', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currency, email: formData.email, name: formData.raisonSociale, phone: formData.telephone })
                });

                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    paymentResult = await res.json();
                } else {
                    throw new Error("Payment service unavailable (Flutterwave).");
                }

                if (paymentResult.error) throw new Error(paymentResult.error);
            }

            // SIMULATION: Assume payment succeeded after 2 seconds
            await new Promise(r => setTimeout(r, 2000));

            // 2. Send Email
            const emailRes = await fetch('/api/send-consultation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client: { ...formData },
                    project: {
                        batimentsHabitation: formData.batimentsHabitation,
                        batimentsFonctionnels: formData.batimentsFonctionnels
                    },
                    payment: {
                        amount,
                        currency,
                        provider,
                        reference: `REF-${Date.now()}`
                    }
                })
            });

            if (emailRes.ok) {
                setPaymentStatus('success');
            } else {
                throw new Error("Failed to send confirmation email");
            }

        } catch (error: any) {
            console.error("Payment Error:", error);
            // Alert the user with the actual error message
            if (typeof window !== 'undefined') {
                alert(error.message || "An error occurred");
            }
            setPaymentStatus('error');
        }
    };

    // Translations for the form
    const t = {
        en: {
            title: "Consultation Form",
            section1: "1 – CLIENT",
            fields: {
                raisonSociale: "Name or Company Name",
                activite: "Activity",
                nationalite: "Nationality",
                adresse: "Address",
                telephone: "Phone",
                fax: "Fax",
                email: "Email",
                commune: "Municipality",
                delegation: "Delegation",
                codePostal: "Postal Code",
                qualiteClient: "Client Quality"
            },
            qualiteClientOptions: [
                "Developer", "Company", "Design Office", "Project Owner", "Project Manager", "Control Bureau", "Other"
            ],
            section2: "2 – TYPE OF STRUCTURE",
            habitationTitle: "Residential Buildings",
            habitationOptions: [
                "Individual house in diffuse sector",
                "Individual house in grouped sector",
                "Collective residential building",
                "Housing included in a non-residential building",
                "Community habitat"
            ],
            functionalTitle: "Functional Buildings",
            functionalOptions: [
                "Hotel", "Offices / Administrative premises", "Educational institution",
                "School or university restaurant", "Healthcare establishment", "Public or parapublic building",
                "Cultural establishment", "Party / multipurpose hall", "Performance hall / cinema / museum",
                "Sports hall / gymnasium / dojo", "Public swimming pool / nautical field", "Other sports building"
            ],
            submit: `Proceed to Payment (${currency} ${amount})`,
            paymentTitle: "Select Payment Method",
            securePayment: "Secure Payment Encrypted",
            successTitle: "Submission Successful!",
            successMsg: "Thank you for your consultation request. We have received your details and payment. A confirmation email has been sent to you.",
            errorTitle: "Something went wrong",
            errorMsg: "There was an issue processing your request. Please try again."
        },
        fr: {
            title: "Formulaire de Consultation",
            section1: "1 – CLIENT",
            fields: {
                raisonSociale: "Nom ou Raison Sociale",
                activite: "Activité",
                nationalite: "Nationalité",
                adresse: "Adresse",
                telephone: "Téléphone",
                fax: "Fax",
                email: "Email",
                commune: "Commune",
                delegation: "Délégation",
                codePostal: "Code Postal",
                qualiteClient: "Qualité Client"
            },
            qualiteClientOptions: [
                "Promoteur", "Entreprise", "Bureau d’études", "Maître d’ouvrage", "Maître d’œuvre", "Bureau de contrôle", "Autre"
            ],
            section2: "2 – TYPE D’OUVRAGE",
            habitationTitle: "Bâtiments d’habitation",
            habitationOptions: [
                "Maison individuelle en secteur diffus",
                "Maison individuelle en secteur groupé",
                "Bâtiment collectif d’habitation",
                "Logement inclus dans un bâtiment à usage non résidentiel",
                "Habitat communautaire"
            ],
            functionalTitle: "Bâtiments fonctionnels",
            functionalOptions: [
                "Hôtel", "Bureaux / Locaux administratifs", "Établissement d’enseignement",
                "Restaurant scolaire ou universitaire", "Établissement de soins", "Bâtiment public ou parapublic",
                "Établissement culturel", "Salle des fêtes / polyvalente", "Salle de spectacle / cinéma / musée",
                "Salle de sport / gymnase / dojo", "Piscine publique / terrain nautique", "Autre bâtiment sportif"
            ],
            submit: `Procéder au paiement (${amount} ${currency})`,
            paymentTitle: "Sélectionnez le mode de paiement",
            securePayment: "Paiement sécurisé chiffré",
            successTitle: "Soumission réussie !",
            successMsg: "Merci pour votre demande de consultation. Nous avons bien reçu vos détails et votre paiement. Un email de confirmation vous a été envoyé.",
            errorTitle: "Une erreur est survenue",
            errorMsg: "Un problème est survenu lors du traitement de votre demande. Veuillez réessayer."
        },
        ar: {
            title: "نموذج الاستشارة",
            section1: "1 – العميل",
            fields: {
                raisonSociale: "الاسم أو اسم الشركة",
                activite: "النشاط",
                nationalite: "الجنسية",
                adresse: "العنوان",
                telephone: "الهاتف",
                fax: "الفاكس",
                email: "البريد الإلكتروني",
                commune: "البلدية",
                delegation: "المعتمدية",
                codePostal: "الرمز البريدي",
                qualiteClient: "صفة العميل"
            },
            qualiteClientOptions: [
                "باعث عقاري", "شركة", "مكتب دراسات", "صاحب مشروع", "مدير مشروع", "مكتب مراقبة", "آخر"
            ],
            section2: "2 – نوع المبنى",
            habitationTitle: "المباني السكنية",
            habitationOptions: [
                "منزل فردي في قطاع متفرق",
                "منزل فردي في قطاع مجمع",
                "مبنى سكني جماعي",
                "سكن ضمن مبنى غير سكني",
                "سكن مجتمعي"
            ],
            functionalTitle: "المباني الوظيفية",
            functionalOptions: [
                "فندق", "مكاتب / مباني إدارية", "مؤسسة تعليمية",
                "مطعم مدرسي أو جامعي", "مؤسسة صحية", "مبنى عام أو شبه عام",
                "مؤسسة ثقافية", "قاعة حفلات / متعددة الأغراض", "قاعة عرض / سينما / متحف",
                "قاعة رياضة / صالة ألعاب", "مسبح عام / مركز مائي", "مبنى رياضي آخر"
            ],
            submit: `تابع للدفع (${amount} ${currency})`,
            paymentTitle: "اختر طريقة الدفع",
            securePayment: "دفع آمن ومشفر",
            successTitle: "تم الإرسال بنجاح!",
            successMsg: "شكراً لطلبك. لقد تلقينا التفاصيل والدفع. تم إرسال رسالة تأكيد إلكترونية إليك.",
            errorTitle: "حدث خطأ ما",
            errorMsg: "حدثت مشكلة أثناء معالجة طلبك. يرجى المحاولة مرة أخرى."
        },
        es: {
            title: "Formulario de Consulta",
            section1: "1 – CLIENTE",
            fields: {
                raisonSociale: "Nombre o Razón Social",
                activite: "Actividad",
                nationalite: "Nacionalidad",
                adresse: "Dirección",
                telephone: "Teléfono",
                fax: "Fax",
                email: "Email",
                commune: "Municipio",
                delegation: "Delegación",
                codePostal: "Código Postal",
                qualiteClient: "Calidad del Cliente"
            },
            qualiteClientOptions: [
                "Promotor", "Empresa", "Oficina de Diseño", "Propietario del Proyecto", "Gerente de Proyecto", "Oficina de Control", "Otro"
            ],
            section2: "2 – TIPO DE ESTRUCTURA",
            habitationTitle: "Edificios Residenciales",
            habitationOptions: [
                "Casa individual en sector difuso",
                "Casa individual en sector agrupado",
                "Edificio residencial colectivo",
                "Vivienda incluida en edificio no residencial",
                "Hábitat comunitario"
            ],
            functionalTitle: "Edificios Funcionales",
            functionalOptions: [
                "Hotel", "Oficinas / Locales administrativos", "Institución educativa",
                "Restaurante escolar o universitario", "Establecimiento de salud", "Edificio público o parapúblico",
                "Establecimiento cultural", "Salón de fiestas / polivalente", "Sala de espectáculos / cine / museo",
                "Gimnasio / sala de deportes", "Piscina pública / campo náutico", "Otro edificio deportivo"
            ],
            submit: `Proceder al pago (${amount} ${currency})`,
            paymentTitle: "Seleccione método de pago",
            securePayment: "Pago seguro encriptado",
            successTitle: "¡Envío exitoso!",
            successMsg: "Gracias por su solicitud. Hemos recibido sus detalles y el pago. Se le ha enviado un correo de confirmación.",
            errorTitle: "Algo salió mal",
            errorMsg: "Hubo un problema al procesar su solicitud. Por favor inténtelo de nuevo."
        },
        de: {
            title: "Beratungsformular",
            section1: "1 – KUNDE",
            fields: {
                raisonSociale: "Name oder Firmenname",
                activite: "Tätigkeit",
                nationalite: "Nationalität",
                adresse: "Adresse",
                telephone: "Telefon",
                fax: "Fax",
                email: "E-Mail",
                commune: "Gemeinde",
                delegation: "Delegation",
                codePostal: "Postleitzahl",
                qualiteClient: "Kundenstatus"
            },
            qualiteClientOptions: [
                "Entwickler", "Unternehmen", "Planungsbüro", "Bauherr", "Projektleiter", "Kontrollbüro", "Andere"
            ],
            section2: "2 – BAUART",
            habitationTitle: "Wohngebäude",
            habitationOptions: [
                "Einfamilienhaus im Streugebiet",
                "Einfamilienhaus im Gruppengebiet",
                "Mehrfamilienhaus",
                "Wohnung in Nichtwohngebäude",
                "Gemeinschaftliches Wohnen"
            ],
            functionalTitle: "Funktionsgebäude",
            functionalOptions: [
                "Hotel", "Büros / Verwaltungsräume", "Bildungseinrichtung",
                "Schul- oder Universitätsmensa", "Gesundheitseinrichtung", "Öffentliches Gebäude",
                "Kultureinrichtung", "Festsaal / Mehrzweckhalle", "Veranstaltungssaal / Kino / Museum",
                "Sporthalle / Turnhalle", "Öffentliches Schwimmbad", "Anderes Sportgebäude"
            ],
            submit: `Weiter zur Zahlung (${amount} ${currency})`,
            paymentTitle: "Zahlungsmethode wählen",
            securePayment: "Sichere verschlüsselte Zahlung",
            successTitle: "Erfolgreich gesendet!",
            successMsg: "Danke für Ihre Anfrage. Wir haben Ihre Details und Zahlung erhalten. Eine Bestätigungs-E-Mail wurde gesendet.",
            errorTitle: "Etwas ist schiefgelaufen",
            errorMsg: "Es gab ein Problem bei der Bearbeitung. Bitte versuchen Sie es erneut."
        },
        it: {
            title: "Modulo di Consultazione",
            section1: "1 – CLIENTE",
            fields: {
                raisonSociale: "Nome o Ragione Sociale",
                activite: "Attività",
                nationalite: "Nazionalità",
                adresse: "Indirizzo",
                telephone: "Telefono",
                fax: "Fax",
                email: "Email",
                commune: "Comune",
                delegation: "Delegazione",
                codePostal: "Codice Postale",
                qualiteClient: "Qualità Cliente"
            },
            qualiteClientOptions: [
                "Sviluppatore", "Azienda", "Ufficio Progettazione", "Proprietario Progetto", "Project Manager", "Ufficio Controllo", "Altro"
            ],
            section2: "2 – TIPO DI STRUTTURA",
            habitationTitle: "Edifici Residenziali",
            habitationOptions: [
                "Casa singola in settore diffuso",
                "Casa singola in settore raggruppato",
                "Edificio residenziale collettivo",
                "Abitazione in edificio non residenziale",
                "Habitat comunitario"
            ],
            functionalTitle: "Edifici Funzionali",
            functionalOptions: [
                "Hotel", "Uffici / Locali amministrativi", "Istituzione educativa",
                "Mensa scolastica o universitaria", "Struttura sanitaria", "Edificio pubblico o parapubblico",
                "Istituzione culturale", "Sala feste / polivalente", "Sala spettacoli / cinema / museo",
                "Palestra / palazzetto dello sport", "Piscina pubblica", "Altro edificio sportivo"
            ],
            submit: `Procedi al pagamento (${amount} ${currency})`,
            paymentTitle: "Seleziona Metodo di Pagamento",
            securePayment: "Pagamento sicuro crittografato",
            successTitle: "Invio Riuscito!",
            successMsg: "Grazie per la richiesta. Abbiamo ricevuto i dettagli e il pagamento. Ti è stata inviata una email di conferma.",
            errorTitle: "Qualcosa è andato storto",
            errorMsg: "C'è stato un problema. Riprova."
        },
        zh: {
            title: "咨询表单",
            section1: "1 – 客户",
            fields: {
                raisonSociale: "姓名或公司名称",
                activite: "活动",
                nationalite: "国籍",
                adresse: "地址",
                telephone: "电话",
                fax: "传真",
                email: "电子邮件",
                commune: "市镇",
                delegation: "代表团",
                codePostal: "邮政编码",
                qualiteClient: "客户性质"
            },
            qualiteClientOptions: [
                "开发商", "公司", "设计院", "项目业主", "项目经理", "监理局", "其他"
            ],
            section2: "2 – 结构类型",
            habitationTitle: "住宅建筑",
            habitationOptions: [
                "分散区域的独栋住宅",
                "集中区域的独栋住宅",
                "集体住宅楼",
                "非住宅建筑内的住房",
                "社区居住"
            ],
            functionalTitle: "功能性建筑",
            functionalOptions: [
                "酒店", "办公室/行政场所", "教育机构",
                "学校或大学食堂", "医疗机构", "公共或半公共建筑",
                "文化机构", "宴会厅/多功能厅", "演艺厅/电影院/博物馆",
                "体育馆/健身房", "公共游泳池/水上运动场", "其他体育建筑"
            ],
            submit: `继续支付 (${amount} ${currency})`,
            paymentTitle: "选择支付方式",
            securePayment: "安全加密支付",
            successTitle: "提交成功！",
            successMsg: "感谢您的咨询请求。我们已收到您的详细信息和付款。确认电子邮件已发送给您。",
            errorTitle: "出错了",
            errorMsg: "处理您的请求时出现问题。请重试。"
        },
        sw: {
            title: "Fomu ya Ushauri",
            section1: "1 – MTEJA",
            fields: {
                raisonSociale: "Jina au Jina la Kampuni",
                activite: "Shughuli",
                nationalite: "Utaifa",
                adresse: "Anwani",
                telephone: "Simu",
                fax: "Faksi",
                email: "Barua pepe",
                commune: "Manispaa",
                delegation: "Ujumbe",
                codePostal: "Msimbo wa Posta",
                qualiteClient: "Hali ya Mteja"
            },
            qualiteClientOptions: [
                "Msanidi", "Kampuni", "Ofisi ya Usanifu", "Mmiliki wa Mradi", "Meneja wa Mradi", "Ofisi ya Udhibiti", "Nyingine"
            ],
            section2: "2 – AINA YA MJENGO",
            habitationTitle: "Majengo ya Makazi",
            habitationOptions: [
                "Nyumba ya mtu binafsi",
                "Nyumba ya kikundi",
                "Jengo la makazi ya pamoja",
                "Makazi katika jengo lisilo la makazi",
                "Makazi ya jamii"
            ],
            functionalTitle: "Majengo ya Kazi",
            functionalOptions: [
                "Hoteli", "Ofisi", "Taasisi ya elimu",
                "Mgahawa wa shule", "Kituo cha afya", "Jengo la umma",
                "Kituo cha utamaduni", "Ukumbi wa sherehe", "Sinema / makumbusho",
                "Ukumbi wa michezo", "Bwawa la kuogelea", "Jengo lingine la michezo"
            ],
            submit: `Endelea kulipa (${amount} ${currency})`,
            paymentTitle: "Chagua Njia ya Malipo",
            securePayment: "Malipo Salama",
            successTitle: "Imetumwa Kikamilifu!",
            successMsg: "Asante kwa ombi lako. Tumepokea maelezo yako. Barua pepe ya uthibitisho imetumwa.",
            errorTitle: "Kuna tatizo",
            errorMsg: "Kulikuwa na tatizo. Tafadhali jaribu tena."
        },
        yo: {
            title: "Fọọmu Imọran",
            section1: "1 – ONIBARA",
            fields: {
                raisonSociale: "Orukọ tabi Orukọ Ile-iṣẹ",
                activite: "Iṣẹ",
                nationalite: "Orilẹ-ede",
                adresse: "Adirẹsi",
                telephone: "Tẹlifoonu",
                fax: "Fax",
                email: "Imeeli",
                commune: "Agbegbe",
                delegation: "Asoju",
                codePostal: "Koodu Ifiweranṣẹ",
                qualiteClient: "Didara Onibara"
            },
            qualiteClientOptions: [
                "Olùgbéejáde", "Ile-iṣẹ", "Ọfiisi Apẹrẹ", "Oniwun Iṣẹ", "Oluṣakoso Iṣẹ", "Ọfiisi Iṣakoso", "Omiran"
            ],
            section2: "2 – IRU ILE",
            habitationTitle: "Awọn Ile Ibugbe",
            habitationOptions: [
                "Ile aladani",
                "Ile ni agbegbe akojọpọ",
                "Ile ibugbe apapọ",
                "Ibugbe ninu ile ti kii ṣe ibugbe",
                "Ibugbe agbegbe"
            ],
            functionalTitle: "Awọn Ile Iṣẹ",
            functionalOptions: [
                "Hotẹẹli", "Awọn ọfiisi", "Ile-ẹkọ ẹkọ",
                "Ile ounjẹ ile-iwe", "Ile-iṣẹ ilera", "Ile ti gbogbo eniyan",
                "Ile-iṣẹ aṣa", "Gbọngan ayẹyẹ", "Sinima / musiọmu",
                "Gbọngan ere idaraya", "Adagun odo", "Ile ere idaraya miiran"
            ],
            submit: `Tẹsiwaju si Isanwo (${amount} ${currency})`,
            paymentTitle: "Yan Ọna Isanwo",
            securePayment: "Isanwo to ni aabo",
            successTitle: "Ifisilẹ Aṣeyọri!",
            successMsg: "O ṣeun fun ibeere rẹ. A ti gba awọn alaye rẹ. A ti fi imeeli ranṣẹ si ọ.",
            errorTitle: "Nkankan ko tọ",
            errorMsg: "Iṣoro wa. Jọwọ gbiyanju lẹẹkansi."
        },
        ha: {
            title: "Fom ɗin Shawara",
            section1: "1 – ABOKIN CIKI",
            fields: {
                raisonSociale: "Suna ko Sunan Kamfani",
                activite: "Ayyuka",
                nationalite: "Ƙasa",
                adresse: "Adireshin",
                telephone: "Waya",
                fax: "Fax",
                email: "Imel",
                commune: "Karamar Hukuma",
                delegation: "Wakilci",
                codePostal: "Lambar Akwatin Gidan Waya",
                qualiteClient: "Ingancin Abokin Ciniki"
            },
            qualiteClientOptions: [
                "Mai Haɓakawa", "Kamfani", "Ofishin Zane", "Mai Aiki", "Manajan Aiki", "Ofishin Kulawa", "Wani"
            ],
            section2: "2 – IRIN GINI",
            habitationTitle: "Gine-ginen Mazauni",
            habitationOptions: [
                "Gida ɗaya",
                "Gida a cikin rukuni",
                "Ginin mazauni na gama gari",
                "Mazauni a cikin ginin da ba na zama ba",
                "Mazaunin al'umma"
            ],
            functionalTitle: "Gine-ginen Aiki",
            functionalOptions: [
                "Otalg", "Ofisoshi", "Cibiyar Ilimi",
                "Gidan abincin makaranta", "Cibiyar kiwon lafiya", "Ginin jama'a",
                "Cibiyar al'adu", "Zauren taro", "Sinima / gidan tarihi",
                "Zauren wasanni", "Wurin wanka na jama'a", "Wani ginin wasanni"
            ],
            submit: `Ci gaba da Biya (${amount} ${currency})`,
            paymentTitle: "Zaɓi Hanyar Biya",
            securePayment: "Amintaccen Biya",
            successTitle: "An tura cikin nasara!",
            successMsg: "Na gode da buƙatarku. Mun karɓi bayananku. An aiko muku da imel na tabbatarwa.",
            errorTitle: "Wani abu ya faru",
            errorMsg: "Akwai matsala. Da fatan a sake gwadawa."
        },
        am: {
            title: "የምክክር ቅጽ",
            section1: "1 – ደንበኛ",
            fields: {
                raisonSociale: "ስም ወይም የኩባንያ ስም",
                activite: "እንቅስቃሴ",
                nationalite: "ዜግነት",
                adresse: "አድራሻ",
                telephone: "ስልክ",
                fax: "ፋክስ",
                email: "ኢሜይል",
                commune: "ወረዳ",
                delegation: "ውክልና",
                codePostal: "የፖስታ ቁጥር",
                qualiteClient: "የደንበኛ አይነት"
            },
            qualiteClientOptions: [
                "አልሚ", "ኩባንያ", "የዲዛይን ቢሮ", "የፕሮጀክት ባለቤት", "የፕሮጀክት ሥራ አስኪያጅ", "የቁጥጥር ቢሮ", "ሌላ"
            ],
            section2: "2 – የሕንፃ አይነት",
            habitationTitle: "የመኖሪያ ሕንፃዎች",
            habitationOptions: [
                "የግል ቤት",
                "የቡድን ቤት",
                "የጋራ መኖሪያ ሕንፃ",
                "መኖሪያ ያልሆነ ሕንፃ ውስጥ ያለ መኖሪያ",
                "የማህበረሰብ መኖሪያ"
            ],
            functionalTitle: "ተግባራዊ ሕንፃዎች",
            functionalOptions: [
                "ሆቴል", "ቢሮዎች", "የትምህርት ተቋም",
                "ትምህርት ቤት ምግብ ቤት", "የጤና ተቋም", "የህዝብ ሕንፃ",
                "የባህል ተቋም", "የስብሰባ አዳራሽ", "ሲኒማ / ሙዚየም",
                "የስፖርት አዳራሽ", "የህዝብ መዋኛ ገንዳ", "ሌላ ስፖርት ሕንፃ"
            ],
            submit: `ክፍያ ይፈጽሙ (${amount} ${currency})`,
            paymentTitle: "የክፍያ ዘዴ ይምረጡ",
            securePayment: "ደህንነቱ የተጠበቀ ክፍያ",
            successTitle: "በተሳካ ሁኔታ ተልኳል!",
            successMsg: "ስለ ጥያቄዎ እናመሰግናለን። ዝርዝርዎን ተቀብለናል። የማረጋገጫ ኢሜይል ተልኮልዎታል።",
            errorTitle: "ችግር ተፈጥሯል",
            errorMsg: "ጥያቄዎን በማስኬድ ላይ ችግር ነበር። እባክዎ እንደገና ይሞክሩ።"
        }
    };

    const strings = (t as any)[lang] || t.en;

    if (paymentStatus === 'success') {
        return (
            <main style={{ padding: "4rem 2rem", fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto", textAlign: 'center' }}>
                <div style={{ backgroundColor: "#d4edda", color: "#155724", padding: "2rem", borderRadius: 16, marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{strings.successTitle}</h1>
                    <p style={{ fontSize: "1.2rem" }}>{strings.successMsg}</p>
                    <div style={{ fontSize: "4rem", marginTop: "1rem" }}>✅</div>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#2a4d69', color: 'white', cursor: 'pointer' }}
                >
                    Return to Home
                </button>
            </main>
        );
    }

    return (
        <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto", backgroundColor: "#f5f5f5" }}>
            <title>{strings.title} | GEOTUCO</title>

            <form onSubmit={handleSubmit} style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: 8, border: "1px solid #ccc", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <h1 style={{ fontSize: "1.8rem", color: "#2a4d69", marginBottom: "2rem", textAlign: "center" }}>{strings.title}</h1>

                {/* SECTION 1 */}
                <h2 style={{ background: "#0b4a7c", color: "white", padding: "10px", fontSize: "1.2rem", marginBottom: "1.5rem", borderRadius: 4 }}>
                    {strings.section1}
                </h2>

                <div style={{ display: "grid", gap: "1rem" }}>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: "250px" }}>
                            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>{strings.fields.raisonSociale}</label>
                            <input
                                type="text"
                                name="raisonSociale"
                                value={formData.raisonSociale}
                                onChange={handleInputChange}
                                required
                                disabled={showPayment}
                                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: "250px" }}>
                            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>{strings.fields.activite}</label>
                            <input
                                type="text"
                                name="activite"
                                value={formData.activite}
                                onChange={handleInputChange}
                                disabled={showPayment}
                                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: "250px" }}>
                            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>{strings.fields.nationalite}</label>
                            <input
                                type="text"
                                name="nationalite"
                                value={formData.nationalite}
                                onChange={handleInputChange}
                                disabled={showPayment}
                                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: "250px" }}>
                            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>{strings.fields.email}</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={showPayment}
                                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>{strings.fields.adresse}</label>
                        <input
                            type="text"
                            name="adresse"
                            value={formData.adresse}
                            onChange={handleInputChange}
                            disabled={showPayment}
                            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: 4 }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>{strings.fields.telephone}</label>
                            <input
                                type="tel"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleInputChange}
                                disabled={showPayment}
                                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>{strings.fields.fax}</label>
                            <input
                                type="text"
                                name="fax"
                                value={formData.fax}
                                onChange={handleInputChange}
                                disabled={showPayment}
                                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>{strings.fields.commune}</label>
                            <input
                                type="text"
                                name="commune"
                                value={formData.commune}
                                onChange={handleInputChange}
                                disabled={showPayment}
                                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>{strings.fields.delegation}</label>
                            <input
                                type="text"
                                name="delegation"
                                value={formData.delegation}
                                onChange={handleInputChange}
                                disabled={showPayment}
                                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>{strings.fields.codePostal}</label>
                            <input
                                type="text"
                                name="codePostal"
                                value={formData.codePostal}
                                onChange={handleInputChange}
                                disabled={showPayment}
                                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: "1rem" }}>
                        <label style={{ display: "block", marginBottom: 10, fontWeight: "bold", borderBottom: "1px solid #eee", paddingBottom: 5 }}>
                            {strings.fields.qualiteClient}
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.5rem" }}>
                            {strings.qualiteClientOptions.map((opt: string, i: number) => (
                                <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", opacity: showPayment ? 0.7 : 1 }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.qualiteClient.includes(opt)}
                                        onChange={() => handleCheckboxChange("qualiteClient", opt)}
                                        disabled={showPayment}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECTION 2 */}
                <h2 style={{ background: "#0b4a7c", color: "white", padding: "10px", fontSize: "1.2rem", margin: "2rem 0 1.5rem 0", borderRadius: 4 }}>
                    {strings.section2}
                </h2>

                <div style={{ marginBottom: "2rem" }}>
                    <h3 style={{ fontSize: "1.1rem", color: "#2a4d69", marginBottom: "1rem", borderLeft: "4px solid #189ab4", paddingLeft: "10px" }}>
                        {strings.habitationTitle}
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem", paddingLeft: "1rem" }}>
                        {strings.habitationOptions.map((opt: string, i: number) => (
                            <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", opacity: showPayment ? 0.7 : 1 }}>
                                <input
                                    type="checkbox"
                                    checked={formData.batimentsHabitation.includes(opt)}
                                    onChange={() => handleCheckboxChange("batimentsHabitation", opt)}
                                    disabled={showPayment}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                    <h3 style={{ fontSize: "1.1rem", color: "#2a4d69", marginBottom: "1rem", borderLeft: "4px solid #189ab4", paddingLeft: "10px" }}>
                        {strings.functionalTitle}
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "0.5rem", paddingLeft: "1rem" }}>
                        {strings.functionalOptions.map((opt: string, i: number) => (
                            <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", opacity: showPayment ? 0.7 : 1 }}>
                                <input
                                    type="checkbox"
                                    checked={formData.batimentsFonctionnels.includes(opt)}
                                    onChange={() => handleCheckboxChange("batimentsFonctionnels", opt)}
                                    disabled={showPayment}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Submit / Payment Section */}
                {!showPayment ? (
                    <div style={{ marginTop: "3rem", display: "flex", justifyContent: "center" }}>
                        <button
                            type="submit"
                            style={{
                                background: "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)",
                                color: "white",
                                padding: "1rem 3rem",
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                borderRadius: 8,
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                transition: "transform 0.1s"
                            }}
                        >
                            {strings.submit}
                        </button>
                    </div>
                ) : (
                    <div id="payment-section" style={{ marginTop: "3rem", padding: "2rem", backgroundColor: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                        <h2 style={{ textAlign: "center", color: "#2a4d69", marginBottom: "1.5rem" }}>{strings.paymentTitle}</h2>
                        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                            {/* Stripe */}
                            <button
                                type="button"
                                onClick={() => handlePayment('stripe')}
                                disabled={paymentStatus === 'processing'}
                                style={{
                                    padding: "1rem 2rem",
                                    borderRadius: 8,
                                    border: "1px solid #ddd",
                                    background: "white",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    fontSize: "1.1rem",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                                }}
                            >
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" style={{ height: 24 }} />
                                Card
                            </button>

                            {/* PayPal */}
                            <button
                                type="button"
                                onClick={() => handlePayment('paypal')}
                                disabled={paymentStatus === 'processing'}
                                style={{
                                    padding: "1rem 2rem",
                                    borderRadius: 8,
                                    border: "1px solid #ddd",
                                    background: "white",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    fontSize: "1.1rem",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                                }}
                            >
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: 24 }} />
                                PayPal
                            </button>

                            {/* Flutterwave (only if African currency or global) */}
                            <button
                                type="button"
                                onClick={() => handlePayment('flutterwave')}
                                disabled={paymentStatus === 'processing'}
                                style={{
                                    padding: "1rem 2rem",
                                    borderRadius: 8,
                                    border: "1px solid #ddd",
                                    background: "white",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    fontSize: "1.1rem",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                                }}
                            >
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flutterwave_Logo.svg/1200px-Flutterwave_Logo.svg.png" alt="Flutterwave" style={{ height: 24 }} />
                            </button>
                        </div>

                        {paymentStatus === 'processing' && (
                            <div style={{ textAlign: "center", marginTop: "1rem", color: "#666" }}>
                                Processing payment and sending request...
                            </div>
                        )}
                        {paymentStatus === 'error' && (
                            <div style={{ textAlign: "center", marginTop: "1rem", color: "red" }}>
                                {strings.errorMsg}
                            </div>
                        )}
                        <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.9rem", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                            🔒 {strings.securePayment}
                        </div>
                    </div>
                )}

            </form>
        </main>
    );
}
