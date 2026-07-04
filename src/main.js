const DEFAULT_MODEL_ID = "openai/gpt-4.1-mini";
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_REQUEST_TIMEOUT_MS = 5000;
const OPENROUTER_TOTAL_TIMEOUT_MS = 8000;
const OPENROUTER_DIALOGUE_TIMEOUT_MS = 5000;
const OPENROUTER_FALLBACK_MODELS = [
  DEFAULT_MODEL_ID,
  "qwen/qwen3.5-plus-20260420",
  "deepseek/deepseek-chat",
  "google/gemini-2.5-flash",
  "openai/gpt-4o-mini",
];

const SOURCE_FILES = [
  { label: "index.html", path: "index.html" },
  { label: "styles.css", path: "src/styles.css" },
  { label: "main.js", path: "src/main.js" },
  { label: "README.md", path: "README.md" },
];

const TARGETS = {
  "月背 L2 中继站": { x: 42, y: -20, type: "station" },
  "木卫二轨道": { x: 184, y: 76, type: "moon" },
  "火星货运廊道": { x: 128, y: 34, type: "lane" },
  "土星外缘": { x: 250, y: -96, type: "deep" },
  "异常信标": { x: 92, y: -72, type: "anomaly" },
  "小行星带补给站": { x: 154, y: -18, type: "station" },
};

const PHASE_LABELS = {
  preflight: "冷启动",
  awaiting_ignition: "待点火",
  launch: "点火加速",
  cruise: "航行中",
  event: "事件",
  arrived: "抵达",
};

const PREFLIGHT_REPORTS = [
  ["lin", "轮机舱报告：反应堆低功率稳定，主推进等待点火授权。"],
  ["ailan", "导航席报告：月背 L2 中继站航路已锁定，姿态控制已就位。"],
  ["heyi", "科学席报告：扫描阵列上线，异常信标监听通道开启。"],
  ["qin", "安保席报告：隔离门与护盾电容待命，甲板封闭完成。"],
];

const NPCS = {
  lin: {
    id: "lin",
    name: "林澈",
    role: "轮机长",
    initial: "林",
    status: "反应堆稳定",
    specialty: "能源、维修、热负荷",
  },
  ailan: {
    id: "ailan",
    name: "艾岚",
    role: "导航官",
    initial: "艾",
    status: "航路同步",
    specialty: "航线、速度、姿态",
  },
  heyi: {
    id: "heyi",
    name: "何弈",
    role: "科学官",
    initial: "何",
    status: "谱线观测",
    specialty: "扫描、异常、样本",
  },
  qin: {
    id: "qin",
    name: "秦昭",
    role: "安保官",
    initial: "秦",
    status: "甲板戒备",
    specialty: "护盾、隔离、登舰风险",
  },
};

const LEVELS = [
  {
    id: "L1",
    name: "月背回声",
    start: "地月转移轨道",
    destination: "月背 L2 中继站",
    objective: "抵达月背 L2 中继站，修复失联信标并确认异常来源。",
    route: "地月转移轨道 / 月背阴影带 / L2 中继站",
    requiredEvents: 2,
    eventMilestones: [46, 76],
    eventPool: ["crew-fatigue", "reactor-spike", "unknown-signal"],
    risk: "低",
    intro: "关卡 01 启动：月背 L2 中继站失联，昆仑号需要穿过地月转移轨道完成抵近。",
    success: "月背中继站恢复握手，异常信标坐标被写入下一关航线。",
  },
  {
    id: "L2",
    name: "木卫二寒海",
    start: "火星货运廊道",
    destination: "木卫二轨道",
    objective: "穿越木星辐射带，向木卫二冰下海投放深潜探针。",
    route: "火星货运廊道 / 木星磁尾 / 木卫二轨道",
    requiredEvents: 3,
    eventMilestones: [18, 46, 78],
    eventPool: ["crew-dispute", "shield-ice", "gravity-lens", "probe-contact"],
    risk: "中",
    intro: "关卡 02 启动：木卫二轨道窗口短暂开放，船员要在高辐射和低温环境里完成投放。",
    success: "深潜探针入水成功，冰层下方传回了非自然结构回波。",
  },
  {
    id: "L3",
    name: "土星外缘黑匣",
    start: "木卫二轨道",
    destination: "土星外缘",
    objective: "抵达土星外缘，回收旧时代探险舰的黑匣子并安全撤离。",
    route: "木星背风侧 / 土星环外缘 / 黑匣信标",
    requiredEvents: 3,
    eventMilestones: [20, 52, 84],
    eventPool: ["hull-breach", "memory-loop", "reactor-spike", "unknown-signal"],
    risk: "高",
    intro: "关卡 03 启动：旧探险舰黑匣仍在广播，信号里混有无法解释的船员语音。",
    success: "黑匣回收完成，昆仑号带着第一批深空异常证据返航。",
  },
];

const EVENT_DECK = {
  "cabin-monkey": {
    category: "起飞阶段考验",
    title: "货舱里的猴子",
    npc: "qin",
    risk: "yellow",
    stage: "launch",
    countsForLevel: true,
    text: "安保官秦昭报告：舰长，我们在船舱发现了一只猴子，它正沿维护管线往扫描阵列方向移动，该怎么办？",
    options: [
      "命令秦昭封锁货舱，何弈扫描生命体来源，林澈保护维护管线。",
      "呼叫秦昭安抚并诱导猴子离开维护管线，何弈做无接触扫描。",
    ],
    ignoreText: "忽略这件事，继续点火航行。",
    solutions: {
      actions: ["communicate", "scan", "toggle_shield", "repair"],
      npcs: ["qin", "heyi", "lin"],
      keywords: ["猴子", "货舱", "封锁", "扫描", "诱导", "维护管线", "安抚", "关起来", "关住", "关押", "抓住", "捕获", "隔离", "控制", "收容"],
      threshold: 2,
    },
    startEffects: { morale: -3, scanner: -2 },
    successEffects: { morale: 7, scanner: 4, oxygen: 2 },
    pressureEffects: { morale: -4, scanner: -3 },
    ignoreEffects: { morale: -6, scanner: -5, oxygen: -2 },
    successText: "秦昭封锁货舱，何弈确认这是一只被误装入补给舱的实验猴；维护管线没有受损。",
    ignoreResult: "猴子事件被挂起。船员确认舰长选择继续点火，但货舱维护风险已经进入后续航段。",
    ignoreComms: "收到，舰长。安保组会先盯着它，但我不保证它不会钻进维护管线。",
    unresolvedThread: {
      id: "loose-monkey",
      title: "货舱猴子未处理",
      turnDelay: 2,
      effects: { morale: -5, scanner: -9, energy: -3 },
      logText: "被忽略的猴子钻进维护管线，扫描阵列出现短时断续。",
      commNpc: "lin",
      commText: "舰长，那只猴子碰到了扫描阵列的维护束线。我们能修，但后面最好别再放任这类小事。",
    },
    hint: "这类事件可以自然语言处理，也可以忽略；忽略会留下后续隐患。",
  },
  "crew-fatigue": {
    category: "NPC 船员问题",
    title: "轮机组连续值守",
    npc: "lin",
    risk: "yellow",
    text: "轮机长林澈报告，反应堆班组已经连续值守 18 小时。继续高功率推进会提高操作失误概率。",
    options: [
      "呼叫轮机长林澈，安排轮换休息，并把推进降到巡航功率。",
      "让林澈重配能源，保持生命维持优先，暂停非必要系统。",
    ],
    solutions: {
      actions: ["communicate", "adjust_speed", "stand_down", "power_reallocate"],
      npcs: ["lin"],
      keywords: ["轮换", "休息", "降速", "林澈", "生命维持", "安抚"],
      threshold: 2,
    },
    startEffects: { morale: -5, heat: 4 },
    successEffects: { morale: 10, heat: -6, energy: -2 },
    pressureEffects: { morale: -4, heat: 3 },
    successText: "轮机组完成换班，反应堆曲线恢复平滑。",
    hint: "这类事件需要和林澈沟通，或降低推进/重配能源。",
  },
  "crew-dispute": {
    category: "NPC 船员问题",
    title: "科学组与安保组争执",
    npc: "heyi",
    risk: "yellow",
    text: "科学官何弈要求立刻接触未知样本，安保官秦昭认为需要先隔离。争执正在拖慢任务窗口。",
    options: [
      "同时呼叫何弈和秦昭，先隔离样本，再允许科学组远程扫描。",
      "命令秦昭建立隔离区，让何弈用扫描阵列做无接触分析。",
    ],
    solutions: {
      actions: ["communicate", "scan", "toggle_shield"],
      npcs: ["heyi", "qin"],
      keywords: ["隔离", "样本", "远程", "无接触", "秦昭", "何弈"],
      threshold: 2,
    },
    startEffects: { morale: -6, scanner: -4 },
    successEffects: { morale: 8, scanner: 7 },
    pressureEffects: { morale: -5 },
    successText: "两组达成流程：先隔离，再扫描，任务节奏恢复。",
    hint: "这类事件需要调停 NPC，并给出隔离或扫描流程。",
  },
  "reactor-spike": {
    category: "舰船突发问题",
    title: "反应堆热尖峰",
    npc: "lin",
    risk: "yellow",
    text: "主反应堆在加速段出现热尖峰。若不处理，散热板会被迫降额，航程推进变慢。",
    options: [
      "降低航速，进入静默航行，让林澈重配能源并检查反应堆。",
      "暂停推进，把能源从武器级护盾转给散热和轮机抢修。",
    ],
    solutions: {
      actions: ["adjust_speed", "stealth", "repair", "power_reallocate"],
      npcs: ["lin"],
      keywords: ["降速", "静默", "散热", "反应堆", "抢修", "热负荷"],
      threshold: 2,
    },
    startEffects: { heat: 14, energy: -5, engine: -5 },
    successEffects: { heat: -18, engine: 8 },
    pressureEffects: { heat: 8, hull: -2 },
    successText: "热尖峰被压下，散热板保持在可用区间。",
    hint: "这类事件需要降速、静默、维修或能源重配。",
  },
  "shield-ice": {
    category: "舰船突发问题",
    title: "护盾结霜",
    npc: "qin",
    risk: "yellow",
    text: "木星磁尾里的带电冰晶附着在护盾边界，护盾效率下降，近距碎片风险升高。",
    options: [
      "开启护盾脉冲，让秦昭监控甲板，同时扫描冰晶密度。",
      "把能源转给护盾电容，低速穿过冰晶带。",
    ],
    solutions: {
      actions: ["toggle_shield", "scan", "power_reallocate", "adjust_speed"],
      npcs: ["qin", "ailan"],
      keywords: ["护盾", "冰晶", "低速", "秦昭", "电容", "脉冲"],
      threshold: 2,
    },
    startEffects: { shield: -18, hull: -3 },
    successEffects: { shield: 18, hull: 3 },
    pressureEffects: { shield: -8, hull: -4 },
    successText: "护盾边界被清理，冰晶带不再威胁外壳。",
    hint: "这类事件需要护盾、扫描、低速或安保配合。",
  },
  "hull-breach": {
    category: "舰船突发问题",
    title: "微陨石击穿外壳",
    npc: "qin",
    risk: "red",
    text: "高速微陨石擦过左舷，外壳出现针孔泄漏。局部甲板需要封锁并抢修。",
    options: [
      "命令秦昭封锁左舷甲板，维修组抢修外壳，同时降低航速。",
      "开启护盾，暂停推进，优先修复船体泄漏。",
    ],
    solutions: {
      actions: ["repair", "toggle_shield", "adjust_speed", "communicate"],
      npcs: ["qin", "lin"],
      keywords: ["封锁", "泄漏", "左舷", "外壳", "抢修", "降速"],
      threshold: 2,
    },
    startEffects: { hull: -16, oxygen: -7, morale: -5 },
    successEffects: { hull: 14, oxygen: 6, morale: 5 },
    pressureEffects: { hull: -8, oxygen: -5 },
    successText: "泄漏段完成封堵，左舷甲板解除红色警戒。",
    hint: "这类事件需要封锁、护盾、降速和维修。",
  },
  "unknown-signal": {
    category: "宇宙未知问题",
    title: "未知信标回应",
    npc: "heyi",
    risk: "yellow",
    text: "一个窄带信号开始模仿昆仑号的通讯节奏。它不像自然回波，也不像人类协议。",
    options: [
      "让何弈做全频扫描，先发射无人探针，不直接回应信号。",
      "保持静默航行，用扫描阵列记录信标结构并等待探针回传。",
    ],
    solutions: {
      actions: ["scan", "launch_probe", "stealth", "communicate"],
      npcs: ["heyi"],
      keywords: ["信标", "全频", "探针", "静默", "何弈", "不回应"],
      threshold: 2,
    },
    startEffects: { scanner: 5, morale: -4 },
    successEffects: { scanner: 12, morale: 4 },
    pressureEffects: { morale: -5, heat: 4 },
    successText: "探针锁定信号源，昆仑号没有暴露主通讯密钥。",
    hint: "这类事件通常要扫描、探针、静默或科学官协助。",
  },
  "gravity-lens": {
    category: "宇宙未知问题",
    title: "引力透镜误差",
    npc: "ailan",
    risk: "yellow",
    text: "导航星图出现不可解释的弯曲，艾岚怀疑前方存在微型引力透镜，自动航线开始漂移。",
    options: [
      "呼叫艾岚手动重算航线，降低速度，并让何弈扫描引力源。",
      "暂停自动导航，低速绕开引力透镜区域。",
    ],
    solutions: {
      actions: ["set_course", "adjust_speed", "scan", "communicate"],
      npcs: ["ailan", "heyi"],
      keywords: ["重算", "航线", "引力", "绕开", "低速", "艾岚"],
      threshold: 2,
    },
    startEffects: { engine: -4, scanner: -4 },
    successEffects: { engine: 5, scanner: 8 },
    pressureEffects: { engine: -6, energy: -4 },
    successText: "新航线绕开透镜核心，自动导航重新可信。",
    hint: "这类事件需要导航重算、降速和扫描。",
  },
  "probe-contact": {
    category: "宇宙未知问题",
    title: "探针传回第二个心跳",
    npc: "heyi",
    risk: "red",
    text: "无人探针回传了两个心跳信号：一个属于探针，另一个正在同步船内生命维持频率。",
    options: [
      "切断探针主动链路，让何弈保存遥测，秦昭隔离通讯缓存。",
      "进入静默航行，隔离探针数据，只保留只读扫描。",
    ],
    solutions: {
      actions: ["launch_probe", "stealth", "scan", "communicate"],
      npcs: ["heyi", "qin"],
      keywords: ["切断", "隔离", "缓存", "只读", "探针", "生命维持"],
      threshold: 2,
    },
    startEffects: { morale: -10, oxygen: -4 },
    successEffects: { scanner: 10, morale: 8, oxygen: 3 },
    pressureEffects: { morale: -7, oxygen: -4 },
    successText: "探针链路被隔离，第二心跳被保存为黑箱样本。",
    hint: "这类事件需要隔离通讯、静默、扫描和科学/安保协作。",
  },
  "memory-loop": {
    category: "宇宙未知问题",
    title: "旧舰语音回环",
    npc: "qin",
    risk: "red",
    text: "黑匣信标开始播放上一支探险队的求救录音，船员听到自己的名字混在其中。",
    options: [
      "秦昭封锁公共频道，何弈只读记录信号，舰桥保持静默。",
      "切换到内部窄带通讯，安抚船员，扫描黑匣信标。",
    ],
    solutions: {
      actions: ["communicate", "scan", "stealth", "toggle_shield"],
      npcs: ["qin", "heyi"],
      keywords: ["封锁", "公共频道", "安抚", "只读", "黑匣", "静默"],
      threshold: 2,
    },
    startEffects: { morale: -14, scanner: -3 },
    successEffects: { morale: 12, scanner: 8 },
    pressureEffects: { morale: -8 },
    successText: "公共频道恢复安静，黑匣信号被收束到只读隔离区。",
    hint: "这类事件需要通讯管制、安抚、扫描或静默。",
  },
};

