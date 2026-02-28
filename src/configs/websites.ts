import type { WebsitesData } from "~/types";

const websites: WebsitesData = {
  favorites: {
    title: "SNS Links",
    sites: [
      {
        id: "my-blog",
        title: "Website",
        img: "https://zxh.me/img/avatar.jpg",
        link: "https://zxh.me/",
        inner: true
      },
      {
        id: "my-github",
        title: "Github",
        img: "img/sites/github.svg",
        link: "https://github.com/Renovamen"
      },
      {
        id: "my-linkedin",
        title: "Linkedin",
        img: "img/sites/linkedin.svg",
        link: "https://www.linkedin.com/in/jacquelynhalpern/"
      },
      {
        id: "my-google-scholar",
        title: "Scholar",
        img: "img/sites/google-scholar.svg",
        link: "https://scholar.google.com/citations?user=RuW6xgMAAAAJ"
      },
      {
        id: "my-zhihu",
        title: "知乎",
        img: "img/sites/zhihu.jpeg",
        link: "https://www.zhihu.com/people/chao-neng-gui-su"
      },
      {
        id: "my-twitter",
        title: "Twitter",
        img: "img/sites/twitter.svg",
        link: "https://www.twitter.com/renovamen_zxh"
      },
      {
        id: "my-email",
        title: "Email",
        img: "img/sites/gmail.svg",
        link: "mailto:jacquelyn.halpern@gmail.com"
      }
    ]
  },
  freq: {
    title: "Frequently Visited",
    sites: [
      {
        id: "github",
        title: "Github",
        img: "img/sites/github.svg",
        link: "https://github.com/jacquelynyakira2/"
      },
      {
        id: "dribbble",
        title: "Dribbble",
        img: "img/sites/dribbble.svg",
        link: "https://dribbble.com/Jacquelynyakira"
      },
      {
        id: "pinterest",
        title: "Pinterest",
        img: "img/sites/pinterest.svg",
        link: "https://www.pinterest.com/jacquelynyakira/"
      },
      {
        id: "reddit",
        title: "Reddit",
        img: "img/sites/reddit.svg",
        link: "https://www.reddit.com/"
      },
      {
        id: "hacker-news",
        title: "Hacker News",
        img: "img/sites/hacker.svg",
        link: "https://news.ycombinator.com/"
      },
      {
        id: "tiny-png",
        title: "Tiny PNG",
        img: "https://tinypng.com/images/panda-chewing-2x.png",
        link: "https://tinypng.com/"
      },
      {
        id: "chatgpt",
        title: "ChatGPT",
        link: "https://chatgpt.com"
      },
      {
        id: "perplexity",
        title: "Perplexity",
        link: "https://perplexity.ai/"
      },
      {
        id: "google-ai-studio",
        title: "Google AI Studio",
        link: "https://aistudio.google.com/"
      },
      {
        id: "claude",
        title: "Claude",
        link: "https://claude.ai/"
      }
    ]
  }
};

export default websites;
