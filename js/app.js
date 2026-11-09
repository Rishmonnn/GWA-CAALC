var KEY = "gwa-calc-v6";
var SAMPLE = [
  {
    name: "Y2S2 (SY 25-26 SEM II)",
    subs: [
      {
        code: "BES 024",
        name: "Computer Aided Drafting",
        units: 1,
        grade: 1.75,
        on: true,
        auto: true,
        ps: 60,
        per: [
          { n: "P1", g: 77.7, w: 33 },
          { n: "P2", g: 90.24, w: 33 },
          { n: "P3", g: 86.1, w: 34 },
        ],
      },
      {
        code: "CPE 038",
        name: "Software Design",
        units: 4,
        grade: 2.0,
        on: true,
      },
      {
        code: "CPE 039",
        name: "Fundamentals of Electronic Circuits",
        units: 4,
        grade: 1.75,
        on: true,
        auto: true,
        ps: 60,
        per: [
          { n: "P1", g: 92.4, w: 33 },
          { n: "P2", g: 93.04, w: 33 },
          { n: "P3", g: 75.7, w: 34 },
        ],
      },
      {
        code: "ECO 017",
        name: "Engineering Economics",
        units: 3,
        grade: 2.5,
        on: true,
      },
      {
        code: "GEN 010",
        name: "Gender and Society",
        units: 3,
        grade: 1.5,
        on: true,
      },
      {
        code: "MAT 042",
        name: "Discrete Math",
        units: 3,
        grade: 2.0,
        on: true,
      },
      {
        code: "MAT 120",
        name: "Numerical Methods",
        units: 3,
        grade: 1.25,
        on: true,
      },
      {
        code: "PED 031",
        name: "Physical Activities Toward Health and Fitness 2",
        units: 2,
        grade: 1.25,
        on: true,
      },
      {
        code: "SSP 006",
        name: "Student Success Program 2 (Complete, no grade)",
        units: 1,
        grade: 0,
        on: false,
      },
    ],
  },
];
var data;
try {
  data = JSON.parse(localStorage.getItem(KEY));
} catch (e) {}
if (!Array.isArray(data) || !data.length)
  data = JSON.parse(JSON.stringify(SAMPLE));
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {}
}
var TABLES = {
  50: [
    [94.8, 1],
    [89.2, 1.25],
    [83.6, 1.5],
    [78, 1.75],
    [72.4, 2],
    [66.8, 2.25],
    [61.2, 2.5],
    [55.6, 2.75],
    [50, 3],
    [0, 5],
  ],
  60: [
    [96, 1],
    [91.5, 1.25],
    [87, 1.5],
    [82.5, 1.75],
    [78, 2],
    [73.5, 2.25],
    [69, 2.5],
    [64.5, 2.75],
    [60, 3],
    [0, 5],
  ],
  70: [
    [96.4, 1],
    [93.1, 1.25],
    [89.8, 1.5],
    [86.5, 1.75],
    [83.2, 2],
    [79.9, 2.25],
    [76.6, 2.5],
    [73.3, 2.75],
    [70, 3],
    [0, 5],
  ],
};
function pct(s) {
  var t = 0,
    w = 0;
  (s.per || []).forEach(function (p) {
    var g = +p.g,
      x = p.w === undefined ? 1 : +p.w;
    if (g > 0 && x > 0) {
      t += g * x;
      w += x;
    }
  });
  return w ? t / w : null;
}
function toGrade(p, ps) {
  p = Math.round(p * 10) / 10;
  var r = TABLES[ps || 60].find(function (r) {
    return p >= r[0];
  });
  return r ? r[1] : 5;
}
function eff(s) {
  if (s.auto) {
    var p = pct(s);
    return p == null ? 0 : toGrade(p, s.ps);
  }
  return +s.grade;
}
function remark(r) {
  var g = eff(r);
  return g > 0 ? (g > 3 ? "FAILED" : "PASSED") : "–";
}
function badge(r) {
  var t = remark(r);
  return (
    '<span class="bd ' +
    (t === "PASSED" ? "ok" : t === "FAILED" ? "no" : "na") +
    '">' +
    t +
    "</span>"
  );
}
function calc(subs) {
  var u = 0,
    w = 0;
  subs.forEach(function (s) {
    var a = +s.units,
      g = eff(s);
    if (s.on && a > 0 && g > 0) {
      u += a;
      w += a * g;
    }
  });
  return { u: u, g: u ? w / u : null };
}
function detail(r, i, j) {
  var h = '<tr class="det"><td></td><td colspan="6">';
  (r.per || []).forEach(function (p, k) {
    var d = 'data-i="' + i + '" data-j="' + j + '" data-p="' + k + '"';
    h +=
      '<div class="pl"><input class="nm" aria-label="Period name" value="' +
      esc(p.n) +
      '" ' +
      d +
      ' data-f="pn"><input type="number" min="0" max="100" step="0.01" aria-label="Period grade in percent" value="' +
      p.g +
      '" ' +
      d +
      ' data-f="pg"><label>weight <input class="nm" type="number" min="0" step="0.01" aria-label="Weight" value="' +
      (+(p.w === undefined ? 1 : p.w)).toFixed(2) +
      '" ' +
      d +
      ' data-f="pw"></label></div>';
  });
  var d0 = 'data-i="' + i + '" data-j="' + j + '"';
  h +=
    '<div class="pl"><label>Passing score <select style="width:auto" ' +
    d0 +
    ' data-f="ps" aria-label="Passing score">' +
    [50, 60, 70]
      .map(function (v) {
        return (
          '<option value="' +
          v +
          '"' +
          ((+r.ps || 60) === v ? " selected" : "") +
          ">PS-" +
          v +
          "</option>"
        );
      })
      .join("") +
    '</select></label><label><input type="checkbox" style="width:auto" ' +
    (r.auto ? "checked" : "") +
    " " +
    d0 +
    ' data-f="auto"> Use periods for the final grade</label></div><div class="sub" id="sum-' +
    i +
    "-" +
    j +
    '"></div></td></tr>';
  return h;
}
function f(x) {
  return x == null ? "–" : x.toFixed(4).replace(/0{1,2}$/, "");
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}
function render() {
  var h = "";
  data.forEach(function (s, i) {
    var c = calc(s.subs);
    h +=
      '<section class="sem"><div class="semh"><input aria-label="Semester name" value="' +
      esc(s.name) +
      '" data-i="' +
      i +
      '" data-f="sem"><span class="g">GWA ' +
      f(c.g) +
      '</span><button class="x" data-del-sem="' +
      i +
      '" aria-label="Remove semester">Remove</button></div><div class="wrap"><table><thead><tr><th>Count</th><th>Code</th><th>Subject</th><th>Units</th><th>Grade</th><th>Remarks</th><th></th></tr></thead><tbody>';
    s.subs.forEach(function (r, j) {
      var d = 'data-i="' + i + '" data-j="' + j + '"';
      h +=
        '<tr><td class="c"><input type="checkbox" aria-label="Include in GWA" ' +
        (r.on ? "checked" : "") +
        " " +
        d +
        ' data-f="on"></td>' +
        '<td class="n"><input aria-label="Subject code" value="' +
        esc(r.code) +
        '" ' +
        d +
        ' data-f="code"></td>' +
        '<td><input aria-label="Subject name" value="' +
        esc(r.name) +
        '" ' +
        d +
        ' data-f="name"></td>' +
        '<td class="n"><input aria-label="Units" type="number" min="0" step="0.5" value="' +
        r.units +
        '" ' +
        d +
        ' data-f="units"></td>' +
        '<td class="n"><input id="gr-' +
        i +
        "-" +
        j +
        '" aria-label="Grade" type="number" min="1" max="5" step="0.25" value="' +
        eff(r) +
        '" ' +
        d +
        ' data-f="grade" ' +
        (r.auto
          ? 'title="Calculated from periods. Type a grade to override." '
          : "") +
        (eff(r) > 3 ? 'class="fail"' : "") +
        "></td>" +
        '<td id="rm-' +
        i +
        "-" +
        j +
        '" style="white-space:nowrap">' +
        badge(r) +
        "</td>" +
        '<td style="width:120px;white-space:nowrap;text-align:right"><button class="sm" ' +
        d +
        ' data-tog="1" aria-expanded="' +
        !!r.open +
        '">Periods</button><button class="x" ' +
        d +
        ' data-del="1" aria-label="Remove subject">✕</button></td></tr>' +
        (r.open ? detail(r, i, j) : "");
    });
    h +=
      '</tbody></table></div><div class="row"><button data-add="' +
      i +
      '">Add subject</button></div></section>';
  });
  document.getElementById("sems").innerHTML = h;
  totals();
}
function totals() {
  var all = [];
  data.forEach(function (s) {
    all = all.concat(s.subs);
  });
  var c = calc(all);
  document.getElementById("gwa").textContent =
    c.g == null ? "–" : c.g.toFixed(2);
  document.getElementById("exact").textContent =
    c.g == null ? "" : "Exact: " + c.g.toFixed(4);
  var ms = document.getElementById("msg");
  drawChart(c.g);
  if (c.g == null) {
    ms.textContent = "Add a grade to get started.";
  } else {
    ms.textContent =
      c.g <= 1.25
        ? "Outstanding work."
        : c.g <= 1.75
          ? "Great work. Keep it up."
          : c.g <= 2.5
            ? "Solid standing."
            : c.g <= 3
              ? "Passing. You can still pull it up."
              : "Below passing. Time to plan a comeback.";
  }
  document.getElementById("units").textContent = c.u;
  document.getElementById("subs").textContent = all.filter(function (s) {
    return s.on;
  }).length;
  document.getElementById("fails").textContent = all.filter(function (s) {
    return s.on && eff(s) > 3;
  }).length;
  data.forEach(function (s, i) {
    s.subs.forEach(function (r, j) {
      var e = document.getElementById("sum-" + i + "-" + j);
      if (e) {
        var a = pct(r);
        e.textContent =
          a == null
            ? "Enter at least one period grade."
            : "Weighted average " +
              a.toFixed(2) +
              "% = grade " +
              toGrade(a, r.ps).toFixed(2) +
              (r.auto
                ? ""
                : " (not used: the final grade is entered manually)");
      }
      var g = document.getElementById("gr-" + i + "-" + j);
      if (g && r.auto) g.value = eff(r);
      var m = document.getElementById("rm-" + i + "-" + j);
      if (m) m.innerHTML = badge(r);
    });
  });
  document.querySelectorAll(".sem").forEach(function (el, i) {
    el.querySelector(".g").textContent = "GWA " + f(calc(data[i].subs).g);
  });
}
var root = document.getElementById("sems");
root.addEventListener("input", function (e) {
  var t = e.target,
    i = t.dataset.i,
    fl = t.dataset.f;
  if (i == null || !fl) return;
  if (fl === "sem") {
    data[i].name = t.value;
  } else {
    var r = data[i].subs[t.dataset.j];
    if (t.dataset.p != null) {
      var key = { pn: "n", pg: "g", pw: "w" }[fl];
      r.per[t.dataset.p][key] =
        fl === "pn" ? t.value : parseFloat(t.value) || 0;
    } else if (fl === "auto") {
      r.auto = t.checked;
      save();
      render();
      commit();
      return;
    } else {
      if (fl === "grade" && r.auto) {
        r.auto = false;
        var cb = document.querySelector(
          'input[data-f="auto"][data-i="' +
            i +
            '"][data-j="' +
            t.dataset.j +
            '"]',
        );
        if (cb) cb.checked = false;
      }
      r[fl] =
        fl === "on"
          ? t.checked
          : fl === "units" || fl === "grade"
            ? parseFloat(t.value) || 0
            : t.value;
    }
  }
  save();
  totals();
});
root.addEventListener("click", function (e) {
  var t = e.target.closest("button");
  if (!t) return;
  if (t.dataset.add != null) {
    data[t.dataset.add].subs.push({
      code: "",
      name: "",
      units: 3,
      grade: 1.75,
      on: true,
    });
  } else if (t.dataset.del) {
    data[t.dataset.i].subs.splice(t.dataset.j, 1);
  } else if (t.dataset.tog) {
    var r = data[t.dataset.i].subs[t.dataset.j];
    r.open = !r.open;
    if (r.open) {
      r.per = r.per || [];
      while (r.per.length < 3)
        r.per.push({
          n: "P" + (r.per.length + 1),
          g: 0,
          w: [33, 33, 34][r.per.length],
        });
    }
  } else if (t.dataset.padd) {
    var q = data[t.dataset.i].subs[t.dataset.j];
    q.per = q.per || [];
    q.per.push({ n: "P" + (q.per.length + 1), g: 0, w: 1 });
  } else if (t.dataset.pdel) {
    data[t.dataset.i].subs[t.dataset.j].per.splice(t.dataset.p, 1);
  } else if (t.dataset.delSem != null) {
    data.splice(t.dataset.delSem, 1);
  } else return;
  save();
  render();
  if (t.dataset.tog) cur = JSON.stringify(data);
  else commit();
});
document.getElementById("reset").onclick = function () {
  data = [{ name: "New semester", subs: [] }];
  save();
  render();
  commit();
};
(function () {
  var cv = document.getElementById("fx"),
    ctx = cv.getContext("2d"),
    hero = cv.parentNode,
    W = 0,
    H = 0,
    ps = [],
    on = false,
    reduce =
      window.matchMedia &&
      matchMedia("(prefers-reduced-motion: reduce)").matches,
    V = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ],
    E = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ],
    C = ["16,151,222", "252,120,77", "255,255,255"];
  function size() {
    var r = hero.getBoundingClientRect(),
      d = window.devicePixelRatio || 1;
    W = r.width;
    H = r.height;
    cv.width = W * d;
    cv.height = H * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  function mk() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      s: 5 + Math.random() * 14,
      ax: Math.random() * 6,
      ay: Math.random() * 6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.1 - Math.random() * 0.3,
      rx: (Math.random() - 0.5) * 0.02,
      ry: (Math.random() - 0.5) * 0.02,
      c: C[Math.floor(Math.random() * 3)],
      a: 0.25 + Math.random() * 0.4,
    };
  }
  function init() {
    size();
    if (!ps.length) {
      var n = Math.max(10, Math.min(26, Math.round(W / 45)));
      for (var i = 0; i < n; i++) ps.push(mk());
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ps.forEach(function (p) {
      if (!reduce) {
        p.ax += p.rx;
        p.ay += p.ry;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -30) p.y = H + 30;
        if (p.x < -30) p.x = W + 30;
        if (p.x > W + 30) p.x = -30;
      }
      var cx = Math.cos(p.ax),
        sx = Math.sin(p.ax),
        cy = Math.cos(p.ay),
        sy = Math.sin(p.ay);
      var q = V.map(function (v) {
        var y = v[1] * cx - v[2] * sx,
          z = v[1] * sx + v[2] * cx,
          x = v[0] * cy + z * sy;
        return [p.x + x * p.s, p.y + y * p.s];
      });
      ctx.strokeStyle = "rgba(" + p.c + "," + p.a + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      E.forEach(function (e) {
        ctx.moveTo(q[e[0]][0], q[e[0]][1]);
        ctx.lineTo(q[e[1]][0], q[e[1]][1]);
      });
      ctx.stroke();
    });
  }
  function loop() {
    if (!on) return;
    draw();
    requestAnimationFrame(loop);
  }
  function start() {
    if (!on && !reduce) {
      on = true;
      loop();
    }
  }
  init();
  draw();
  if (window.ResizeObserver)
    new ResizeObserver(function () {
      size();
      if (reduce) draw();
    }).observe(hero);
  if ("IntersectionObserver" in window)
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) start();
      else on = false;
    }).observe(hero);
  else start();
})();
function drawChart(g) {
  var el = document.getElementById("chart");
  if (!el) return;
  var pts = [];
  data.forEach(function (s) {
    s.subs.forEach(function (r) {
      var v = eff(r);
      if (r.on && v > 0) pts.push({ c: r.code || "-", v: v });
    });
  });
  var W = el.clientWidth || 600,
    H = 170,
    L = 40,
    R = 14,
    T = 22,
    B = 26,
    n = pts.length;
  if (!n) {
    el.innerHTML =
      '<div class="sub" style="padding:60px 0;text-align:center">Add grades to see your chart.</div>';
    return;
  }
  function X(i) {
    return n < 2 ? L + (W - L - R) / 2 : L + (i * (W - L - R)) / (n - 1);
  }
  function Y(v) {
    return T + ((Math.min(Math.max(v, 1), 3) - 1) / 2) * (H - T - B);
  }
  var s =
    '<svg width="' +
    W +
    '" height="' +
    H +
    '" viewBox="0 0 ' +
    W +
    " " +
    H +
    '">';
  [1, 2, 3].forEach(function (t) {
    var y = Y(t);
    s +=
      '<line x1="' +
      L +
      '" x2="' +
      (W - R) +
      '" y1="' +
      y +
      '" y2="' +
      y +
      '" stroke="rgba(255,255,255,.14)"' +
      (t === 3 ? ' stroke-dasharray="4 4"' : "") +
      '/><text x="' +
      (L - 6) +
      '" y="' +
      (y + 4) +
      '" text-anchor="end" font-size="11" fill="#9fb3bf">' +
      t.toFixed(2) +
      "</text>";
  });
  if (g != null) {
    var gy = Y(g);
    s +=
      '<line x1="' +
      L +
      '" x2="' +
      (W - R) +
      '" y1="' +
      gy +
      '" y2="' +
      gy +
      '" stroke="#FC784D" stroke-width="1.5" stroke-dasharray="2 5"/><text x="' +
      (W - R) +
      '" y="' +
      (gy + 14) +
      '" text-anchor="end" font-size="11" font-weight="700" fill="#FC784D">GWA ' +
      g.toFixed(2) +
      "</text>";
  }
  if (n > 1)
    s +=
      '<path d="' +
      pts
        .map(function (p, i) {
          return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(p.v).toFixed(1);
        })
        .join(" ") +
      '" fill="none" stroke="#1097DE" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
  var step = Math.ceil(n / Math.max(1, Math.floor((W - L - R) / 58)));
  pts.forEach(function (p, i) {
    var x = X(i),
      y = Y(p.v),
      bad = p.v > 3;
    s +=
      '<circle cx="' +
      x +
      '" cy="' +
      y +
      '" r="5" fill="' +
      (bad ? "#FC784D" : "#02070A") +
      '" stroke="' +
      (bad ? "#fff" : "#1097DE") +
      '" stroke-width="2.5"><title>' +
      esc(p.c) +
      ": " +
      p.v.toFixed(2) +
      "</title></circle>";
    if (n <= 10)
      s +=
        '<text x="' +
        x +
        '" y="' +
        (y - 10) +
        '" text-anchor="middle" font-size="10" font-weight="600" fill="#fff">' +
        p.v.toFixed(2) +
        "</text>";
    if (i % step === 0)
      s +=
        '<text x="' +
        x +
        '" y="' +
        (H - 8) +
        '" text-anchor="middle" font-size="10" fill="#9fb3bf">' +
        esc(p.c) +
        "</text>";
  });
  el.innerHTML = s + "</svg>";
}
window.addEventListener("resize", function () {
  totals();
});
var rootEl = document.documentElement,
  tb = document.getElementById("theme");