const ACTION_ALIASES = {
  ignition: "ignite",
  launch: "ignite",
  liftoff: "ignite",
  ignore: "ignore_event",
  skip: "ignore_event",
  dismiss: "ignore_event",
  course: "set_course",
  navigate: "set_course",
  navigation: "set_course",
  move: "set_course",
  fly: "set_course",
  travel: "set_course",
  speed: "adjust_speed",
  throttle: "adjust_speed",
  shield: "toggle_shield",
  shields: "toggle_shield",
  scan: "scan",
  sensor: "scan",
  communicate: "communicate",
  comms: "communicate",
  talk: "communicate",
  message: "communicate",
  repair: "repair",
  fix: "repair",
  power: "power_reallocate",
  reallocate_power: "power_reallocate",
  stealth: "stealth",
  silent: "stealth",
  probe: "launch_probe",
  launch_probe: "launch_probe",
  dock: "dock",
  standby: "stand_down",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const elements = {
  canvas: $("#spaceCanvas"),
  commandForm: $("#commandForm"),
  commandInput: $("#commandInput"),
  executeButton: $("#executeButton"),
  aiToggle: $("#aiToggle"),
  apiKeyInput: $("#apiKeyInput"),
  modelInput: $("#modelInput"),
  rememberKeyToggle: $("#rememberKeyToggle"),
  saveSettingsButton: $("#saveSettingsButton"),
  analysisText: $("#sourceTab #analysisText") || $("#analysisText"),
  logList: $("#logList"),
  npcList: $("#npcList"),
  commsTranscript: $("#commsTranscript"),
  systemGrid: $("#systemGrid"),
  missionText: $("#missionText"),
  levelValue: $("#levelValue"),
  progressValue: $("#progressValue"),
  levelCode: $("#levelCode"),
  levelName: $("#levelName"),
  levelStatePill: $("#levelStatePill"),
  levelObjective: $("#levelObjective"),
  journeyProgressBar: $("#journeyProgressBar"),
  levelDestination: $("#levelDestination"),
  levelEvents: $("#levelEvents"),
  levelRisk: $("#levelRisk"),
  eventPanel: $("#eventPanel"),
  eventDock: $("#eventDock"),
  eventDockTitle: $("#eventDockTitle"),
  eventRail: $("#eventRail"),
  eventCategory: $("#eventCategory"),
  eventTitle: $("#eventTitle"),
  eventText: $("#eventText"),
  eventOptions: $("#eventOptions"),
  advanceButton: $("#advanceButton"),
  nextLevelButton: $("#nextLevelButton"),
  levelList: $("#levelList"),
  sourceToolbar: $("#sourceToolbar"),
  sourceCode: $("#sourceCode"),
  alertPill: $("#alertPill"),
  tokenPill: $("#tokenPill"),
  modePill: $("#modePill"),
  locationValue: $("#locationValue"),
  targetValue: $("#targetValue"),
  speedValue: $("#speedValue"),
  postureValue: $("#postureValue"),
  captainLastOrder: $("#captainLastOrder"),
  commandCommsPreview: $("#commandCommsPreview"),
  channelSelector: $("#channelSelector"),
  commandChannelKicker: $("#commandChannelKicker"),
  commandChannelTitle: $("#commandChannelTitle"),
};

const game = {
  turn: 0,
  logs: [],
  comms: [],
  chat: [],
  lastCaptainOrder: "",
  tokens: { prompt: 0, completion: 0, total: 0 },
  sourceFile: "src/main.js",
  settings: loadSettings(),
  level: createLevelState(0),
  mission: {
    phase: "preflight",
    launchEventTriggered: false,
    ignitionPulse: 0,
  },
  ui: {
    selectedEventTab: "phase",
    eventDockExpanded: false,
    commandChannel: "all",
  },
  revealed: {
    anomaly: true,
    probe: false,
  },
  ship: {
    name: "昆仑号",
    location: "地月转移轨道",
    target: "月背 L2 中继站",
    posture: "冷启动",
    alert: "green",
    x: 0,
    y: 0,
    heading: 32,
    speed: 0,
    hull: 96,
    shield: 42,
    energy: 84,
    heat: 23,
    engine: 76,
    scanner: 44,
    oxygen: 99,
    morale: 88,
    stealth: false,
    lastCommandMode: "LOCAL",
  },
};

const ctx = elements.canvas.getContext("2d");
const stars = createStars(260);
let canvasSize = { width: 0, height: 0, dpr: 1 };
let scannerPulse = 0;

seedState();
removeLegacyCommandAnalysis();
bindEvents();
resizeCanvas();
renderAll();
initSourceViewer();
requestAnimationFrame(drawScene);

function createLevelState(index) {
  return {
    index,
    progress: 0,
    eventsResolved: 0,
    eventsSeen: [],
    ignoredEvents: 0,
    unresolvedThreads: [],
    activeEvent: null,
    complete: false,
    campaignComplete: false,
  };
}

function currentLevel() {
  return LEVELS[game.level.index] || LEVELS[0];
}

function currentLevelNumber() {
  return String(game.level.index + 1).padStart(2, "0");
}

function removeLegacyCommandAnalysis() {
  $$("#commandTab .analysis-panel").forEach((panel) => panel.remove());
}

function startNextLevel() {
  if (!game.level.complete) {
    appendLog("关卡", "当前关卡尚未完成，无法跃迁到下一关。");
    renderAll();
    return;
  }

  const nextIndex = game.level.index + 1;
  if (nextIndex >= LEVELS.length) {
    game.level.campaignComplete = true;
    appendLog("战役", "当前 demo 的三个关卡已经全部完成。");
    elements.missionText.textContent = "战役 demo 已完成。可以刷新页面重新开始，或继续用自然语言测试舰桥系统。";
    renderAll();
    return;
  }

  game.level = createLevelState(nextIndex);
  const level = currentLevel();
  game.ship.location = level.start;
  game.ship.target = level.destination;
  game.ship.speed = 0;
  game.ship.posture = "冷启动";
  game.ship.stealth = false;
  game.ship.alert = level.risk === "高" ? "yellow" : "green";
  game.mission.phase = "awaiting_ignition";
  game.mission.launchEventTriggered = false;
  game.mission.ignitionPulse = 0;
  appendLog("关卡", level.intro);
  appendCrewReports();
  appendLog("舰桥", "船员报备完成，等待舰长下令点火。");
  elements.commandInput.value = "下令点火，启动主推进，进入目标航线。";
  renderAll();
}

function seedState() {
  const level = currentLevel();
  game.ship.location = level.start;
  game.ship.target = level.destination;
  game.ship.speed = 0;
  game.ship.posture = "冷启动";
  game.mission.phase = "awaiting_ignition";
  appendLog("舰桥", "昆仑号启动序列开始，指挥链路上线。");
  appendLog("关卡", level.intro);
  appendCrewReports();
  appendLog("舰桥", "船员报备完成，等待舰长下令点火。");
  elements.commandInput.value = "下令点火，启动主推进，进入月背航线。";
  elements.missionText.textContent = "昆仑号处于冷启动状态。船员已完成报备，请下令点火进入航行。";
}

function appendCrewReports() {
  PREFLIGHT_REPORTS.forEach(([npcId, line]) => appendComms(npcId, line));
}

function bindEvents() {
  $$(".tab-button").forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.tab));
  });

  $$(".quick-command").forEach((button) => {
    button.addEventListener("click", () => {
      elements.commandInput.value = button.dataset.command;
      runCommand(button.dataset.command);
    });
  });

  elements.commandForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runCommand(elements.commandInput.value);
  });

  elements.channelSelector?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-channel]");
    if (!button) return;
    setCommandChannel(button.dataset.channel);
  });

  elements.npcList?.addEventListener("click", (event) => {
    const card = event.target.closest("[data-private-channel]");
    if (!card) return;
    setCommandChannel(card.dataset.privateChannel, { openCommandTab: true });
  });

  elements.saveSettingsButton.addEventListener("click", () => {
    syncSettingsFromInputs();
    persistSettings();
    appendLog("系统", "OpenRouter 设置已写入本机配置。");
    renderAll();
  });

  elements.advanceButton.addEventListener("click", () => {
    const command =
      game.mission.phase === "awaiting_ignition"
        ? "下令点火，启动主推进，进入月背航线。"
        : "继续航行，保持关卡航线，并让导航官艾岚监控偏航。";
    runCommand(command);
  });

  elements.nextLevelButton.addEventListener("click", () => {
    startNextLevel();
  });

  elements.eventOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-command]");
    if (!button) return;
    elements.commandInput.value = button.dataset.command;
    runCommand(button.dataset.command);
  });

  elements.eventRail?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-event-tab]");
    if (!button) return;
    game.ui.selectedEventTab = button.dataset.eventTab;
    game.ui.eventDockExpanded = true;
    renderEvent();
  });

  $$("[data-open-tab]").forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.openTab));
  });

  window.addEventListener("resize", resizeCanvas);
}

function setCommandChannel(channel, options = {}) {
  game.ui.commandChannel = channel === "all" || NPCS[channel] ? channel : "all";
  if (options.openCommandTab) {
    setActiveTab("command");
    requestAnimationFrame(() => elements.commandInput.focus());
  }
  renderQuickCommands();
  renderInteraction();
  renderNpcs();
}

function currentPrivateNpcId() {
  return NPCS[game.ui.commandChannel] ? game.ui.commandChannel : "";
}

function loadSettings() {
  const rememberKey = localStorage.getItem("ntm-remember-key") === "1";
  return {
    aiEnabled: localStorage.getItem("ntm-ai-enabled") === "1",
    rememberKey,
    modelId: localStorage.getItem("ntm-model-id") || DEFAULT_MODEL_ID,
    apiKey: rememberKey
      ? localStorage.getItem("ntm-openrouter-key") || ""
      : sessionStorage.getItem("ntm-openrouter-key") || "",
  };
}

function persistSettings() {
  localStorage.setItem("ntm-ai-enabled", game.settings.aiEnabled ? "1" : "0");
  localStorage.setItem("ntm-model-id", game.settings.modelId || DEFAULT_MODEL_ID);
  localStorage.setItem("ntm-remember-key", game.settings.rememberKey ? "1" : "0");
  sessionStorage.setItem("ntm-openrouter-key", game.settings.apiKey || "");

  if (game.settings.rememberKey && game.settings.apiKey) {
    localStorage.setItem("ntm-openrouter-key", game.settings.apiKey);
  } else {
    localStorage.removeItem("ntm-openrouter-key");
  }
}

