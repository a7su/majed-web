/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  en: {
    nav_gallery: "Gallery",
    nav_about: "Biography",
    nav_exhibitions: "Exhibitions",
    nav_contact: "Contact",
    nav_menu: "Menu",
    nav_menu_gallery: "Gallery · Collection",
    nav_menu_youth: "Youth Workshops",
    nav_menu_corporate: "Corporate Workshops",
    nav_menu_about: "About the Artist",
    nav_menu_courses: "Masterclass",

    hero_title: "Majed Alnahdi",
    hero_subtitle: "Visual Artist & Charcoal Master",
    hero_quote: '"Art is not what you see, but what you make others see."',
    btn_explore: "Explore Collection",
    btn_inquire: "Inquire Now",
    btn_close: "Close",
    btn_view: "View Details",

    about_title: "Who Am I?",
    about_subtitle: "The Artist",
    about_text1: "Based in Riyadh, I am a fine artist specializing in hyper-realistic charcoal and mixed media artwork. My journey began with a simple pencil, and over the years, has evolved into a deep exploration of contrast, light, and human emotion.",
    about_text2: "Every piece I create is an intimate dialogue between the subject and the canvas. I believe that true art lies in the subtle imperfections and the silent stories hidden within the shadows.",
    about_readmore: "Discover the Gallery",

    gallery_title: "Collection & Artworks",
    gallery_subtitle: "Selected Works",
    filter_all: "All",
    filter_charcoal: "Charcoal",
    filter_watercolor: "Watercolor",
    filter_colored_pencil: "Colored Pencil",
    filter_pencil: "Pencil & Graphite",
    filter_ink: "Ink Drawings",

    course_title: "Workshops & Courses",
    course_subtitle: "Learn the Craft",
    course_headline: "The Art of Charcoal & Ink",
    course_desc: "Join an immersive journey into hyper-realism. Learn advanced shading techniques, material mastery, and the secrets of capturing emotion on paper.",
    course_btn: "Reserve Your Spot",

    arab_title: "Arab Painters",
    arab_subtitle: "رسامين العرب",
    arab_desc: "Honoring the rich heritage of Arab art. A tribute to the masters who paved the way and the contemporary voices shaping the future of visual storytelling in the Middle East.",

    contact_title: "Contact & Acquisition",
    contact_desc: "For inquiries regarding original artwork acquisitions, private studio viewings, or custom fine art commissions.",
    contact_name: "Full Name *",
    contact_email: "Email Address *",
    contact_msg: "Message / Inquiry *",
    contact_send: "Send Inquiry →",
    contact_thanks: "Thank you for your message",
    contact_thanks_sub: "We will contact you shortly regarding your artwork acquisition inquiry.",
    contact_rights: "All rights reserved.",
    contact_back: "Back to top ↑"
  },
  ar: {
    nav_gallery: "المعرض",
    nav_about: "السيرة الذاتية",
    nav_exhibitions: "المعارض",
    nav_contact: "تواصل",
    nav_menu: "القائمة",
    nav_menu_gallery: "المعرض · التشكيلة",
    nav_menu_youth: "ورش عمل للشباب",
    nav_menu_corporate: "ورش عمل للشركات",
    nav_menu_about: "عن الفنان",
    nav_menu_courses: "دورة احترافية",

    hero_title: "ماجد النهدي",
    hero_subtitle: "فنان تشكيلي وخبير الفحم",
    hero_quote: '"الفن ليس ما تراه، بل ما تجعل الآخرين يرونه."',
    btn_explore: "استكشف المجموعة",
    btn_inquire: "استفسر الآن",
    btn_close: "إغلاق",
    btn_view: "عرض التفاصيل",

    about_title: "من أنا؟",
    about_subtitle: "الفنان",
    about_text1: "أنا فنان تشكيلي مقيم في الرياض، متخصص في الفن الواقعي المفرط باستخدام الفحم والوسائط المتعددة. بدأت رحلتي بقلم رصاص بسيط، وتطورت على مر السنين إلى استكشاف عميق للتباين والضوء والعاطفة الإنسانية.",
    about_text2: "كل قطعة أبدعها هي حوار حميم بين الموضوع واللوحة. أؤمن بأن الفن الحقيقي يكمن في العيوب الدقيقة والقصص الصامتة المخبأة في الظلال.",
    about_readmore: "اكتشف المعرض",

    gallery_title: "المجموعة والأعمال الفنية",
    gallery_subtitle: "أعمال مختارة",
    filter_all: "الكل",
    filter_charcoal: "فحم",
    filter_watercolor: "ألوان مائية",
    filter_colored_pencil: "ألوان خشبية",
    filter_pencil: "رصاص وجرافيت",
    filter_ink: "رسم بالحبر",

    course_title: "ورش العمل والدورات",
    course_subtitle: "تعلّم الفن",
    course_headline: "فن الفحم والحبر",
    course_desc: "انضم إلى رحلة غامرة في الواقعية المفرطة. تعلم تقنيات التظليل المتقدمة، وإتقان المواد، وأسرار التقاط المشاعر على الورق.",
    course_btn: "احجز مقعدك",

    arab_title: "رسامون عرب",
    arab_subtitle: "تراث الفن",
    arab_desc: "تكريماً للتراث الغني للفن العربي. تحية للرواد الذين مهدوا الطريق والأصوات المعاصرة التي تشكل مستقبل السرد البصري في الشرق الأوسط.",

    contact_title: "التواصل والاقتناء",
    contact_desc: "للاستفسارات المتعلقة باقتناء الأعمال الفنية الأصلية، أو زيارة الاستوديو الخاص، أو طلبات الأعمال الفنية المخصصة.",
    contact_name: "الاسم الكامل *",
    contact_email: "البريد الإلكتروني *",
    contact_msg: "الرسالة / الاستفسار *",
    contact_send: "إرسال الاستفسار ←",
    contact_thanks: "شكراً لرسالتك",
    contact_thanks_sub: "سنتواصل معك قريباً بخصوص استفسارك عن اقتناء الأعمال الفنية.",
    contact_rights: "جميع الحقوق محفوظة.",
    contact_back: "العودة للأعلى ↑"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Set document direction and language attribute
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;

    // Update lang class on body
    document.body.classList.remove('lang-en', 'lang-ar');
    document.body.classList.add(`lang-${language}`);

    // Apply Palestine font for Arabic via CSS custom property
    if (language === 'ar') {
      document.documentElement.style.setProperty('--active-arabic-font', "'PalestineFont', 'Amiri', 'Cairo', serif");
    } else {
      document.documentElement.style.removeProperty('--active-arabic-font');
    }
  }, [language]);

  const t = (key) => translations[language][key] || key;

  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'ar' : 'en');

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
