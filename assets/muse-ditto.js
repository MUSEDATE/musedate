(function () {
  function clean(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function findSrSection(text) {
    var heading = qsa("h2.sr-only").find(function (el) {
      return clean(el.textContent) === text;
    });
    return heading ? heading.parentElement : null;
  }

  function ensureTitle(section, id, title, copy) {
    var existing;
    var img;

    if (!section) {
      return;
    }

    existing = section.querySelector(".muse-title-replacement[data-muse-title='" + id + "']");
    img = section.querySelector("img[src*='title-text/']");

    if (img) {
      img.style.display = "none";
    }

    if (!existing) {
      existing = document.createElement("div");
      existing.className = "muse-title-replacement";
      existing.dataset.museTitle = id;
      if (img) {
        img.insertAdjacentElement("afterend", existing);
      } else {
        section.insertBefore(existing, section.firstChild);
      }
    }

    existing.innerHTML = "<h2>" + title + "</h2><p>" + copy + "</p>";
  }

  function ensureBlock(parent, id, className, html) {
    var existing;

    if (!parent) {
      return null;
    }

    existing = parent.querySelector("[data-muse-block='" + id + "']");
    if (!existing) {
      existing = document.createElement("div");
      existing.dataset.museBlock = id;
      existing.className = className;
      parent.appendChild(existing);
    }

    existing.innerHTML = html;
    return existing;
  }

  function setTextList(selector, values) {
    qsa(selector).forEach(function (el, index) {
      if (values[index] != null) {
        el.textContent = values[index];
      }
    });
  }

  function setImage(img, src, alt) {
    if (!img) {
      return;
    }
    img.src = src;
    if (alt) {
      img.alt = alt;
    }
    img.classList.add("muse-cover-photo");
  }

  function updateHero() {
    var heroTitle = document.querySelector("h1");
    var countdown = document.getElementById("countdown");

    if (heroTitle) {
      heroTitle.classList.add("muse-cn-hero");
      heroTitle.innerHTML =
        "<span class='block text-[72px] font-normal leading-[0.9] whitespace-nowrap'>找到真正</span>" +
        "<span class='block text-[82px] font-normal leading-[0.9]'>合适的人</span>";
    }

    if (countdown && !countdown.querySelector(".muse-hero-meta")) {
      countdown.innerHTML =
        "<div class='muse-hero-meta'>" +
        "<div class='muse-hero-card'>" +
        "<div class='muse-hero-kicker'>AI Matchmaking</div>" +
        "<div class='muse-hero-tags'><span>审美</span><span>Persona</span><span>意图</span><span>认真度</span></div>" +
        "<div class='muse-hero-copy'>不是随机推荐。<strong>Muse</strong> 会先理解你，再用四维判断筛掉不合适的人，把更值得推进的人留给你。</div>" +
        "</div>" +
        "<div class='muse-hero-stats'>" +
        "<div class='muse-hero-stat'><strong>普通匹配</strong><span>免费开始</span></div>" +
        "<div class='muse-hero-stat'><strong>高端匹配</strong><span>¥100/次</span></div>" +
        "</div>" +
        "</div>";
    }
  }

  function updateHowItWorks() {
    var section = findSrSection("How it works");

    ensureTitle(
      section,
      "how",
      "如何运作",
      "<strong>小 me</strong> 先理解你，再理解你喜欢谁。匹配不是刷人，而是四维判断后，把更值得认识的人送到你面前。"
    );

    setTextList(".howItWorks-module-scss-module__qgPgUG__stepTitle", [
      "AI 读懂你",
      "双轮精准筛选",
      "认真才能匹配",
      "聊天更容易开始",
    ]);

    setTextList(".howItWorks-module-scss-module__qgPgUG__stepDescription", [
      "先和小 me 聊聊，Muse 会从你的表达、审美和价值观里理解你。",
      "先筛掉不合适的颜值风格，再筛掉意图不一致的人。",
      "双向认真后才进入更高质量的候选池，减少无效消耗。",
      "Muse 会提供更自然的开场建议，让第一次对话更容易推进。",
    ]);
  }

  function updateResults() {
    var section = findSrSection("Real Dates Delivered");
    var photoGroups;
    var sources;

    ensureTitle(
      section,
      "real",
      "认真匹配，不靠运气",
      "普通匹配每天更新，高端匹配 <strong>¥100/次</strong>。少一点无效聊天，多一点真正值得推进的人。"
    );

    if (!section) {
      return;
    }

    qsa("img", section).forEach(function (img) {
      if (/12,000\+ dates|65%|92%/.test(img.alt || "")) {
        img.style.display = "none";
      }
    });

    photoGroups = qsa("[style*='aspect-ratio']", section);
    sources = [
      ["assets/web/friends-dinner.jpg", "认真见面，比无限刷人更重要"],
      ["assets/web/phone-night.jpg", "不是更多消息，而是更对的人"],
      ["assets/web/hold-hands-night.jpg", "关系推进，比闲聊更重要"],
    ];

    photoGroups.forEach(function (group) {
      var photos = qsa("img", group).filter(function (img) {
        return !/(12,000\+ dates|65%|92%)/.test(img.alt || "");
      });

      photos.forEach(function (img, index) {
        var pair = sources[index % sources.length];
        setImage(img, pair[0], pair[1]);
      });

      ensureBlock(
        group,
        "photo-stats",
        "muse-photo-stats",
        "<div class='muse-photo-stat muse-photo-stat--a'><strong>4 维判断</strong><span>审美 · Persona · 意图 · 认真度</span><em>不是先给很多人，再让你自己筛。</em></div>" +
          "<div class='muse-photo-stat muse-photo-stat--b'><strong>每天 21 个</strong><span>普通匹配持续更新</span><em>减少无效候选和无效聊天。</em></div>" +
          "<div class='muse-photo-stat muse-photo-stat--c'><strong>¥100 / 次</strong><span>高端匹配更认真</span><em>筛掉不想推进的人。</em></div>"
      );
    });
  }

  function updateCapabilities() {
    var section = findSrSection("Your Personalized Matchmaker");
    var items;
    var photoSets;
    var notes;

    ensureTitle(
      section,
      "personalized",
      "核心能力",
      "Muse 不只会推荐，它会记住你的偏好、理解你的表达，再把下一次推荐调得更准。"
    );

    if (!section) {
      return;
    }

    items = qsa(".yourPersonalized-module-scss-module__vcdDvW__item", section);
    photoSets = [
      ["assets/web/phone-night.jpg", "从照片和反馈里学习审美"],
      ["assets/web/hero-city.jpg", "从表达和选择里理解 Persona"],
      ["assets/web/hold-hands-night.jpg", "从聊天目标里识别意图"],
    ];
    notes = [
      "Muse 会从你的偏好、照片和反馈里，慢慢学出你真正会心动的审美方向。",
      "不是只看几个标签，而是理解你在关系里是什么样的人、适合什么样的人。",
      "分清你是想认真恋爱、谨慎了解，还是更高效地推进见面和关系。",
    ];

    setTextList(".yourPersonalized-module-scss-module__vcdDvW__item h3", [
      "审美 Embedding",
      "审美 Embedding",
      "Persona Embedding",
      "Persona Embedding",
      "意图识别",
      "意图识别",
    ]);

    items.forEach(function (item, index) {
      var imgs = qsa("img", item);
      imgs.forEach(function (img) {
        setImage(img, photoSets[index][0], photoSets[index][1]);
      });
      ensureBlock(
        item,
        "note",
        "muse-item-copy",
        "<strong>" + ["审美偏好", "关系画像", "匹配目标"][index] + "</strong> " + notes[index]
      );
    });
  }

  function updateGallery() {
    var sections = qsa("h2.sr-only")
      .filter(function (el) {
        return clean(el.textContent) === "Unforgettable Great Times";
      })
      .map(function (el) {
        return el.parentElement;
      });

    sections.forEach(function (section, index) {
      ensureTitle(
        section,
        "fun-" + index,
        index === 0 ? "聊天辅助 + 持续记忆" : "你值得遇见真正合适的人",
        index === 0
          ? "聊过什么、在意什么、喜欢什么，Muse 会持续记住，让下一次推荐和对话更贴近你。"
          : "如果你已经厌倦了重复刷人和重复自我介绍，这页就是为你做的。"
      );

      ensureBlock(
        section,
        "gallery-caption",
        "muse-gallery-caption",
        index === 0
          ? "<strong>持续记忆、聊天辅助、认真模式</strong> 会跟着你的反馈一起变准，而不是每次都从零开始。"
          : "<strong>少一点重复解释自己，多一点真正想见面的人。</strong>"
      );
    });
  }

  function updateCompare() {
    var section = findSrSection("tired of tinder & hinge? Ditto is for you");
    var headings;
    var labels;
    var items;
    var notes = [
      "先理解你，再给你少而准的候选。每一次打开，都是更值得花时间的人。",
      "先给你很多人，再让你自己筛。花掉大量时间，也未必知道谁真的认真。",
    ];

    ensureTitle(
      section,
      "compare",
      "Muse 和普通交友 App 的区别",
      "<strong>Muse</strong> 先缩小候选人，再把更匹配的人给你；普通交友 App 往往先给很多人，再让你自己筛。"
    );

    headings = qsa("h3", section).filter(function (el) {
      var text = clean(el.textContent);
      return text.indexOf("One Ready-to-go Date Invite") !== -1 || text.indexOf("Endless Swiping") !== -1;
    });

    labels = qsa("span", section).filter(function (el) {
      var text = clean(el.textContent);
      return text === "Ditto" || text === "Other Dating Apps";
    });

    items = qsa(".tiredOfTinder-module-scss-module__bUEahq__item", section);

    if (headings[0]) {
      headings[0].innerHTML = "Muse<br/>每天 21 个高质量推荐";
    }

    if (headings[1]) {
      headings[1].innerHTML = "普通交友 App<br/>刷很多人，也聊很多废话";
    }

    if (labels[0]) {
      labels[0].textContent = "Muse";
    }

    if (labels[1]) {
      labels[1].textContent = "普通交友 App";
    }

    items.forEach(function (item, index) {
      ensureBlock(
        item,
        "compare-note",
        "muse-compare-copy",
        "<strong>" + (index === 0 ? "Less Noise" : "More Noise") + "</strong> " + notes[index]
      );
    });
  }

  function updateSafety() {
    var section = findSrSection("Verified. Private. Safe.");

    ensureTitle(
      section,
      "safe",
      "隐私优先，认真优先",
      "你给 Muse 的偏好、审美和意图信息，只用来提升匹配质量，不拿去公开展示。"
    );

    setTextList(".verifiedPrivateSafe-module-scss-module__GKUbRW__item .text-base", [
      "隐私 #1",
      "隐私 #2",
      "认真 #3",
      "隐私 #1",
      "隐私 #2",
      "认真 #3",
    ]);

    setTextList(".verifiedPrivateSafe-module-scss-module__GKUbRW__item .whitespace-pre-line", [
      "审美与偏好数据\n只给 AI 学习",
      "只有匹配到的人\n才会看到你",
      "双向认真后再推进\n高端匹配",
      "审美与偏好数据\n只给 AI 学习",
      "只有匹配到的人\n才会看到你",
      "双向认真后再推进\n高端匹配",
    ]);

    ensureBlock(
      section,
      "pricing-copy",
      "muse-pricing-copy",
      "<strong>普通匹配免费，高端匹配 ¥100/次。</strong> 价格不是主角，认真度筛选才是主角。"
    );
  }

  function updateFaq() {
    var section = findSrSection("FAQ");
    var faqData = [
      {
        q: "Muse 怎么匹配人？",
        a: ["Muse 会综合审美、性格、价值观和感情意图做多维匹配，不只是按年龄和城市筛选。"],
      },
      {
        q: "为什么比普通交友软件更准？",
        a: ["因为 Muse 不是先把人堆给你，而是先理解你，再把候选人缩到真正值得认识的人。"],
      },
      {
        q: "高端匹配为什么要收费？",
        a: ["双方都付费能筛掉不认真的人，也让匹配结果更有回应率。"],
      },
      {
        q: "前任照片和偏好数据会公开吗？",
        a: ["不会。相关数据只用于 AI 内部学习，不会展示给其他用户。"],
      },
      {
        q: "如果我不喜欢这次匹配怎么办？",
        a: ["你可以直接反馈，Muse 会据此调整后续推荐。"],
      },
      {
        q: "多久能收到推荐？",
        a: ["普通匹配每天都会更新，高端匹配会优先给你更高质量的人选。"],
      },
      {
        q: "聊天会不会很尴尬？",
        a: ["Muse 会提供开场建议和表达辅助，让第一次对话更自然。"],
      },
      {
        q: "Muse 适合谁？",
        a: ["适合不想再无效刷人、想认真认识更合适对象的人。"],
      },
    ];

    ensureTitle(
      section,
      "faq",
      "常见问题",
      "如果你关心匹配逻辑、隐私、价格和认真度，这些问题基本都在这里。"
    );

    qsa(".faqSection-module-scss-module__pl9tla__faqCard article").forEach(function (article, index) {
      var item = faqData[index];
      var question;
      var body;

      if (!item) {
        return;
      }

      question = article.querySelector("button span");
      body = article.querySelector(".overflow-hidden > div");

      if (question) {
        question.textContent = item.q;
      }

      if (body) {
        body.innerHTML = item.a
          .map(function (paragraph) {
            return "<p class='my-2'>" + paragraph + "</p>";
          })
          .join("");
      }
    });
  }

  function updateFooterAndLinks() {
    qsa("span").forEach(function (el) {
      var text = clean(el.textContent);
      if (text === "Date Without Swiping") {
        el.textContent = "认真恋爱";
      }
      if (text === "Date without Swiping") {
        el.textContent = "不靠刷卡";
      }
      if (text === "© Ditto 2025") {
        el.textContent = "© Muse 觅Ta 2026";
      }
    });

    qsa("button").forEach(function (button) {
      var text = clean(button.textContent);
      if (text === "Our Manifesto") {
        button.textContent = "为什么是 Muse";
      }
    });

    qsa("a").forEach(function (link) {
      var text = clean(link.textContent);
      if (text === "Careers") {
        link.textContent = "如何运作";
        link.setAttribute("href", "#how-it-works");
      } else if (text === "Manifesto") {
        link.textContent = "核心能力";
        link.setAttribute("href", "#capabilities");
      } else if (text === "Why is Muse" || text === "为什么是 Muse") {
        link.setAttribute("href", "#compare");
        link.classList.add("muse-footer-button");
      } else if (link.getAttribute("href") === "manifesto.html") {
        link.setAttribute("href", "#compare");
        link.classList.add("muse-footer-button");
      }
    });

    qsa("h3").forEach(function (heading) {
      if (clean(heading.textContent) === "Resources") {
        heading.textContent = "Muse 觅Ta";
      }
    });
  }

  function setSectionIds() {
    [
      ["How it works", "how-it-works"],
      ["Real Dates Delivered", "results"],
      ["Your Personalized Matchmaker", "capabilities"],
      ["tired of tinder & hinge? Ditto is for you", "compare"],
      ["Verified. Private. Safe.", "privacy-faq"],
      ["FAQ", "faq"],
    ].forEach(function (pair) {
      var section = findSrSection(pair[0]);
      if (section) {
        section.id = pair[1];
      }
    });
  }

  function applyMuse() {
    document.documentElement.lang = "zh-CN";
    updateHero();
    updateHowItWorks();
    updateResults();
    updateCapabilities();
    updateGallery();
    updateCompare();
    updateSafety();
    updateFaq();
    updateFooterAndLinks();
    setSectionIds();
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyMuse();
    setTimeout(applyMuse, 250);
    setTimeout(applyMuse, 900);
  });

  window.addEventListener("load", function () {
    applyMuse();
    setTimeout(applyMuse, 400);
  });
})();