function curTheme() {
  return (
    rootEl.getAttribute("data-theme") ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
}
function paintTheme() {
  var d = curTheme() === "dark";
  tb.textContent = d ? "☀ Light" : "☾ Dark";
  tb.setAttribute(
    "aria-label",
    d ? "Switch to light mode" : "Switch to dark mode",
  );
}
try {
  var th = localStorage.getItem("gwa-theme");
  if (th === "dark" || th === "light") rootEl.setAttribute("data-theme", th);
} catch (e) {}
function glitch(color, mid, end) {
  var cv = document.getElementById("gl"),
    x = cv.getContext("2d"),
    w = innerWidth,
    h = innerHeight,
    d = window.devicePixelRatio || 1;
  cv.width = w * d;
  cv.height = h * d;
  x.setTransform(d, 0, 0, d, 0, 0);
  cv.style.display = "block";
  var t0 = performance.now(),
    A = 520,
    H = 90,
    B = 520,
    swapped = false;
  function frame(p) {
    x.clearRect(0, 0, w, h);
    if (p >= 1) {
      x.fillStyle = color;
      x.fillRect(0, 0, w, h);
      return;
    }
    var y = 0;
    while (y < h) {
      var bh = 4 + Math.random() * 48;
      if (Math.random() < p) {
        var bw = Math.random() < 0.65 ? w : w * (0.3 + Math.random() * 0.7),
          bx = bw === w ? 0 : Math.random() * (w - bw),
          j = (Math.random() - 0.5) * 70;
        x.fillStyle = "rgba(16,151,222,.9)";
        x.fillRect(bx + j - 7, y, bw, bh);
        x.fillStyle = "rgba(252,120,77,.9)";
        x.fillRect(bx + j + 7, y, bw, bh);
        x.fillStyle = color;
        x.fillRect(bx + j, y, bw, bh);
      }
      y += bh;
    }
  }
  function tick(now) {
    var e = now - t0;
    if (e < A) frame(Math.pow(e / A, 1.4));
    else if (e < A + H) {
      if (!swapped) {
        swapped = true;
        mid();
      }
      frame(1);
    } else if (e < A + H + B) frame(Math.pow(1 - (e - A - H) / B, 1.4));
    else {
      x.clearRect(0, 0, w, h);
      cv.style.display = "none";
      end();
      return;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
var busy = false;
tb.onclick = function () {
  if (busy) return;
  var n = curTheme() === "dark" ? "light" : "dark";
  function apply() {
    rootEl.setAttribute("data-theme", n);
    try {
      localStorage.setItem("gwa-theme", n);
    } catch (e) {}
    paintTheme();
  }
  if (
    window.matchMedia &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    apply();
    return;
  }
  busy = true;
  glitch(n === "dark" ? "#000" : "#fff", apply, function () {
    busy = false;
  });
};
var undoS = [],
  redoS = [],
  cur = JSON.stringify(data),
  ub = document.getElementById("undo"),
  rb = document.getElementById("redo");
function paintHist() {
  ub.disabled = !undoS.length;
  rb.disabled = !redoS.length;
}
function commit() {
  var s = JSON.stringify(data);
  if (s === cur) return;
  undoS.push(cur);
  if (undoS.length > 100) undoS.shift();
  redoS = [];
  cur = s;
  paintHist();
}
function restore(s) {
  data = JSON.parse(s);
  cur = s;
  save();
  render();
  paintHist();
}
function undo() {
  if (!undoS.length) return;
  redoS.push(cur);
  restore(undoS.pop());
}
function redo() {
  if (!redoS.length) return;
  undoS.push(cur);
  restore(redoS.pop());
}
ub.onclick = undo;
rb.onclick = redo;
paintHist();
root.addEventListener("change", commit);
document.addEventListener("keydown", function (e) {
  var k = e.key.toLowerCase();
  if (!(e.ctrlKey || e.metaKey) || (k !== "z" && k !== "y")) return;
  var a = document.activeElement;
  if (a && /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName)) return;
  e.preventDefault();
  if (k === "y" || e.shiftKey) redo();
  else undo();
});
var dlg = document.getElementById("scaleDlg");
function buildScale() {
  var h = "";
  [50, 60, 70].forEach(function (ps) {
    var t = TABLES[ps];
    h +=
      '<div><div class="ptitle">PS-' +
      ps +
      "</div><table><thead><tr><th>Percentage</th><th>Grade</th></tr></thead><tbody>";
    t.forEach(function (r, k) {
      var hi = k === 0 ? "100" : (t[k - 1][0] - 0.1).toFixed(1);
      h +=
        "<tr><td>" +
        r[0].toFixed(1) +
        " &ndash; " +
        hi +
        "</td><td>" +
        r[1].toFixed(2) +
        (r[1] === 3
          ? ' <span class="sub">passing</span>'
          : r[1] === 5
            ? ' <span class="sub">failing</span>'
            : "") +
        "</td></tr>";
    });
    h += "</tbody></table></div>";
  });
  document.getElementById("scaleBody").innerHTML = h;
}
document.getElementById("scaleBtn").onclick = function () {
  buildScale();
  if (dlg.showModal) dlg.showModal();
  else dlg.setAttribute("open", "");
};
document.getElementById("scaleClose").onclick = function () {
  dlg.close();
};
dlg.addEventListener("click", function (e) {
  if (e.target === dlg) dlg.close();
});
var INFOKEY = "gwa-student-v1",
  IF = ["sname", "sno", "program", "year"],
  expDlg = document.getElementById("expDlg"),
  expForm = document.getElementById("expForm");
function loadInfo() {
  var o = {};
  try {
    o = JSON.parse(localStorage.getItem(INFOKEY)) || {};
  } catch (e) {}
  return o;
}
function buildReport(o) {
  var all = [];
  data.forEach(function (s) {
    all = all.concat(s.subs);
  });
  var c = calc(all);
  function row(l, v) {
    return v ? "<div><b>" + l + ":</b> " + esc(v) + "</div>" : "";
  }
  var h =
    '<div class="rh"><h2>Grade Report</h2><div class="dt">Date: ' +
    new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    '</div></div><div class="info">' +
    row("Student name", o.sname) +
    row("Student no.", o.sno) +
    row("Program", o.program) +
    row("Year level", o.year) +
    "</div>";
  data.forEach(function (s) {
    var sc = calc(s.subs);
    h +=
      '<div class="semt"><span>' +
      esc(s.name) +
      '</span></div><table><thead><tr><th>Code</th><th>Subject</th><th class="r">Units</th><th class="r">Grade</th><th>Remarks</th></tr></thead><tbody>';
    s.subs.forEach(function (r) {
      var g = eff(r),
        pg = (r.per || [])
          .filter(function (q) {
            return +q.g > 0;
          })
          .map(function (q) {
            var m = /^P(\d+)$/i.exec(String(q.n).trim());
            return (
              "<td>" +
              (m ? "Period " + m[1] : esc(q.n)) +
              ": <b>" +
              +q.g +
              "</b></td>"
            );
          })
          .join("");
      h +=
        "<tr><td>" +
        esc(r.code) +
        "</td><td>" +
        esc(r.name) +
        (pg
          ? '<table class="pgt"><tbody><tr>' + pg + "</tr></tbody></table>"
          : "") +
        '</td><td class="r">' +
        (+r.units || 0) +
        '</td><td class="r">' +
        (g > 0 ? g.toFixed(2) : "–") +
        "</td><td>" +
        (r.on ? remark(r) : "Not counted") +
        "</td></tr>";
    });
    h +=
      '</tbody></table><div class="ssum">Units counted: ' +
      sc.u +
      " &nbsp;|&nbsp; Semester GWA: " +
      (sc.g == null ? "–" : sc.g.toFixed(4)) +
      "</div>";
  });
  h +=
    '<div class="sum"><span>Cumulative GWA</span><span>' +
    (c.g == null ? "–" : c.g.toFixed(2) + " (exact " + c.g.toFixed(4) + ")") +
    " &nbsp;|&nbsp; " +
    c.u +
    " units</span></div>";
  h +=
    '<div class="fine">GWA = sum of (units × grade) ÷ sum of units. 1.00 is the highest grade, 3.00 is passing, 5.00 is failed. Self-computed, unofficial copy.</div>';
  h +=
    '<div class="gd">GWADATA[' +
    btoa(
      unescape(
        encodeURIComponent(JSON.stringify({ v: 1, student: o, data: data })),
      ),
    ) +
    "]GWADATA</div>";
  var sp = '<tr><td><div class="sp"></div></td></tr>';
  document.getElementById("rpt").innerHTML =
    '<table class="pw"><thead>' +
    sp +
    "</thead><tfoot>" +
    sp +
    "</tfoot><tbody><tr><td>" +
    h +
    "</td></tr></tbody></table>";
}
document.getElementById("exportBtn").onclick = function () {
  var o = loadInfo();
  IF.forEach(function (k) {
    expForm.elements[k].value = o[k] || "";
  });
  if (expDlg.showModal) expDlg.showModal();
  else expDlg.setAttribute("open", "");
  expForm.elements.sname.focus();
};
document.getElementById("expCancel").onclick = function () {
  expDlg.close();
};
expForm.onsubmit = function (e) {
  e.preventDefault();
  var o = {};
  IF.forEach(function (k) {
    o[k] = expForm.elements[k].value.trim();
  });
  try {
    localStorage.setItem(INFOKEY, JSON.stringify(o));
  } catch (x) {}
  expDlg.close();
  buildReport(o);
  document.title = "Grade Report - " + o.sname;
  setTimeout(function () {
    window.print();
  }, 80);
};
window.addEventListener("afterprint", function () {
  document.title = "GWA Calculator";
});
var pdfReady = null,
  importBtn = document.getElementById("importBtn"),
  pdfIn = document.getElementById("pdfIn");
function loadScript(src) {
  return new Promise(function (ok, no) {
    var t = document.createElement("script");
    t.src = src;
    t.onload = ok;
    t.onerror = function () {
      no(new Error("load"));
    };
    document.head.appendChild(t);
  });
}
function pdfLib() {
  if (!pdfReady) {
    var B = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
    pdfReady = loadScript(B + "pdf.min.js")
      .then(function () {
        pdfjsLib.GlobalWorkerOptions.workerSrc = B + "pdf.worker.min.js";
        return loadScript(B + "pdf.worker.min.js");
      })
      .catch(function (e) {
        pdfReady = null;
        throw e;
      });
  }
  return pdfReady;
}
function pdfRead(buf) {
  return pdfLib()
    .then(function () {
      return pdfjsLib.getDocument({ data: buf }).promise;
    })
    .then(function (doc) {
      var ps = [];
      for (var i = 1; i <= doc.numPages; i++)
        ps.push(
          doc
            .getPage(i)
            .then(function (pg) {
              return pg.getTextContent();
            })
            .then(function (tc) {
              return tc.items
                .filter(function (it) {
                  return it.str && it.str.trim();
                })
                .map(function (it) {
                  return {
                    s: it.str,
                    x: it.transform[4],
                    r: it.transform[4] + it.width,
                    y: it.transform[5],
                  };
                });
            }),
        );
      return Promise.all(ps);
    });
}
function parseVisible(pages) {
  var L = [],
    sems = [],
    H = null,
    inT = false,
    cur = null,
    PR = /(?:Period\s*|P)(\d+)\s*:\s*(\d+(?:\.\d+)?)/g;
  pages.forEach(function (its) {
    var c = null;
    its
      .slice()
      .sort(function (p, q) {
        return q.y - p.y || p.x - q.x;
      })
      .forEach(function (it) {
        if (c && Math.abs(c.y - it.y) <= 2.5) c.it.push(it);
        else {
          c = { y: it.y, it: [it] };
          L.push(c);
        }
      });
  });
  L.forEach(function (l) {
    l.it.sort(function (p, q) {
      return p.x - q.x;
    });
    l.t = l.it
      .map(function (i) {
        return i.s.trim();
      })
      .join(" ");
  });
  function fin(sem) {
    var ext = sem.A.map(function () {
      return [];
    });
    sem.O.forEach(function (l) {
      var b = 0,
        d = 1e9;
      sem.A.forEach(function (a, i) {
        var e = Math.abs(a.y - l.y);
        if (e < d) {
          d = e;
          b = i;
        }
      });
      if (sem.A.length) ext[b].push(l);
    });
    sem.subs = sem.A.map(function (a, k) {
      var o = { code: "", name: "", units: 0, grade: 0, on: true },
        nm = [],
        rm = "",
        pt = "";
      function pick(l) {
        l.it.forEach(function (i) {
          var t = i.s.trim();
          if (i.x >= H.rm - 2) rm += (rm ? " " : "") + t;
          else if (/^[\d.]+$/.test(t) && Math.abs(i.r - H.ur) <= 14)
            o.units = parseFloat(t);
          else if (
            (/^[\d.]+$/.test(t) || t === "–") &&
            Math.abs(i.r - H.gr) <= 14
          )
            o.grade = parseFloat(t) || 0;
          else if (i.x < H.s - 2) o.code += (o.code ? " " : "") + t;
          else if (i.r < H.u - 1) nm.push({ y: l.y, x: i.x, s: t });
          else pt += " " + t;
        });
      }
      pick(a);
      ext[k].forEach(function (l) {
        if (PR.test(l.t)) {
          pt += " " + l.t;
          PR.lastIndex = 0;
        } else {
          PR.lastIndex = 0;
          pick(l);
        }
      });
      o.name = nm
        .sort(function (p, q) {
          return q.y - p.y || p.x - q.x;
        })
        .map(function (n) {
          return n.s;
        })
        .join(" ");
      o.on = rm.indexOf("Not counted") < 0;
      var ms = [],
        m;
      PR.lastIndex = 0;
      while ((m = PR.exec(pt))) ms.push(m);
      PR.lastIndex = 0;
      if (ms.length) {
        o.ps = 60;
        o.per = ms.map(function (m, i, z) {
          return {
            n: "P" + m[1],
            g: parseFloat(m[2]),
            w: z.length === 3 ? [33, 33, 34][i] : Math.round(100 / z.length),
          };
        });
      }
      return o;
    });
  }
  L.forEach(function (l, k) {
    var ss = l.it.map(function (i) {
      return i.s.trim();
    });
    if (
      ss.indexOf("Code") > -1 &&
      ss.indexOf("Subject") > -1 &&
      ss.indexOf("Remarks") > -1
    ) {
      if (inT) return;
      var g = function (n) {
        return l.it[ss.indexOf(n)];
      };
      H = {
        s: g("Subject").x,
        u: g("Units").x,
        ur: g("Units").r,
        gr: g("Grade").r,
        rm: g("Remarks").x,
      };
      cur = { name: L[k - 1] ? L[k - 1].t : "", A: [], O: [], subs: [] };
      sems.push(cur);
      inT = true;
      return;
    }
    if (!inT) return;
    if (/Units counted/.test(l.t)) {
      fin(cur);
      inT = false;
      return;
    }
    (l.it.some(function (i) {
      return /^[\d.]+$/.test(i.s.trim()) && Math.abs(i.r - H.ur) <= 14;
    })
      ? cur.A
      : cur.O
    ).push(l);
  });
  if (inT) fin(cur);
  var flat = [].concat.apply([], pages),
    st = {};
  [
    ["Student name:", "sname"],
    ["Student no.:", "sno"],
    ["Program:", "program"],
    ["Year level:", "year"],
  ].forEach(function (p) {
    for (var i = 0; i < flat.length; i++) {
      var t = flat[i].s.trim();
      if (t.indexOf(p[0]) === 0) {
        var v = t.slice(p[0].length).trim();
        if (!v && flat[i + 1]) {
          v = flat[i + 1].s.trim();
          if (/:/.test(v)) v = "";
        }
        st[p[1]] = v;
        break;
      }
    }
  });
  return {
    vis: true,
    student: st,
    data: sems.map(function (x) {
      return { name: x.name, subs: x.subs };
    }),
  };
}
function cleanData(d) {
  return d.map(function (s) {
    return {
      name: String(s.name || ""),
      subs: (Array.isArray(s.subs) ? s.subs : []).map(function (r) {
        var o = {
          code: String(r.code || ""),
          name: String(r.name || ""),
          units: +r.units || 0,
          grade: +r.grade || 0,
          on: !!r.on,
        };
        if (r.auto) o.auto = true;
        if ([50, 60, 70].indexOf(+r.ps) > -1) o.ps = +r.ps;
        if (Array.isArray(r.per))
          o.per = r.per.map(function (q) {
            return {
              n: String(q.n || ""),
              g: +q.g || 0,
              w: q.w === undefined ? 1 : +q.w || 0,
            };
          });
        return o;
      }),
    };
  });
}
importBtn.onclick = function () {
  pdfIn.click();
};
pdfIn.onchange = function () {
  var f = pdfIn.files[0];
  pdfIn.value = "";
  if (!f) return;
  importBtn.disabled = true;
  importBtn.textContent = "Reading…";
  f.arrayBuffer()
    .then(pdfRead)
    .then(function (pages) {
      if (
        !pages.some(function (p) {
          return p.length;
        })
      )
        throw new Error("notext");
      var t = pages
          .map(function (p) {
            return p
              .map(function (i) {
                return i.s;
              })
              .join("");
          })
          .join(""),
        m = /GWADATA\[([^\]]*)\]GWADATA/.exec(t),
        o = null;
      if (m) {
        try {
          o = JSON.parse(
            decodeURIComponent(
              escape(atob(m[1].replace(/[^A-Za-z0-9+\/=]/g, ""))),
            ),
          );
        } catch (x) {}
      }
      if (!o || !Array.isArray(o.data) || !o.data.length)
        o = parseVisible(pages);
      if (
        !o ||
        !o.data.length ||
        !o.data.some(function (q) {
          return q.subs.length;
        })
      )
        throw new Error("nodata");
      return o;
    })
    .then(function (o) {
      var d = cleanData(o.data),
        n = d.reduce(function (a, s) {
          return a + s.subs.length;
        }, 0);
      if (
        confirm(
          "Replace the current grades with the data in this PDF (" +
            d.length +
            " semester" +
            (d.length > 1 ? "s" : "") +
            ", " +
            n +
            " subjects)? " +
            (o.vis
              ? "Period weights are not stored in this PDF, so the grades are kept as shown. "
              : "") +
            "You can undo this.",
        )
      ) {
        data = d;
        save();
        render();
        commit();
        if (o.student) {
          try {
            localStorage.setItem(INFOKEY, JSON.stringify(o.student));
          } catch (x) {}
        }
      }
    })
    .catch(function (e) {
      alert(
        e.message === "notext"
          ? "This PDF has no readable text. It was probably saved with “Microsoft Print to PDF”, which turns the page into a picture. Export again and choose “Save as PDF” as the destination in the print window."
          : e.message === "nodata"
            ? "This PDF doesn’t look like a report exported from this calculator."
            : "Could not read the PDF. The PDF reader loads online, so check your internet connection and try again.",
      );
    })
    .then(function () {
      importBtn.disabled = false;
      importBtn.textContent = "Import PDF";
    });
};
paintTheme();
render();