function syncInputsFromSettings() {
  elements.aiToggle.checked = game.settings.aiEnabled;
  elements.apiKeyInput.value = game.settings.apiKey;
  elements.modelInput.value = game.settings.modelId;
  elements.rememberKeyToggle.checked = game.settings.rememberKey;
}

function syncSettingsFromInputs() {
  game.settings.aiEnabled = elements.aiToggle.checked;
  game.settings.apiKey = elements.apiKeyInput.value.trim();
  game.settings.modelId = elements.modelInput.value.trim() || DEFAULT_MODEL_ID;
  game.settings.rememberKey = elements.rememberKeyToggle.checked;
}

async function runCommand(rawCommand) {
  const command = rawCommand.trim();
  if (!command) return;

  syncSettingsFromInputs();
  persistSettings();
  elements.executeButton.disabled = true;
  elements.executeButton.textContent = "解析中";

  let intent;
  let mode = "LOCAL";

  try {
    if (game.settings.aiEnabled && game.settings.apiKey) {
      try {
        const aiIntent = await withTimeout(
          parseWithOpenRouter(command),
          OPENROUTER_TOTAL_TIMEOUT_MS + 1000,
          "OpenRouter 解析超时",
        );
        applyTokenUsage(aiIntent.usage);
        const playableIntent = preferExecutableIntent(aiIntent, command);
        intent = playableIntent.intent;
        mode = playableIntent.mode;
      } catch (error) {
        console.error(error);
        appendLog("系统", `OpenRouter 调用失败：${readableError(error)}。`);
        intent = parseLocally(command);
        intent.summary = `AI 请求失败，本轮转入本地解析。${intent.summary}`;
        intent.skipDialoguePolish = true;
      }
    } else {
      intent = parseLocally(command);
      if (game.settings.aiEnabled) {
        appendLog("系统", "AI 解析已开启，但未检测到 OpenRouter Key，本轮转入本地解析。");
        intent.skipDialoguePolish = true;
      }
    }

    await applyIntent(intent, command, mode);
  } finally {
    elements.executeButton.disabled = false;
    updateCommandChannelUi();
  }
}

async function parseWithOpenRouter(command) {
  const systemPrompt = [
    "你是《南天门计划》的舰载指令解析 AI。",
    "玩家是探索舰昆仑号舰长。你要把自然语言舰长令解析为可执行游戏动作。",
    "游戏是关卡制：每关有目的地、航程进度、随机事件。若存在 activeEvent，优先解析玩家如何处理该事件。",
    "只返回 JSON，不要 markdown，不要解释。",
    "动作 type 只能使用：ignite, ignore_event, set_course, adjust_speed, toggle_shield, scan, communicate, repair, power_reallocate, stealth, launch_probe, dock, stand_down, unknown。",
    "JSON 结构：",
    '{"summary":"一句中文解析摘要","risk":"low|medium|high","actions":[{"type":"scan","target":"异常信标","npc":"何弈","value":60,"enabled":true,"message":"通讯内容"}],"npcReplies":[{"npc":"何弈","line":"NPC 中文回应"}],"logs":["中文日志"],"missionText":"一句当前态势"}',
    "如果玩家要和 NPC 沟通，必须给 communicate 动作，并给 npcReplies。",
    "不要用 npcReplies 复述每个动作结果；点火、航线、航速、维修、扫描等操作会由游戏系统产生船员反馈。",
    "除非玩家明确询问、私聊、呼叫某个 NPC，或命令本身就是通信，否则 npcReplies 返回空数组。",
    "如果 statePayload.commandChannel 是某个 NPC，玩家没有点名时也默认是在和该 NPC 私聊。",
    "如果玩家在解决随机事件，actions 必须体现具体方案，例如 communicate+scan、repair+adjust_speed、stealth+launch_probe。",
    "数值 value 取 0 到 100；速度 speed 取 0 到 8。",
  ].join("\n");

  const level = currentLevel();
  const activeEvent = getActiveEvent();
  const privateNpcId = currentPrivateNpcId();

  const statePayload = {
    captainOrder: command,
    commandChannel: privateNpcId
      ? { type: "private", npc: NPCS[privateNpcId].name, role: NPCS[privateNpcId].role }
      : { type: "group", name: "舰桥群聊" },
    level: {
      id: level.id,
      name: level.name,
      objective: level.objective,
      destination: level.destination,
      progress: game.level.progress,
      requiredEvents: level.requiredEvents,
      eventsResolved: game.level.eventsResolved,
      ignoredEvents: game.level.ignoredEvents,
      unresolvedThreads: game.level.unresolvedThreads.map(({ title, triggered, resolved, escalationTurn }) => ({
        title,
        triggered,
        resolved,
        escalationTurn,
      })),
      activeEvent: activeEvent
        ? {
            category: activeEvent.category,
            title: activeEvent.title,
            text: activeEvent.text,
            hint: activeEvent.hint,
            ignoreText: activeEvent.ignoreText || "",
          }
        : null,
    },
    mission: {
      phase: game.mission.phase,
      phaseLabel: PHASE_LABELS[game.mission.phase] || game.mission.phase,
    },
    ship: {
      location: game.ship.location,
      target: game.ship.target,
      posture: game.ship.posture,
      alert: game.ship.alert,
      speed: game.ship.speed,
      hull: game.ship.hull,
      shield: game.ship.shield,
      energy: game.ship.energy,
      heat: game.ship.heat,
      scanner: game.ship.scanner,
    },
    npcs: Object.values(NPCS).map(({ name, role, status, specialty }) => ({
      name,
      role,
      status,
      specialty,
    })),
    knownTargets: Object.keys(TARGETS),
    recentLogs: game.logs.slice(0, 5).map((entry) => entry.text),
  };

  const result = await callOpenRouterJson({
    systemPrompt,
    payload: statePayload,
    temperature: 0.35,
    maxTokens: 800,
  });

  const intent = normalizeIntent(result.parsed, command);
  intent.usage = result.usage;
  intent.modelId = result.model;
  return intent;
}

function openRouterHeaders() {
  const headers = {
    Authorization: `Bearer ${game.settings.apiKey}`,
    "Content-Type": "application/json",
    "X-OpenRouter-Title": "Nantianmen Plan Demo",
  };

  if (window.location.origin && window.location.origin !== "null") {
    headers["HTTP-Referer"] = window.location.origin;
  }

  return headers;
}

async function callOpenRouterJson({
  systemPrompt,
  payload,
  temperature = 0.35,
  maxTokens = 700,
  requestTimeoutMs = OPENROUTER_REQUEST_TIMEOUT_MS,
  totalTimeoutMs = OPENROUTER_TOTAL_TIMEOUT_MS,
}) {
  const preferredModel = game.settings.modelId || DEFAULT_MODEL_ID;
  const models = [...new Set([preferredModel, ...OPENROUTER_FALLBACK_MODELS])];
  let lastError = null;
  const startedAt = Date.now();

  for (const model of models) {
    const remainingMs = totalTimeoutMs - (Date.now() - startedAt);
    if (remainingMs <= 0) break;

    try {
      const response = await fetchWithTimeout(
        OPENROUTER_ENDPOINT,
        {
          method: "POST",
          headers: openRouterHeaders(),
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: JSON.stringify(payload) },
            ],
            temperature,
            max_tokens: maxTokens,
            response_format: { type: "json_object" },
          }),
        },
        Math.min(requestTimeoutMs, remainingMs),
      );

      const text = await response.text();
      if (!response.ok) {
        lastError = new Error(`${model} -> ${response.status} ${text.slice(0, 180)}`);
        if (response.status === 401) break;
        continue;
      }

      const data = JSON.parse(text);
      const content = data.choices?.[0]?.message?.content || "{}";
      return {
        model,
        parsed: parseModelJson(content),
        usage: data.usage,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("OpenRouter 请求超时或没有返回可用结果");
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`OpenRouter 请求超时（${Math.ceil(timeoutMs / 1000)} 秒）`);
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function withTimeout(promise, timeoutMs, message) {
  let timeoutId = null;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timeoutId !== null) window.clearTimeout(timeoutId);
  });
}

function parseModelJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("模型没有返回 JSON");
    }
    return JSON.parse(match[0]);
  }
}

function normalizeIntent(raw, command) {
  const actions = Array.isArray(raw.actions) ? raw.actions : [];
  const normalizedActions = actions.map(normalizeAction).filter(Boolean);

  if (normalizedActions.length === 0) {
    normalizedActions.push({ type: "unknown", message: command });
  }

  return {
    summary: asText(raw.summary || raw.intent || "AI 已解析舰长令。"),
    risk: asText(raw.risk || "low"),
    actions: normalizedActions,
    npcReplies: normalizeNpcReplies(raw.npcReplies || raw.comms || raw.communications),
    logs: normalizeStringArray(raw.logs),
    missionText: asText(raw.missionText || raw.mission || ""),
  };
}

function preferExecutableIntent(aiIntent, command) {
  if (hasExecutableAction(aiIntent)) {
    return { intent: aiIntent, mode: "AI" };
  }

  const localIntent = parseLocally(command);
  if (!hasExecutableAction(localIntent)) {
    return { intent: aiIntent, mode: "AI" };
  }

  localIntent.summary = `AI 未返回可执行动作，已转入本地解析。${localIntent.summary}`;
  localIntent.skipDialoguePolish = true;
  return { intent: localIntent, mode: "LOCAL" };
}

function hasExecutableAction(intent) {
  return Boolean(intent?.actions?.some((action) => action.type && action.type !== "unknown"));
}

function normalizeAction(action) {
  if (!action || typeof action !== "object") return null;
  const rawType = String(action.type || action.action || "unknown").trim();
  const type = ACTION_ALIASES[rawType] || rawType;
  return {
    ...action,
    type,
    target: asText(action.target || action.destination || ""),
    npc: asText(action.npc || action.character || ""),
    message: asText(action.message || action.utterance || action.content || ""),
    value: numberOrNull(action.value),
    speed: numberOrNull(action.speed),
    enabled: typeof action.enabled === "boolean" ? action.enabled : undefined,
  };
}

function normalizeNpcReplies(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((reply) => {
      if (typeof reply === "string") return { npc: "heyi", line: reply };
      if (!reply || typeof reply !== "object") return null;
      return {
        npc: asText(reply.npc || reply.name || "heyi"),
        line: asText(reply.line || reply.text || reply.message || ""),
      };
    })
    .filter((reply) => reply && reply.line);
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asText(item)).filter(Boolean);
}

function parseLocally(command) {
  const actions = [];
  const replies = [];
  const logs = [];
  const target = detectTarget(command);
  const npc = detectNpc(command) || currentPrivateNpcId();

  if (/点火|起飞|启航|离港|发射|启动.*推进|启动飞船|主推进/.test(command)) {
    actions.push({ type: "ignite" });
  }

  if (game.level.activeEvent && /忽略|不处理|先不管|跳过|放着|继续点火|继续航行/.test(command)) {
    actions.push({ type: "ignore_event" });
  }

  if (target && /前往|驶向|航向|去|到|靠近|抵达|同步|航线|推进|全速/.test(command)) {
    actions.push({ type: "set_course", target });
  }

  if (/全速|最大航速|跃迁|加速|推进/.test(command)) {
    actions.push({ type: "adjust_speed", speed: /全速|最大|跃迁/.test(command) ? 6 : 3.4 });
  } else if (/减速|降速|低速|慢速|悬停|停止|刹停|暂停推进/.test(command)) {
    actions.push({ type: "adjust_speed", speed: /停止|悬停|刹停|暂停推进/.test(command) ? 0 : 0.8 });
  }

  if (/扫描|探测|侦测|传感|雷达|谱线|阵列/.test(command)) {
    actions.push({ type: "scan", target: target || "前方空域", value: /全频|深度|全部/.test(command) ? 88 : 62 });
  }

  if (/护盾|力场|防御/.test(command)) {
    actions.push({ type: "toggle_shield", enabled: !/关闭|收起|待机|下线/.test(command), value: 68 });
  }

  if (/能源|功率|反应堆|转给|分配/.test(command)) {
    actions.push({ type: "power_reallocate", target: detectPowerTarget(command), value: /全部|最大|优先/.test(command) ? 78 : 58 });
  }

  if (/静默|隐蔽|低功率|潜航|熄灯/.test(command)) {
    actions.push({ type: "stealth", enabled: !/解除|取消|退出/.test(command) });
  }

  if (/探针|无人机|浮标/.test(command)) {
    actions.push({ type: "launch_probe", target: target || "异常信标" });
  }

  if (/维修|修复|抢修|检修/.test(command)) {
    actions.push({ type: "repair", target: /引擎|推进/.test(command) ? "engine" : "hull", value: 14 });
  }

  if (/呼叫|联系|通讯|询问|告诉|问|对.*说|汇报/.test(command) || npc) {
    const npcId = npc || "ailan";
    actions.push({ type: "communicate", npc: npcId, message: command });
    replies.push({ npc: npcId, line: buildLocalNpcReply(npcId, command, target) });
  }

  if (/停泊|对接|入港|靠泊/.test(command)) {
    actions.push({ type: "dock", target: target || "小行星带补给站" });
  }

  if (actions.length === 0) {
    actions.push({ type: "unknown", message: command });
    logs.push("舰载解析器未找到明确动作，已记录为开放指令。");
  }

  return {
    summary: `本地解析为 ${summarizeActionTypes(actions)}。`,
    risk: /异常|警戒|护盾|静默|全速|跃迁/.test(command) ? "medium" : "low",
    actions,
    npcReplies: replies,
    logs,
    missionText: "",
  };
}

