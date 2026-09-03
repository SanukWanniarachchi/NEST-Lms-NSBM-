const STORAGE_KEY = "nest-activity-lab-v1";
const THEME_KEY = "nest-activity-lab-theme";

const activities = [
  { id: "quiz", title: "Knowledge Quiz", type: "Quiz", course: "Cybersecurity", image: "../../public/images/courses/cybersecurity-foundations.webp", description: "Five randomized questions with instant feedback, explanations, scoring, review, and retry." },
  { id: "scenario", title: "Scenario Challenge", type: "Decisions", course: "Cybersecurity", image: "../../public/images/courses/cybersecurity-foundations.webp", description: "Choose the safest response to realistic student security situations and see each consequence." },
  { id: "matching", title: "Match and Sort", type: "Puzzle", course: "Networking", image: "../../public/images/courses/networking-essentials.webp", description: "Match protocols to their purposes, then arrange the seven OSI layers in order." },
  { id: "diagram", title: "Network Explorer", type: "Interactive diagram", course: "Networking", image: "../../public/images/courses/networking-essentials.webp", description: "Inspect a network map and select the component that answers each infrastructure challenge." },
  { id: "phishing", title: "Phishing Investigator", type: "Identification", course: "Cybersecurity", image: "../../public/images/courses/cybersecurity-foundations.webp", description: "Find five warning signs in a simulated email, with an optional and accessible timer." },
  { id: "branching", title: "Incident Commander", type: "Simulation", course: "Cybersecurity", image: "../../public/images/illustrations/campus-hero.webp", description: "Manage a campus cyber incident through four decisions that change evidence, containment, and trust." },
];

const quizQuestions = [
  { prompt: "Which part of the CIA triad prevents unauthorized disclosure?", choices: ["Availability", "Confidentiality", "Integrity", "Authentication"], answer: 1, explanation: "Confidentiality limits information access to authorized people and systems." },
  { prompt: "What is the safest response to an unexpected account-verification link?", choices: ["Open it in private browsing", "Forward it to friends", "Visit the service through its official address", "Reply and ask whether it is real"], answer: 2, explanation: "Navigate independently to the known official service instead of trusting the message link." },
  { prompt: "What does multi-factor authentication add?", choices: ["A second independent proof of identity", "A longer username", "Automatic antivirus updates", "Encrypted Wi-Fi"], answer: 0, explanation: "MFA combines independent factors, so a stolen password alone is less useful." },
  { prompt: "Which behaviour best supports password security?", choices: ["One memorable password everywhere", "Unique passwords stored in a password manager", "Changing one character each month", "Sharing passwords only with friends"], answer: 1, explanation: "Unique passwords prevent one breached service from exposing every other account." },
  { prompt: "A file is changed without permission. Which security property failed?", choices: ["Integrity", "Availability", "Confidentiality", "Convenience"], answer: 0, explanation: "Integrity means data remains accurate and is changed only in authorized ways." },
];

const scenarioQuestions = [
  { context: "A classmate sends a cloud-document link from an unfamiliar address and says the assignment is urgent.", prompt: "What should you do first?", choices: ["Open it quickly before it expires", "Confirm through a separate trusted channel", "Reply with your university password", "Disable browser protection"], answer: 1, explanation: "Independent verification avoids relying on the potentially compromised message." },
  { context: "Your phone shows an MFA approval request while you are not signing in.", prompt: "Choose the strongest response.", choices: ["Approve it to clear the notification", "Ignore it forever", "Deny it, change the password, and review sessions", "Turn off MFA"], answer: 2, explanation: "An unsolicited prompt can mean someone already has the password. Deny and secure the account." },
  { context: "A USB drive labelled 'Exam Answers' is lying near a campus computer lab.", prompt: "How should it be handled?", choices: ["Connect it to identify the owner", "Give it to the responsible staff without connecting it", "Take it home and scan it", "Upload its files to the class group"], answer: 1, explanation: "Unknown removable media can execute or carry malware. Staff can handle it using controlled procedures." },
  { context: "A laptop containing project data is stolen.", prompt: "What action best reduces ongoing harm?", choices: ["Wait to see whether it appears online", "Post the password publicly so the finder can contact you", "Report it, revoke sessions, and use remote protection if configured", "Delete the project from your teammates' devices"], answer: 2, explanation: "Fast reporting and session revocation limit access while preserving evidence and team data." },
];

