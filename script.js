(function () {
  const intro = document.querySelector("[data-intro]");
  const introKey = "muse_cinematic_intro_seen";

  if (intro) {
    if (localStorage.getItem(introKey)) {
      intro.classList.add("is-hidden");
    } else {
      window.setTimeout(function () {
        intro.classList.add("is-hidden");
        localStorage.setItem(introKey, "true");
      }, 1850);
    }
  }

  const nav = document.querySelector("[data-nav]");
  window.addEventListener("scroll", function () {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }, { passive: true });

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll("[data-reveal]").forEach(function (node) {
    revealObserver.observe(node);
  });

  const parallaxNodes = document.querySelectorAll("[data-parallax]");
  window.addEventListener("scroll", function () {
    const y = window.scrollY;
    parallaxNodes.forEach(function (node) {
      const speed = Number(node.getAttribute("data-parallax")) || 0;
      node.style.transform = "translate3d(0," + y * speed + "px,0)";
    });
  }, { passive: true });

  function setupCanvas(canvas, draw) {
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let raf = 0;
    let time = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function loop() {
      time += 0.012;
      draw(ctx, width, height, time);
      raf = window.requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener("resize", resize);
    loop();

    return function destroy() {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }

  const signalPoints = Array.from({ length: 88 }, function (_, index) {
    return {
      seed: index,
      angle: Math.random() * Math.PI * 2,
      radius: 160 + Math.random() * 420,
      speed: 0.2 + Math.random() * 0.55,
      size: 1 + Math.random() * 2.4
    };
  });

  setupCanvas(document.querySelector("[data-signal-canvas]"), function (ctx, width, height, time) {
    ctx.clearRect(0, 0, width, height);
    const cx = width * 0.58;
    const cy = height * 0.48;
    const scrollFactor = Math.min(1, window.scrollY / Math.max(1, height * 0.7));

    signalPoints.forEach(function (point, index) {
      const orbit = point.radius * (1 - scrollFactor * 0.58);
      const angle = point.angle + time * point.speed;
      const x = cx + Math.cos(angle) * orbit + Math.sin(time + index) * 18;
      const y = cy + Math.sin(angle) * orbit * 0.48 + Math.cos(time * 0.7 + index) * 14;
      const alpha = 0.18 + scrollFactor * 0.46;

      ctx.beginPath();
      ctx.arc(x, y, point.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(105, 185, 255," + alpha + ")";
      ctx.fill();

      if (index % 4 === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(cx + Math.cos(angle + 0.5) * orbit * 0.42, cy + Math.sin(angle + 0.5) * orbit * 0.2);
        ctx.strokeStyle = "rgba(255,255,255," + (0.035 + scrollFactor * 0.05) + ")";
        ctx.stroke();
      }
    });

    ctx.beginPath();
    ctx.arc(cx, cy, 70 + scrollFactor * 22, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,113,227," + (0.18 + scrollFactor * 0.28) + ")";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  const pointer = { x: -9999, y: -9999 };
  window.addEventListener("pointermove", function (event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }, { passive: true });

  const noiseWords = ["意图不清", "只想聊聊", "标签太薄", "已读不回", "节奏不合", "判断太晚", "低意图", "时间成本", "情绪消耗", "随手滑过"];
  const noiseItems = Array.from({ length: 80 }, function (_, index) {
    return {
      word: noiseWords[index % noiseWords.length],
      x: Math.random(),
      y: Math.random(),
      speed: 0.12 + Math.random() * 0.28,
      drift: Math.random() * 80,
      alpha: 0.15 + Math.random() * 0.32
    };
  });

  setupCanvas(document.querySelector("[data-noise-canvas]"), function (ctx, width, height, time) {
    ctx.clearRect(0, 0, width, height);
    ctx.font = "14px Avenir Next, PingFang SC, sans-serif";
    ctx.textBaseline = "middle";

    noiseItems.forEach(function (item, index) {
      let x = ((item.x * width) + Math.sin(time * item.speed + index) * item.drift + time * 16) % (width + 220) - 110;
      let y = item.y * height + Math.cos(time * item.speed + index) * 26;
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        x += (dx / Math.max(dist, 1)) * (150 - dist) * 0.32;
        y += (dy / Math.max(dist, 1)) * (150 - dist) * 0.32;
      }

      ctx.fillStyle = "rgba(255,255,255," + item.alpha + ")";
      ctx.fillText(item.word, x, y);
      ctx.beginPath();
      ctx.arc(x - 12, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,113,227," + (item.alpha * 0.8) + ")";
      ctx.fill();
    });
  });

  setupCanvas(document.querySelector("[data-final-canvas]"), function (ctx, width, height, time) {
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, 90 + i * 74 + Math.sin(time + i) * 8, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255," + (0.06 - i * 0.008) + ")";
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,113,227,0.8)";
    ctx.fill();
  });

  const filterCopy = {
    intent: ["关系意图清晰", "认真了解，不把你放进低意图聊天。", "87%", "intent confidence", "来自关系期待、回复节奏、资料完整度和近期反馈。"],
    persona: ["真实偏好被理解", "审美、价值观和相处方式一起进入判断。", "6", "persona dimensions", "审美、意图、节奏、沟通、价值观和长期可能共同参与排序。"],
    timing: ["节奏更接近", "沟通频率、推进速度和生活安排不再被忽略。", "78%", "rhythm fit", "作息、城市距离、可见面时间和回复节奏会被一起校准。"],
    boundary: ["边界更明确", "系统先理解期待和限制，再决定是否推荐。", "91%", "boundary clarity", "关系推进速度、沟通距离感和隐私偏好会被前置处理。"]
  };

  const filterResult = document.querySelector("[data-filter-result]");
  document.querySelectorAll("[data-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      const key = button.getAttribute("data-filter");
      const copy = filterCopy[key];
      if (!copy || !filterResult) return;

      document.querySelectorAll("[data-filter]").forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });

      filterResult.style.opacity = "0";
      filterResult.style.transform = "translateY(10px)";
      window.setTimeout(function () {
        filterResult.innerHTML =
          "<p>Current signal</p><h3>" + copy[0] + "</h3><span>" + copy[1] + "</span>" +
          '<div class="signal-evidence"><b>' + copy[2] + '</b><em>' + copy[3] + '</em><small>' + copy[4] + '</small></div>';
        filterResult.style.opacity = "1";
        filterResult.style.transform = "translateY(0)";
      }, 160);
    });
  });

  const personaCopy = {
    intent: ["Muse 会先判断对方是否真的想进入认真了解，而不是只把你放进一段低意图聊天。", ["Intent", "87"], ["Noise", "24"], ["Ready", "81"]],
    aesthetic: ["审美不是简单的颜值标签，而是你会被什么气质、表达方式和生活状态吸引。", ["Taste", "76"], ["Signal", "69"], ["Drift", "18"]],
    rhythm: ["生活节奏决定一段关系能否自然发生，包括作息、城市距离和相处频率。", ["Rhythm", "78"], ["Timing", "82"], ["Friction", "31"]],
    communication: ["沟通方式会影响安全感：回应频率、表达直接度、边界感都会被纳入判断。", ["Reply", "83"], ["Boundary", "91"], ["Pace", "77"]],
    values: ["价值观不是口号，而是对关系、家庭、工作和长期选择的真实排序。", ["Values", "72"], ["Family", "68"], ["Choice", "74"]],
    future: ["长期可能性来自多个维度的共同重合，而不是某一个标签的相似。", ["Future", "80"], ["Overlap", "86"], ["Risk", "22"]]
  };

  const personaText = document.querySelector("[data-persona-copy]");
  const personaStats = document.querySelector("[data-persona-stats]");
  document.querySelectorAll("[data-persona]").forEach(function (button) {
    button.addEventListener("click", function () {
      const key = button.getAttribute("data-persona");
      const copy = personaCopy[key] || personaCopy.intent;
      document.querySelectorAll("[data-persona]").forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });
      if (personaText) {
        personaText.style.opacity = "0";
        window.setTimeout(function () {
          personaText.textContent = copy[0];
          personaText.style.opacity = "1";
        }, 140);
      }
      if (personaStats) {
        personaStats.innerHTML = copy.slice(1).map(function (item) {
          return "<div><span>" + item[0] + "</span><strong>" + item[1] + "</strong></div>";
        }).join("");
      }
    });
  });

  const calibrationStates = {
    intent: {
      label: "关系意图",
      width: "82%",
      notes: ["低意图候选权重降低", "稳定沟通权重提升"],
      bubbles: [
        ["user", "我想认真了解，不太想一直停在暧昧聊天。"],
        ["me", "已记录：关系期待更偏稳定推进。"],
        ["me", "下一次推荐会降低低意图候选权重。"]
      ]
    },
    taste: {
      label: "审美偏好",
      width: "74%",
      notes: ["外貌偏好变成气质线索", "相似表达方式权重提升"],
      bubbles: [
        ["user", "我更容易被干净、松弛、表达真诚的人吸引。"],
        ["me", "已更新：审美偏好不只来自照片，也来自表达气质。"],
        ["me", "推荐解释会展示为什么你可能会被对方吸引。"]
      ]
    },
    boundary: {
      label: "沟通边界",
      width: "91%",
      notes: ["过度热情风险降低", "稳定回应权重提升"],
      bubbles: [
        ["user", "我不喜欢过度热情，但希望沟通是稳定的。"],
        ["me", "已记录：需要边界感，也需要持续性。"],
        ["me", "系统会关注对方的沟通节奏是否相容。"]
      ]
    },
    reason: {
      label: "推荐依据",
      width: "86%",
      notes: ["生成可解释推荐原因", "保留用户可反馈入口"],
      bubbles: [
        ["me", "这次推荐不是因为一个标签相似。"],
        ["me", "而是关系意图、沟通节奏和长期期待同时接近。"],
        ["user", "我想先看看为什么匹配。"]
      ]
    }
  };

  const chatFeed = document.querySelector("[data-chat-feed]");
  const modelLabel = document.querySelector("[data-model-label]");
  const modelBar = document.querySelector(".model-state i");
  const modelNotes = document.querySelector("[data-model-notes]");

  function setCalibration(key) {
    const state = calibrationStates[key] || calibrationStates.intent;
    if (modelLabel) modelLabel.textContent = state.label;
    if (modelBar) modelBar.style.setProperty("--w", state.width);
    if (modelNotes) {
      modelNotes.innerHTML = state.notes.map(function (note) {
        return "<li>" + note + "</li>";
      }).join("");
    }
    if (!chatFeed) return;
    chatFeed.innerHTML = "";
    state.bubbles.forEach(function (bubble, index) {
      window.setTimeout(function () {
        const div = document.createElement("div");
        div.className = "bubble " + bubble[0];
        div.textContent = bubble[1];
        chatFeed.appendChild(div);
      }, index * 120);
    });
  }

  document.querySelectorAll("[data-calibration]").forEach(function (button) {
    button.addEventListener("click", function () {
      const key = button.getAttribute("data-calibration");
      document.querySelectorAll("[data-calibration]").forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });
      setCalibration(key);
    });
  });
  setCalibration("intent");

  const costProfiles = {
    app: {
      bars: ["18%", "88%", "82%", "26%"],
      readout: ["低金钱成本", "但判断通常发生在大量聊天之后。"],
      copy: "普通 dating app 的金钱成本低，但时间成本和情绪成本经常被推迟到聊天和见面之后。"
    },
    agency: {
      bars: ["92%", "54%", "58%", "64%"],
      readout: ["高前置门槛", "能筛掉部分噪音，但决策周期和经济压力更重。"],
      copy: "传统相亲会提前筛选一部分信息，但决策周期和经济门槛通常更重。"
    },
    muse: {
      bars: ["26%", "38%", "34%", "84%"],
      readout: ["判断前置", "用轻量门槛和解释型推荐降低综合试错成本。"],
      copy: "Muse 不是最便宜的方式。它试图把判断前置，降低综合试错成本。"
    }
  };

  const costBars = document.querySelectorAll("[data-cost-bars] i");
  const costCopy = document.querySelector("[data-cost-copy]");
  const costReadout = document.querySelector("[data-cost-readout]");
  document.querySelectorAll("[data-cost]").forEach(function (button) {
    button.addEventListener("click", function () {
      const key = button.getAttribute("data-cost");
      const profile = costProfiles[key] || costProfiles.muse;
      document.querySelectorAll("[data-cost]").forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });
      costBars.forEach(function (bar, index) {
        bar.style.setProperty("--w", profile.bars[index]);
      });
      if (costReadout) {
        costReadout.innerHTML = "<strong>" + profile.readout[0] + "</strong><span>" + profile.readout[1] + "</span>";
      }
      if (costCopy) costCopy.textContent = profile.copy;
    });
  });

  const privacyCopy = {
    public: ["Visibility", "别人只看到你选择展示的信息。", "公开资料负责介绍你；私密偏好只参与匹配；算法判断不会变成别人浏览你的标签。", ["其他用户", "基础展示", "不展示深层偏好"]],
    private: ["Private layer", "私密偏好只服务于推荐判断。", "关系期待、参考偏好、边界感和敏感反馈进入匹配系统，但不进入你的公开页面。", ["仅系统使用", "匹配排序", "不对外展示"]],
    model: ["Model layer", "算法可以理解你，但不替你暴露你。", "Muse 产生的是内部判断信号，不是公开标签。别人不会看到系统如何评价你的关系偏好。", ["不可见", "内部判断", "不生成公开标签"]],
    control: ["Control layer", "重要信息应该由你控制。", "你可以调整公开内容、偏好校准和反馈方向。理解越深，控制权越应该清楚。", ["你自己", "修改与撤回", "保留用户控制"]]
  };

  const privacyPanel = document.querySelector("[data-privacy-copy]");
  document.querySelectorAll("[data-privacy]").forEach(function (button) {
    button.addEventListener("click", function () {
      const key = button.getAttribute("data-privacy");
      const copy = privacyCopy[key] || privacyCopy.public;
      document.querySelectorAll("[data-privacy]").forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });
      if (!privacyPanel) return;
      privacyPanel.style.opacity = "0";
      privacyPanel.style.transform = "translateY(8px)";
      window.setTimeout(function () {
        privacyPanel.innerHTML =
          "<span>" + copy[0] + "</span><strong>" + copy[1] + "</strong><p>" + copy[2] + "</p>" +
          "<dl><div><dt>谁能看到</dt><dd>" + copy[3][0] + "</dd></div><div><dt>用于什么</dt><dd>" + copy[3][1] + "</dd></div><div><dt>默认限制</dt><dd>" + copy[3][2] + "</dd></div></dl>";
        privacyPanel.style.opacity = "1";
        privacyPanel.style.transform = "translateY(0)";
      }, 140);
    });
  });
})();