async function applyIntent(intent, command, mode) {
  game.turn += 1;
  game.ship.lastCommandMode = mode;
  game.ship.lastCommandModel = intent.modelId || game.settings.modelId || DEFAULT_MODEL_ID;
  game.lastCaptainOrder = command;
  appendCaptainChat(command, collectCaptainTargets(intent, command));
  appendLog("舰长令", command);
  const existingChatIds = new Set(game.chat.map((entry) => entry.id));

  const contextualHandled = handleContextualFollowUp(intent, command);
  if (!contextualHandled) {
    intent.actions.forEach((action) => applyAction(action));
  }
  const eventWasResolved = contextualHandled || resolveActiveEvent(intent, command);

  if (!contextualHandled) {
    intent.logs.forEach((line) => appendLog(mode === "AI" ? "AI 解析" : "本地解析", line));
    intent.npcReplies.forEach((reply) => appendComms(resolveNpcId(reply.npc), reply.line));
  }

  if (intent.risk === "high") {
    setAlert("red");
  } else if (intent.risk === "medium" && game.ship.alert !== "red") {
    setAlert("yellow");
  }

  if (intent.missionText) {
    elements.missionText.textContent = intent.missionText;
  }

  elements.analysisText.textContent = `${mode === "AI" ? "AI" : "本地"}：${intent.summary}`;

  if (shouldAdvanceJourney(command, intent)) {
    if (game.level.activeEvent) {
      const activeEvent = getActiveEvent();
      appendLog("关卡", `航程暂停：需要先处理「${activeEvent?.title || "随机事件"}」。`);
    } else if (!eventWasResolved) {
      advanceJourney("舰长令");
    }
  }

  checkUnresolvedThreads();
  checkPassiveRisks();
  checkLevelCompletion();

  const newCrewReplies = game.chat.filter((entry) => entry.type === "crew" && !existingChatIds.has(entry.id));
  const polishedCount = await polishNewCrewReplies(command, newCrewReplies, intent, mode);
  if (polishedCount > 0) {
    elements.analysisText.textContent = `${mode === "AI" ? "AI" : "本地"}：${intent.summary}；AI 角色演出 ${polishedCount} 条。`;
  }

  renderAll();
}

function collectCaptainTargets(intent, command) {
  const targets = new Set();
  const privateNpcId = currentPrivateNpcId();

  if (privateNpcId) targets.add(privateNpcId);
  detectExplicitNpcIds(command).forEach((npcId) => targets.add(npcId));

  intent.actions.forEach((action) => {
    if (!action.npc) return;
    targets.add(resolveNpcId(action.npc));
  });

  return [...targets];
}

async function polishNewCrewReplies(command, newCrewReplies, intent, mode) {
  if (!shouldUseAiDialogue(intent, newCrewReplies)) return 0;

  const entries = newCrewReplies.slice(-8).map((entry) => ({
    id: entry.id,
    npc: entry.npcId,
    speaker: entry.speaker,
    line: entry.text,
  }));

  if (entries.length === 0) return 0;

  try {
    elements.executeButton.textContent = "生成通讯中";
    const result = await withTimeout(
      generateNpcDialogueWithOpenRouter(command, entries, intent, mode),
      OPENROUTER_DIALOGUE_TIMEOUT_MS,
      "角色演出生成超时",
    );
    applyTokenUsage(result.usage);
    return applyPolishedReplies(result.replies, entries);
  } catch (error) {
    console.error(error);
    appendLog("系统", `角色演出生成失败：${readableError(error)}。已保留本地通讯。`);
    return 0;
  }
}

function shouldUseAiDialogue(intent, newCrewReplies) {
  return Boolean(
    game.settings.aiEnabled &&
      game.settings.apiKey &&
      !intent.skipDialoguePolish &&
      Array.isArray(newCrewReplies) &&
      newCrewReplies.some((entry) => entry.type === "crew"),
  );
}

async function generateNpcDialogueWithOpenRouter(command, entries, intent, mode) {
  const systemPrompt = [
    "你是《南天门计划》的 NPC 角色演出导演。",
    "你的任务是把已经确定的船员回复改写得更像舰桥群聊里的真人角色。",
    "绝对不要改变游戏事实、行动结果、状态变化、事件是否解决、数值、地点、目标或风险等级。",
    "不要新增未发生的动作；不要替舰长做新决定；不要把失败写成成功。",
    "每条回复保留原意，中文，1 到 2 句，最多 70 个汉字。",
    "语气自然、有角色差异，但克制专业；不要使用表情、括号舞台指示、旁白或 markdown。",
    "减少机械的“收到/已完成/建议”，但关键任务信息必须留下。",
    "角色卡：",
    "林澈，轮机长：务实、嘴硬、关心反应堆和维修，偶尔带疲惫的直率。",
    "艾岚，导航官：冷静精确，关注航线、姿态、窗口和偏航。",
    "何弈，科学官：好奇但谨慎，关注异常、样本、扫描证据。",
    "秦昭，安保官：短句、果断，关注隔离、护盾、秩序和人员安全。",
    "只返回 JSON，不要解释。",
    'JSON 结构：{"replies":[{"id":"原 id","line":"改写后的台词"}]}',
  ].join("\n");

  const level = currentLevel();
  const activeEvent = getActiveEvent();
  const payload = {
    captainOrder: command,
    parseMode: mode,
    intentSummary: intent.summary,
    commandChannel: currentPrivateNpcId() || "all",
    mission: {
      level: `${level.id} ${level.name}`,
      phase: PHASE_LABELS[game.mission.phase] || game.mission.phase,
      progress: Math.round(game.level.progress),
      posture: game.ship.posture,
      alert: game.ship.alert,
    },
    activeEvent: activeEvent
      ? {
          title: activeEvent.title,
          category: activeEvent.category,
          text: activeEvent.text,
          hint: activeEvent.hint,
        }
      : null,
    unresolvedThreads: game.level.unresolvedThreads.map(({ title, triggered, resolved }) => ({
      title,
      triggered,
      resolved,
    })),
    recentChat: game.chat.slice(-8).map((entry) => ({
      type: entry.type,
      speaker: formatChatSpeaker(entry),
      text: entry.text,
    })),
    repliesToRewrite: entries,
  };

  const result = await callOpenRouterJson({
    systemPrompt,
    payload,
    temperature: 0.78,
    maxTokens: 700,
    totalTimeoutMs: OPENROUTER_DIALOGUE_TIMEOUT_MS,
  });

  return {
    replies: normalizePolishedReplies(result.parsed.replies),
    usage: result.usage,
    model: result.model,
  };
}

function normalizePolishedReplies(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((reply) => ({
      id: asText(reply?.id),
      line: sanitizeNpcLine(reply?.line || reply?.text || reply?.message),
    }))
    .filter((reply) => reply.id && reply.line);
}

function sanitizeNpcLine(value) {
  return asText(value).replace(/\s+/g, " ").replace(/^["“]|["”]$/g, "").slice(0, 120);
}

function applyPolishedReplies(polishedReplies, originalEntries) {
  const originalIds = new Set(originalEntries.map((entry) => entry.id));
  let changed = 0;

  polishedReplies.forEach((reply) => {
    if (!originalIds.has(reply.id)) return;
    const chatEntry = game.chat.find((entry) => entry.id === reply.id);
    const commsEntry = game.comms.find((entry) => entry.id === reply.id);
    if (!chatEntry || !reply.line || reply.line === chatEntry.text) return;
    chatEntry.text = reply.line;
    if (commsEntry) commsEntry.text = reply.line;
    changed += 1;
  });

  return changed;
}

function handleContextualFollowUp(intent, command) {
  if (handleMonkeyFollowUp(command)) {
    intent.summary = "结合上下文处理为 安保隔离、维修恢复。";
    return true;
  }
  return false;
}

function handleMonkeyFollowUp(command) {
  const text = String(command || "");
  const activeEvent = game.level.activeEvent;
  const activeIsMonkey = activeEvent?.id === "cabin-monkey";
  const activeEventDef = activeIsMonkey ? EVENT_DECK[activeEvent.id] : null;
  const monkeyThread = game.level.unresolvedThreads.find(
    (thread) => thread.id === "loose-monkey" && !thread.resolved,
  );

  if (!activeIsMonkey && !monkeyThread) return false;
  if (/杀|击毙|射杀|处决|弄死|打死/.test(text)) return false;
  if (!/猴子|货舱|维护管线|管线|扫描阵列|它|这只|那只/.test(text)) return false;
  if (!/关|锁|封|隔离|抓|捕|控制|看住|收容/.test(text)) return false;

  appendComms("qin", "收到，舰长。安保组封锁货舱并设置软隔离网，我会把猴子从维护管线旁诱导到隔离箱。");
  appendComms("lin", "维修组开始复位扫描阵列维护束线，后续我会把管线口加一道防护闸。");
  appendLog(activeIsMonkey ? "事件解决" : "补救处置", "安保组隔离货舱猴子，维修组复位扫描阵列维护束线。");
  applyStatEffects({ scanner: 6, morale: 2, energy: -1 });

  if (monkeyThread) {
    monkeyThread.resolved = true;
    monkeyThread.triggered = true;
  }

  if (activeIsMonkey) {
    if (activeEventDef?.countsForLevel !== false) {
      game.level.eventsResolved += 1;
    }
    game.level.activeEvent = null;
    game.mission.phase = "cruise";
    game.ui.selectedEventTab = "phase";
    game.ui.eventDockExpanded = true;
    game.ship.posture = "巡航";
  } else {
    game.ui.selectedEventTab = "all";
    game.ui.eventDockExpanded = true;
  }

  if (game.ship.alert !== "red") {
    setAlert("yellow");
  }
  return true;
}

function applyAction(action) {
  switch (action.type) {
    case "ignite":
      igniteShip();
      break;
    case "ignore_event":
      ignoreActiveEvent();
      break;
    case "set_course":
      setCourse(action.target);
      break;
    case "adjust_speed":
      setSpeed(action.speed ?? action.value);
      break;
    case "toggle_shield":
      toggleShield(action.enabled, action.value);
      break;
    case "scan":
      scanTarget(action.target, action.value);
      break;
    case "communicate":
      communicate(action.npc, action.message);
      break;
    case "repair":
      repairSystem(action.target, action.value);
      break;
    case "power_reallocate":
      reallocatePower(action.target, action.value);
      break;
    case "stealth":
      setStealth(action.enabled !== false);
      break;
    case "launch_probe":
      launchProbe(action.target);
      break;
    case "dock":
      dockAt(action.target);
      break;
    case "stand_down":
      standDown();
      break;
    default:
      appendLog("舰载 AI", "指令保留在开放队列，等待更明确的舰长令。");
      if (!game.level.activeEvent) {
        appendComms("ailan", "舰长，这条命令没有形成可执行动作。请指定航线、航速、扫描、通讯、维修或能源分配。");
      }
  }
}

function igniteShip() {
  if (game.level.activeEvent) return;

  if (game.mission.phase !== "awaiting_ignition" && game.mission.phase !== "preflight") {
    appendLog("推进", "主推进已经在线，点火指令被并入当前航行节奏。");
    return;
  }

  game.mission.phase = "launch";
  game.mission.ignitionPulse = 1;
  game.ship.speed = 2.6;
  game.ship.posture = "点火加速";
  game.ship.energy = clamp(game.ship.energy - 8, 0, 100);
  game.ship.heat = clamp(game.ship.heat + 11, 0, 100);
  setAlert("yellow");
  appendLog("点火", "主推进点火，昆仑号离开待命姿态，进入月背航线。");
  appendComms("lin", "主推进燃烧稳定，热负荷上升但还在绿区边缘。");
  appendComms("ailan", "姿态修正完成，航线窗口已接管到手动确认模式。");
  elements.missionText.textContent = "昆仑号已点火起航。起飞段会优先触发船员与舰内突发考验。";
}

function ignoreActiveEvent() {
  const eventDef = getActiveEvent();
  if (!eventDef) {
    appendLog("舰载 AI", "当前没有需要忽略的活跃事件。");
    return;
  }

  applyStatEffects(eventDef.ignoreEffects || eventDef.pressureEffects || {});
  game.level.ignoredEvents += 1;
  appendLog("事件忽略", eventDef.ignoreResult || `「${eventDef.title}」被标记为暂不处理。`);
  appendComms(eventDef.npc, eventDef.ignoreComms || "收到，舰长。该问题会被挂起，但风险不会自动消失。");

  if (eventDef.unresolvedThread) {
    game.level.unresolvedThreads.push({
      ...eventDef.unresolvedThread,
      eventId: game.level.activeEvent.id,
      escalationTurn: game.turn + (eventDef.unresolvedThread.turnDelay || 2),
      triggered: false,
    });
  }

  game.level.activeEvent = null;
  game.mission.phase = "cruise";
  game.ui.selectedEventTab = game.level.unresolvedThreads.length > 0 ? "threads" : "phase";
  game.ui.eventDockExpanded = true;
  if (eventDef.stage === "launch") {
    game.ship.posture = "巡航";
  }
  setAlert("yellow");
}