const matchPairs = [
  ["DNS", "Translates names into IP addresses"],
  ["DHCP", "Assigns network configuration automatically"],
  ["HTTPS", "Protects web traffic in transit"],
  ["ICMP", "Carries network diagnostics and error messages"],
  ["TCP", "Provides reliable ordered delivery"],
  ["UDP", "Provides lightweight connectionless delivery"],
];

const osiLayers = ["Application", "Presentation", "Session", "Transport", "Network", "Data Link", "Physical"];

const diagramQuestions = [
  { prompt: "Select the device that filters traffic between the public Internet and the internal network.", answer: "firewall", explanation: "A firewall applies traffic rules at the network boundary." },
  { prompt: "Select the component that forwards packets between different networks.", answer: "router", explanation: "A router chooses paths and forwards packets across network boundaries." },
  { prompt: "Select the system most likely to host a shared learning application.", answer: "server", explanation: "Servers provide shared services and resources to client devices." },
  { prompt: "Select the endpoint used directly by a learner.", answer: "laptop", explanation: "The laptop is the client endpoint in this simplified topology." },
];

const branchStages = [
  {
    title: "Unusual account activity",
    prompt: "Multiple staff accounts are signing in from unfamiliar locations. What is your first coordinated action?",
    options: [
      { label: "Disable affected sessions and preserve authentication logs", consequence: "Suspicious access is interrupted while evidence remains available.", delta: [25, 20, 5] },
      { label: "Delete all authentication logs", consequence: "Some traces disappear, but the investigation loses essential evidence.", delta: [5, -35, -10] },
      { label: "Wait until a user reports a visible problem", consequence: "The attacker receives more time to move through connected systems.", delta: [-20, -5, -15] },
    ],
  },
  {
    title: "Possible lateral movement",
    prompt: "A compromised account accessed a shared server. How do you contain the situation?",
    options: [
      { label: "Isolate affected systems and reset exposed credentials", consequence: "Containment limits spread while the response team investigates.", delta: [25, 10, 5] },
      { label: "Shut down every campus system immediately", consequence: "The attacker may be interrupted, but disruption and evidence loss are substantial.", delta: [10, -15, -25] },
      { label: "Only rename the compromised account", consequence: "Renaming does not revoke sessions or remove the attacker.", delta: [-15, 0, -10] },
    ],
  },
  {
    title: "Communication pressure",
    prompt: "Students notice service disruption and rumours begin spreading. What should the team communicate?",
    options: [
      { label: "Issue a factual update with known impact and next steps", consequence: "Clear, bounded communication reduces uncertainty without inventing facts.", delta: [5, 5, 25] },
      { label: "Claim there was no incident before checking", consequence: "A premature denial can damage trust when evidence emerges.", delta: [0, -5, -30] },
      { label: "Publish raw logs and affected names", consequence: "The update exposes personal data and operational details.", delta: [-5, -15, -30] },
    ],
  },
  {
    title: "Recovery decision",
    prompt: "The immediate threat is contained. What should happen before normal service resumes?",
    options: [
      { label: "Verify clean recovery points, patch the cause, monitor, and document lessons", consequence: "Recovery addresses both service restoration and the original weakness.", delta: [20, 20, 15] },
      { label: "Restore quickly without changing the vulnerable system", consequence: "Service returns, but the same route remains available to the attacker.", delta: [-10, 0, -15] },
      { label: "Replace every device without reviewing evidence", consequence: "The cost rises while the root cause may remain unknown.", delta: [0, -20, -15] },
    ],
  },
];

let saved = readSaved();
let route = "overview";
let session = {};
let toastTimer;
let countdownTimer;

const app = document.querySelector("#app");
const nav = document.querySelector("#activity-nav");
const progress = document.querySelector("#overall-progress");

