import type {
  ProfileFormData,
  LinksFormData,
  SocialFormData,
  SupportFormData,
} from './validations';
import { DEFAULT_PREFIX } from '@/constants/defaults';
import type { CustomSkill, ProficiencyLevel } from '@/types/skills';
import type { TemplateType } from '@/types/template';
import { templates } from '@/types/template';
import type { SectionType } from '@/types/section-order';
import type { ColorThemeType } from '@/types/color-theme';
import { colorThemes } from '@/types/color-theme';

interface GenerateMarkdownOptions {
  profile: Partial<ProfileFormData>;
  links: Partial<LinksFormData>;
  social: Partial<SocialFormData>;
  support: Partial<SupportFormData>;
  skills: Record<string, boolean>;
  customSkills?: Record<string, CustomSkill>;
  template?: TemplateType;
  skillProficiency?: Record<string, ProficiencyLevel>;
  sectionOrder?: SectionType[];
  colorTheme?: ColorThemeType;
}

const socialPlatformUrls: Record<string, (username: string) => string> = {
  github: (u) => `https://github.com/${u}`,
  linkedin: (u) => `https://linkedin.com/in/${u}`,
  twitter: (u) => `https://twitter.com/${u}`,
  dev: (u) => `https://dev.to/${u}`,
  stackoverflow: (u) => `https://stackoverflow.com/users/${u}`,
  kaggle: (u) => `https://kaggle.com/${u}`,
  fb: (u) => `https://fb.com/${u}`,
  instagram: (u) => `https://instagram.com/${u}`,
  dribbble: (u) => `https://dribbble.com/${u}`,
  behance: (u) => `https://behance.net/${u}`,
  medium: (u) => `https://medium.com/${u}`,
  youtube: (u) => `https://youtube.com/${u}`,
  codepen: (u) => `https://codepen.io/${u}`,
  codesandbox: (u) => `https://codesandbox.io/${u}`,
  leetcode: (u) => `https://leetcode.com/${u}`,
  hackerrank: (u) => `https://hackerrank.com/${u}`,
  codeforces: (u) => `https://codeforces.com/profile/${u}`,
  codechef: (u) => `https://codechef.com/users/${u}`,
  topcoder: (u) => `https://topcoder.com/members/${u}`,
  hackerearth: (u) => `https://hackerearth.com/${u}`,
  geeks_for_geeks: (u) => `https://auth.geeksforgeeks.org/user/${u}`,
  discord: (u) => `https://discord.gg/${u}`,
};

const socialIcons: Record<string, string> = {
  github: 'github.svg',
  linkedin: 'linked-in-alt.svg',
  twitter: 'twitter.svg',
  dev: 'devto.svg',
  stackoverflow: 'stack-overflow.svg',
  kaggle: 'kaggle.svg',
  fb: 'facebook.svg',
  instagram: 'instagram.svg',
  dribbble: 'dribbble.svg',
  behance: 'behance.svg',
  medium: 'medium.svg',
  youtube: 'youtube.svg',
  codepen: 'codepen.svg',
  codesandbox: 'codesandbox.svg',
  leetcode: 'leet-code.svg',
  hackerrank: 'hackerrank.svg',
  codeforces: 'codeforces.svg',
  codechef: 'codechef.svg',
  topcoder: 'topcoder.svg',
  hackerearth: 'hackerearth.svg',
  geeks_for_geeks: 'geeks-for-geeks.svg',
  discord: 'discord.svg',
};