function setCourse(target) {
  const resolvedTarget = TARGETS[target] ? target : detectTarget(target) || "异常信标";
  game.ship.target = resolvedTarget;
  game.ship.posture = "转向";
  game.ship.energy = clamp(game.ship.energy - 3, 0, 100);
  appendLog("导航", `航线重算完成，目标更新为 ${resolvedTarget}。`);
  appendComms("ailan", `${resolvedTarget} 已进入主航路，我会把偏航控制在 0.4 度以内。`);
}

function setSpeed(value) {
  const speed = clamp(Number(value ?? game.ship.speed), 0, 8);
  if ((game.mission.phase === "awaiting_ignition" || game.mission.phase === "preflight") && speed > 0) {
    appendLog("推进", "推进系统等待点火授权。请先下令点火。");
    return;
  }
  game.ship.speed = Number(speed.toFixed(1));
  game.ship.posture = speed === 0 ? "悬停" : speed > 4.8 ? "高速推进" : "巡航";
  game.ship.energy = clamp(game.ship.energy - Math.ceil(speed / 2), 0, 100);
  game.ship.heat = clamp(game.ship.heat + Math.ceil(speed * 1.6), 0, 100);
  appendLog("推进", `航速调整为 ${game.ship.speed.toFixed(1)} c-f。`);
}

function toggleShield(enabled, value) {
  const next = enabled === false ? 12 : clamp(value ?? 66, 20, 100);
  game.ship.shield = next;
  game.ship.energy = clamp(game.ship.energy - (enabled === false ? 1 : 6), 0, 100);
  setAlert(enabled === false ? "green" : "yellow");
  appendLog("防御", enabled === false ? "护盾转入待机。" : `护盾上线，强度 ${next}%。`);
  appendComms("qin", enabled === false ? "甲板戒备降级，保留近距传感。" : "护盾环完整，登舰风险已压低。");
}

function scanTarget(target, value) {
  const scanPower = clamp(value ?? 60, 15, 100);
  game.ship.scanner = clamp(Math.max(game.ship.scanner, scanPower), 0, 100);
  game.ship.energy = clamp(game.ship.energy - Math.ceil(scanPower / 20), 0, 100);
  game.ship.heat = clamp(game.ship.heat + Math.ceil(scanPower / 16), 0, 100);
  scannerPulse = 1;
  game.revealed.anomaly = true;
  appendLog("科学", `${target || "前方空域"} 扫描完成，发现窄带脉冲与非自然热斑。`);
  appendComms("heyi", "谱线不像普通信标，舰长。它在回应我们的扫描节奏。");
}

function communicate(npc, message) {
  const npcId = resolveNpcId(npc);
  if (!message) {
    appendComms(npcId, buildLocalNpcReply(npcId, "", game.ship.target));
  }
}

function repairSystem(target, value) {
  const amount = clamp(value ?? 12, 4, 28);
  if (/engine|引擎|推进/.test(String(target))) {
    game.ship.engine = clamp(game.ship.engine + amount, 0, 100);
    appendLog("轮机", `推进系统完成检修，效率提升 ${amount} 点。`);
  } else {
    game.ship.hull = clamp(game.ship.hull + amount, 0, 100);
    appendLog("轮机", `外壳与管线完成抢修，船体完整度提升 ${amount} 点。`);
  }
  game.ship.energy = clamp(game.ship.energy - 5, 0, 100);
  game.ship.heat = clamp(game.ship.heat + 4, 0, 100);
  appendComms("lin", "维修组已经就位，热负荷还在可控区间。");
}

function reallocatePower(target, value) {
  const amount = clamp(value ?? 55, 20, 90);
  const powerTarget = detectPowerTarget(target || "");
  if (powerTarget === "scanner") {
    game.ship.scanner = clamp(amount, 0, 100);
    appendLog("能源", `扫描阵列功率调整到 ${amount}%。`);
  } else if (powerTarget === "shield") {
    game.ship.shield = clamp(amount, 0, 100);
    appendLog("能源", `护盾电容功率调整到 ${amount}%。`);
  } else {
    game.ship.engine = clamp(amount, 0, 100);
    appendLog("能源", `推进系统功率调整到 ${amount}%。`);
  }
  game.ship.energy = clamp(game.ship.energy - 4, 0, 100);
  appendComms("lin", "能源总线已重配，短时峰值不会伤到反应堆。");
}

function setStealth(enabled) {
  game.ship.stealth = enabled;
  game.ship.posture = enabled ? "静默航行" : "巡航";
  game.ship.speed = enabled ? Math.min(game.ship.speed, 1.1) : Math.max(game.ship.speed, 1.4);
  game.ship.heat = enabled ? clamp(game.ship.heat - 8, 0, 100) : clamp(game.ship.heat + 3, 0, 100);
  game.ship.shield = enabled ? Math.min(game.ship.shield, 38) : game.ship.shield;
  appendLog("舰桥", enabled ? "全舰静默，主动辐射压低。" : "静默规程解除，舰桥恢复常规功率。");
}

function launchProbe(target) {
  const resolvedTarget = target || game.ship.target;
  game.revealed.probe = true;
  game.ship.energy = clamp(game.ship.energy - 5, 0, 100);
  appendLog("飞控", `无人探针已发射，航向 ${resolvedTarget}。`);
  appendComms("heyi", "探针遥测清晰，我会把回波交给主阵列比对。");
}

function dockAt(target) {
  const resolvedTarget = target || "小行星带补给站";
  game.ship.location = resolvedTarget;
  game.ship.target = resolvedTarget;
  game.ship.speed = 0;
  game.ship.posture = "对接";
  game.ship.energy = clamp(game.ship.energy + 10, 0, 100);
  appendLog("导航", `${resolvedTarget} 对接程序完成。`);
}

function standDown() {
  game.ship.speed = 0;
  game.ship.posture = "待命";
  game.ship.alert = "green";
  game.ship.heat = clamp(game.ship.heat - 10, 0, 100);
  appendLog("舰桥", "昆仑号进入待命态势。");
}

function shouldAdvanceJourney(command, intent) {
  if (game.level.complete || game.level.campaignComplete) return false;
  if (game.mission.phase === "awaiting_ignition" || game.mission.phase === "preflight") return false;
  const text = String(command || "");
  const actionTypes = new Set(intent.actions.map((action) => action.type));
  return (
    /点火|起飞|启航|继续|航行|推进|前进|驶向|前往|抵达|航线|加速|全速/.test(text) ||
    actionTypes.has("ignite") ||
    actionTypes.has("set_course") ||
    actionTypes.has("adjust_speed")
  );
}

function advanceJourney(source) {
  if (game.level.activeEvent || game.level.complete) return;
  const level = currentLevel();
  const speedGain = game.ship.speed > 0 ? game.ship.speed * 2.7 : 3;
  const engineGain = game.ship.engine / 22;
  const drag = game.ship.heat > 70 ? 4 : game.ship.energy < 30 ? 3 : 0;
  const gain = Math.round(clamp(8 + speedGain + engineGain - drag, 6, 24));
  game.level.progress = clamp(game.level.progress + gain, 0, 100);
  game.ship.energy = clamp(game.ship.energy - Math.max(2, Math.round(gain / 8)), 0, 100);
  game.ship.heat = clamp(game.ship.heat + Math.max(1, Math.round(game.ship.speed / 2)), 0, 100);
  appendLog("关卡", `${source}推进航程 +${gain}%，当前 ${Math.round(game.level.progress)}%。`);
  simulateTravel();

  if (maybeTriggerPhaseEvent()) {
    return;
  }

  if (!maybeTriggerLevelEvent()) {
    checkLevelCompletion();
  }
}

function maybeTriggerPhaseEvent() {
  if (game.mission.phase !== "launch" || game.mission.launchEventTriggered) return false;
  if (game.level.progress < 8) return false;
  game.mission.launchEventTriggered = true;
  triggerLevelEvent("cabin-monkey");
  return true;
}

function maybeTriggerLevelEvent() {
  const level = currentLevel();
  if (game.level.activeEvent || game.level.complete) return false;
  const milestoneIndex = level.eventMilestones.findIndex((milestone, index) => {
    return game.level.progress >= milestone && !game.level.eventsSeen.includes(`milestone-${index}`);
  });

  if (milestoneIndex === -1) return false;
  game.level.eventsSeen.push(`milestone-${milestoneIndex}`);
  triggerLevelEvent();
  return true;
}

function triggerLevelEvent(forcedEventId = "") {
  const level = currentLevel();
  const usedEventIds = game.level.eventsSeen.filter((id) => !id.startsWith("milestone-"));
  const available = level.eventPool.filter((eventId) => !usedEventIds.includes(eventId));
  const eventId = forcedEventId || (available.length > 0 ? randomItem(available) : randomItem(level.eventPool));
  const eventDef = EVENT_DECK[eventId];
  if (!eventDef) return;

  game.level.eventsSeen.push(eventId);
  game.level.activeEvent = {
    id: eventId,
    attempts: 0,
    startedTurn: game.turn,
  };
  game.mission.phase = "event";
  game.ui.selectedEventTab = "active";
  game.ui.eventDockExpanded = true;
  if (eventDef.stage === "launch") {
    game.ship.posture = "点火加速";
  }
  applyStatEffects(eventDef.startEffects);
  setAlert(eventDef.risk === "red" ? "red" : "yellow");
  appendLog(eventDef.category, `触发事件：「${eventDef.title}」。`);
  appendComms(eventDef.npc, `${eventDef.text} ${eventDef.hint}`);
  elements.commandInput.value = eventDef.options[0];
}

function resolveActiveEvent(intent, command) {
  if (!game.level.activeEvent) return false;
  const eventDef = getActiveEvent();
  if (!eventDef) {
    game.level.activeEvent = null;
    return false;
  }

  const score = scoreEventSolution(eventDef, intent, command);
  if (score >= (eventDef.solutions.threshold || 2)) {
    applyStatEffects(eventDef.successEffects);
    if (eventDef.countsForLevel !== false) {
      game.level.eventsResolved += 1;
    }
    game.level.activeEvent = null;
    game.mission.phase = "cruise";
    game.ui.selectedEventTab = "phase";
    game.ui.eventDockExpanded = true;
    if (eventDef.stage === "launch") {
      game.ship.posture = "巡航";
    }
    game.level.progress = clamp(game.level.progress + 6, 0, 100);
    appendLog("事件解决", eventDef.successText);
    appendComms(eventDef.npc, eventDef.successText);
    if (game.ship.alert !== "red" || eventDef.risk === "red") {
      setAlert(game.ship.hull < 45 || game.ship.oxygen < 45 ? "red" : "yellow");
    }
    return true;
  }

  game.level.activeEvent.attempts += 1;
  applyStatEffects(eventDef.pressureEffects);
  appendLog("事件未解", `${eventDef.title} 仍在持续。${eventDef.hint}`);
  appendComms(eventDef.npc, buildEventFailureReply(eventDef, command, score, game.level.activeEvent.attempts));
  return false;
}

function buildEventFailureReply(eventDef, command, score, attempts) {
  const text = String(command || "");
  if (/杀|击毙|射杀|处决|弄死|打死/.test(text)) {
    return `舰长，不建议直接伤害目标。${eventDef.title}需要可控处置，请明确封锁、扫描、诱导或保护关键管线。`;
  }
  if (score <= 0) {
    return `舰长，这道命令还没有形成可执行处置。${eventDef.hint}`;
  }
  if (attempts >= 2) {
    return `舰长，方案还不够完整。请明确谁执行、做什么，以及要保护哪一处风险点。${eventDef.hint}`;
  }
  return `收到，但方案还缺少关键动作。可以直接下令：${eventDef.options[0] || eventDef.hint}`;
}

function scoreEventSolution(eventDef, intent, command) {
  const actionTypes = new Set(intent.actions.map((action) => action.type));
  const npcIds = new Set(intent.actions.map((action) => resolveNpcId(action.npc)).filter(Boolean));
  const text = String(command || "");
  let score = 0;

  if (eventDef.solutions.actions.some((type) => actionTypes.has(type))) score += 1;
  if (eventDef.solutions.npcs.some((npcId) => npcIds.has(npcId) || text.includes(NPCS[npcId]?.name))) score += 1;
  if (eventDef.solutions.keywords.some((keyword) => text.includes(keyword))) score += 1;
  if (intent.actions.length >= 2) score += 1;
  return score;
}

function getActiveEvent() {
  return game.level.activeEvent ? EVENT_DECK[game.level.activeEvent.id] : null;
}

function checkLevelCompletion() {
  const level = currentLevel();
  if (game.level.complete || game.level.activeEvent) return;

  if (game.level.progress >= 100 && game.level.eventsResolved >= level.requiredEvents) {
    game.level.complete = true;
    game.ship.location = level.destination;
    game.ship.target = level.destination;
    game.ship.speed = 0;
    game.ship.posture = "抵达";
    game.mission.phase = "arrived";
    setAlert("green");
    appendLog("关卡完成", level.success);
    appendComms("ailan", `${level.name} 完成。${level.success}`);
    elements.missionText.textContent = level.success;
    return;
  }

  if (game.level.progress >= 100 && game.level.eventsResolved < level.requiredEvents) {
    game.level.progress = 94;
    appendLog("关卡", "已抵近目的地，但还有未处理的航段风险，必须再解决一次事件才能完成关卡。");
    triggerLevelEvent();
  }
}