function readSaved() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveResult(id, score, max) {
  saved[id] = { score, max, completedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  renderNav();
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderNav() {
  const complete = activities.filter((item) => saved[item.id]).length;
  progress.textContent = `${complete} of ${activities.length} completed`;
  nav.innerHTML = `<button class="nav-item ${route === "overview" ? "active" : ""}" type="button" data-route="overview"><span class="nav-number">0</span><span class="nav-label">Overview</span></button>${activities.map((item, index) => `<button class="nav-item ${route === item.id ? "active" : ""}" type="button" data-route="${item.id}"><span class="nav-number">${index + 1}</span><span class="nav-label">${item.title}</span><span class="nav-status">${saved[item.id] ? "Done" : ""}</span></button>`).join("")}`;
}

function go(nextRoute) {
  clearInterval(countdownTimer);
  countdownTimer = null;
  route = nextRoute;
  session = {};
  renderNav();
  render();
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function activityHeader(item, copy) {
  return `<header class="view-header"><p class="eyebrow">${item.course} · ${item.type}</p><h1>${item.title}</h1><p class="lede">${copy || item.description}</p></header>`;
}

function toolbar(current, total, right = "") {
  const width = total ? Math.round((current / total) * 100) : 0;
  return `<div class="activity-toolbar"><div class="progress-group"><div class="progress-track" aria-label="Activity progress"><span style="width:${width}%"></span></div><span class="progress-label">${current} of ${total}</span></div>${right}</div>`;
}

function resultView(id, score, max, message) {
  saveResult(id, score, max);
  const percent = Math.round((score / max) * 100);
  return `<div class="activity-body"><div class="result-panel"><div class="result-score">${percent}%</div><p class="eyebrow">Activity complete</p><h2>${message}</h2><p>You scored ${score} out of ${max}. This prototype stores the result locally and allows unlimited retries.</p><div class="result-actions"><button class="button button-primary" type="button" data-retry="${id}">Try again</button><button class="button button-secondary" type="button" data-route="overview">View all activities</button></div></div></div>`;
}

function renderOverview() {
  app.innerHTML = `<section class="view"><header class="view-header"><p class="eyebrow">Interaction playground</p><h1>Test each activity without cluttering the LMS.</h1><p class="lede">Six complete prototypes show how assessment, practice, and simulation can feel before any pattern is integrated into the real modules.</p></header><div class="activity-grid">${activities.map((item) => {
    const result = saved[item.id];
    return `<article class="activity-card"><img src="${item.image}" alt=""><div class="activity-card-body"><div class="activity-card-top"><span class="type-label">${item.type}</span><span class="status-pill ${result ? "complete" : ""}">${result ? `${result.score}/${result.max}` : "Not attempted"}</span></div><h2>${item.title}</h2><p>${item.description}</p><button class="button ${result ? "button-secondary" : "button-primary"}" type="button" data-route="${item.id}">${result ? "Open again" : "Start activity"}</button></div></article>`;
  }).join("")}</div></section>`;
}

function startQuestionSet(kind) {
  const questions = kind === "quiz" ? quizQuestions : scenarioQuestions;
  const prepared = questions.map((question) => {
    const correct = question.choices[question.answer];
    const choices = shuffle(question.choices);
    return { ...question, choices, answer: choices.indexOf(correct) };
  });
  session = { index: 0, score: 0, answered: false, selected: null, questions: kind === "quiz" ? shuffle(prepared) : prepared };
  renderQuestionSet(kind);
}

function renderQuestionSet(kind) {
  const item = activities.find((entry) => entry.id === kind);
  if (!session.questions) startQuestionSet(kind);
  if (session.index >= session.questions.length) {
    app.innerHTML = `<section class="view">${activityHeader(item)}<div class="activity-frame">${toolbar(session.questions.length, session.questions.length)}${resultView(kind, session.score, session.questions.length, session.score >= Math.ceil(session.questions.length * .7) ? "Strong understanding demonstrated" : "Review the explanations and try once more")}</div></section>`;
    return;
  }
  const question = session.questions[session.index];
  const context = kind === "scenario" ? `<div class="incident-card"><strong>Situation</strong><p>${question.context}</p></div>` : "";
  const choices = question.choices.map((choice, index) => {
    let state = "";
    if (session.answered && index === question.answer) state = "correct";
    if (session.answered && index === session.selected && index !== question.answer) state = "incorrect";
    return `<button class="choice ${state}" type="button" data-answer="${index}" ${session.answered ? "disabled" : ""}><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${choice}</span></button>`;
  }).join("");
  const feedback = session.answered ? `<div class="feedback ${session.selected === question.answer ? "correct" : "incorrect"}"><strong>${session.selected === question.answer ? "Correct" : "Not quite"}</strong><p>${question.explanation}</p></div><div class="question-actions"><button class="button button-primary" type="button" data-next-question="${kind}">${session.index === session.questions.length - 1 ? "See results" : "Next question"}</button></div>` : "";
  app.innerHTML = `<section class="view">${activityHeader(item)}<div class="activity-frame">${toolbar(session.index + 1, session.questions.length)}<div class="activity-body">${context}<div class="question-copy"><p class="eyebrow">${kind === "quiz" ? "Choose one answer" : "Make a decision"}</p><h2>${question.prompt}</h2></div><div class="choice-list">${choices}</div>${feedback}</div></div></section>`;
}

function renderMatching() {
  const item = activities.find((entry) => entry.id === "matching");
  if (!session.mode) session = { mode: "match", selected: null, matched: [], targetOrder: shuffle(matchPairs.map((pair) => pair[1])), order: shuffle(osiLayers) };
  if (session.finished) {
    app.innerHTML = `<section class="view">${activityHeader(item)}<div class="activity-frame">${toolbar(2, 2)}${resultView("matching", session.score, 13, session.score >= 10 ? "The protocol stack is taking shape" : "A second pass will strengthen the sequence")}</div></section>`;
    return;
  }
  const tabs = `<div class="mode-tabs"><button type="button" class="${session.mode === "match" ? "active" : ""}" data-match-mode="match">1. Match</button><button type="button" class="${session.mode === "sort" ? "active" : ""}" data-match-mode="sort">2. Sort</button></div>`;
  let content;
  if (session.mode === "match") {
    content = `${tabs}<div class="matching-board"><div class="matching-column"><h3>Select a protocol</h3>${matchPairs.map(([name]) => `<button type="button" class="match-item ${session.selected === name ? "selected" : ""} ${session.matched.includes(name) ? "matched" : ""}" data-match-item="${name}" ${session.matched.includes(name) ? "disabled" : ""}>${name}</button>`).join("")}</div><div class="matching-column"><h3>Then select its purpose</h3>${session.targetOrder.map((target) => { const pair = matchPairs.find((entry) => entry[1] === target); const done = session.matched.includes(pair[0]); return `<button type="button" class="match-target ${done ? "matched" : ""}" data-match-target="${pair[0]}" ${done ? "disabled" : ""}>${target}${done ? `<small>Matched with ${pair[0]}</small>` : ""}</button>`; }).join("")}</div></div><div class="question-actions"><button class="button button-primary" type="button" data-match-mode="sort" ${session.matched.length < matchPairs.length ? "disabled" : ""}>Continue to layer sorting</button></div>`;
  } else {
    content = `${tabs}<div class="question-copy"><p class="eyebrow">Top to bottom</p><h2>Arrange the OSI layers from Layer 7 to Layer 1.</h2><p>Drag rows or use the arrow buttons.</p></div><ol class="sort-list">${session.order.map((layer, index) => `<li class="sort-item" draggable="true" data-sort-index="${index}"><span class="sort-handle" aria-hidden="true">::</span><strong>${layer}</strong><span class="sort-actions"><button type="button" data-move="up" data-index="${index}" aria-label="Move ${layer} up" ${index === 0 ? "disabled" : ""}>↑</button><button type="button" data-move="down" data-index="${index}" aria-label="Move ${layer} down" ${index === session.order.length - 1 ? "disabled" : ""}>↓</button></span></li>`).join("")}</ol><div class="question-actions"><button class="button button-primary" type="button" data-check-sort>Check order</button><button class="button button-secondary" type="button" data-shuffle-sort>Shuffle</button></div>`;
  }
  app.innerHTML = `<section class="view">${activityHeader(item)}<div class="activity-frame">${toolbar(session.mode === "match" ? 1 : 2, 2)}<div class="activity-body">${content}</div></div></section>`;
  if (session.mode === "sort") bindSortDnD();
}

function bindSortDnD() {
  let from = null;
  document.querySelectorAll(".sort-item").forEach((row) => {
    row.addEventListener("dragstart", () => { from = Number(row.dataset.sortIndex); });
    row.addEventListener("dragover", (event) => event.preventDefault());
    row.addEventListener("drop", (event) => {
      event.preventDefault();
      const to = Number(row.dataset.sortIndex);
      if (from === null || from === to) return;
      const [moved] = session.order.splice(from, 1);
      session.order.splice(to, 0, moved);
      renderMatching();
    });
  });
}

function startDiagram() {
  session = { index: 0, score: 0, selected: null, answered: false };
  renderDiagram();
}

function renderDiagram() {
  const item = activities.find((entry) => entry.id === "diagram");
  if (session.index >= diagramQuestions.length) {
    app.innerHTML = `<section class="view">${activityHeader(item)}<div class="activity-frame">${toolbar(4, 4)}${resultView("diagram", session.score, 4, session.score === 4 ? "Topology understood" : "The map is ready for another inspection")}</div></section>`;
    return;
  }
  const question = diagramQuestions[session.index];
  const nodes = [["internet", "Public Internet"], ["firewall", "Firewall"], ["router", "Router"], ["laptop", "Student Laptop"], ["server", "Learning Server"]].map(([id, label]) => {
    let state = "";
    if (session.answered && id === question.answer) state = "correct";
    if (session.answered && id === session.selected && id !== question.answer) state = "incorrect";
    return `<button type="button" class="network-node node-${id} ${state}" data-node="${id}" ${session.answered ? "disabled" : ""}>${label}</button>`;
  }).join("");
  const feedback = session.answered ? `<div class="feedback ${session.selected === question.answer ? "correct" : "incorrect"}"><strong>${session.selected === question.answer ? "Correct component" : "Look at the highlighted component"}</strong><p>${question.explanation}</p></div><button class="button button-primary" type="button" data-next-diagram>${session.index === 3 ? "See results" : "Next challenge"}</button>` : "";
  app.innerHTML = `<section class="view">${activityHeader(item)}<div class="activity-frame">${toolbar(session.index + 1, 4)}<div class="activity-body"><div class="network-lab"><div class="network-map" aria-label="Simplified campus network diagram">${nodes}</div><div class="diagram-challenge"><p class="eyebrow">Map challenge ${session.index + 1}</p><h2>${question.prompt}</h2><p>Select one component in the diagram.</p>${feedback}</div></div></div></div></section>`;
}

function startPhishing(timerOn = true) {
  clearInterval(countdownTimer);
  session = { started: true, timerOn, seconds: 60, found: [] };
  if (timerOn) {
    countdownTimer = setInterval(() => {
      session.seconds -= 1;
      const timer = document.querySelector("#hunt-timer");
      if (timer) {
        timer.textContent = `${session.seconds}s`;
        timer.classList.toggle("urgent", session.seconds <= 10);
      }
      if (session.seconds <= 0) finishPhishing();
    }, 1000);
  }
  renderPhishing();
}

function renderPhishing() {
  const item = activities.find((entry) => entry.id === "phishing");
  if (session.finished) {
    app.innerHTML = `<section class="view">${activityHeader(item)}<div class="activity-frame">${toolbar(session.found.length, 5)}${resultView("phishing", session.found.length, 5, session.found.length === 5 ? "All warning signs identified" : "The message still has clues to uncover")}</div></section>`;
    return;
  }
  const found = session.found || [];
  const mark = (id, content, className = "flag") => `<button type="button" class="${className} ${found.includes(id) ? "found" : ""}" data-flag="${id}" ${!session.started ? "disabled" : ""}>${content}</button>`;
  const right = `<div class="timer-controls"><label class="toggle"><input id="timer-toggle" type="checkbox" ${session.timerOn !== false ? "checked" : ""} ${session.started ? "disabled" : ""}> Optional timer</label><span class="timer" id="hunt-timer">${session.timerOn === false ? "Untimed" : `${session.seconds || 60}s`}</span></div>`;
  app.innerHTML = `<section class="view">${activityHeader(item, "Inspect the simulated email and select five suspicious details. The timer is optional and never changes the score.")}<div class="activity-frame">${toolbar(found.length, 5, right)}<div class="activity-body"><div class="email-game"><article class="mock-email" aria-label="Simulated suspicious email"><div class="email-chrome"><span>Inbox / Message</span><span>10:42 AM</span></div><div class="email-header"><strong>${mark("urgent-subject", "URGENT: Your NSBM account closes today")}</strong><span>From: ${mark("sender", "NSBM Support &lt;security@nsbm-helpdesk-login.com&gt;")}</span><span>To: Student</span></div><div class="email-content"><p>Dear ${mark("generic", "valued user")},</p><p>We detected a problem with your account. You must verify it ${mark("pressure", "within 30 minutes or all files will be deleted")}.</p><p>${mark("link", "Verify account now", "flag fake-login")}</p><p>Enter your university email, password, and verification code on the page. Do not contact the IT office because this is an automated security action.</p><p>Regards,<br>Account Team</p></div></article><aside class="hunt-panel"><p class="eyebrow">Investigation</p><h2>${found.length} of 5 clues found</h2><p>Click suspicious text in the message. Correct discoveries stay highlighted.</p><ul>${found.map((id) => `<li>${flagExplanation(id)}</li>`).join("") || "<li>No warning signs selected yet.</li>"}</ul>${!session.started ? `<button class="button button-primary" type="button" data-start-hunt>Start investigation</button>` : `<button class="button button-secondary" type="button" data-finish-hunt>Finish now</button>`}</aside></div></div></div></section>`;
}

function flagExplanation(id) {
  return {
    "urgent-subject": "The subject creates urgency and threatens account loss.",
    sender: "The sender domain is not the university's official domain.",
    generic: "The greeting does not identify the account holder.",
    pressure: "The short deadline pressures the recipient into acting without checking.",
    link: "The sign-in button may lead to a credential-stealing page.",
  }[id];
}

function finishPhishing() {
  clearInterval(countdownTimer);
  countdownTimer = null;
  session.finished = true;
  renderPhishing();
}

function startBranching() {
  session = { stage: 0, metrics: [50, 50, 50], log: [] };
  renderBranching();
}

function renderBranching() {
  const item = activities.find((entry) => entry.id === "branching");
  if (session.stage >= branchStages.length) {
    const score = Math.round(session.metrics.reduce((sum, value) => sum + value, 0) / 30);
    app.innerHTML = `<section class="view">${activityHeader(item)}<div class="activity-frame">${toolbar(4, 4)}${resultView("branching", score, 10, score >= 8 ? "The incident was contained with confidence" : score >= 6 ? "Services recovered with lessons to review" : "The response needs a calmer second run")}<div class="activity-body decision-log"><h3>Decision record</h3><ol>${session.log.map((entry) => `<li>${entry}</li>`).join("")}</ol></div></div></section>`;
    return;
  }
  const stage = branchStages[session.stage];
  const context = session.stage === 1 && session.metrics[0] < 50 ? "Delayed containment has allowed more suspicious connections to appear. " : session.stage === 2 && session.metrics[2] < 40 ? "Confidence is already low because earlier actions disrupted users. " : "";
  const metrics = ["Containment", "Evidence", "Community trust"].map((label, index) => `<div class="metric"><div class="metric-label"><span>${label}</span><strong>${session.metrics[index]}</strong></div><div class="metric-track"><span style="width:${session.metrics[index]}%"></span></div></div>`).join("");
  app.innerHTML = `<section class="view">${activityHeader(item)}<div class="activity-frame">${toolbar(session.stage + 1, 4)}<div class="activity-body"><div class="branch-layout"><div><div class="incident-card"><p class="eyebrow">Stage ${session.stage + 1}</p><h2>${stage.title}</h2><p>${context}${stage.prompt}</p></div><div class="branch-choices">${stage.options.map((option, index) => `<button class="branch-choice" type="button" data-branch="${index}"><strong>${option.label}</strong></button>`).join("")}</div>${session.log.length ? `<div class="decision-log"><h3>Earlier consequences</h3><ol>${session.log.map((entry) => `<li>${entry}</li>`).join("")}</ol></div>` : ""}</div><aside class="metrics" aria-label="Incident response metrics">${metrics}</aside></div></div></div></section>`;
}

function shuffle(values) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function render() {
  if (route === "overview") renderOverview();
  if (route === "quiz" || route === "scenario") renderQuestionSet(route);
  if (route === "matching") renderMatching();
  if (route === "diagram") { if (!Number.isInteger(session.index)) startDiagram(); else renderDiagram(); }
  if (route === "phishing") renderPhishing();
  if (route === "branching") { if (!Number.isInteger(session.stage)) startBranching(); else renderBranching(); }
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.dataset.route) return go(target.dataset.route);
  if (target.dataset.retry) return go(target.dataset.retry);
  if (target.dataset.answer !== undefined) {
    const question = session.questions[session.index];
    session.selected = Number(target.dataset.answer);
    session.answered = true;
    if (session.selected === question.answer) session.score += 1;
    return renderQuestionSet(route);
  }
  if (target.dataset.nextQuestion) {
    session.index += 1;
    session.answered = false;
    session.selected = null;
    return renderQuestionSet(target.dataset.nextQuestion);
  }
  if (target.dataset.matchItem) {
    session.selected = target.dataset.matchItem;
    return renderMatching();
  }
  if (target.dataset.matchTarget) {
    if (!session.selected) return showToast("Select a protocol first.");
    if (session.selected === target.dataset.matchTarget) {
      session.matched.push(session.selected);
      session.selected = null;
      showToast("Correct match.");
      return renderMatching();
    }
    session.selected = null;
    showToast("Those do not match. Try another purpose.");
    return renderMatching();
  }
  if (target.dataset.matchMode) {
    if (target.dataset.matchMode === "sort" && session.matched.length < 6) return showToast("Complete all six matches before sorting.");
    session.mode = target.dataset.matchMode;
    return renderMatching();
  }
  if (target.dataset.move) {
    const index = Number(target.dataset.index);
    const destination = target.dataset.move === "up" ? index - 1 : index + 1;
    [session.order[index], session.order[destination]] = [session.order[destination], session.order[index]];
    return renderMatching();
  }
  if (target.hasAttribute("data-shuffle-sort")) {
    session.order = shuffle(osiLayers);
    return renderMatching();
  }
  if (target.hasAttribute("data-check-sort")) {
    const correct = session.order.filter((layer, index) => layer === osiLayers[index]).length;
    session.score = session.matched.length + correct;
    session.finished = true;
    return renderMatching();
  }
  if (target.dataset.node) {
    const question = diagramQuestions[session.index];
    session.selected = target.dataset.node;
    session.answered = true;
    if (session.selected === question.answer) session.score += 1;
    return renderDiagram();
  }
  if (target.hasAttribute("data-next-diagram")) {
    session.index += 1;
    session.selected = null;
    session.answered = false;
    return renderDiagram();
  }
  if (target.hasAttribute("data-start-hunt")) return startPhishing(document.querySelector("#timer-toggle").checked);
  if (target.dataset.flag) {
    if (!session.started || session.found.includes(target.dataset.flag)) return;
    session.found.push(target.dataset.flag);
    showToast(flagExplanation(target.dataset.flag));
    if (session.found.length === 5) return finishPhishing();
    return renderPhishing();
  }
  if (target.hasAttribute("data-finish-hunt")) return finishPhishing();
  if (target.dataset.branch !== undefined) {
    const option = branchStages[session.stage].options[Number(target.dataset.branch)];
    session.metrics = session.metrics.map((value, index) => Math.max(0, Math.min(100, value + option.delta[index])));
    session.log.push(option.consequence);
    session.stage += 1;
    showToast(option.consequence);
    return renderBranching();
  }
});

document.querySelector("#theme-toggle").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
});

document.querySelector("#reset-all").addEventListener("click", () => {
  if (!window.confirm("Reset every saved activity result in this demo?")) return;
  saved = {};
  localStorage.removeItem(STORAGE_KEY);
  showToast("All demo results were reset.");
  go("overview");
});

const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme === "dark") document.documentElement.dataset.theme = "dark";
renderNav();
render();
