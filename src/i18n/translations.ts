export const languages = {
  'zh-TW': '中文',
  'en': 'EN',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'zh-TW';

export const translations = {
  'zh-TW': {
    // Navigation
    'nav.news': '最新消息',
    'nav.about': '關於中心',
    'nav.missions': '太空任務',
    'nav.activities': '活動花絮',
    'nav.contact': '聯絡我們',
    'nav.langSwitch': 'EN',

    // Hero
    'hero.title': '夏漢民太空科技中心',
    'hero.subtitle': '啟動臺灣太空新視界｜匯聚前沿科研、跨域人才與國際合作，領航未來太空時代',
    'hero.madeInTaiwan': '臺灣製造',
    'hero.madeInTaiwanLabel': 'TW',
    'hero.missionCount': '任務次數',
    'hero.scroll': 'Scroll',

    // Missions Section (homepage)
    'missions.title': '參與國家太空任務',
    'missions.active': '執行中任務',
    'missions.retired': '除役任務',
    'missions.datePrefix': '公告時間',
    'missions.readMore': '了解更多',
    'missions.moreInfo': '更多資訊',

    // Missions Page
    'missionsPage.pageTitle': '太空任務 | 夏漢民太空科技中心',
    'missionsPage.heading': '參與國家太空任務',
    'missionsPage.description': '記錄中心參與的太空計畫與科技發展',
    'missionsPage.active': '執行中任務',
    'missionsPage.retired': '除役任務',
    'missionsPage.statusActive': '執行中',
    'missionsPage.statusRetired': '已除役',
    'missionsPage.datePrefix': '公告時間',
    'missionsPage.readMore': '了解更多',
    'missionsPage.backToMissions': '返回太空任務',
    'missionsPage.breadcrumbHome': '首頁',
    'missionsPage.breadcrumbMissions': '太空任務',

    // Activities Page
    'activitiesPage.pageTitle': '活動花絮 | 夏漢民太空科技中心',
    'activitiesPage.heading': '活動花絮',
    'activitiesPage.description': '記錄中心活動的精彩瞬間',
    'activitiesPage.datePrefix': '公告時間',
    'activitiesPage.readMore': '了解更多',
    'activitiesPage.backToActivities': '返回活動花絮',
    'activitiesPage.breadcrumbHome': '首頁',
    'activitiesPage.breadcrumbActivities': '活動花絮',

    // News Section
    'news.title': '最新消息',
    'news.datePrefix': '公告時間',
    'news.readMore': '了解更多',
    'news.moreNews': '更多消息',

    // Team Section
    'team.title': '團隊成員',
    'team.more': '更多',
    'team.backToTeam': '返回團隊成員',

    // About Page
    'about.pageTitle': '關於中心 | 夏漢民太空科技中心',
    'about.heroTitle': '關於中心',
    'about.heroSubtitle': '認識夏漢民太空科技中心的使命與歷史',
    'about.stats.missions': '太空任務',
    'about.stats.members': '核心成員',
    'about.stats.publications': '學術論文',
    'about.stats.partnerships': '國際合作',

    // Contact Page
    'contact.pageTitle': '聯絡我們 | 夏漢民太空科技中心',
    'contact.heroTitle': '聯絡我們',
    'contact.heroSubtitle': '歡迎與我們聯繫，了解更多合作機會',
    'contact.info': '聯絡資訊',
    'contact.phone': '電話',
    'contact.address': '地址',
    'contact.email': '電子郵件',
    'contact.form': '聯絡表單',
    'contact.form.name': '姓名',
    'contact.form.namePlaceholder': '請輸入您的姓名',
    'contact.form.email': '電子郵件',
    'contact.form.emailPlaceholder': 'your@email.com',
    'contact.form.subject': '主旨',
    'contact.form.subjectPlaceholder': '請輸入主旨',
    'contact.form.message': '訊息內容',
    'contact.form.messagePlaceholder': '請輸入您的訊息...',
    'contact.form.submit': '送出訊息',
    'contact.mapTitle': '國立成功大學位置',
    'contact.contacts.director': '林建宏 教授 中心主任',
    'contact.contacts.secretary': '林子軒 先生 中心秘書',

    // Footer
    'footer.orgName': '夏漢民太空科技中心',
    'footer.orgNameEn': 'Hsia Han-Min Space Science & Technology Center',
    'footer.phone': '電話：06-2757575 #60073',
    'footer.address1': '701 臺南市東區大學路1號',
    'footer.address2': '國立成功大學成功校區 綜合二館3樓 49315 室',
    'footer.copyright': '© 2025 夏漢民太空科技中心 保留所有權利。',
    'footer.director': '林建宏 教授 中心主任',
    'footer.secretary': '林子軒 先生 中心秘書',

    // Common
    'common.home': '首頁',
    'common.readMore': '了解更多',
    'common.backToHome': '返回首頁',
  },
  'en': {
    // Navigation
    'nav.news': 'News',
    'nav.about': 'About',
    'nav.missions': 'Missions',
    'nav.activities': 'Activities',
    'nav.contact': 'Contact',
    'nav.langSwitch': '中文',

    // Hero
    'hero.title': 'HAN MING HSIA',
    'hero.subtitle': 'Pioneering a New Era of Space Innovation in Taiwan｜Uniting Innovation, Talent, and Global Collaboration to Shape the Future of Space.',
    'hero.madeInTaiwan': 'Made in Taiwan',
    'hero.madeInTaiwanLabel': 'TW',
    'hero.missionCount': 'Missions',
    'hero.scroll': 'Scroll',

    // Missions Section (homepage)
    'missions.title': 'National Space Missions',
    'missions.active': 'Active Missions',
    'missions.retired': 'Retired Missions',
    'missions.datePrefix': 'Announced',
    'missions.readMore': 'Read more',
    'missions.moreInfo': 'More Info',

    // Missions Page
    'missionsPage.pageTitle': 'Space Missions | HMSSTC',
    'missionsPage.heading': 'National Space Missions',
    'missionsPage.description': 'Documenting the space programs and technology development participated by the center',
    'missionsPage.active': 'Active Missions',
    'missionsPage.retired': 'Retired Missions',
    'missionsPage.statusActive': 'Active',
    'missionsPage.statusRetired': 'Retired',
    'missionsPage.datePrefix': 'Announced',
    'missionsPage.readMore': 'Read more',
    'missionsPage.backToMissions': 'Back to Missions',
    'missionsPage.breadcrumbHome': 'Home',
    'missionsPage.breadcrumbMissions': 'Missions',

    // Activities Page
    'activitiesPage.pageTitle': 'Activities | HMSSTC',
    'activitiesPage.heading': 'Activities',
    'activitiesPage.description': 'Capturing memorable moments from center activities',
    'activitiesPage.datePrefix': 'Published',
    'activitiesPage.readMore': 'Read more',
    'activitiesPage.backToActivities': 'Back to Activities',
    'activitiesPage.breadcrumbHome': 'Home',
    'activitiesPage.breadcrumbActivities': 'Activities',

    // News Section
    'news.title': 'Latest News',
    'news.datePrefix': 'Published',
    'news.readMore': 'Read more',
    'news.moreNews': 'More News',

    // Team Section
    'team.title': 'Team Members',
    'team.more': 'More',
    'team.backToTeam': 'Back to Team',

    // About Page
    'about.pageTitle': 'About | HMSSTC',
    'about.heroTitle': 'About Us',
    'about.heroSubtitle': 'Learn about the mission and history of HMSSTC',
    'about.stats.missions': 'Space Missions',
    'about.stats.members': 'Core Members',
    'about.stats.publications': 'Publications',
    'about.stats.partnerships': 'Intl. Partnerships',

    // Contact Page
    'contact.pageTitle': 'Contact | HMSSTC',
    'contact.heroTitle': 'Contact Us',
    'contact.heroSubtitle': 'Get in touch to learn more about collaboration opportunities',
    'contact.info': 'Contact Information',
    'contact.phone': 'Phone',
    'contact.address': 'Address',
    'contact.email': 'Email',
    'contact.form': 'Contact Form',
    'contact.form.name': 'Name',
    'contact.form.namePlaceholder': 'Enter your name',
    'contact.form.email': 'Email',
    'contact.form.emailPlaceholder': 'your@email.com',
    'contact.form.subject': 'Subject',
    'contact.form.subjectPlaceholder': 'Enter subject',
    'contact.form.message': 'Message',
    'contact.form.messagePlaceholder': 'Enter your message...',
    'contact.form.submit': 'Send Message',
    'contact.mapTitle': 'NCKU Location',
    'contact.contacts.director': 'Prof. Jian-Hong Lin, Director',
    'contact.contacts.secretary': 'Mr. Zi-Xuan Lin, Secretary',

    // Footer
    'footer.orgName': 'HMSSTC',
    'footer.orgNameEn': 'Hsia Han-Min Space Science & Technology Center',
    'footer.phone': 'Phone: 06-2757575 #60073',
    'footer.address1': 'No. 1, University Rd., East Dist., Tainan 701',
    'footer.address2': 'NCKU Cheng Kung Campus, Building 2, 3F, Room 49315',
    'footer.copyright': '© 2025 HMSSTC. All rights reserved.',
    'footer.director': 'Prof. Jian-Hong Lin, Director',
    'footer.secretary': 'Mr. Zi-Xuan Lin, Secretary',

    // Common
    'common.home': 'Home',
    'common.readMore': 'Read more',
    'common.backToHome': 'Back to Home',
  },
} as const;

export type TranslationKey = keyof typeof translations['zh-TW'];

/**
 * Client-side i18n helper script to be included in the page.
 * Uses localStorage for language persistence. All translatable elements
 * use data-i18n="key" attributes and are updated via JS.
 */
export const i18nClientScript = `
<script>
  (function() {
    const translations = ${JSON.stringify(translations)};
    const defaultLang = '${defaultLang}';

    function getLang() {
      return localStorage.getItem('hmsstc-lang') || defaultLang;
    }

    function setLang(lang) {
      localStorage.setItem('hmsstc-lang', lang);
      applyTranslations(lang);
    }

    function applyTranslations(lang) {
      const t = translations[lang] || translations[defaultLang];

      // Update html lang attribute
      document.documentElement.lang = lang === 'en' ? 'en' : 'zh-TW';

      // Update all elements with data-i18n attribute
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
          el.textContent = t[key];
          // Update data-content if it exists (used for CSS pseudo-elements)
          if (el.hasAttribute('data-content')) {
            el.setAttribute('data-content', t[key]);
          }
        }
      });

      // Update all elements with data-i18n-placeholder attribute
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
          el.placeholder = t[key];
        }
      });

      // Update all elements with data-i18n-title attribute
      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (t[key]) {
          el.title = t[key];
        }
      });

      // Update page title if data-i18n-page-title exists
      const pageTitle = document.querySelector('[data-i18n-page-title]');
      if (pageTitle) {
        const key = pageTitle.getAttribute('data-i18n-page-title');
        if (t[key]) {
          document.title = t[key];
        }
      }

      // Update lang switch buttons
      document.querySelectorAll('[data-lang-switch]').forEach(btn => {
        btn.textContent = lang === 'en' ? '中文' : 'EN';
      });

      // Show/hide language-specific content
      document.querySelectorAll('[data-lang-content]').forEach(el => {
        const contentLang = el.getAttribute('data-lang-content');
        el.style.display = contentLang === lang ? '' : 'none';
      });
    }

    // Initialize on page load
    const lang = getLang();
    applyTranslations(lang);

    // Expose globally for lang switch buttons
    window.__setLang = setLang;
    window.__getLang = getLang;
  })();
<\/script>
`;