function checkPassiveRisks() {
  if (game.ship.heat > 84 && !game.level.activeEvent) {
    appendLog("告警", "热负荷已进入危险区，下一次航程推进可能触发舰船事件。");
    setAlert("yellow");
  }
  if (game.ship.energy < 18 && !game.level.activeEvent) {
    appendLog("能源", "主电容余量过低，建议重配能源或降低航速。");
    setAlert("yellow");
  }
  if (game.ship.hull < 32 || game.ship.oxygen < 35) {
    setAlert("red");
  }
}

function checkUnresolvedThreads() {
  game.level.unresolvedThreads.forEach((thread) => {
    if (thread.resolved || thread.triggered || game.turn < thread.escalationTurn) return;
    thread.triggered = true;
    applyStatEffects(thread.effects || {});
    appendLog("遗留后果", thread.logText || `${thread.title} 开始影响当前航段。`);
    appendComms(thread.commNpc || "ailan", thread.commText || "舰长，先前挂起的问题正在影响当前任务节奏。");
    game.ui.eventDockExpanded = true;
    if (!game.level.activeEvent) {
      game.ui.selectedEventTab = "all";
    }
    setAlert("yellow");
  });
}

function applyStatEffects(effects = {}) {
  Object.entries(effects).forEach(([key, delta]) => {
    if (typeof game.ship[key] !== "number") return;
    game.ship[key] = clamp(game.ship[key] + Number(delta), 0, 100);
  });
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function simulateTravel() {
  const target = TARGETS[game.ship.target];
  if (!target || game.ship.speed <= 0) return;

  const dx = target.x - game.ship.x;
  const dy = target.y - game.ship.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 3) {
    game.ship.location = game.ship.target;
    game.ship.posture = game.ship.speed > 0 ? "抵近" : game.ship.posture;
    return;
  }

  const step = Math.min(distance, game.ship.speed * 1.8);
  game.ship.x += (dx / distance) * step;
  game.ship.y += (dy / distance) * step;
  game.ship.heading = (Math.atan2(dy, dx) * 180) / Math.PI;

  if (distance < 18) {
    game.ship.location = `${game.ship.target} 近域`;
  } else {
    game.ship.location = "深空航渡";
  }
}

function maybeTriggerWorldEvent() {
  if (game.turn < 2 || game.turn % 3 !== 0) return;

  if (game.ship.heat > 72) {
    game.ship.hull = clamp(game.ship.hull - 3, 0, 100);
    appendLog("告警", "热负荷穿过安全阈值，外层散热板出现微振。");
    appendComms("lin", "我建议降速或转入静默，别让散热板继续硬扛。");
    setAlert("yellow");
  } else if (game.revealed.anomaly && game.ship.target === "异常信标") {
    appendLog("科学", "异常信标的脉冲间隔缩短，像是在等待回应。");
  } else if (game.ship.energy < 28) {
    appendLog("能源", "主电容余量偏低，长距离推进将受限。");
    appendComms("lin", "给我一次重配窗口，我能把推进和生命维持都保住。");
  }
}

function detectTarget(text) {
  const value = String(text || "");
  if (/木卫二|欧罗巴/.test(value)) return "木卫二轨道";
  if (/月背|L2|中继/.test(value)) return "月背 L2 中继站";
  if (/火星|货运/.test(value)) return "火星货运廊道";
  if (/土星|外缘/.test(value)) return "土星外缘";
  if (/异常|信标|热斑|未知/.test(value)) return "异常信标";
  if (/小行星|补给|港/.test(value)) return "小行星带补给站";
  return TARGETS[value] ? value : "";
}

function detectNpc(text) {
  const value = String(text || "");
  if (/林澈|轮机|工程|反应堆|能源|维修/.test(value)) return "lin";
  if (/艾岚|导航|航线|航向|速度/.test(value)) return "ailan";
  if (/何弈|科学|扫描|谱线|异常|样本/.test(value)) return "heyi";
  if (/秦昭|安保|护盾|戒备|隔离|登舰|封锁|关押|关起来|关住|抓住|捕获|收容|货舱/.test(value)) return "qin";
  return "";
}

function detectExplicitNpcIds(text) {
  const value = String(text || "");
  const matches = [];
  if (/林澈|轮机长|轮机组|轮机舱/.test(value)) matches.push("lin");
  if (/艾岚|导航官|导航席/.test(value)) matches.push("ailan");
  if (/何弈|科学官|科学席/.test(value)) matches.push("heyi");
  if (/秦昭|安保官|安保组|安保席/.test(value)) matches.push("qin");
  return matches;
}

function detectPowerTarget(text) {
  const value = String(text || "");
  if (/扫描|雷达|传感|阵列|科学/.test(value)) return "scanner";
  if (/护盾|防御|力场/.test(value)) return "shield";
  return "engine";
}

function resolveNpcId(value) {
  const text = String(value || "");
  if (NPCS[text]) return text;
  const detected = detectNpc(text);
  if (detected) return detected;
  const found = Object.values(NPCS).find((npc) => npc.name === text || npc.role === text);
  return found?.id || "ailan";
}

function buildLocalNpcReply(npcId, command, target) {
  if (npcId === "lin") {
    return /热|静默|低功率/.test(command)
      ? "我会压住反应堆输出，热源曲线十秒后收敛。"
      : "轮机舱收到，能源总线可以支撑这次操作。";
  }
  if (npcId === "heyi") {
    return target
      ? `${target} 的读数不自然，我建议先用探针接触。`
      : "科学阵列在线，我会盯住任何非自然回波。";
  }
  if (npcId === "qin") {
    return "安保组进入戒备，护盾和隔离门都能立即接管。";
  }
  return target ? `${target} 航线已标绘，舰长。` : "导航席收到，等待你的下一道航行命令。";
}

function summarizeActionTypes(actions) {
  const names = {
    ignite: "点火",
    ignore_event: "忽略事件",
    set_course: "航线",
    adjust_speed: "航速",
    toggle_shield: "护盾",
    scan: "扫描",
    communicate: "通讯",
    repair: "维修",
    power_reallocate: "能源重配",
    stealth: "静默",
    launch_probe: "探针",
    dock: "对接",
    unknown: "开放指令",
  };
  return [...new Set(actions.map((action) => names[action.type] || action.type))].join("、");
}

function appendLog(source, text) {
  game.logs.unshift({
    id: crypto.randomUUID(),
    turn: game.turn,
    source,
    text,
  });
  game.logs = game.logs.slice(0, 36);
}

function appendComms(npcId, text, meta = {}) {
  const npc = NPCS[npcId] || NPCS.ailan;
  const entry = {
    id: crypto.randomUUID(),
    turn: game.turn,
    npcId: npc.id,
    channel: meta.channel || npc.id,
    speaker: `${npc.name} · ${npc.role}`,
    text,
  };
  game.comms.unshift(entry);
  game.comms = game.comms.slice(0, 24);
  game.chat.push({ ...entry, type: "crew" });
  game.chat = game.chat.slice(-48);
}

function appendCaptainChat(text, targetNpcIds = []) {
  const targets = [...new Set(targetNpcIds.filter((npcId) => NPCS[npcId]))];
  game.chat.push({
    id: crypto.randomUUID(),
    turn: game.turn,
    type: "captain",
    channel: targets.length === 1 ? targets[0] : "all",
    targetNpcIds: targets,
    speaker: "舰长",
    text,
  });
  game.chat = game.chat.slice(-48);
}

function setAlert(level) {
  game.ship.alert = level;
}

function applyTokenUsage(usage) {
  if (!usage) return;
  const prompt = usage.prompt_tokens || usage.prompt || 0;
  const completion = usage.completion_tokens || usage.completion || 0;
  const total = usage.total_tokens || usage.total || prompt + completion;
  game.tokens.prompt += Number(prompt) || 0;
  game.tokens.completion += Number(completion) || 0;
  game.tokens.total += Number(total) || 0;
}

function renderAll() {
  syncInputsFromSettings();
  renderBridge();
  renderLevel();
  renderEvent();
  renderQuickCommands();
  renderInteraction();
  renderLogs();
  renderNpcs();
  renderComms();
  renderSystems();
  renderLevelList();
}

function renderQuickCommands() {
  const buttons = $$(".quick-command");
  if (buttons.length < 3) return;
  const activeEvent = getActiveEvent();
  const privateNpcId = currentPrivateNpcId();
  const privateNpc = privateNpcId ? NPCS[privateNpcId] : null;
  const presets = activeEvent
    ? [
        ["按建议处理", activeEvent.options[0] || "呼叫相关船员处理当前事件。"],
        ["询问船员", `呼叫${NPCS[activeEvent.npc]?.name || "相关船员"}汇报当前事件细节。`],
        ["忽略此事", activeEvent.ignoreText || "忽略当前事件，继续航行。"],
      ]
    : privateNpc
      ? [
          [`询问${privateNpc.name}`, `${privateNpc.name}，汇报你负责系统的状态。`],
          ["下达任务", privateTaskPreset(privateNpcId)],
          ["同步舰桥", `${privateNpc.name}，把你的判断同步到舰桥频道。`],
        ]
    : game.mission.phase === "awaiting_ignition"
      ? [
          ["下令点火", "下令点火，启动主推进，进入月背航线。"],
          ["复核报备", "呼叫全体船员复核点火状态。"],
          ["能源预热", "让林澈预热主推进能源总线，准备点火。"],
        ]
      : [
          ["继续航行", "继续航行，保持关卡航线，并让导航官艾岚监控偏航。"],
          ["船员沟通", "呼叫相关船员汇报情况，先安抚船员再处理风险。"],
          ["危机处理", "开启护盾，把能源转给扫描阵列，发射无人探针侦察未知源。"],
        ];

  buttons.forEach((button, index) => {
    const [label, command] = presets[index];
    button.textContent = label;
    button.dataset.command = command;
  });
}

function privateTaskPreset(npcId) {
  const presets = {
    lin: "林澈，检查反应堆和能源总线，准备维修风险点。",
    ailan: "艾岚，复核当前航线和航速，标出下一段偏航风险。",
    heyi: "何弈，扫描前方空域并判断异常信号来源。",
    qin: "秦昭，复核货舱、隔离门和护盾状态，准备安保处置。",
  };
  return presets[npcId] || "汇报你的岗位状态，并给出下一步建议。";
}

function renderBridge() {
  const level = currentLevel();
  elements.levelValue.textContent = `${level.id} ${level.name}`;
  elements.locationValue.textContent = game.ship.location;
  elements.targetValue.textContent = game.ship.target;
  elements.progressValue.textContent = `${Math.round(game.level.progress)}%`;
  elements.speedValue.textContent = `航速：${game.ship.speed.toFixed(1)} c-f`;
  elements.postureValue.textContent = `姿态：${game.ship.posture}`;
  elements.tokenPill.textContent = `Tokens ${game.tokens.total}`;
  elements.modePill.textContent =
    game.ship.lastCommandMode === "AI" ? `AI ${game.ship.lastCommandModel || game.settings.modelId}` : "LOCAL";

  elements.alertPill.textContent = game.ship.alert.toUpperCase();
  elements.alertPill.className = "readout";
  if (game.ship.alert === "red") elements.alertPill.classList.add("readout-red");
  else if (game.ship.alert === "yellow") elements.alertPill.classList.add("readout-yellow");
  else elements.alertPill.classList.add("readout-green");
}

function renderLevel() {
  const level = currentLevel();
  const activeEvent = getActiveEvent();
  elements.levelCode.textContent = `关卡 ${currentLevelNumber()}`;
  elements.levelName.textContent = level.name;
  elements.levelObjective.textContent = level.objective;
  elements.journeyProgressBar.style.width = `${clamp(game.level.progress, 0, 100)}%`;
  elements.levelDestination.textContent = `目的地：${level.destination}`;
  elements.levelEvents.textContent = `事件：${game.level.eventsResolved}/${level.requiredEvents} · 忽略：${game.level.ignoredEvents}`;
  elements.levelRisk.textContent = `风险：${level.risk}`;
  elements.nextLevelButton.hidden = !game.level.complete || game.level.campaignComplete;
  elements.advanceButton.disabled = Boolean(activeEvent) || game.level.complete || game.level.campaignComplete;
  elements.advanceButton.textContent = activeEvent
    ? "事件处理中"
    : game.level.complete
      ? "关卡完成"
      : game.mission.phase === "awaiting_ignition"
        ? "下令点火"
        : "继续航行";

  elements.levelStatePill.className = "readout";
  if (game.level.campaignComplete) {
    elements.levelStatePill.textContent = "战役完成";
    elements.levelStatePill.classList.add("readout-green");
  } else if (game.level.complete) {
    elements.levelStatePill.textContent = "已完成";
    elements.levelStatePill.classList.add("readout-green");
  } else if (activeEvent) {
    elements.levelStatePill.textContent = "事件";
    elements.levelStatePill.classList.add(activeEvent.risk === "red" ? "readout-red" : "readout-yellow");
  } else if (game.mission.phase === "awaiting_ignition" || game.mission.phase === "launch") {
    elements.levelStatePill.textContent = PHASE_LABELS[game.mission.phase];
    elements.levelStatePill.classList.add(game.mission.phase === "launch" ? "readout-yellow" : "readout-green");
  } else {
    elements.levelStatePill.textContent = PHASE_LABELS[game.mission.phase] || "航行中";
    elements.levelStatePill.classList.add(level.risk === "高" ? "readout-yellow" : "readout-green");
  }
}