// Generate skill icon URL - uses skillicons.dev for consistent dark mode support
export function getSkillIconUrl(skill: string): string {
  // Skills that use simple-icons for better brand colors and dark mode support
  // Using colors that work in both light and dark modes
  const simpleIconsFallback: Record<string, string> = {
    // DevOps
    circleci: 'circleci/555', // CircleCI in medium gray (visible in both modes)
    travisci: 'travisci', // Travis CI uses teal brand color (works in both modes)
    // Modern AI/ML Tools
    langchain: 'langchain/1C3C3C', // LangChain dark color
    huggingface: 'huggingface', // HuggingFace brand color
    ollama: 'ollama', // Ollama brand color
    mlflow: 'mlflow/0194E2', // MLflow blue
    streamlit: 'streamlit/FF4B4B', // Streamlit red
    gradio: 'gradio/FF7C00', // Gradio orange
    // Frontend
    backbonejs: 'backbonedotjs/0071B5', // Backbone.js blue
    // Mobile
    nativescript: 'nativescript/3655FF', // NativeScript blue
    apachecordova: 'apachecordova/E8E8E8', // Apache Cordova gray
    // Backend
    solr: 'apachesolr/D9411E', // Apache Solr red
    // Database
    cockroachdb: 'cockroachlabs', // CockroachDB official
    hive: 'apachehive/FDEE21', // Apache Hive yellow
    // Data Visualization
    chartjs: 'chartdotjs/FF6384', // Chart.js pink
    // Testing
    puppeteer: 'puppeteer/40B5A4', // Puppeteer teal
    // Software/Design
    framer: 'framer', // Framer brand color
    invision: 'invision/FF3366', // InVision pink
    // Static Site Generators
    '11ty': 'eleventy', // Eleventy brand color
    hexo: 'hexo/0E83CD', // Hexo blue
    gridsome: 'gridsome', // Gridsome brand color
    // Automation
    zapier: 'zapier/FF4A00', // Zapier orange
    ifttt: 'ifttt', // IFTTT brand color
  };

  if (simpleIconsFallback[skill]) {
    const parts = simpleIconsFallback[skill].split('/');
    const iconName = parts[0];
    const color = parts[1] || '';
    return `https://cdn.simpleicons.org/${iconName}${color ? `/${color}` : ''}`;
  }

  const deviconFallback: Record<string, string> = {
    oracle: 'oracle/oracle-original',
    realm: 'realm/realm-original',
    couchdb: 'couchdb/couchdb-original',
    mssql: 'microsoftsqlserver/microsoftsqlserver-plain',
    mariadb: 'mysql/mysql-original-wordmark',
    xamarin: 'dot-net/dot-net-plain',
    ionic: 'ionic/ionic-original',
    erlang: 'erlang/erlang-original',
    bulma: 'bulma/bulma-plain',
    materialize: 'materialui/materialui-original',
    openresty: 'nginx/nginx-original',
    hadoop: 'hadoop/hadoop-original',
    keras: 'keras/keras-original',
    numpy: 'numpy/numpy-original',
    matplotlib: 'matplotlib/matplotlib-original',
    jupyter: 'jupyter/jupyter-original-wordmark',
    pandas: 'pandas/pandas-original',
    seaborn: 'python/python-original',
    canvasjs: 'javascript/javascript-original',
    kibana: 'kibana/kibana-original',
    vagrant: 'vagrant/vagrant-original',
    amplify: 'amazonwebservices/amazonwebservices-plain-wordmark',
    codeigniter: 'codeigniter/codeigniter-plain',
    quasar: 'quasar/quasar-plain',
    mocha: 'mocha/mocha-plain',
    karma: 'karma/karma-original',
    jasmine: 'jasmine/jasmine-original',
    sketch: 'sketch/sketch-original',
    hugo: 'hugo/hugo-original',
    sculpin: 'php/php-original',
    vuepress: 'vuejs/vuejs-original',
    jekyll: 'jekyll/jekyll-original',
    middleman: 'ruby/ruby-original',
    scully: 'angularjs/angularjs-original',
  };

  if (deviconFallback[skill]) {
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${deviconFallback[skill]}.svg`;
  }

  const skillIconsMap: Record<string, string> = {
    c: 'c',
    cplusplus: 'cpp',
    csharp: 'cs',
    go: 'go',
    java: 'java',
    javascript: 'js',
    typescript: 'ts',
    php: 'php',
    perl: 'perl',
    ruby: 'ruby',
    scala: 'scala',
    python: 'py',
    swift: 'swift',
    objectivec: 'apple',
    clojure: 'clojure',
    rust: 'rust',
    haskell: 'haskell',
    coffeescript: 'coffeescript',
    elixir: 'elixir',
    erlang: 'erlang',
    vuejs: 'vue',
    react: 'react',
    svelte: 'svelte',
    angularjs: 'angular',
    angular: 'angular',
    backbonejs: 'backbone',
    bootstrap: 'bootstrap',
    vuetify: 'vuetify',
    css3: 'css',
    html5: 'html',
    pug: 'pug',
    gulp: 'gulp',
    sass: 'sass',
    redux: 'redux',
    webpack: 'webpack',
    babel: 'babel',
    tailwind: 'tailwind',
    bulma: 'bulma',
    gtk: 'gtk',
    qt: 'qt',
    ember: 'ember',
    nodejs: 'nodejs',
    spring: 'spring',
    express: 'express',
    graphql: 'graphql',
    kafka: 'kafka',
    rabbitmq: 'rabbitmq',
    rabbitMQ: 'rabbitmq',
    hadoop: 'hadoop',
    nginx: 'nginx',
    nestjs: 'nestjs',
    android: 'androidstudio',
    flutter: 'flutter',
    dart: 'dart',
    kotlin: 'kotlin',
    reactnative: 'react',
    ionic: 'ionic',
    tensorflow: 'tensorflow',
    pytorch: 'pytorch',
    opencv: 'opencv',
    scikit_learn: 'scikitlearn',
    anaconda: 'anaconda',
    fastapi: 'fastapi',
    mongodb: 'mongodb',
    mysql: 'mysql',
    postgresql: 'postgres',
    redis: 'redis',
    cassandra: 'cassandra',
    elasticsearch: 'elasticsearch',
    sqlite: 'sqlite',
    d3js: 'd3',
    grafana: 'grafana',
    aws: 'aws',
    docker: 'docker',
    jenkins: 'jenkins',
    gcp: 'gcp',
    kubernetes: 'kubernetes',
    bash: 'bash',
    azure: 'azure',
    vagrant: 'vagrant',
    circleci: 'circleci',
    travisci: 'travis',
    firebase: 'firebase',
    appwrite: 'appwrite',
    heroku: 'heroku',
    django: 'django',
    dotnet: 'dotnet',
    electron: 'electron',
    symfony: 'symfony',
    laravel: 'laravel',
    codeigniter: 'codeigniter',
    rails: 'rails',
    flask: 'flask',
    quasar: 'quasar',
    cypress: 'cypress',
    selenium: 'selenium',
    jest: 'jest',
    mocha: 'mocha',
    puppeteer: 'puppeteer',
    karma: 'karma',
    jasmine: 'jasmine',
    illustrator: 'illustrator',
    photoshop: 'photoshop',
    xd: 'xd',
    figma: 'figma',
    blender: 'blender',
    sketch: 'sketch',
    invision: 'invision',
    framer: 'framer',
    matlab: 'matlab',
    postman: 'postman',
    gatsby: 'gatsby',
    hugo: 'hugo',
    jekyll: 'jekyll',
    nextjs: 'nextjs',
    nuxtjs: 'nuxtjs',
    '11ty': 'eleventy',
    hexo: 'hexo',
    unity: 'unity',
    unreal: 'unreal',
    zapier: 'zapier',
    ifttt: 'ifttt',
    linux: 'linux',
    git: 'git',
    arduino: 'arduino',
  };

  const iconName = skillIconsMap[skill] || skill;

  return `https://skillicons.dev/icons?i=${iconName}`;
}

export function generateMarkdown(options: GenerateMarkdownOptions): string {
  const { profile, links, social, support, skills, customSkills = {}, template = 'professional', skillProficiency = {}, sectionOrder, colorTheme = 'default' } = options;
  const templateConfig = templates[template];
  const themeConfig = colorThemes[colorTheme];
  let markdown = '';

  const proficiencyBadge: Record<ProficiencyLevel, string> = {
    beginner: '🌱',
    intermediate: '🌿',
    expert: '🌳',
  };

  // Define section generators
  const sectionGenerators: Record<SectionType, () => string> = {
    title: () => {
      let md = '';
      if (templateConfig.sections.showTitle && profile.title) {
        md += `# ${DEFAULT_PREFIX.title} ${profile.title}\n\n`;
      }
      if (templateConfig.sections.showSubtitle && profile.subtitle) {
        md += `### ${profile.subtitle}\n\n`;
      }
      return md;
    },
    badges: () => {
      let md = '';
      if (templateConfig.sections.showVisitorBadge && profile.visitorsBadge && social.github) {
        const badgeColor = profile.badgeColor || themeConfig.badgeColors.message;
        md += `<p align="left"> <img src="https://komarev.com/ghpvc/?username=${social.github}&label=${profile.badgeLabel || 'Profile views'}&color=${badgeColor}&style=${profile.badgeStyle || 'flat'}" alt="${social.github}" /> </p>\n\n`;
      }
      if (templateConfig.sections.showGitHubTrophy && profile.githubProfileTrophy && social.github) {
        md += `<p align="left"> <a href="https://github.com/ryo-ma/github-profile-trophy"><img src="https://github-profile-trophy.vercel.app/?username=${social.github}" alt="${social.github}" /></a> </p>\n\n`;
      }
      if (templateConfig.sections.showTwitterBadge && social.twitterBadge && social.twitter) {
        md += `<p align="left"> <a href="https://twitter.com/${social.twitter}" target="blank"><img src="https://img.shields.io/twitter/follow/${social.twitter}?logo=twitter&style=for-the-badge&color=${themeConfig.badgeColors.message}" alt="${social.twitter}" /></a> </p>\n\n`;
      }
      return md;
    },
    about: () => {
      let md = '';
      if (templateConfig.sections.showAboutSections) {
        const aboutSections = [
          {
            key: 'currentWork',
            value: profile.currentWork,
            prefix: DEFAULT_PREFIX.currentWork,
            link: links.currentWork,
          },
          { key: 'currentLearn', value: profile.currentLearn, prefix: DEFAULT_PREFIX.currentLearn },
          {
            key: 'collaborateOn',
            value: profile.collaborateOn,
            prefix: DEFAULT_PREFIX.collaborateOn,
            link: links.collaborateOn,
          },
          {
            key: 'helpWith',
            value: profile.helpWith,
            prefix: DEFAULT_PREFIX.helpWith,
            link: links.helpWith,
          },
          { key: 'ama', value: profile.ama, prefix: DEFAULT_PREFIX.ama },
          { key: 'contact', value: profile.contact, prefix: DEFAULT_PREFIX.contact },
          { key: 'funFact', value: profile.funFact, prefix: DEFAULT_PREFIX.funFact },
        ];

        aboutSections.forEach(({ value, prefix, link }) => {
          if (value) {
            if (link) {
              md += `- ${prefix} **[${value}](${link})**\n\n`;
            } else {
              md += `- ${prefix} **${value}**\n\n`;
            }
          }
        });
      }
      return md;
    },
    links: () => {
      let md = '';
      if (templateConfig.sections.showLinks && links.portfolio) {
        md += `- ${DEFAULT_PREFIX.portfolio} **[${links.portfolio}](${links.portfolio})**\n\n`;
      }
      if (templateConfig.sections.showLinks && links.blog) {
        md += `- ${DEFAULT_PREFIX.blog} **[${links.blog}](${links.blog})**\n\n`;
      }
      if (templateConfig.sections.showLinks && links.resume) {
        md += `- ${DEFAULT_PREFIX.resume} **[${links.resume}](${links.resume})**\n\n`;
      }
      return md;
    },
    social: () => {
      let md = '';
      if (templateConfig.sections.showSocial) {
        const socialLinks = Object.entries(social).filter(
          ([key, value]) =>
            key !== 'twitterBadge' && value && typeof value === 'string' && value.trim() !== ''
        );
        if (socialLinks.length > 0) {
          md += `<h3 align="left">Connect with me:</h3>\n`;
          md += `<p align="left">\n`;

          socialLinks.forEach(([platform, username]) => {
            const icon = socialIcons[platform];
            const url = socialPlatformUrls[platform];
            if (icon && url && username) {
              md += `<a href="${url(username as string)}" target="blank"><img align="center" src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/master/src/images/icons/Social/${icon}" alt="${username as string}" height="30" width="40" /></a>\n`;
            }
          });

          md += `</p>\n\n`;
        }
      }
      return md;
    },
    skills: () => {
      let md = '';
      if (templateConfig.sections.showSkills) {
        const selectedSkills = Object.entries(skills).filter(([_, selected]) => selected);
        if (selectedSkills.length > 0) {
          md += `<h3 align="left">Languages and Tools:</h3>\n`;
          md += `<p align="left">`;

          selectedSkills.forEach(([skill]) => {
            const iconUrl = getSkillIconUrl(skill);
            const level = skillProficiency[skill];
            const badge = level ? proficiencyBadge[level] : '';
            md += ` <a href="https://developer.mozilla.org/en-US/docs/Web/${skill}" target="_blank" rel="noreferrer"> <img src="${iconUrl}" alt="${skill}" width="40" height="40"/> </a>${badge ? ` ${badge}` : ''}`;
          });

          md += `</p>\n\n`;
        }

        // Custom Skills
        const selectedCustomSkills = Object.entries(customSkills).filter(([skillName]) => skills[skillName]);
        if (selectedCustomSkills.length > 0) {
          md += `<h3 align="left">Other Skills:</h3>\n`;
          md += `<p align="left">`;

          selectedCustomSkills.forEach(([skillName, skill]) => {
            const iconUrl = skill.iconUrl || 'https://via.placeholder.com/40';
            const level = skillProficiency[skillName] || skill.proficiency;
            const badge = level ? proficiencyBadge[level] : '';
            md += ` <img src="${iconUrl}" alt="${skill.name}" width="40" height="40"/>${badge ? ` ${badge}` : ''}`;
          });

          md += `</p>\n\n`;
        }
      }
      return md;
    },
    support: () => {
      let md = '';
      if (templateConfig.sections.showSupport && support.buyMeACoffee) {
        md += `<h3 align="left">Support:</h3>\n`;
        md += `<p><a href="https://www.buymeacoffee.com/${support.buyMeACoffee}"> <img align="left" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="${support.buyMeACoffee}" /></a></p><br><br>\n\n`;
      }
      return md;
    },
    stats: () => {
      let md = '';
      if (templateConfig.sections.showGitHubStats && profile.githubStats && social.github) {
        md += `<p><img align="left" src="https://github-readme-stats.vercel.app/api/top-langs?username=${social.github}&show_icons=true&locale=en&layout=compact" alt="${social.github}" /></p>\n\n`;
        md += `<p>&nbsp;<img align="center" src="https://github-readme-stats.vercel.app/api?username=${social.github}&show_icons=true&locale=en" alt="${social.github}" /></p>\n\n`;
      }
      if (templateConfig.sections.showStreakStats && profile.streakStats && social.github) {
        md += `<p><img align="center" src="https://github-readme-streak-stats.herokuapp.com/?user=${social.github}&" alt="${social.github}" /></p>\n\n`;
      }
      return md;
    },
  };

  // Generate markdown based on section order
  const order = sectionOrder || ['title', 'badges', 'about', 'links', 'social', 'skills', 'support', 'stats'];
  order.forEach((section) => {
    markdown += sectionGenerators[section]();
  });

  return markdown;
}

export function generateTitle(profile: Partial<ProfileFormData>): string {
  return profile.title || 'My GitHub Profile';
}