function renderEvent() {
  const activeEvent = getActiveEvent();
  const eventItems = buildEventOverview(activeEvent);
  const openThreads = game.level.unresolvedThreads.filter((thread) => !thread.resolved);
  const selectedTab = normalizeEventTabSelection(activeEvent, eventItems, openThreads);
  game.ui.selectedEventTab = selectedTab;

  elements.eventDock.classList.toggle("expanded", game.ui.eventDockExpanded || Boolean(activeEvent) || eventItems.length > 0);
  elements.eventDock.classList.toggle("has-event", Boolean(activeEvent));
  elements.eventDockTitle.textContent = eventDockTitle(activeEvent, openThreads, eventItems);

  elements.eventRail.innerHTML = [
    eventTabButton("phase", "航段状态", PHASE_LABELS[game.mission.phase] || "航段", selectedTab),
    eventTabButton("active", "当前事件", activeEvent ? activeEvent.title : "待触发", selectedTab, activeEvent ? "!" : ""),
    eventTabButton("all", "全部事件", eventItems.length ? `${eventItems.length} 项记录` : "暂无事件", selectedTab, eventItems.length ? String(eventItems.length) : ""),
    eventTabButton("threads", "遗留隐患", openThreads.length ? `${openThreads.length} 个未了` : "暂无隐患", selectedTab, openThreads.length ? String(openThreads.length) : ""),
  ].join("");

  if (selectedTab === "all") {
    renderEventOverview(eventItems);
    return;
  }

  if (selectedTab === "threads") {
    renderThreadDetails(openThreads);
    return;
  }

  if (selectedTab === "phase" || !activeEvent) {
    renderPhaseDetails(openThreads);
    return;
  }

  renderActiveEventDetails(activeEvent);
}

function normalizeEventTabSelection(activeEvent, eventItems, openThreads) {
  const allowedTabs = new Set(["phase", "active", "all", "threads"]);
  let selectedTab = allowedTabs.has(game.ui.selectedEventTab) ? game.ui.selectedEventTab : "";

  if (!selectedTab) {
    selectedTab = activeEvent ? "active" : eventItems.length ? "all" : "phase";
  }
  if (selectedTab === "active" && !activeEvent) {
    selectedTab = eventItems.length ? "all" : "phase";
  }
  if (selectedTab === "threads" && openThreads.length === 0) {
    selectedTab = eventItems.length ? "all" : "phase";
  }
  if (selectedTab === "all" && eventItems.length === 0) {
    selectedTab = activeEvent ? "active" : "phase";
  }
  return selectedTab;
}

function eventDockTitle(activeEvent, openThreads, eventItems) {
  if (activeEvent && openThreads.length > 0) return "多事件并行";
  if (activeEvent) return "当前事件";
  if (openThreads.length > 0 || eventItems.length > 0) return "事件总览";
  return "航段节奏";
}

function eventTabButton(id, label, detail, selectedTab, badge = "") {
  return `
    <button class="event-tab ${selectedTab === id ? "active" : ""}" type="button" data-event-tab="${id}">
      <span>
        <small>${escapeHtml(label)}</small>
        <em>${escapeHtml(detail)}</em>
      </span>
      ${badge ? `<strong>${escapeHtml(badge)}</strong>` : ""}
    </button>
  `;
}

function renderPhaseDetails(pendingThreads) {
  elements.eventPanel.classList.remove("active", "danger");
  elements.eventCategory.textContent = PHASE_LABELS[game.mission.phase] || "航段节奏";
  if (game.level.complete) {
    elements.eventTitle.textContent = "关卡完成";
    elements.eventText.textContent = "本关目标已达成，可以进入下一关。";
  } else if (game.mission.phase === "awaiting_ignition") {
    elements.eventTitle.textContent = "等待舰长点火";
    elements.eventText.textContent = "船员已完成报备。输入“点火/启航/启动主推进”，或点击主按钮进入航行。";
  } else if (game.mission.phase === "launch") {
    elements.eventTitle.textContent = "点火加速";
    elements.eventText.textContent = "主推进正在拉升。起飞段会优先出现舰内突发考验，舰长需要决定处理或忽略。";
  } else {
    elements.eventTitle.textContent = "航线稳定";
    elements.eventText.textContent = pendingThreads.length
      ? "当前航段暂时稳定，但仍有被忽略的问题挂在风险队列里。"
      : "当前航段没有危机。继续航行会推进关卡进度，并可能触发下一次随机事件。";
  }
  elements.eventOptions.innerHTML = "";
}

function buildEventOverview(activeEvent) {
  const items = [];

  if (activeEvent) {
    items.push({
      id: "active-event",
      status: "当前",
      tone: activeEvent.risk === "red" ? "danger" : "warning",
      category: activeEvent.category,
      title: activeEvent.title,
      text: activeEvent.text,
      meta: `${NPCS[activeEvent.npc]?.name || "船员"}负责 · ${activeEvent.hint}`,
      primaryLabel: "按建议处理",
      primaryCommand: activeEvent.options[0] || "",
      secondaryLabel: activeEvent.ignoreText ? "忽略此事" : "",
      secondaryCommand: activeEvent.ignoreText || "",
    });
  }

  game.level.unresolvedThreads.forEach((thread) => {
    const sourceEvent = EVENT_DECK[thread.eventId] || {};
    const status = thread.resolved ? "已补救" : thread.triggered ? "已反噬" : "待复核";
    const tone = thread.resolved ? "resolved" : thread.triggered ? "danger" : "warning";
    const timing = thread.resolved
      ? "补救完成"
      : thread.triggered
        ? "后果已发生"
        : `预计 T+${String(thread.escalationTurn || game.turn + 1).padStart(2, "0")} 反噬`;

    items.push({
      id: thread.id,
      status,
      tone,
      category: sourceEvent.category || "遗留隐患",
      title: thread.title,
      text: thread.resolved
        ? "这个问题已经完成补救，后续不会继续推进风险。"
        : thread.triggered
          ? thread.logText || thread.commText || "被忽略的问题已经影响当前航段。"
          : `来自「${sourceEvent.title || thread.title}」的挂起后果，需要在后续航段前复核。`,
      meta: timing,
      primaryLabel: thread.resolved ? "" : "处理隐患",
      primaryCommand: thread.resolved ? "" : buildThreadRecoveryCommand(thread, sourceEvent),
      secondaryLabel: thread.resolved ? "" : "询问详情",
      secondaryCommand: thread.resolved ? "" : `呼叫相关船员汇报「${thread.title}」当前状态和补救风险。`,
    });
  });

  return items;
}

function buildThreadRecoveryCommand(thread, sourceEvent) {
  if (thread.id === "loose-monkey") {
    return "呼叫秦昭封锁货舱并收容猴子，林澈复位扫描阵列维护束线。";
  }
  return `复核「${thread.title}」，让相关船员执行补救方案，优先处理${sourceEvent.title || "遗留风险"}。`;
}

function renderEventOverview(eventItems) {
  elements.eventPanel.classList.toggle("active", eventItems.length > 0);
  elements.eventPanel.classList.remove("danger");
  elements.eventCategory.textContent = "事件总览";
  elements.eventTitle.textContent = eventItems.length ? `${eventItems.length} 项事件记录` : "暂无事件";
  elements.eventText.textContent = eventItems.length
    ? "这里同时显示当前事件、挂起隐患、已反噬后果和已补救事项。"
    : "当前航段没有需要回看的事件。";
  elements.eventOptions.innerHTML = eventItems.length
    ? `<div class="event-stack">${eventItems.map(renderEventCard).join("")}</div>`
    : "";
}

function renderEventCard(item) {
  const primaryButton = item.primaryCommand
    ? `<button type="button" data-command="${escapeHtml(item.primaryCommand)}">${escapeHtml(item.primaryLabel)}</button>`
    : "";
  const secondaryButton = item.secondaryCommand
    ? `<button class="subtle-option" type="button" data-command="${escapeHtml(item.secondaryCommand)}">${escapeHtml(item.secondaryLabel)}</button>`
    : "";

  return `
    <article class="event-card ${escapeHtml(item.tone)}">
      <div class="event-card-head">
        <span class="event-status">${escapeHtml(item.status)}</span>
        <small>${escapeHtml(item.category)}</small>
      </div>
      <h4>${escapeHtml(item.title)}</h4>
      <p>${escapeHtml(item.text)}</p>
      <em>${escapeHtml(item.meta)}</em>
      ${primaryButton || secondaryButton ? `<div class="event-card-actions">${primaryButton}${secondaryButton}</div>` : ""}
    </article>
  `;
}

function renderThreadDetails(pendingThreads) {
  elements.eventPanel.classList.toggle("active", pendingThreads.length > 0);
  elements.eventPanel.classList.remove("danger");
  elements.eventCategory.textContent = "遗留隐患";
  elements.eventTitle.textContent = pendingThreads.length ? `${pendingThreads.length} 个问题未了` : "暂无遗留隐患";
  elements.eventText.textContent = pendingThreads.length
    ? pendingThreads
        .map((thread) =>
          thread.triggered
            ? `「${thread.title}」已经反噬当前航段。`
            : `「${thread.title}」预计会在后续航段反噬。`,
        )
        .join(" ")
    : "被忽略的事件会出现在这里，并在后续阶段产生后果。";
  elements.eventOptions.innerHTML = pendingThreads.length
    ? `<div class="event-stack">${pendingThreads.map((thread) => renderEventCard(buildThreadOverviewItem(thread))).join("")}</div>`
    : "";
}

function buildThreadOverviewItem(thread) {
  return buildEventOverview(null).find((item) => item.id === thread.id) || {
    id: thread.id,
    status: "待复核",
    tone: "warning",
    category: "遗留隐患",
    title: thread.title,
    text: "这个问题仍未解决，需要舰长复核。",
    meta: "等待处理",
    primaryLabel: "处理隐患",
    primaryCommand: buildThreadRecoveryCommand(thread, EVENT_DECK[thread.eventId] || {}),
  };
}

function renderActiveEventDetails(activeEvent) {
  elements.eventPanel.classList.add("active");
  elements.eventPanel.classList.toggle("danger", activeEvent.risk === "red");
  elements.eventCategory.textContent = activeEvent.category;
  elements.eventTitle.textContent = activeEvent.title;
  elements.eventText.textContent = activeEvent.text;
  const optionButtons = activeEvent.options.map(
    (option) => `
      <button type="button" data-command="${escapeHtml(option)}">${escapeHtml(option)}</button>
    `,
  );

  if (activeEvent.ignoreText) {
    optionButtons.push(`
      <button class="ignore-option" type="button" data-command="${escapeHtml(activeEvent.ignoreText)}">
        ${escapeHtml(activeEvent.ignoreText)}
      </button>
    `);
  }

  elements.eventOptions.innerHTML = optionButtons.join("");
}

function renderInteraction() {
  if (elements.captainLastOrder) {
    elements.captainLastOrder.textContent = game.lastCaptainOrder || "等待舰长下令。";
  }

  updateCommandChannelUi();

  const thread = visibleCommandThread();
  elements.commandCommsPreview.innerHTML = thread.length
    ? thread.map(renderChatMessage).join("")
    : renderEmptyChannelMessage();
  elements.commandCommsPreview.scrollTop = elements.commandCommsPreview.scrollHeight;
}

function updateCommandChannelUi() {
  const channel = game.ui.commandChannel || "all";
  const npc = NPCS[channel];

  elements.channelSelector
    ?.querySelectorAll("[data-channel]")
    .forEach((button) => button.classList.toggle("active", button.dataset.channel === channel));

  if (npc) {
    elements.commandChannelKicker.textContent = "舰长私聊";
    elements.commandChannelTitle.textContent = `${npc.name} · ${npc.role}`;
    if (!elements.executeButton.disabled) {
      elements.executeButton.textContent = `私聊${npc.name}`;
    }
  } else {
    elements.commandChannelKicker.textContent = "舰桥群聊";
    elements.commandChannelTitle.textContent = "昆仑号通讯频道";
    if (!elements.executeButton.disabled) {
      elements.executeButton.textContent = "发送至舰桥";
    }
  }
}

function visibleCommandThread() {
  const privateNpcId = currentPrivateNpcId();
  const thread = privateNpcId
    ? game.chat.filter((entry) => chatEntryMatchesPrivateNpc(entry, privateNpcId))
    : game.chat;
  return thread.slice(-12);
}

function chatEntryMatchesPrivateNpc(entry, npcId) {
  if (entry.type === "crew") return entry.npcId === npcId;
  return entry.channel === npcId || (entry.targetNpcIds || []).includes(npcId);
}

function renderEmptyChannelMessage() {
  const npc = NPCS[currentPrivateNpcId()];
  const avatar = npc?.initial || "舰";
  const speaker = npc ? `${npc.name} · ${npc.role}` : "舰桥系统";
  const text = npc ? `${npc.name}的私聊频道已打开，等待舰长发言。` : "频道待命，等待舰长下令。";
  return `<article class="chat-message crew-message">
    <div class="npc-avatar mini">${escapeHtml(avatar)}</div>
    <div>
      <span>${escapeHtml(speaker)}</span>
      <p>${escapeHtml(text)}</p>
    </div>
  </article>`;
}

function renderChatMessage(entry) {
  const directClass = currentPrivateNpcId() || (entry.targetNpcIds || []).length ? " direct-message" : "";
  const speaker = formatChatSpeaker(entry);
  if (entry.type === "captain") {
    return `
      <article class="chat-message captain-message${directClass}">
        <span>${escapeHtml(speaker)}</span>
        <p>${escapeHtml(entry.text)}</p>
      </article>
    `;
  }

  const npc = NPCS[entry.npcId] || NPCS.ailan;
  return `
    <article class="chat-message crew-message${directClass}">
      <div class="npc-avatar mini">${escapeHtml(npc.initial)}</div>
      <div>
        <span>${escapeHtml(speaker)}</span>
        <p>${escapeHtml(entry.text)}</p>
      </div>
    </article>
  `;
}

function formatChatSpeaker(entry) {
  if (entry.type !== "captain") return entry.speaker;
  const targetNames = (entry.targetNpcIds || []).map((npcId) => NPCS[npcId]?.name).filter(Boolean);
  return targetNames.length ? `${entry.speaker} → ${targetNames.join("、")}` : entry.speaker;
}

function renderLogs() {
  elements.logList.innerHTML = game.logs
    .slice(0, 14)
    .map(
      (entry) => `
        <article class="log-item">
          <span class="log-meta">T+${String(entry.turn).padStart(2, "0")} · ${escapeHtml(entry.source)}</span>
          <span class="log-text">${escapeHtml(entry.text)}</span>
        </article>
      `,
    )
    .join("");
}

function renderNpcs() {
  elements.npcList.innerHTML = Object.values(NPCS)
    .map(
      (npc) => `
        <button class="npc-card ${game.ui.commandChannel === npc.id ? "active" : ""}" type="button" data-private-channel="${escapeHtml(npc.id)}">
          <div class="npc-avatar">${escapeHtml(npc.initial)}</div>
          <div>
            <h3>${escapeHtml(npc.name)} · ${escapeHtml(npc.role)}</h3>
            <p>${escapeHtml(npc.status)} / ${escapeHtml(npc.specialty)}</p>
          </div>
        </button>
      `,
    )
    .join("");
}

function renderComms() {
  elements.commsTranscript.innerHTML = game.chat
    .slice(-18)
    .map(
      (entry) => `
        <article class="comms-line ${entry.type === "captain" ? "captain-line" : ""}">
          <span class="comms-meta">T+${String(entry.turn).padStart(2, "0")} · ${escapeHtml(formatChatSpeaker(entry))}</span>
          <span class="comms-text">${escapeHtml(entry.text)}</span>
        </article>
      `,
    )
    .join("");
}

function renderSystems() {
  const systems = [
    { name: "船体完整度", value: game.ship.hull, lowBad: true },
    { name: "护盾强度", value: game.ship.shield, lowBad: true },
    { name: "能源余量", value: game.ship.energy, lowBad: true },
    { name: "反应堆热负荷", value: game.ship.heat, highBad: true },
    { name: "推进效率", value: game.ship.engine, lowBad: true },
    { name: "扫描阵列", value: game.ship.scanner, lowBad: true },
    { name: "生命维持", value: game.ship.oxygen, lowBad: true },
    { name: "船员状态", value: game.ship.morale, lowBad: true },
  ];

  elements.systemGrid.innerHTML = systems
    .map((system) => {
      const meterClass = meterState(system);
      return `
        <article class="system-row">
          <header>
            <h3>${escapeHtml(system.name)}</h3>
            <span>${Math.round(system.value)}%</span>
          </header>
          <div class="meter ${meterClass}"><div style="width: ${clamp(system.value, 0, 100)}%"></div></div>
        </article>
      `;
    })
    .join("");
}

function renderLevelList() {
  elements.levelList.innerHTML = `
    <span class="panel-kicker">关卡链路</span>
    ${LEVELS.map((level, index) => {
      const isCurrent = index === game.level.index;
      const isDone = index < game.level.index || (isCurrent && game.level.complete);
      const status = isDone ? "已完成" : isCurrent ? "进行中" : "未解锁";
      return `
        <article class="level-row ${isCurrent ? "active" : ""}">
          <div>
            <strong>${escapeHtml(level.id)} · ${escapeHtml(level.name)}</strong>
            <p>${escapeHtml(level.objective)}</p>
          </div>
          <span>${escapeHtml(status)}</span>
        </article>
      `;
    }).join("")}
  `;
}

function meterState(system) {
  if (system.highBad) {
    if (system.value > 82) return "danger";
    if (system.value > 64) return "warning";
    return "";
  }
  if (system.lowBad) {
    if (system.value < 24) return "danger";
    if (system.value < 48) return "warning";
  }
  return "";
}

function setActiveTab(name) {
  $$(".tab-button").forEach((button) => button.classList.toggle("active", button.dataset.tab === name));
  $$(".tab-panel").forEach((panel) => panel.classList.remove("active"));
  $(`#${name}Tab`).classList.add("active");
  if (name === "source" && elements.sourceCode) loadSourceFile(game.sourceFile);
}

function initSourceViewer() {
  if (!elements.sourceToolbar || !elements.sourceCode) return;

  elements.sourceToolbar.innerHTML = SOURCE_FILES.map(
    (file) => `<button class="source-tab" data-path="${file.path}" type="button">${file.label}</button>`,
  ).join("");

  $$(".source-tab").forEach((button) => {
    button.addEventListener("click", () => loadSourceFile(button.dataset.path));
  });

  loadSourceFile(game.sourceFile);
}

async function loadSourceFile(path) {
  if (!elements.sourceCode) return;

  game.sourceFile = path;
  $$(".source-tab").forEach((button) => button.classList.toggle("active", button.dataset.path === path));
  try {
    const response = await fetch(`${path}?v=${Date.now()}`);
    if (!response.ok) throw new Error(`${response.status}`);
    elements.sourceCode.textContent = await response.text();
  } catch (error) {
    elements.sourceCode.textContent = `无法读取 ${path}。\n请通过本地 HTTP 服务打开 demo，例如：python -m http.server 5177`;
  }
}

function createStars(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 1.8 + 0.4,
    depth: Math.random() * 0.8 + 0.2,
    tint: Math.random() > 0.82 ? "amber" : Math.random() > 0.62 ? "jade" : "white",
  }));
}

function resizeCanvas() {
  const rect = elements.canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvasSize = {
    width: Math.max(1, rect.width),
    height: Math.max(1, rect.height),
    dpr,
  };
  elements.canvas.width = Math.floor(canvasSize.width * dpr);
  elements.canvas.height = Math.floor(canvasSize.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawScene(time) {
  const { width, height } = canvasSize;
  if (width <= 1 || height <= 1) {
    requestAnimationFrame(drawScene);
    return;
  }

  ctx.clearRect(0, 0, width, height);
  drawBackground(width, height);
  drawStarfield(width, height, time);
  drawNavGrid(width, height, time);
  drawRoute(width, height);
  drawTargets(width, height, time);
  const shake = game.mission.ignitionPulse * Math.sin(time * 0.07) * 5;
  drawShip(width / 2 + shake, height / 2 + shake * 0.35, time);

  scannerPulse = Math.max(0, scannerPulse - 0.012);
  game.mission.ignitionPulse = Math.max(0, game.mission.ignitionPulse - 0.01);
  requestAnimationFrame(drawScene);
}

function drawBackground(width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#050705");
  gradient.addColorStop(0.52, "#0b100d");
  gradient.addColorStop(1, "#130d09");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(69, 230, 191, 0.045)";
  ctx.fillRect(0, 0, width, height * 0.18);
  ctx.fillStyle = "rgba(255, 189, 89, 0.035)";
  ctx.fillRect(0, height * 0.74, width, height * 0.26);
}

function drawStarfield(width, height, time) {
  const drift = time * 0.006 * Math.max(game.ship.speed + game.mission.ignitionPulse * 2.8, 0.2);
  for (const star of stars) {
    const x = modulo(star.x * width - game.ship.x * star.depth * 1.7 - drift * star.depth, width);
    const y = modulo(star.y * height - game.ship.y * star.depth * 1.2, height);
    if (star.tint === "jade") ctx.fillStyle = "rgba(69, 230, 191, 0.68)";
    else if (star.tint === "amber") ctx.fillStyle = "rgba(255, 189, 89, 0.72)";
    else ctx.fillStyle = "rgba(238, 245, 232, 0.74)";
    ctx.globalAlpha = 0.45 + star.depth * 0.55;
    ctx.beginPath();
    ctx.arc(x, y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawNavGrid(width, height, time) {
  const spacing = 72;
  const offset = modulo(time * 0.01 * (game.ship.speed + game.mission.ignitionPulse * 2), spacing);
  ctx.strokeStyle = "rgba(215, 231, 214, 0.09)";
  ctx.lineWidth = 1;

  for (let x = -spacing; x < width + spacing; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x + offset, 0);
    ctx.lineTo(x - width * 0.08 + offset, height);
    ctx.stroke();
  }

  for (let y = -spacing; y < height + spacing; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y + offset * 0.4);
    ctx.lineTo(width, y - height * 0.08 + offset * 0.4);
    ctx.stroke();
  }
}

function drawRoute(width, height) {
  const target = TARGETS[game.ship.target];
  if (!target) return;
  const start = { x: width / 2, y: height / 2 };
  const end = worldToScreen(target, width, height);

  ctx.strokeStyle = "rgba(69, 230, 191, 0.34)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 9]);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawTargets(width, height, time) {
  Object.entries(TARGETS).forEach(([name, target]) => {
    if (target.type === "anomaly" && !game.revealed.anomaly) return;
    const point = worldToScreen(target, width, height);
    const pulse = Math.sin(time * 0.004 + target.x) * 0.5 + 0.5;
    const isActive = name === game.ship.target;
    const radius = isActive ? 10 + pulse * 4 : 6;

    ctx.strokeStyle =
      target.type === "anomaly" ? "rgba(232, 91, 98, 0.72)" : "rgba(255, 189, 89, 0.6)";
    ctx.fillStyle = target.type === "anomaly" ? "rgba(232, 91, 98, 0.16)" : "rgba(255, 189, 89, 0.12)";
    ctx.lineWidth = isActive ? 2 : 1;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (isActive || target.type === "anomaly") {
      ctx.fillStyle = "rgba(237, 245, 234, 0.86)";
      ctx.font = "12px Microsoft YaHei, sans-serif";
      ctx.fillText(name, point.x + 14, point.y + 4);
    }
  });
}

function worldToScreen(target, width, height) {
  const scale = Math.max(1.5, Math.min(width, height) / 180);
  const x = width / 2 + (target.x - game.ship.x) * scale;
  const y = height / 2 + (target.y - game.ship.y) * scale;
  return {
    x: clamp(x, 28, width - 120),
    y: clamp(y, 96, height - 96),
  };
}

function drawShip(x, y, time) {
  const heading = ((game.ship.heading || 0) * Math.PI) / 180;
  const shieldRadius = 46 + Math.sin(time * 0.006) * 3;

  if (game.ship.shield > 18) {
    ctx.strokeStyle = `rgba(69, 230, 191, ${0.12 + game.ship.shield / 260})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, shieldRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (scannerPulse > 0) {
    ctx.strokeStyle = `rgba(255, 189, 89, ${scannerPulse * 0.6})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 60 + (1 - scannerPulse) * 140, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(heading);

  ctx.fillStyle = "#dce7dc";
  ctx.strokeStyle = "rgba(69, 230, 191, 0.75)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(34, 0);
  ctx.lineTo(-18, -17);
  ctx.lineTo(-10, 0);
  ctx.lineTo(-18, 17);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#101811";
  ctx.beginPath();
  ctx.moveTo(17, 0);
  ctx.lineTo(-4, -7);
  ctx.lineTo(-1, 7);
  ctx.closePath();
  ctx.fill();

  if (game.ship.speed > 0.5 && !game.ship.stealth) {
    const thrust = game.ship.speed + game.mission.ignitionPulse * 4;
    ctx.fillStyle = "rgba(255, 189, 89, 0.72)";
    ctx.beginPath();
    ctx.moveTo(-18, -7);
    ctx.lineTo(-35 - thrust * 2.8, 0);
    ctx.lineTo(-18, 7);
    ctx.closePath();
    ctx.fill();

    if (game.mission.ignitionPulse > 0.08) {
      ctx.fillStyle = `rgba(69, 230, 191, ${0.16 + game.mission.ignitionPulse * 0.36})`;
      ctx.beginPath();
      ctx.moveTo(-16, -4);
      ctx.lineTo(-44 - thrust * 3.2, 0);
      ctx.lineTo(-16, 4);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
}

function readableError(error) {
  return String(error?.message || error || "未知错误").replace(/\s+/g, " ").slice(0, 160);
}

function asText(value) {
  return String(value ?? "").trim();
}

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value)));
}

function modulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
