const STORAGE_KEY = "lanai-hire-bridge-v2";
const moneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
});

const app = document.querySelector("#app");
const brandNameNode = document.querySelector("#brandName");
const siteNav = document.querySelector("#siteNav");
const navToggle = document.querySelector("#navToggle");
const dashboardButton = document.querySelector("#dashboardButton");
const logoutButton = document.querySelector("#logoutButton");
const modalRoot = document.querySelector("#modalRoot");
const toastStack = document.querySelector("#toastStack");

let state = loadState();
const ui = createDefaultUi();

function createDefaultUi() {
  return {
    route: "home",
    signupRole: "jobseeker",
    jobseekerTab: "myJobs",
    employerTab: "activeJobs",
    consultancyTab: "queue",
    adminTab: "settings",
    selectedEmployerJobId: null,
    selectedCandidates: new Set(),
    modal: null,
    toasts: [],
  };
}

function createSeedState() {
  return {
    version: 2,
    currentUserId: null,
    settings: {
      brandName: "Lanai Hire Bridge",
      heroHeadline: "Verified hiring routes for India's jobseekers and employers.",
      heroSubhead:
        "Structured profiles, verified companies, consultancy-managed workflows, and founder-only controls in one responsive product experience.",
      supportNumber: "+91 98765 43210",
      supportEmail: "ops@lanaihire.in",
      matchThreshold: 90,
      cityFocus: "Pune, Nashik, Mumbai, Ahmedabad",
      operators: [
        { id: "op_asha", name: "Asha Singh", role: "Verification Desk" },
        { id: "op_rishi", name: "Rishi Nair", role: "Applications Desk" },
        { id: "op_megha", name: "Megha Joshi", role: "Employer Actions Desk" },
      ],
      footerLinks: ["About", "FAQs", "Privacy Policy", "Terms", "Contact", "Support"],
    },
    users: [
      {
        id: "js_rahul",
        role: "jobseeker",
        email: "rahul@demo.in",
        password: "Job123!",
        fullName: "Rahul Shinde",
        phone: "9876501111",
        currentCity: "Pune",
        permanentAddress: "Bhosari, Pune, Maharashtra",
        createdAt: "2026-04-20T09:00:00.000Z",
        profile: {
          desiredDesignation: "CNC Machine Operator",
          totalExperience: 4,
          industry: "Auto Components",
          currentSalary: 260000,
          expectedSalaryMin: 280000,
          expectedSalaryMax: 360000,
          preferredLocations: ["Pune", "Nashik"],
          preferredAreas: ["Chakan", "Bhosari", "MIDC"],
          availability: "Immediate",
          relocate: true,
          shiftPreference: "Day / Rotational",
          currentCompany: "Precision Forge India",
          currentTenure: 2.8,
          skills: ["CNC Programming", "Fanuc", "Preventive Maintenance", "Production Documents"],
          summary:
            "Machine operator focused on CNC setup, shift planning, and disciplined production output for automotive components.",
          achievements:
            "Reduced setup time by 15% and managed preventive checks across 12 CNC machines without unplanned downtime.",
          avatar: "",
          resumeTitle: "CNC Machine Operator Resume",
        },
      },
      {
        id: "js_pooja",
        role: "jobseeker",
        email: "pooja@demo.in",
        password: "Job123!",
        fullName: "Pooja Salunke",
        phone: "9890012121",
        currentCity: "Nashik",
        permanentAddress: "Satpur, Nashik, Maharashtra",
        createdAt: "2026-04-19T11:15:00.000Z",
        profile: {
          desiredDesignation: "Quality Inspector",
          totalExperience: 5,
          industry: "Industrial Manufacturing",
          currentSalary: 330000,
          expectedSalaryMin: 350000,
          expectedSalaryMax: 420000,
          preferredLocations: ["Nashik", "Pune"],
          preferredAreas: ["Satpur", "MIDC", "Ambad"],
          availability: "15 Days",
          relocate: true,
          shiftPreference: "Any Shift",
          currentCompany: "Northline Controls",
          currentTenure: 1.6,
          skills: ["Quality Checks", "Calibration", "Inspection Reports", "Root Cause Analysis"],
          summary:
            "Inspection specialist with strong hands-on experience in in-process checks, final inspection, and reporting for plant quality teams.",
          achievements:
            "Built a weekly rejection dashboard that cut repeat defects by 11% in the last review cycle.",
          avatar: "",
          resumeTitle: "Quality Inspector Resume",
        },
      },
      {
        id: "emp_sunforge",
        role: "employer",
        email: "hr@sunforge.in",
        password: "Employer123!",
        fullName: "Neha Patil",
        createdAt: "2026-04-18T08:30:00.000Z",
        verified: true,
        company: {
          companyName: "Sunforge Auto Components Pvt Ltd",
          category: "Auto Components",
          size: "200-500 employees",
          officeAddress: "Chakan MIDC, Pune",
          website: "https://sunforge.example",
          officialPhone: "02045000000",
          registrationNumber: "U28999PN2020PTC1024",
          gstPan: "27ABCDE1234F1Z5",
          signatory: "Amit Kulkarni",
          recruiterName: "Neha Patil",
          recruiterRole: "HR Manager",
          businessHours: "Mon-Sat, 9 AM to 6 PM",
          legalAccepted: true,
        },
      },
      {
        id: "emp_vardhan",
        role: "employer",
        email: "talent@vardhanengg.in",
        password: "Employer123!",
        fullName: "Karan Shah",
        createdAt: "2026-04-21T07:10:00.000Z",
        verified: false,
        company: {
          companyName: "Vardhan Engineering Works",
          category: "Industrial Manufacturing",
          size: "50-200 employees",
          officeAddress: "Rabale, Navi Mumbai",
          website: "https://vardhan.example",
          officialPhone: "02233001122",
          registrationNumber: "U31909MH2024PTC4501",
          gstPan: "27ZZZDE4567G1Z2",
          signatory: "Karan Shah",
          recruiterName: "Karan Shah",
          recruiterRole: "HR Lead",
          businessHours: "Mon-Fri, 10 AM to 7 PM",
          legalAccepted: true,
        },
      },
      {
        id: "consult_ops",
        role: "consultancy",
        email: "ops@lanaihire.in",
        password: "Consult123!",
        fullName: "Lanai Operations",
        createdAt: "2026-04-17T09:00:00.000Z",
        profile: {
          region: "India - West Zone",
        },
      },
      {
        id: "admin_founder",
        role: "admin",
        email: "founder@lanaihire.in",
        password: "Founder123!",
        fullName: "Founder Access",
        createdAt: "2026-04-17T09:00:00.000Z",
        profile: {
          title: "Founder",
        },
      },
      {
        id: "admin_ceo",
        role: "admin",
        email: "ceo@lanaihire.in",
        password: "Ceo123!",
        fullName: "CEO Access",
        createdAt: "2026-04-17T09:00:00.000Z",
        profile: {
          title: "CEO",
        },
      },
    ],
    jobs: [
      {
        id: "job_cnc",
        employerId: "emp_sunforge",
        title: "CNC Machine Operator",
        category: "Auto Components",
        experienceMin: 4,
        experienceMax: 6,
        salaryMin: 280000,
        salaryMax: 360000,
        location: "Pune",
        area: "Chakan",
        availability: "Immediate",
        relocationAllowed: true,
        openings: 6,
        skills: ["CNC Programming", "Fanuc", "Production Discipline"],
        description:
          "Operate CNC machines, maintain shift quality logs, manage setup discipline, and support preventive production checks.",
        status: "active",
        createdAt: "2026-04-21T10:20:00.000Z",
      },
      {
        id: "job_quality",
        employerId: "emp_sunforge",
        title: "Quality Inspector",
        category: "Industrial Manufacturing",
        experienceMin: 3,
        experienceMax: 5,
        salaryMin: 320000,
        salaryMax: 420000,
        location: "Nashik",
        area: "MIDC",
        availability: "15 Days",
        relocationAllowed: true,
        openings: 4,
        skills: ["Inspection Reports", "Calibration", "Quality Checks"],
        description:
          "Handle in-process inspection, final quality checks, report deviations, and coordinate with production supervisors.",
        status: "active",
        createdAt: "2026-04-20T08:05:00.000Z",
      },
      {
        id: "job_electrician",
        employerId: "emp_sunforge",
        title: "Plant Electrician",
        category: "Maintenance",
        experienceMin: 4,
        experienceMax: 7,
        salaryMin: 300000,
        salaryMax: 420000,
        location: "Pune",
        area: "Bhosari",
        availability: "30 Days",
        relocationAllowed: false,
        openings: 2,
        skills: ["Panel Wiring", "Preventive Maintenance", "Breakdown Support"],
        description:
          "Support plant electrical maintenance, panel checks, and rapid breakdown response across rotating shifts.",
        status: "closed",
        createdAt: "2026-04-18T14:30:00.000Z",
      },
    ],
    applications: [
      {
        id: "app_seed_1",
        jobId: "job_quality",
        jobseekerId: "js_pooja",
        mode: "resume",
        status: "new",
        createdAt: "2026-04-21T12:30:00.000Z",
      },
    ],
    employerActions: [
      {
        id: "act_seed_1",
        employerId: "emp_sunforge",
        jobId: "job_cnc",
        jobseekerId: "js_rahul",
        type: "shortlist",
        status: "new",
        createdAt: "2026-04-21T16:40:00.000Z",
      },
    ],
    notifications: [
      {
        id: "note_seed_1",
        role: "consultancy",
        userId: null,
        title: "New company verification pending",
        message: "Vardhan Engineering Works submitted legal details and is waiting for consultancy approval.",
        tone: "warning",
        createdAt: "2026-04-21T07:20:00.000Z",
      },
      {
        id: "note_seed_2",
        role: "jobseeker",
        userId: "js_pooja",
        title: "Application moved to consultancy queue",
        message: "Your resume for Quality Inspector has been routed to consultancy operations for the next step.",
        tone: "success",
        createdAt: "2026-04-21T12:32:00.000Z",
      },
      {
        id: "note_seed_3",
        role: "employer",
        userId: "emp_sunforge",
        title: "Shortlist action captured",
        message: "Consultancy has been alerted that you shortlisted a matched Quality candidate.",
        tone: "success",
        createdAt: "2026-04-21T16:43:00.000Z",
      },
    ],
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createSeedState();
    }

    const parsed = JSON.parse(raw);
    if (parsed?.version === 2) {
      return parsed;
    }
  } catch (error) {
    console.warn("Unable to load saved state. Falling back to seed data.", error);
  }

  return createSeedState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetDemoData() {
  state = createSeedState();
  Object.assign(ui, createDefaultUi());
  syncRouteToCurrentUser();
  saveState();
  closeModal();
  showToast("Demo data reset ho gaya. Aap fresh se test kar sakte ho.", "success");
  render();
}

function syncRouteToCurrentUser() {
  const currentUser = getCurrentUser();
  ui.route = currentUser ? dashboardRouteFor(currentUser) : "home";
  ui.selectedCandidates = new Set();
  ensureEmployerSelection(currentUser);
}

function getCurrentUser() {
  return state.users.find((user) => user.id === state.currentUserId) || null;
}

function getUserById(userId) {
  return state.users.find((user) => user.id === userId) || null;
}

function dashboardRouteFor(user) {
  if (!user) {
    return "login";
  }

  if (user.role === "jobseeker") {
    return "jobseeker-dashboard";
  }

  if (user.role === "employer") {
    return "employer-dashboard";
  }

  if (user.role === "consultancy") {
    return "consultancy-dashboard";
  }

  return "admin-dashboard";
}

function makeId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function splitList(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatCurrency(value) {
  return moneyFormatter.format(Number(value || 0));
}

function formatDate(value) {
  return dateFormatter.format(new Date(value));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value || 0));
}

function telHref(value) {
  return `tel:${String(value ?? "").replace(/[^\d+]/g, "")}`;
}

function maskedPhone(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length < 6) {
    return "Hidden";
  }
  return `${digits.slice(0, 2)}******${digits.slice(-2)}`;
}

function maskedEmail(value) {
  const [local = "", domain = "hidden.com"] = String(value ?? "").split("@");
  const start = local.slice(0, 2);
  const domainName = domain.split(".")[0] || "hidden";
  return `${start}***@${domainName.slice(0, 1)}***.com`;
}

function initials(value) {
  return String(value ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function avatarMarkup(user, size = "avatar") {
  const photo = user?.profile?.avatar || "";
  if (photo) {
    return `<span class="${size}"><img src="${escapeHtml(photo)}" alt="${escapeHtml(user.fullName)}"></span>`;
  }

  return `<span class="${size}">${escapeHtml(initials(user.fullName) || "LH")}</span>`;
}

function companyForEmployer(user) {
  return user?.company || {};
}

function getUsersByRole(role) {
  return state.users.filter((user) => user.role === role);
}

function getEmployerJobs(employerId) {
  return state.jobs.filter((job) => job.employerId === employerId);
}

function getEmployerByJob(job) {
  return getUserById(job.employerId);
}

function getApplicationFor(jobseekerId, jobId) {
  return [...state.applications]
    .reverse()
    .find((application) => application.jobseekerId === jobseekerId && application.jobId === jobId);
}

function getEmployerActionFor(employerId, jobId, jobseekerId, type) {
  return [...state.employerActions]
    .reverse()
    .find(
      (action) =>
        action.employerId === employerId &&
        action.jobId === jobId &&
        action.jobseekerId === jobseekerId &&
        action.type === type
    );
}

function pushNotification({ role, userId = null, title, message, tone = "success" }) {
  state.notifications.unshift({
    id: makeId("note"),
    role,
    userId,
    title,
    message,
    tone,
    createdAt: new Date().toISOString(),
  });
}

function getNotificationsForUser(user) {
  return state.notifications
    .filter((notification) => {
      if (notification.userId) {
        return notification.userId === user.id;
      }

      return notification.role === user.role || notification.role === "all";
    })
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

function getOperatorLoad(index) {
  const queueItems = [
    ...state.applications.filter((item) => item.status === "new"),
    ...state.employerActions.filter((item) => item.status === "new"),
    ...state.users.filter((user) => user.role === "employer" && !user.verified),
  ];

  const operators = state.settings.operators;
  return queueItems.filter((_, itemIndex) => itemIndex % operators.length === index).length;
}

function careerSignal(profile) {
  const tenure = Number(profile?.currentTenure || 0);
  if (tenure >= 2.5) {
    return {
      tone: "success",
      percent: 84,
      title: "Strong stability signal",
      message: `Aap ${tenure} years se current company me ho. Long-term retention ke liye yeh strong positive signal hai.`,
    };
  }

  if (tenure >= 1.5) {
    return {
      tone: "success",
      percent: 68,
      title: "Healthy work continuity",
      message: `Aap ${tenure} years se current role me ho. Employers ko yeh disciplined continuity dikhata hai.`,
    };
  }

  if (tenure >= 1) {
    return {
      tone: "warning",
      percent: 52,
      title: "Neutral signal",
      message: `Aapka tenure ${tenure} years hai. Interview me growth reason clear rakhna useful rahega.`,
    };
  }

  return {
    tone: "warning",
    percent: 36,
    title: "Short tenure caution",
    message: `Tenure ${tenure} years hai. Stable next move explain karna important rahega.`,
  };
}

function computeMatch(job, profile, person) {
  const threshold = Number(state.settings.matchThreshold || 90);
  let score = 0;
  const reasons = [];

  const desired = normalize(profile.desiredDesignation);
  const title = normalize(job.title);
  if (desired && title && (desired.includes(title) || title.includes(desired) || desired.split(" ")[0] === title.split(" ")[0])) {
    score += 24;
    reasons.push("Designation");
  }

  const experience = Number(profile.totalExperience || 0);
  if (experience >= Number(job.experienceMin) && experience <= Number(job.experienceMax)) {
    score += 18;
    reasons.push("Experience");
  } else if (experience + 1 >= Number(job.experienceMin) && experience - 1 <= Number(job.experienceMax)) {
    score += 10;
    reasons.push("Near Experience Fit");
  }

  const preferredLocations = (profile.preferredLocations || []).map(normalize);
  const currentCity = normalize(person.currentCity);
  const jobLocation = normalize(job.location);
  if (preferredLocations.includes(jobLocation) || currentCity === jobLocation) {
    score += 18;
    reasons.push("Location");
  }

  const salaryMin = Number(profile.expectedSalaryMin || 0);
  const salaryMax = Number(profile.expectedSalaryMax || 0);
  const salaryFits =
    (salaryMin && salaryMax && salaryMin <= job.salaryMax && salaryMax >= job.salaryMin) ||
    (!salaryMin && !salaryMax);
  if (salaryFits) {
    score += 14;
    reasons.push("Salary Range");
  } else if (Number(profile.currentSalary || 0) <= Number(job.salaryMax)) {
    score += 8;
    reasons.push("Salary Close Fit");
  }

  const availability = normalize(profile.availability);
  const jobAvailability = normalize(job.availability);
  if (availability === jobAvailability) {
    score += 10;
    reasons.push("Availability");
  } else if (
    (availability === "immediate" && jobAvailability === "15 days") ||
    (availability === "15 days" && jobAvailability === "immediate")
  ) {
    score += 6;
    reasons.push("Availability Close");
  }

  const preferredAreas = (profile.preferredAreas || []).map(normalize);
  const jobArea = normalize(job.area);
  if (preferredAreas.includes(jobArea)) {
    score += 8;
    reasons.push("Preferred Area");
  }

  if ((profile.relocate && job.relocationAllowed) || jobLocation === currentCity) {
    score += 8;
    reasons.push("Move Option");
  }

  return {
    rawScore: Math.min(score, 100),
    displayScore: score >= threshold ? 99 : Math.min(score, 88),
    qualifies: score >= threshold,
    reasons,
  };
}

function getMatchedJobsForUser(user) {
  if (!user?.profile) {
    return [];
  }

  return state.jobs
    .filter((job) => job.status === "active")
    .map((job) => ({
      job,
      match: computeMatch(job, user.profile, user),
    }))
    .filter((entry) => entry.match.qualifies)
    .sort((left, right) => {
      if (right.match.rawScore !== left.match.rawScore) {
        return right.match.rawScore - left.match.rawScore;
      }

      return new Date(right.job.createdAt) - new Date(left.job.createdAt);
    });
}

function getMatchedCandidatesForJob(job) {
  return getUsersByRole("jobseeker")
    .map((candidate) => ({
      candidate,
      match: computeMatch(job, candidate.profile, candidate),
    }))
    .filter((entry) => entry.match.qualifies)
    .sort((left, right) => right.match.rawScore - left.match.rawScore);
}

function ensureEmployerSelection(currentUser = getCurrentUser()) {
  if (!currentUser || currentUser.role !== "employer") {
    return;
  }

  const activeJobs = getEmployerJobs(currentUser.id).filter((job) => job.status === "active");
  if (!activeJobs.length) {
    ui.selectedEmployerJobId = null;
    return;
  }

  const selectedStillExists = activeJobs.some((job) => job.id === ui.selectedEmployerJobId);
  if (!selectedStillExists) {
    ui.selectedEmployerJobId = activeJobs[0].id;
  }
}

function render() {
  const currentUser = getCurrentUser();
  guardRoute(currentUser);
  ensureEmployerSelection(currentUser);
  renderHeader(currentUser);
  app.innerHTML = renderRoute(currentUser);
  renderModal();
  renderToasts();
}

function guardRoute(currentUser) {
  const dashboardRoutes = [
    "jobseeker-dashboard",
    "employer-dashboard",
    "consultancy-dashboard",
    "admin-dashboard",
  ];

  if (dashboardRoutes.includes(ui.route) && !currentUser) {
    ui.route = "login";
  }

  if (currentUser) {
    const expectedRoute = dashboardRouteFor(currentUser);
    if (dashboardRoutes.includes(ui.route) && ui.route !== expectedRoute) {
      ui.route = expectedRoute;
    }
  }
}

function renderHeader(currentUser) {
  brandNameNode.textContent = state.settings.brandName;

  document.querySelectorAll(".site-nav__link").forEach((link) => {
    const isActive =
      (ui.route === link.dataset.route) ||
      (ui.route.endsWith("dashboard") && link.dataset.route === "home");
    link.classList.toggle("site-nav__link--active", isActive);
  });

  dashboardButton.hidden = !currentUser;
  logoutButton.hidden = !currentUser;
}

function renderRoute(currentUser) {
  switch (ui.route) {
    case "jobseeker":
      return renderJobseekerPage();
    case "employer":
      return renderEmployerPage();
    case "login":
      return renderLoginPage();
    case "signup":
      return renderSignupPage();
    case "jobseeker-dashboard":
      return currentUser ? renderJobseekerDashboard(currentUser) : renderLoginPage();
    case "employer-dashboard":
      return currentUser ? renderEmployerDashboard(currentUser) : renderLoginPage();
    case "consultancy-dashboard":
      return currentUser ? renderConsultancyDashboard(currentUser) : renderLoginPage();
    case "admin-dashboard":
      return currentUser ? renderAdminDashboard(currentUser) : renderLoginPage();
    default:
      return renderHomePage();
  }
}

function renderHomePage() {
  const totalJobseekers = getUsersByRole("jobseeker").length;
  const verifiedEmployers = getUsersByRole("employer").filter((user) => user.verified).length;
  const activeJobs = state.jobs.filter((job) => job.status === "active").length;

  return `
    <section class="page">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Responsive hiring platform</p>
          <h1>${escapeHtml(state.settings.heroHeadline)}</h1>
          <p>${escapeHtml(state.settings.heroSubhead)}</p>
          <div class="chip-row">
            <span class="tag">Desktop + mobile ready</span>
            <span class="tag">Jobseeker, employer, consultancy, admin flows</span>
            <span class="tag">99% match logic</span>
            <span class="tag">Hidden contact workflow</span>
          </div>
          <div class="actions-row">
            <button class="button button--primary" type="button" data-action="navigate" data-route="signup" data-role="jobseeker">
              Create skill profile
            </button>
            <button class="button" type="button" data-action="navigate" data-route="signup" data-role="employer">
              Register company
            </button>
          </div>
        </div>

        <aside class="hero-panel">
          <div class="panel">
            <div class="panel__head">
              <div>
                <p class="eyebrow">Platform flow</p>
                <h3>Consultancy-led hiring pipeline</h3>
              </div>
            </div>
            <ul class="flow-list">
              <li>Jobseeker creates a structured profile with work, salary, location, and resume details.</li>
              <li>Employer registers a real company profile with legal terms and verification details.</li>
              <li>Only 99% compatible jobs and candidates are shown on dashboards.</li>
              <li>Consultancy handles applications, resume views, shortlists, hire requests, and call routing.</li>
            </ul>
          </div>

          <div class="panel">
            <div class="panel__head">
              <div>
                <p class="eyebrow">Important rules</p>
                <h3>Built around your requested control points</h3>
              </div>
            </div>
            <ul class="check-list">
              <li>Top public navigation stays limited to Home, Jobseeker, Employer, Login, Signup.</li>
              <li>Jobseeker sees company category only, not direct employer identity.</li>
              <li>Employer sees masked phone, email, and masked resume contact details.</li>
              <li>Founder and CEO accounts are the only admin access accounts.</li>
            </ul>
          </div>
        </aside>
      </section>

      <section class="metrics-grid">
        <article class="metric metric--highlight">
          <span class="metric__pill">Live demo pool</span>
          <strong>Registered jobseekers</strong>
          <span class="metric__value">${formatNumber(totalJobseekers)}</span>
          <p>Structured profiles with resume data, location preferences, and move options.</p>
        </article>
        <article class="metric">
          <span class="metric__pill">Verified companies</span>
          <strong>Employer accounts</strong>
          <span class="metric__value">${formatNumber(verifiedEmployers)}</span>
          <p>Only verified employers can fully operate the hiring workspace.</p>
        </article>
        <article class="metric">
          <span class="metric__pill">Active roles</span>
          <strong>Matching jobs</strong>
          <span class="metric__value">${formatNumber(activeJobs)}</span>
          <p>Every active post is matched by role, experience, salary, area, availability, and relocation logic.</p>
        </article>
      </section>

      <section class="section-grid">
        <article class="panel">
          <div class="panel__head">
            <div>
              <p class="eyebrow">Problem to solution</p>
              <h3>What this product solves</h3>
            </div>
          </div>
          <div class="card-grid">
            <article class="card feature-card">
              <p class="eyebrow">Jobseeker lane</p>
              <h3>Profile-first job access</h3>
              <p>Jobseeker dashboard only shows highly matched jobs using designation, experience, salary, location, availability, area, and move preference.</p>
            </article>
            <article class="card feature-card">
              <p class="eyebrow">Employer lane</p>
              <h3>Verified company onboarding</h3>
              <p>Company legal details, recruiter details, official number, and legal acceptance stay inside a formal registration workflow.</p>
            </article>
            <article class="card feature-card">
              <p class="eyebrow">Consultancy lane</p>
              <h3>Human-managed actions</h3>
              <p>Apply, interest, call, view resume, shortlist, and hire actions all notify consultancy operators so direct bypass is avoided.</p>
            </article>
          </div>
        </article>

        <article class="panel">
          <div class="panel__head">
            <div>
              <p class="eyebrow">Testing access</p>
              <h3>Use demo logins instantly</h3>
            </div>
            <button class="button button--subtle" type="button" data-action="reset-demo">Reset demo data</button>
          </div>
          <div class="demo-login-grid">
            ${renderDemoLogin("Jobseeker", "rahul@demo.in", "Job123!")}
            ${renderDemoLogin("Employer", "hr@sunforge.in", "Employer123!")}
            ${renderDemoLogin("Consultancy", "ops@lanaihire.in", "Consult123!")}
            ${renderDemoLogin("Founder", "founder@lanaihire.in", "Founder123!")}
          </div>
          <p class="support-note">Support line for call-based applications: ${escapeHtml(state.settings.supportNumber)}</p>
        </article>
      </section>

      ${renderPublicFooter()}
    </section>
  `;
}

function renderDemoLogin(label, email, password) {
  return `
    <div class="demo-login">
      <div>
        <strong>${escapeHtml(label)}</strong>
        <span class="muted">${escapeHtml(email)} | ${escapeHtml(password)}</span>
      </div>
      <button
        class="button button--subtle"
        type="button"
        data-action="demo-login"
        data-email="${escapeHtml(email)}"
        data-password="${escapeHtml(password)}"
      >
        Login now
      </button>
    </div>
  `;
}

function renderJobseekerPage() {
  return `
    <section class="page">
      <section class="section-title">
        <p class="eyebrow">Jobseeker entry</p>
        <h2>Create your skill profile before job access</h2>
        <p>
          Har jobseeker ko pehle complete personal + professional + preference profile banana hota hai.
          Uske baad hi private dashboard khulta hai jahan sirf highly matched jobs dikhte hain.
        </p>
      </section>

      <section class="public-grid">
        <article class="card">
          <p class="eyebrow">Profile details</p>
          <h3>Basic personal information</h3>
          <ul class="mini-list">
            <li>Full name, current city, permanent address, photo URL or profile image</li>
            <li>Phone number and email only for internal + consultancy use</li>
            <li>Private login created with password-based dashboard access</li>
          </ul>
        </article>
        <article class="card">
          <p class="eyebrow">Professional details</p>
          <h3>Work information</h3>
          <ul class="mini-list">
            <li>Desired designation, total experience, industry, salary range</li>
            <li>Current company, tenure, skills, shift preference</li>
            <li>Notice period, relocation choice, preferred locations and working areas</li>
          </ul>
        </article>
        <article class="card">
          <p class="eyebrow">Resume builder</p>
          <h3>Resume with photo</h3>
          <ul class="mini-list">
            <li>Profile data auto-fills resume preview with headline and achievements</li>
            <li>Resume is auto-selected during "Apply with Resume" flow</li>
            <li>Employer sees resume but masked contact info only</li>
          </ul>
        </article>
        <article class="card">
          <p class="eyebrow">Career tracker</p>
          <h3>Tenure reward signal</h3>
          <ul class="mini-list">
            <li>Dashboard shows current company tenure and whether it is a good or weak signal</li>
            <li>Words are framed as supportive guidance for the candidate</li>
            <li>Tracker updates automatically from current tenure value</li>
          </ul>
        </article>
      </section>

      <section class="panel">
        <div class="panel__head">
          <div>
            <p class="eyebrow">Next step</p>
            <h3>Create your skill profile now</h3>
          </div>
        </div>
        <div class="actions-row">
          <button class="button button--primary" type="button" data-action="navigate" data-route="signup" data-role="jobseeker">
            Start Jobseeker Signup
          </button>
          <button class="button" type="button" data-action="navigate" data-route="login">
            Already have login
          </button>
        </div>
      </section>

      ${renderPublicFooter()}
    </section>
  `;
}

function renderEmployerPage() {
  return `
    <section class="page">
      <section class="section-title">
        <p class="eyebrow">Employer entry</p>
        <h2>Register a real company and post structured jobs</h2>
        <p>
          Employer dashboard sirf verified company profiles ko full access deta hai.
          Company form me legal acceptance, official contact details, recruiter ownership, aur structured job-post fields included hain.
        </p>
      </section>

      <section class="public-grid">
        <article class="card">
          <p class="eyebrow">Company onboarding</p>
          <h3>Real company details</h3>
          <ul class="mini-list">
            <li>Company name, category, size, office address, website</li>
            <li>Official phone, registration number, GST/PAN equivalent identifier</li>
            <li>Authorized signatory and recruiter responsibility details</li>
          </ul>
        </article>
        <article class="card">
          <p class="eyebrow">Legal controls</p>
          <h3>Verification and terms</h3>
          <ul class="mini-list">
            <li>Legal acceptance is mandatory before submission</li>
            <li>Consultancy can review and approve pending employers</li>
            <li>Fake profiles are blocked from active hiring operations</li>
          </ul>
        </article>
        <article class="card">
          <p class="eyebrow">Job form logic</p>
          <h3>Structured hiring fields</h3>
          <ul class="mini-list">
            <li>Designation, experience, location, salary, area, availability, openings</li>
            <li>Relocation logic and skills help improve precision of candidate matches</li>
            <li>Jobs appear automatically inside matched jobseeker dashboards</li>
          </ul>
        </article>
        <article class="card">
          <p class="eyebrow">Candidate visibility</p>
          <h3>Private contact masking</h3>
          <ul class="mini-list">
            <li>Employer sees only relevant personal + work details</li>
            <li>Phone, email, and contact lines are masked in both card view and resume</li>
            <li>Hire, shortlist, and resume view actions notify consultancy first</li>
          </ul>
        </article>
      </section>

      <section class="panel">
        <div class="panel__head">
          <div>
            <p class="eyebrow">Next step</p>
            <h3>Register your company profile</h3>
          </div>
        </div>
        <div class="actions-row">
          <button class="button button--primary" type="button" data-action="navigate" data-route="signup" data-role="employer">
            Start Employer Signup
          </button>
          <button class="button" type="button" data-action="navigate" data-route="login">
            Employer Login
          </button>
        </div>
      </section>

      ${renderPublicFooter()}
    </section>
  `;
}

function renderLoginPage() {
  return `
    <section class="page auth-layout">
      <article class="auth-card auth-card--info">
        <p class="eyebrow">Login access</p>
        <h2>Role-based private dashboards</h2>
        <p>
          Jobseeker, Employer, Consultancy, Founder, aur CEO sab ke alag dashboards hain.
          Agar aap turant test karna chahte ho to demo credentials se seedha login kar sakte ho.
        </p>

        <div class="demo-login-grid">
          ${renderDemoLogin("Jobseeker", "rahul@demo.in", "Job123!")}
          ${renderDemoLogin("Employer", "hr@sunforge.in", "Employer123!")}
          ${renderDemoLogin("Consultancy", "ops@lanaihire.in", "Consult123!")}
          ${renderDemoLogin("Founder", "founder@lanaihire.in", "Founder123!")}
          ${renderDemoLogin("CEO", "ceo@lanaihire.in", "Ceo123!")}
        </div>
      </article>

      <article class="auth-card">
        <div class="panel__head">
          <div>
            <p class="eyebrow">Secure access</p>
            <h3>Login with email and password</h3>
          </div>
        </div>

        <form class="form" id="loginForm">
          <div class="form-grid">
            <div class="field field--full">
              <label for="loginEmail">Email address</label>
              <input id="loginEmail" name="email" type="email" placeholder="example@company.com" required>
            </div>
            <div class="field field--full">
              <label for="loginPassword">Password</label>
              <input id="loginPassword" name="password" type="password" placeholder="Enter your password" required>
            </div>
          </div>

          <div class="actions-row">
            <button class="button button--primary" type="submit">Login</button>
            <button class="button" type="button" data-action="navigate" data-route="signup">Create new account</button>
          </div>
        </form>
      </article>
    </section>
  `;
}

function renderSignupPage() {
  const isJobseeker = ui.signupRole === "jobseeker";
  return `
    <section class="page auth-layout">
      <article class="auth-card auth-card--info">
        <p class="eyebrow">Signup flow</p>
        <h2>${isJobseeker ? "Create a complete skill profile." : "Register a verified employer profile."}</h2>
        <p>
          ${isJobseeker
            ? "Jobseeker signup ke baad private dashboard milta hai jahan sirf matched jobs dikhte hain."
            : "Employer signup ke baad company verification, job posting, matched candidate review, aur consultancy notifications flow activate hota hai."}
        </p>

        <div class="auth-switch">
          <button
            class="tab-button ${isJobseeker ? "is-active" : ""}"
            type="button"
            data-action="set-signup-role"
            data-role="jobseeker"
          >
            Jobseeker
          </button>
          <button
            class="tab-button ${!isJobseeker ? "is-active" : ""}"
            type="button"
            data-action="set-signup-role"
            data-role="employer"
          >
            Employer
          </button>
        </div>

        <ul class="check-list">
          ${
            isJobseeker
              ? `
                <li>Personal information + job information + location preferences + resume details.</li>
                <li>Jobseeker dashboard uses this data to show only high-fit jobs.</li>
                <li>Resume, tracker, interest, resume apply, and call apply workflow are included.</li>
              `
              : `
                <li>Company legal details, official recruiter information, and non-fake profile controls.</li>
                <li>Active jobs, close job, add job, shortlist, hire, and resume view actions are included.</li>
                <li>Pending companies can be approved inside consultancy dashboard.</li>
              `
          }
        </ul>
      </article>

      <article class="auth-card">
        <div class="panel__head">
          <div>
            <p class="eyebrow">${isJobseeker ? "Jobseeker signup" : "Employer signup"}</p>
            <h3>${isJobseeker ? "Create your skill profile" : "Register company profile"}</h3>
          </div>
        </div>

        <form class="form" id="signupForm">
          ${isJobseeker ? renderJobseekerSignupFields() : renderEmployerSignupFields()}
          <div class="actions-row">
            <button class="button button--primary" type="submit">
              ${isJobseeker ? "Create profile & enter dashboard" : "Submit company profile"}
            </button>
            <button class="button" type="button" data-action="navigate" data-route="login">Already have login</button>
          </div>
        </form>
      </article>
    </section>
  `;
}

function renderJobseekerSignupFields() {
  return `
    <div class="form-grid">
      <div class="field">
        <label for="jsFullName">Full name</label>
        <input id="jsFullName" name="fullName" type="text" required>
      </div>
      <div class="field">
        <label for="jsEmail">Email</label>
        <input id="jsEmail" name="email" type="email" required>
      </div>
      <div class="field">
        <label for="jsPassword">Password</label>
        <input id="jsPassword" name="password" type="password" minlength="6" required>
      </div>
      <div class="field">
        <label for="jsPhone">Phone number</label>
        <input id="jsPhone" name="phone" type="tel" required>
      </div>
      <div class="field">
        <label for="jsCity">Current city</label>
        <input id="jsCity" name="currentCity" type="text" required>
      </div>
      <div class="field">
        <label for="jsAddress">Permanent address</label>
        <input id="jsAddress" name="permanentAddress" type="text" required>
      </div>
      <div class="field">
        <label for="jsDesignation">Desired designation</label>
        <input id="jsDesignation" name="desiredDesignation" type="text" required>
      </div>
      <div class="field">
        <label for="jsExperience">Total experience (years)</label>
        <input id="jsExperience" name="totalExperience" type="number" min="0" step="0.1" required>
      </div>
      <div class="field">
        <label for="jsIndustry">Industry / category</label>
        <input id="jsIndustry" name="industry" type="text" required>
      </div>
      <div class="field">
        <label for="jsSkills">Skills (comma separated)</label>
        <input id="jsSkills" name="skills" type="text" placeholder="CNC, Fanuc, Quality Check" required>
      </div>
      <div class="field">
        <label for="jsCurrentSalary">Current salary</label>
        <input id="jsCurrentSalary" name="currentSalary" type="number" min="0" required>
      </div>
      <div class="field">
        <label for="jsExpectedMin">Expected salary min</label>
        <input id="jsExpectedMin" name="expectedSalaryMin" type="number" min="0" required>
      </div>
      <div class="field">
        <label for="jsExpectedMax">Expected salary max</label>
        <input id="jsExpectedMax" name="expectedSalaryMax" type="number" min="0" required>
      </div>
      <div class="field">
        <label for="jsAvailability">Availability</label>
        <select id="jsAvailability" name="availability" required>
          <option value="Immediate">Immediate</option>
          <option value="7 Days">7 Days</option>
          <option value="15 Days">15 Days</option>
          <option value="30 Days">30 Days</option>
        </select>
      </div>
      <div class="field">
        <label for="jsLocations">Preferred locations (comma separated)</label>
        <input id="jsLocations" name="preferredLocations" type="text" placeholder="Pune, Nashik" required>
      </div>
      <div class="field">
        <label for="jsAreas">Preferred working areas (comma separated)</label>
        <input id="jsAreas" name="preferredAreas" type="text" placeholder="Chakan, MIDC" required>
      </div>
      <div class="field">
        <label for="jsRelocate">Ready to move cities?</label>
        <select id="jsRelocate" name="relocate" required>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <div class="field">
        <label for="jsShift">Shift preference</label>
        <input id="jsShift" name="shiftPreference" type="text" placeholder="Day / Rotational" required>
      </div>
      <div class="field">
        <label for="jsCompany">Current company</label>
        <input id="jsCompany" name="currentCompany" type="text" required>
      </div>
      <div class="field">
        <label for="jsTenure">Current company tenure (years)</label>
        <input id="jsTenure" name="currentTenure" type="number" min="0" step="0.1" required>
      </div>
      <div class="field">
        <label for="jsAvatar">Photo URL (optional)</label>
        <input id="jsAvatar" name="avatar" type="url" placeholder="https://...">
      </div>
      <div class="field field--full">
        <label for="jsSummary">Professional summary</label>
        <textarea id="jsSummary" name="summary" required></textarea>
      </div>
      <div class="field field--full">
        <label for="jsAchievements">Achievements / resume highlights</label>
        <textarea id="jsAchievements" name="achievements" required></textarea>
      </div>
    </div>
  `;
}

function renderEmployerSignupFields() {
  return `
    <div class="form-grid">
      <div class="field">
        <label for="empCompanyName">Company name</label>
        <input id="empCompanyName" name="companyName" type="text" required>
      </div>
      <div class="field">
        <label for="empCategory">Company category</label>
        <input id="empCategory" name="category" type="text" required>
      </div>
      <div class="field">
        <label for="empSize">Company size</label>
        <input id="empSize" name="size" type="text" placeholder="50-200 employees" required>
      </div>
      <div class="field">
        <label for="empAddress">Office address</label>
        <input id="empAddress" name="officeAddress" type="text" required>
      </div>
      <div class="field">
        <label for="empWebsite">Website</label>
        <input id="empWebsite" name="website" type="url" placeholder="https://...">
      </div>
      <div class="field">
        <label for="empPhone">Official phone number</label>
        <input id="empPhone" name="officialPhone" type="tel" required>
      </div>
      <div class="field">
        <label for="empRegistration">Registration number</label>
        <input id="empRegistration" name="registrationNumber" type="text" required>
      </div>
      <div class="field">
        <label for="empTax">GST / PAN / legal ID</label>
        <input id="empTax" name="gstPan" type="text" required>
      </div>
      <div class="field">
        <label for="empSignatory">Authorized signatory</label>
        <input id="empSignatory" name="signatory" type="text" required>
      </div>
      <div class="field">
        <label for="empRecruiter">Recruiter name</label>
        <input id="empRecruiter" name="recruiterName" type="text" required>
      </div>
      <div class="field">
        <label for="empRecruiterRole">Recruiter role</label>
        <input id="empRecruiterRole" name="recruiterRole" type="text" required>
      </div>
      <div class="field">
        <label for="empBusinessHours">Business hours</label>
        <input id="empBusinessHours" name="businessHours" type="text" placeholder="Mon-Sat, 9 AM to 6 PM" required>
      </div>
      <div class="field">
        <label for="empFullName">Account holder full name</label>
        <input id="empFullName" name="fullName" type="text" required>
      </div>
      <div class="field">
        <label for="empEmail">Official email</label>
        <input id="empEmail" name="email" type="email" required>
      </div>
      <div class="field">
        <label for="empPassword">Password</label>
        <input id="empPassword" name="password" type="password" minlength="6" required>
      </div>
      <div class="field field--full">
        <label class="checkbox-row">
          <input name="legalAccepted" type="checkbox" value="yes" required>
          <span>I confirm this is a real company profile and I accept the legal terms.</span>
        </label>
      </div>
    </div>
  `;
}

function renderPublicFooter() {
  return `
    <section class="footer-band">
      <article class="footer-card">
        <p class="eyebrow">Brand and support</p>
        <h3>${escapeHtml(state.settings.brandName)}</h3>
        <p>
          ${escapeHtml(state.settings.cityFocus)} ke hiring lanes ke liye structured platform.
          Support email: ${escapeHtml(state.settings.supportEmail)} | Support number: ${escapeHtml(state.settings.supportNumber)}
        </p>
      </article>
      <article class="footer-card">
        <p class="eyebrow">Footer links</p>
        <div class="footer-links">
          ${state.settings.footerLinks.map((link) => `<a href="#">${escapeHtml(link)}</a>`).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderNotificationsMini(user) {
  const notifications = getNotificationsForUser(user).slice(0, 3);
  if (!notifications.length) {
    return `
      <div class="empty-state">
        <p>No alerts yet. New workflow events will appear here.</p>
      </div>
    `;
  }

  return `
    <div class="activity-list">
      ${notifications
        .map(
          (notification) => `
            <article class="application-item">
              <div class="application-item__top">
                <div>
                  <strong>${escapeHtml(notification.title)}</strong>
                  <p>${escapeHtml(notification.message)}</p>
                </div>
                <span class="status-pill ${notification.tone ? `status-pill--${notification.tone}` : ""}">
                  ${escapeHtml(formatDate(notification.createdAt))}
                </span>
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderJobseekerDashboard(user) {
  const matchedJobs = getMatchedJobsForUser(user);
  const applications = state.applications
    .filter((application) => application.jobseekerId === user.id)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  const signal = careerSignal(user.profile);

  return `
    <section class="page dashboard-page">
      <section class="dashboard-hero">
        <div>
          <p class="eyebrow">Private jobseeker dashboard</p>
          <h1>${escapeHtml(user.fullName)}</h1>
          <p>
            Sirf aapke profile se highly matched jobs dikh rahe hain. Employer ka direct identity hidden hai
            aur consultancy har important action ko manage karti hai.
          </p>
        </div>
        <div class="actions-row">
          <span class="status-pill status-pill--success">${escapeHtml(user.profile.desiredDesignation)}</span>
          <span class="status-pill">${escapeHtml(user.currentCity)}</span>
        </div>
      </section>

      <section class="dashboard-layout">
        <aside class="dashboard-sidebar">
          <div class="dashboard-sidebar__head">
            <div class="sidebar-profile">
              ${avatarMarkup(user)}
              <div>
                <strong>${escapeHtml(user.fullName)}</strong>
                <span class="muted">${escapeHtml(user.profile.totalExperience)} years experience</span>
                <span class="muted">${escapeHtml(user.profile.currentCompany)}</span>
              </div>
            </div>
          </div>

          <div class="tag-row">
            <span class="tag">${escapeHtml(user.profile.availability)}</span>
            <span class="tag">${user.profile.relocate ? "Can Relocate" : "No Relocation"}</span>
          </div>

          <nav class="sidebar-nav">
            ${renderSidebarButton("jobseeker", "myJobs", "My Jobs")}
            ${renderSidebarButton("jobseeker", "latestJobs", "Latest Job")}
            ${renderSidebarButton("jobseeker", "resume", "Resume Builder")}
          </nav>

          <div class="card">
            <p class="eyebrow">Quick stats</p>
            <strong>${formatNumber(matchedJobs.length)} matched jobs</strong>
            <span class="muted">${formatNumber(applications.length)} applications tracked</span>
            <span class="muted">Support call number: ${escapeHtml(state.settings.supportNumber)}</span>
          </div>
        </aside>

        <div class="dashboard-main">
          <section class="metrics-grid">
            <article class="metric">
              <span class="metric__pill">Profile fit</span>
              <strong>Matching jobs</strong>
              <span class="metric__value">${formatNumber(matchedJobs.length)}</span>
              <p>Only high-fit jobs are shown using your current profile.</p>
            </article>
            <article class="metric">
              <span class="metric__pill">Career tracker</span>
              <strong>${escapeHtml(signal.title)}</strong>
              <div class="progress"><span style="width:${signal.percent}%"></span></div>
              <p>${escapeHtml(signal.message)}</p>
            </article>
            <article class="metric">
              <span class="metric__pill">Resume ready</span>
              <strong>${escapeHtml(user.profile.resumeTitle || "Resume Ready")}</strong>
              <p>Apply with resume auto-selects your saved resume and notifies consultancy.</p>
            </article>
          </section>

          <section class="dashboard-panel">
            <div class="card__head">
              <div>
                <p class="eyebrow">Alerts</p>
                <h3>Recent updates</h3>
              </div>
            </div>
            ${renderNotificationsMini(user)}
          </section>

          ${renderJobseekerTabPanel(user, matchedJobs, applications)}
        </div>
      </section>
    </section>
  `;
}

function renderSidebarButton(scope, tab, label) {
  const active =
    (scope === "jobseeker" && ui.jobseekerTab === tab) ||
    (scope === "employer" && ui.employerTab === tab) ||
    (scope === "consultancy" && ui.consultancyTab === tab) ||
    (scope === "admin" && ui.adminTab === tab);

  return `
    <button
      class="${active ? "is-active" : ""}"
      type="button"
      data-action="set-tab"
      data-scope="${escapeHtml(scope)}"
      data-tab="${escapeHtml(tab)}"
    >
      ${escapeHtml(label)}
    </button>
  `;
}

function renderJobseekerTabPanel(user, matchedJobs, applications) {
  if (ui.jobseekerTab === "resume") {
    return renderJobseekerResumePanel(user);
  }

  if (ui.jobseekerTab === "latestJobs") {
    const latestJobs = [...matchedJobs].sort(
      (left, right) => new Date(right.job.createdAt) - new Date(left.job.createdAt)
    );
    return `
      <section class="dashboard-panel">
        <div class="card__head">
          <div>
            <p class="eyebrow">Latest jobs</p>
            <h3>Newest roles matching your profile</h3>
          </div>
        </div>
        ${renderJobCards(user, latestJobs)}
      </section>
    `;
  }

  return `
    <section class="dashboard-panel">
      <div class="card__head">
        <div>
          <p class="eyebrow">My jobs</p>
          <h3>Only 99% matched jobs visible</h3>
        </div>
        <span class="status-pill">Employer hidden, company category visible</span>
      </div>
      ${renderJobCards(user, matchedJobs)}
    </section>

    <section class="dashboard-panel">
      <div class="card__head">
        <div>
          <p class="eyebrow">Application tracker</p>
          <h3>Your current activity</h3>
        </div>
      </div>
      ${renderApplicationTracker(applications)}
    </section>
  `;
}

function renderJobCards(user, entries) {
  if (!entries.length) {
    return `
      <div class="empty-state">
        <h3>No matching jobs yet</h3>
        <p>Resume, salary range, preferred locations, ya availability update karne par nayi jobs appear ho sakti hain.</p>
      </div>
    `;
  }

  return `
    <div class="job-list">
      ${entries
        .map(({ job, match }) => {
          const existing = getApplicationFor(user.id, job.id);
          const employer = getEmployerByJob(job);
          return `
            <article class="job-card">
              <div class="job-card__top">
                <div>
                  <strong>${escapeHtml(job.title)}</strong>
                  <span class="muted">Company Category: ${escapeHtml(employer?.company?.category || job.category)}</span>
                </div>
                <span class="match-badge">${escapeHtml(String(match.displayScore))}% Match</span>
              </div>
              <div class="job-meta">
                <span>Experience: ${escapeHtml(job.experienceMin)}-${escapeHtml(job.experienceMax)} years</span>
                <span>Location: ${escapeHtml(job.location)}</span>
                <span>Salary: ${escapeHtml(formatCurrency(job.salaryMin))} - ${escapeHtml(formatCurrency(job.salaryMax))}</span>
                <span>Availability: ${escapeHtml(job.availability)}</span>
                <span>Area: ${escapeHtml(job.area)}</span>
              </div>
              <div class="tag-row">
                ${match.reasons.map((reason) => `<span class="match-reason">${escapeHtml(reason)}</span>`).join("")}
              </div>
              <p>${escapeHtml(job.description)}</p>
              ${
                existing
                  ? `<span class="status-pill status-pill--success">Already sent via ${escapeHtml(existing.mode)}</span>`
                  : ""
              }
              <div class="actions-row">
                <button
                  class="button button--primary"
                  type="button"
                  data-action="open-apply-modal"
                  data-job-id="${escapeHtml(job.id)}"
                  ${existing ? "disabled" : ""}
                >
                  Apply Now
                </button>
                <button
                  class="button"
                  type="button"
                  data-action="apply-interest"
                  data-job-id="${escapeHtml(job.id)}"
                  ${existing ? "disabled" : ""}
                >
                  I'm Interested
                </button>
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderApplicationTracker(applications) {
  if (!applications.length) {
    return `
      <div class="empty-state">
        <h3>No applications yet</h3>
        <p>Apply with resume, interest, ya call request karte hi yahan live status aa jayega.</p>
      </div>
    `;
  }

  return `
    <div class="application-list">
      ${applications
        .map((application) => {
          const job = state.jobs.find((item) => item.id === application.jobId);
          const employer = job ? getEmployerByJob(job) : null;
          return `
            <article class="application-item">
              <div class="application-item__top">
                <div>
                  <strong>${escapeHtml(job?.title || "Unknown Job")}</strong>
                  <p>${escapeHtml(employer?.company?.category || "Company Category")}</p>
                </div>
                <span class="status-pill status-pill--success">${escapeHtml(application.mode)}</span>
              </div>
              <p class="muted">Sent on ${escapeHtml(formatDate(application.createdAt))}</p>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderJobseekerResumePanel(user) {
  return `
    <section class="section-grid">
      <article class="dashboard-panel">
        <div class="card__head">
          <div>
            <p class="eyebrow">Resume builder</p>
            <h3>Update resume content</h3>
          </div>
        </div>
        <form class="form" id="resumeForm">
          <div class="form-grid">
            <div class="field field--full">
              <label for="resumeTitle">Resume title</label>
              <input id="resumeTitle" name="resumeTitle" type="text" value="${escapeHtml(user.profile.resumeTitle || "")}">
            </div>
            <div class="field">
              <label for="resumeAvatar">Photo URL</label>
              <input id="resumeAvatar" name="avatar" type="url" value="${escapeHtml(user.profile.avatar || "")}">
            </div>
            <div class="field">
              <label for="resumeTenure">Current company tenure</label>
              <input id="resumeTenure" name="currentTenure" type="number" step="0.1" value="${escapeHtml(user.profile.currentTenure)}">
            </div>
            <div class="field field--full">
              <label for="resumeSkills">Skills (comma separated)</label>
              <input id="resumeSkills" name="skills" type="text" value="${escapeHtml((user.profile.skills || []).join(", "))}">
            </div>
            <div class="field field--full">
              <label for="resumeSummary">Summary</label>
              <textarea id="resumeSummary" name="summary">${escapeHtml(user.profile.summary || "")}</textarea>
            </div>
            <div class="field field--full">
              <label for="resumeAchievements">Achievements</label>
              <textarea id="resumeAchievements" name="achievements">${escapeHtml(user.profile.achievements || "")}</textarea>
            </div>
          </div>
          <div class="actions-row">
            <button class="button button--primary" type="submit">Save Resume</button>
            <button class="button" type="button" data-action="preview-own-resume">Open Resume Modal</button>
          </div>
        </form>
      </article>

      <article class="resume-sheet">
        ${renderResumeSheet(user, false)}
      </article>
    </section>
  `;
}

function renderResumeSheet(user, masked) {
  const profile = user.profile || {};
  const contactPhone = masked ? maskedPhone(user.phone) : user.phone;
  const contactEmail = masked ? maskedEmail(user.email) : user.email;

  return `
    <div class="resume-head">
      <div class="sidebar-profile">
        ${avatarMarkup(user)}
        <div>
          <h3>${escapeHtml(profile.resumeTitle || `${user.fullName} Resume`)}</h3>
          <p>${escapeHtml(profile.desiredDesignation)} | ${escapeHtml(profile.totalExperience)} years experience</p>
        </div>
      </div>
      <div class="tag-row">
        <span class="tag">${escapeHtml(contactPhone)}</span>
        <span class="tag">${escapeHtml(contactEmail)}</span>
        <span class="tag">${escapeHtml(user.currentCity)}</span>
      </div>
    </div>

    <div class="resume-columns">
      <div class="resume-block">
        <h4>Profile snapshot</h4>
        <p>Current Company: ${escapeHtml(profile.currentCompany || "-")}</p>
        <p>Current Tenure: ${escapeHtml(String(profile.currentTenure || 0))} years</p>
        <p>Preferred Locations: ${escapeHtml((profile.preferredLocations || []).join(", "))}</p>
        <p>Preferred Areas: ${escapeHtml((profile.preferredAreas || []).join(", "))}</p>
        <p>Availability: ${escapeHtml(profile.availability || "-")}</p>
        <p>Relocation: ${profile.relocate ? "Yes" : "No"}</p>
      </div>

      <div class="resume-block">
        <h4>Summary</h4>
        <p>${escapeHtml(profile.summary || "")}</p>
        <h4>Skills</h4>
        <div class="tag-row">
          ${(profile.skills || []).map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join("")}
        </div>
        <h4>Achievements</h4>
        <p>${escapeHtml(profile.achievements || "")}</p>
      </div>
    </div>
  `;
}

function renderEmployerDashboard(user) {
  const jobs = getEmployerJobs(user.id);
  const activeJobs = jobs.filter((job) => job.status === "active");
  const selectedJob = state.jobs.find((job) => job.id === ui.selectedEmployerJobId) || activeJobs[0] || null;
  const matchedCandidates = selectedJob ? getMatchedCandidatesForJob(selectedJob) : [];

  if (!user.verified) {
    return `
      <section class="page dashboard-page">
        <section class="dashboard-hero">
          <div>
            <p class="eyebrow">Employer dashboard</p>
            <h1>${escapeHtml(user.company.companyName)}</h1>
            <p>Company profile submitted hai, lekin consultancy verification pending hai. Approval ke baad active jobs aur matched candidates unlock ho jayenge.</p>
          </div>
          <span class="status-pill status-pill--warning">Verification Pending</span>
        </section>

        <section class="section-grid">
          <article class="notice notice--warning">
            <p class="eyebrow">Verification queue</p>
            <h3>Your company is waiting for approval</h3>
            <p>Demo me aap consultancy login use karke is employer profile ko approve bhi kar sakte ho.</p>
          </article>

          <article class="dashboard-panel">
            <div class="card__head">
              <div>
                <p class="eyebrow">Submitted details</p>
                <h3>Company record</h3>
              </div>
            </div>
            <ul class="detail-list">
              <li>${escapeHtml(user.company.companyName)}</li>
              <li>${escapeHtml(user.company.category)}</li>
              <li>${escapeHtml(user.company.officeAddress)}</li>
              <li>Official number: ${escapeHtml(user.company.officialPhone)}</li>
              <li>Registration: ${escapeHtml(user.company.registrationNumber)}</li>
            </ul>
          </article>
        </section>
      </section>
    `;
  }

  return `
    <section class="page dashboard-page">
      <section class="dashboard-hero">
        <div>
          <p class="eyebrow">Employer dashboard</p>
          <h1>${escapeHtml(user.company.companyName)}</h1>
          <p>
            Verified employer view. Sirf 99% matched jobseekers dikhte hain, direct phone/email hidden rehta hai,
            aur har hire, shortlist, resume-view action consultancy ko notify karta hai.
          </p>
        </div>
        <div class="actions-row">
          <span class="status-pill status-pill--success">Verified company</span>
          <span class="status-pill">${escapeHtml(user.company.category)}</span>
        </div>
      </section>

      <section class="dashboard-layout">
        <aside class="dashboard-sidebar">
          <div class="sidebar-profile">
            <span class="avatar">${escapeHtml(initials(user.company.companyName))}</span>
            <div>
              <strong>${escapeHtml(user.company.recruiterName)}</strong>
              <span class="muted">${escapeHtml(user.company.recruiterRole)}</span>
              <span class="muted">${escapeHtml(user.company.officeAddress)}</span>
            </div>
          </div>

          <nav class="sidebar-nav">
            ${renderSidebarButton("employer", "activeJobs", "Active Jobs")}
            ${renderSidebarButton("employer", "closeJobs", "Close Job")}
            ${renderSidebarButton("employer", "addJob", "Add Job")}
          </nav>

          <div class="card">
            <p class="eyebrow">Contact policy</p>
            <span class="muted">Phone and email stay hidden in candidate cards and resumes.</span>
            <span class="muted">Official number: ${escapeHtml(user.company.officialPhone)}</span>
          </div>
        </aside>

        <div class="dashboard-main">
          <section class="metrics-grid">
            <article class="metric">
              <span class="metric__pill">Active jobs</span>
              <strong>Open positions</strong>
              <span class="metric__value">${formatNumber(activeJobs.length)}</span>
              <p>Job posts with high-fit candidate routing.</p>
            </article>
            <article class="metric">
              <span class="metric__pill">Matched talent</span>
              <strong>Selected job matches</strong>
              <span class="metric__value">${formatNumber(matchedCandidates.length)}</span>
              <p>Only jobseekers over the match threshold appear.</p>
            </article>
            <article class="metric">
              <span class="metric__pill">Consultancy alerts</span>
              <strong>Triggered actions</strong>
              <span class="metric__value">${formatNumber(state.employerActions.filter((item) => item.employerId === user.id).length)}</span>
              <p>Hire, shortlist, and resume view actions stay under consultancy control.</p>
            </article>
          </section>

          ${renderEmployerTabPanel(user, selectedJob, matchedCandidates)}
        </div>
      </section>
    </section>
  `;
}

function renderEmployerTabPanel(user, selectedJob, matchedCandidates) {
  if (ui.employerTab === "addJob") {
    return renderAddJobPanel();
  }

  if (ui.employerTab === "closeJobs") {
    return renderCloseJobsPanel(user);
  }

  return `
    <section class="dashboard-top">
      <article class="dashboard-panel">
        <div class="card__head">
          <div>
            <p class="eyebrow">Job selector</p>
            <h3>Choose an active job</h3>
          </div>
        </div>
        <div class="job-list">
          ${
            getEmployerJobs(user.id).length
              ? getEmployerJobs(user.id)
                  .map(
                    (job) => `
                      <article class="job-card">
                        <div class="job-card__top">
                          <div>
                            <strong>${escapeHtml(job.title)}</strong>
                            <span class="muted">${escapeHtml(job.location)} | ${escapeHtml(job.area)}</span>
                          </div>
                          <span class="status-pill ${job.status === "active" ? "status-pill--success" : "status-pill--warning"}">
                            ${escapeHtml(job.status)}
                          </span>
                        </div>
                        <div class="job-meta">
                          <span>${escapeHtml(formatCurrency(job.salaryMin))} - ${escapeHtml(formatCurrency(job.salaryMax))}</span>
                          <span>${escapeHtml(job.availability)}</span>
                          <span>${escapeHtml(job.experienceMin)}-${escapeHtml(job.experienceMax)} years</span>
                        </div>
                        <div class="actions-row">
                          <button
                            class="button ${ui.selectedEmployerJobId === job.id ? "button--primary" : ""}"
                            type="button"
                            data-action="select-employer-job"
                            data-job-id="${escapeHtml(job.id)}"
                          >
                            ${ui.selectedEmployerJobId === job.id ? "Selected Job" : "View Matches"}
                          </button>
                          ${
                            job.status === "active"
                              ? `<button class="button button--danger" type="button" data-action="toggle-job-status" data-job-id="${escapeHtml(job.id)}">Close Job</button>`
                              : `<button class="button" type="button" data-action="toggle-job-status" data-job-id="${escapeHtml(job.id)}">Reopen</button>`
                          }
                        </div>
                      </article>
                    `
                  )
                  .join("")
              : `
                <div class="empty-state">
                  <h3>No jobs posted yet</h3>
                  <p>Add your first job post to unlock matched jobseekers.</p>
                </div>
              `
          }
        </div>
      </article>

      <article class="dashboard-panel">
        <div class="card__head">
          <div>
            <p class="eyebrow">Selected job</p>
            <h3>${selectedJob ? escapeHtml(selectedJob.title) : "No active job selected"}</h3>
          </div>
          ${
            selectedJob
              ? `<span class="status-pill">${escapeHtml(formatNumber(applicationCountForJob(selectedJob.id)))} applies</span>`
              : ""
          }
        </div>
        ${
          selectedJob
            ? `
              <div class="job-meta">
                <span>${escapeHtml(selectedJob.category)}</span>
                <span>${escapeHtml(selectedJob.location)}</span>
                <span>${escapeHtml(selectedJob.area)}</span>
                <span>${escapeHtml(formatCurrency(selectedJob.salaryMin))} - ${escapeHtml(formatCurrency(selectedJob.salaryMax))}</span>
                <span>${escapeHtml(selectedJob.availability)}</span>
              </div>
              <p>${escapeHtml(selectedJob.description)}</p>
              <div class="tag-row">
                ${(selectedJob.skills || []).map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join("")}
              </div>
            `
            : `
              <div class="empty-state">
                <p>Active job select karne ke baad matched jobseeker list yahan sync hogi.</p>
              </div>
            `
        }
      </article>
    </section>

    <section class="dashboard-panel">
      <div class="card__head">
        <div>
          <p class="eyebrow">Matched jobseekers</p>
          <h3>Only 99% fit profiles appear</h3>
        </div>
        <div class="inline-actions">
          <span class="status-pill">Phone and email hidden</span>
          <button class="button button--subtle" type="button" data-action="bulk-shortlist" ${!ui.selectedCandidates.size ? "disabled" : ""}>
            Shortlist Selected (${ui.selectedCandidates.size})
          </button>
        </div>
      </div>
      ${renderCandidateCards(user, selectedJob, matchedCandidates)}
    </section>
  `;
}

function applicationCountForJob(jobId) {
  return state.applications.filter((item) => item.jobId === jobId).length;
}

function renderCandidateCards(employer, selectedJob, entries) {
  if (!selectedJob) {
    return `
      <div class="empty-state">
        <h3>Select an active job first</h3>
        <p>Matched candidate list selected job ke basis par refresh hoti hai.</p>
      </div>
    `;
  }

  if (!entries.length) {
    return `
      <div class="empty-state">
        <h3>No 99% match found yet</h3>
        <p>Experience, salary, availability, location, ya area field update karke job fit improve kiya ja sakta hai.</p>
      </div>
    `;
  }

  return `
    <div class="candidate-list">
      ${entries
        .map(({ candidate, match }) => {
          const hireAction = getEmployerActionFor(employer.id, selectedJob.id, candidate.id, "hire");
          const shortlistAction = getEmployerActionFor(employer.id, selectedJob.id, candidate.id, "shortlist");
          const selected = ui.selectedCandidates.has(candidate.id);
          return `
            <article class="candidate-card">
              <div class="candidate-card__top">
                <div class="sidebar-profile">
                  ${avatarMarkup(candidate, "avatar--small")}
                  <div>
                    <strong>${escapeHtml(candidate.fullName)}</strong>
                    <span class="muted">${escapeHtml(candidate.profile.desiredDesignation)}</span>
                    <span class="muted">${escapeHtml(candidate.currentCity)} | ${escapeHtml(candidate.profile.totalExperience)} years</span>
                  </div>
                </div>
                <span class="match-badge">${escapeHtml(String(match.displayScore))}% Match</span>
              </div>
              <div class="candidate-meta">
                <span>Phone: ${escapeHtml(maskedPhone(candidate.phone))}</span>
                <span>Email: ${escapeHtml(maskedEmail(candidate.email))}</span>
                <span>Salary Expectation: ${escapeHtml(formatCurrency(candidate.profile.expectedSalaryMin))} - ${escapeHtml(formatCurrency(candidate.profile.expectedSalaryMax))}</span>
                <span>Availability: ${escapeHtml(candidate.profile.availability)}</span>
              </div>
              <div class="tag-row">
                ${match.reasons.map((reason) => `<span class="selection-badge">${escapeHtml(reason)}</span>`).join("")}
              </div>
              <p>${escapeHtml(candidate.profile.summary)}</p>
              <div class="actions-row">
                <button class="button ${selected ? "button--primary" : ""}" type="button" data-action="toggle-select-candidate" data-user-id="${escapeHtml(candidate.id)}">
                  ${selected ? "Selected" : "Select"}
                </button>
                <button
                  class="button button--primary"
                  type="button"
                  data-action="employer-action"
                  data-type="hire"
                  data-user-id="${escapeHtml(candidate.id)}"
                  data-job-id="${escapeHtml(selectedJob.id)}"
                  ${hireAction ? "disabled" : ""}
                >
                  Hire Now
                </button>
                <button
                  class="button"
                  type="button"
                  data-action="employer-view-resume"
                  data-user-id="${escapeHtml(candidate.id)}"
                  data-job-id="${escapeHtml(selectedJob.id)}"
                >
                  View Resume
                </button>
                <button
                  class="button"
                  type="button"
                  data-action="employer-action"
                  data-type="shortlist"
                  data-user-id="${escapeHtml(candidate.id)}"
                  data-job-id="${escapeHtml(selectedJob.id)}"
                  ${shortlistAction ? "disabled" : ""}
                >
                  Shortlist
                </button>
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderCloseJobsPanel(employer) {
  const jobs = getEmployerJobs(employer.id);
  if (!jobs.length) {
    return `
      <section class="dashboard-panel">
        <div class="empty-state">
          <h3>No jobs available yet</h3>
          <p>Add a job first, then active and closed roles will appear here.</p>
        </div>
      </section>
    `;
  }

  return `
    <section class="dashboard-panel">
      <div class="card__head">
        <div>
          <p class="eyebrow">Close job</p>
          <h3>Manage active and closed postings</h3>
        </div>
      </div>
      <div class="job-list">
        ${jobs
          .map(
            (job) => `
              <article class="job-card">
                <div class="job-card__top">
                  <div>
                    <strong>${escapeHtml(job.title)}</strong>
                    <span class="muted">${escapeHtml(job.location)} | ${escapeHtml(job.area)}</span>
                  </div>
                  <span class="status-pill ${job.status === "active" ? "status-pill--success" : "status-pill--warning"}">${escapeHtml(job.status)}</span>
                </div>
                <div class="job-meta">
                  <span>${escapeHtml(formatCurrency(job.salaryMin))} - ${escapeHtml(formatCurrency(job.salaryMax))}</span>
                  <span>${escapeHtml(job.availability)}</span>
                  <span>${escapeHtml(job.openings)} openings</span>
                </div>
                <div class="actions-row">
                  <button class="button ${job.status === "active" ? "button--danger" : ""}" type="button" data-action="toggle-job-status" data-job-id="${escapeHtml(job.id)}">
                    ${job.status === "active" ? "Close Job" : "Reopen Job"}
                  </button>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderAddJobPanel() {
  return `
    <section class="dashboard-panel">
      <div class="card__head">
        <div>
          <p class="eyebrow">Add job</p>
          <h3>Post a structured role for precise matching</h3>
        </div>
      </div>
      <form class="form" id="jobForm">
        <div class="form-grid">
          <div class="field">
            <label for="jobTitle">Job title / designation</label>
            <input id="jobTitle" name="title" type="text" required>
          </div>
          <div class="field">
            <label for="jobCategory">Category</label>
            <input id="jobCategory" name="category" type="text" required>
          </div>
          <div class="field">
            <label for="jobExpMin">Experience min</label>
            <input id="jobExpMin" name="experienceMin" type="number" min="0" required>
          </div>
          <div class="field">
            <label for="jobExpMax">Experience max</label>
            <input id="jobExpMax" name="experienceMax" type="number" min="0" required>
          </div>
          <div class="field">
            <label for="jobSalaryMin">Salary min</label>
            <input id="jobSalaryMin" name="salaryMin" type="number" min="0" required>
          </div>
          <div class="field">
            <label for="jobSalaryMax">Salary max</label>
            <input id="jobSalaryMax" name="salaryMax" type="number" min="0" required>
          </div>
          <div class="field">
            <label for="jobLocation">Location</label>
            <input id="jobLocation" name="location" type="text" required>
          </div>
          <div class="field">
            <label for="jobArea">Preferred working area</label>
            <input id="jobArea" name="area" type="text" required>
          </div>
          <div class="field">
            <label for="jobAvailability">Joining availability</label>
            <select id="jobAvailability" name="availability" required>
              <option value="Immediate">Immediate</option>
              <option value="7 Days">7 Days</option>
              <option value="15 Days">15 Days</option>
              <option value="30 Days">30 Days</option>
            </select>
          </div>
          <div class="field">
            <label for="jobOpenings">Openings</label>
            <input id="jobOpenings" name="openings" type="number" min="1" required>
          </div>
          <div class="field">
            <label for="jobRelocate">Candidate can relocate?</label>
            <select id="jobRelocate" name="relocationAllowed" required>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div class="field">
            <label for="jobSkills">Skills (comma separated)</label>
            <input id="jobSkills" name="skills" type="text" placeholder="CNC, Fanuc, Quality Reports" required>
          </div>
          <div class="field field--full">
            <label for="jobDescription">Job description</label>
            <textarea id="jobDescription" name="description" required></textarea>
          </div>
        </div>
        <div class="actions-row">
          <button class="button button--primary" type="submit">Post Job</button>
        </div>
      </form>
    </section>
  `;
}

function renderConsultancyDashboard(user) {
  const newApplications = state.applications.filter((item) => item.status === "new");
  const newEmployerActions = state.employerActions.filter((item) => item.status === "new");
  const pendingEmployers = getUsersByRole("employer").filter((item) => !item.verified);

  return `
    <section class="page dashboard-page">
      <section class="dashboard-hero">
        <div>
          <p class="eyebrow">Consultancy operations</p>
          <h1>${escapeHtml(user.fullName)}</h1>
          <p>
            Yeh central workflow desk multiple HR operators ke liye hai. Employer verification, applications,
            resume views, hire requests, shortlist actions, aur call routing sab yahin manage hote hain.
          </p>
        </div>
        <div class="actions-row">
          <span class="status-pill status-pill--success">${escapeHtml(user.profile.region)}</span>
          <span class="status-pill">${escapeHtml(state.settings.supportNumber)}</span>
        </div>
      </section>

      <section class="dashboard-layout">
        <aside class="dashboard-sidebar">
          <div class="sidebar-profile">
            <span class="avatar">OP</span>
            <div>
              <strong>Operations Control</strong>
              <span class="muted">Shared desk for HR team</span>
            </div>
          </div>

          <nav class="sidebar-nav">
            ${renderSidebarButton("consultancy", "queue", "Application Queue")}
            ${renderSidebarButton("consultancy", "hiring", "Employer Actions")}
            ${renderSidebarButton("consultancy", "verifications", "Company Verification")}
            ${renderSidebarButton("consultancy", "operators", "Operator Desk")}
          </nav>

          <div class="card">
            <p class="eyebrow">Live counts</p>
            <span class="muted">${formatNumber(newApplications.length)} new applications</span>
            <span class="muted">${formatNumber(newEmployerActions.length)} employer actions</span>
            <span class="muted">${formatNumber(pendingEmployers.length)} pending companies</span>
          </div>
        </aside>

        <div class="dashboard-main">
          <section class="metrics-grid">
            <article class="metric">
              <span class="metric__pill">Applications</span>
              <strong>Incoming queue</strong>
              <span class="metric__value">${formatNumber(newApplications.length)}</span>
              <p>Resume apply, interest, and call actions land here first.</p>
            </article>
            <article class="metric">
              <span class="metric__pill">Employer actions</span>
              <strong>Hire / shortlist / resume view</strong>
              <span class="metric__value">${formatNumber(newEmployerActions.length)}</span>
              <p>Employer interest is mediated through consultancy operators.</p>
            </article>
            <article class="metric">
              <span class="metric__pill">Verification desk</span>
              <strong>Pending company approvals</strong>
              <span class="metric__value">${formatNumber(pendingEmployers.length)}</span>
              <p>Only approved companies should stay active.</p>
            </article>
          </section>

          ${renderConsultancyTabPanel()}
        </div>
      </section>
    </section>
  `;
}

function renderConsultancyTabPanel() {
  if (ui.consultancyTab === "verifications") {
    return renderVerificationPanel();
  }

  if (ui.consultancyTab === "operators") {
    return renderOperatorPanel();
  }

  if (ui.consultancyTab === "hiring") {
    return renderEmployerActionsPanel();
  }

  return renderApplicationsPanel();
}

function renderApplicationsPanel() {
  const items = state.applications
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

  return `
    <section class="dashboard-panel">
      <div class="card__head">
        <div>
          <p class="eyebrow">Application queue</p>
          <h3>Jobseeker requests and apply flow</h3>
        </div>
      </div>
      ${
        items.length
          ? `
            <div class="application-list">
              ${items
                .map((item) => {
                  const candidate = getUserById(item.jobseekerId);
                  const job = state.jobs.find((entry) => entry.id === item.jobId);
                  return `
                    <article class="application-item">
                      <div class="application-item__top">
                        <div>
                          <strong>${escapeHtml(candidate?.fullName || "Candidate")}</strong>
                          <p>${escapeHtml(job?.title || "Unknown role")} | ${escapeHtml(job?.location || "-")}</p>
                          <p>${escapeHtml(item.mode)} request | ${escapeHtml(formatDate(item.createdAt))}</p>
                        </div>
                        <span class="status-pill ${item.status === "new" ? "status-pill--warning" : "status-pill--success"}">
                          ${escapeHtml(item.status)}
                        </span>
                      </div>
                      <div class="actions-row">
                        <button class="button" type="button" data-action="preview-user-resume" data-user-id="${escapeHtml(candidate.id)}" data-masked="false">
                          Open Resume
                        </button>
                        <button class="button button--subtle" type="button" data-action="resolve-application" data-application-id="${escapeHtml(item.id)}">
                          Mark Handled
                        </button>
                      </div>
                    </article>
                  `;
                })
                .join("")}
            </div>
          `
          : `
            <div class="empty-state">
              <h3>No applications in queue</h3>
              <p>Jobseeker apply flow triggers will appear here.</p>
            </div>
          `
      }
    </section>
  `;
}

function renderEmployerActionsPanel() {
  const items = state.employerActions.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  return `
    <section class="dashboard-panel">
      <div class="card__head">
        <div>
          <p class="eyebrow">Employer actions</p>
          <h3>Hire, shortlist, and resume view workflow</h3>
        </div>
      </div>
      ${
        items.length
          ? `
            <div class="application-list">
              ${items
                .map((item) => {
                  const employer = getUserById(item.employerId);
                  const candidate = getUserById(item.jobseekerId);
                  const job = state.jobs.find((entry) => entry.id === item.jobId);
                  return `
                    <article class="application-item">
                      <div class="application-item__top">
                        <div>
                          <strong>${escapeHtml(employer?.company?.companyName || "Employer")}</strong>
                          <p>${escapeHtml(item.type)} request for ${escapeHtml(candidate?.fullName || "Candidate")}</p>
                          <p>${escapeHtml(job?.title || "Role")} | ${escapeHtml(formatDate(item.createdAt))}</p>
                        </div>
                        <span class="status-pill ${item.status === "new" ? "status-pill--warning" : "status-pill--success"}">
                          ${escapeHtml(item.status)}
                        </span>
                      </div>
                      <div class="actions-row">
                        <button class="button" type="button" data-action="preview-user-resume" data-user-id="${escapeHtml(candidate.id)}" data-masked="false">
                          View Candidate Resume
                        </button>
                        <button class="button button--subtle" type="button" data-action="resolve-employer-action" data-employer-action-id="${escapeHtml(item.id)}">
                          Mark Handled
                        </button>
                      </div>
                    </article>
                  `;
                })
                .join("")}
            </div>
          `
          : `
            <div class="empty-state">
              <h3>No employer action yet</h3>
              <p>Hire, shortlist, and resume view actions will start appearing here.</p>
            </div>
          `
      }
    </section>
  `;
}

function renderVerificationPanel() {
  const pendingEmployers = getUsersByRole("employer").filter((item) => !item.verified);
  return `
    <section class="dashboard-panel">
      <div class="card__head">
        <div>
          <p class="eyebrow">Company verification</p>
          <h3>Pending employer profiles</h3>
        </div>
      </div>
      ${
        pendingEmployers.length
          ? `
            <div class="candidate-list">
              ${pendingEmployers
                .map(
                  (employer) => `
                    <article class="candidate-card">
                      <div class="candidate-card__top">
                        <div>
                          <strong>${escapeHtml(employer.company.companyName)}</strong>
                          <span class="muted">${escapeHtml(employer.company.category)}</span>
                          <span class="muted">${escapeHtml(employer.company.officeAddress)}</span>
                        </div>
                        <span class="status-pill status-pill--warning">Pending</span>
                      </div>
                      <div class="candidate-meta">
                        <span>Recruiter: ${escapeHtml(employer.company.recruiterName)}</span>
                        <span>Official number: ${escapeHtml(employer.company.officialPhone)}</span>
                        <span>Registration: ${escapeHtml(employer.company.registrationNumber)}</span>
                        <span>GST/PAN: ${escapeHtml(employer.company.gstPan)}</span>
                      </div>
                      <div class="actions-row">
                        <button class="button button--primary" type="button" data-action="approve-employer" data-user-id="${escapeHtml(employer.id)}">
                          Approve Company
                        </button>
                      </div>
                    </article>
                  `
                )
                .join("")}
            </div>
          `
          : `
            <div class="empty-state">
              <h3>No pending company</h3>
              <p>New employer signups will appear here for verification.</p>
            </div>
          `
      }
    </section>
  `;
}

function renderOperatorPanel() {
  const feed = state.notifications
    .filter((notification) => notification.role === "consultancy")
    .slice(0, 6);

  return `
    <section class="operator-grid">
      ${state.settings.operators
        .map(
          (operator, index) => `
            <article class="operator-card">
              <p class="eyebrow">Operator ${index + 1}</p>
              <h3>${escapeHtml(operator.name)}</h3>
              <p>${escapeHtml(operator.role)}</p>
              <span class="status-pill">${escapeHtml(String(getOperatorLoad(index)))} live items</span>
            </article>
          `
        )
        .join("")}
    </section>

    <section class="dashboard-panel">
      <div class="card__head">
        <div>
          <p class="eyebrow">Activity feed</p>
          <h3>Recent consultancy alerts</h3>
        </div>
      </div>
      ${
        feed.length
          ? `
            <div class="activity-list">
              ${feed
                .map(
                  (item) => `
                    <article class="activity-item">
                      <div>
                        <strong>${escapeHtml(item.title)}</strong>
                        <p>${escapeHtml(item.message)}</p>
                        <p class="muted">${escapeHtml(formatDate(item.createdAt))}</p>
                      </div>
                      <span class="status-pill ${item.tone ? `status-pill--${item.tone}` : ""}">
                        ${escapeHtml(item.role)}
                      </span>
                    </article>
                  `
                )
                .join("")}
            </div>
          `
          : `
            <div class="empty-state">
              <p>No recent alerts.</p>
            </div>
          `
      }
    </section>
  `;
}

function renderAdminDashboard(user) {
  return `
    <section class="page dashboard-page">
      <section class="dashboard-hero">
        <div>
          <p class="eyebrow">Founder / CEO admin</p>
          <h1>${escapeHtml(user.fullName)}</h1>
          <p>Restricted business control layer for website settings, match engine rules, reporting, and access policies.</p>
        </div>
        <span class="status-pill status-pill--success">${escapeHtml(user.profile.title)}</span>
      </section>

      <section class="dashboard-layout">
        <aside class="dashboard-sidebar">
          <div class="sidebar-profile">
            <span class="avatar">AD</span>
            <div>
              <strong>${escapeHtml(user.profile.title)}</strong>
              <span class="muted">Founder / CEO only</span>
            </div>
          </div>

          <nav class="sidebar-nav">
            ${renderSidebarButton("admin", "settings", "Settings")}
            ${renderSidebarButton("admin", "reports", "Reports")}
            ${renderSidebarButton("admin", "access", "Access")}
          </nav>

          <div class="card">
            <p class="eyebrow">Security note</p>
            <span class="muted">This dashboard is intentionally limited to founder and CEO demo accounts only.</span>
          </div>
        </aside>

        <div class="dashboard-main">
          ${renderAdminTabPanel()}
        </div>
      </section>
    </section>
  `;
}

function renderAdminTabPanel() {
  if (ui.adminTab === "reports") {
    return renderAdminReports();
  }

  if (ui.adminTab === "access") {
    return renderAdminAccess();
  }

  return renderAdminSettings();
}

function renderAdminSettings() {
  return `
    <section class="settings-grid">
      <article class="settings-card">
        <div class="card__head">
          <div>
            <p class="eyebrow">Website settings</p>
            <h3>Update public brand controls</h3>
          </div>
        </div>
        <form class="form" id="settingsForm">
          <div class="form-grid">
            <div class="field">
              <label for="brandField">Brand name</label>
              <input id="brandField" name="brandName" type="text" value="${escapeHtml(state.settings.brandName)}" required>
            </div>
            <div class="field">
              <label for="cityField">City focus</label>
              <input id="cityField" name="cityFocus" type="text" value="${escapeHtml(state.settings.cityFocus)}" required>
            </div>
            <div class="field field--full">
              <label for="heroHeadline">Hero headline</label>
              <input id="heroHeadline" name="heroHeadline" type="text" value="${escapeHtml(state.settings.heroHeadline)}" required>
            </div>
            <div class="field field--full">
              <label for="heroSubhead">Hero subhead</label>
              <textarea id="heroSubhead" name="heroSubhead" required>${escapeHtml(state.settings.heroSubhead)}</textarea>
            </div>
            <div class="field">
              <label for="supportNumber">Support number</label>
              <input id="supportNumber" name="supportNumber" type="text" value="${escapeHtml(state.settings.supportNumber)}" required>
            </div>
            <div class="field">
              <label for="supportEmail">Support email</label>
              <input id="supportEmail" name="supportEmail" type="email" value="${escapeHtml(state.settings.supportEmail)}" required>
            </div>
            <div class="field">
              <label for="matchThreshold">Match threshold</label>
              <input id="matchThreshold" name="matchThreshold" type="number" min="50" max="100" value="${escapeHtml(state.settings.matchThreshold)}" required>
            </div>
          </div>
          <div class="actions-row">
            <button class="button button--primary" type="submit">Save Settings</button>
          </div>
        </form>
      </article>

      <article class="settings-card">
        <div class="card__head">
          <div>
            <p class="eyebrow">Admin reminders</p>
            <h3>Business controls in this demo</h3>
          </div>
        </div>
        <ul class="check-list">
          <li>Brand and hero copy update instantly across the website.</li>
          <li>Match threshold affects which jobs and candidates are visible.</li>
          <li>Support number drives call-apply flow for jobseekers.</li>
          <li>Support email and city focus reflect inside public footer and brand notes.</li>
        </ul>
      </article>
    </section>
  `;
}

function renderAdminReports() {
  const jobseekers = getUsersByRole("jobseeker");
  const employers = getUsersByRole("employer");
  const activeJobs = state.jobs.filter((job) => job.status === "active");
  const categoryCounts = activeJobs.reduce((accumulator, job) => {
    accumulator[job.category] = (accumulator[job.category] || 0) + 1;
    return accumulator;
  }, {});

  return `
    <section class="metrics-grid">
      <article class="metric">
        <span class="metric__pill">Users</span>
        <strong>Total jobseekers</strong>
        <span class="metric__value">${formatNumber(jobseekers.length)}</span>
        <p>All registered candidates with complete profile data.</p>
      </article>
      <article class="metric">
        <span class="metric__pill">Employers</span>
        <strong>Verified employers</strong>
        <span class="metric__value">${formatNumber(employers.filter((item) => item.verified).length)}</span>
        <p>Only approved companies are counted as verified.</p>
      </article>
      <article class="metric">
        <span class="metric__pill">Pipeline</span>
        <strong>Active jobs</strong>
        <span class="metric__value">${formatNumber(activeJobs.length)}</span>
        <p>Jobs currently open to matched dashboard routing.</p>
      </article>
    </section>

    <section class="report-grid">
      <article class="settings-card">
        <div class="card__head">
          <div>
            <p class="eyebrow">Workflow numbers</p>
            <h3>Hiring pipeline status</h3>
          </div>
        </div>
        <div class="table">
          <div class="table__row table__row--head">
            <span>Metric</span>
            <span>Count</span>
            <span>Metric</span>
            <span>Count</span>
          </div>
          <div class="table__row">
            <span>Applications</span>
            <span>${formatNumber(state.applications.length)}</span>
            <span>Employer actions</span>
            <span>${formatNumber(state.employerActions.length)}</span>
          </div>
          <div class="table__row">
            <span>Pending employers</span>
            <span>${formatNumber(employers.filter((item) => !item.verified).length)}</span>
            <span>Consultancy operators</span>
            <span>${formatNumber(state.settings.operators.length)}</span>
          </div>
        </div>
      </article>

      <article class="settings-card">
        <div class="card__head">
          <div>
            <p class="eyebrow">Top categories</p>
            <h3>Live active job mix</h3>
          </div>
        </div>
        <div class="queue-list">
          ${Object.entries(categoryCounts)
            .map(
              ([category, count]) => `
                <li>${escapeHtml(category)}: ${escapeHtml(formatNumber(count))} active roles</li>
              `
            )
            .join("") || "<li>No active categories yet.</li>"}
        </div>
      </article>
    </section>
  `;
}

function renderAdminAccess() {
  const founderCeo = getUsersByRole("admin");
  return `
    <section class="settings-grid">
      <article class="settings-card">
        <div class="card__head">
          <div>
            <p class="eyebrow">Restricted admin access</p>
            <h3>Founder and CEO accounts</h3>
          </div>
        </div>
        <div class="application-list">
          ${founderCeo
            .map(
              (account) => `
                <article class="application-item">
                  <div class="application-item__top">
                    <div>
                      <strong>${escapeHtml(account.fullName)}</strong>
                      <p>${escapeHtml(account.email)}</p>
                    </div>
                    <span class="status-pill status-pill--success">${escapeHtml(account.profile.title)}</span>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </article>

      <article class="settings-card">
        <div class="card__head">
          <div>
            <p class="eyebrow">Access rules</p>
            <h3>Platform role policy</h3>
          </div>
        </div>
        <ul class="check-list">
          <li>Jobseekers can access only their own dashboard and resume.</li>
          <li>Employers can access only their company jobs and masked candidate data.</li>
          <li>Consultancy can see full operational flows and verification queues.</li>
          <li>Founder and CEO can update settings and review business metrics.</li>
        </ul>
      </article>
    </section>
  `;
}

function renderModal() {
  if (!ui.modal) {
    modalRoot.hidden = true;
    modalRoot.innerHTML = "";
    return;
  }

  modalRoot.hidden = false;
  modalRoot.innerHTML = `
    <div class="modal">
      ${ui.modal.type === "apply" ? renderApplyModal() : renderResumeModal()}
    </div>
  `;
}

function renderApplyModal() {
  const currentUser = getCurrentUser();
  const job = state.jobs.find((item) => item.id === ui.modal.jobId);
  const employer = job ? getEmployerByJob(job) : null;
  const existing = currentUser && job ? getApplicationFor(currentUser.id, job.id) : null;

  return `
    <div class="modal__head">
      <div>
        <p class="eyebrow">Apply now</p>
        <h3>${escapeHtml(job?.title || "Job")}</h3>
        <p>${escapeHtml(employer?.company?.category || job?.category || "")}</p>
      </div>
      <button class="button button--subtle" type="button" data-action="close-modal">Close</button>
    </div>

    <div class="job-meta">
      <span>${escapeHtml(job?.location || "-")}</span>
      <span>${escapeHtml(job?.area || "-")}</span>
      <span>${escapeHtml(job ? `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}` : "-")}</span>
      <span>${escapeHtml(job?.availability || "-")}</span>
    </div>

    ${
      existing
        ? `<div class="notice notice--success"><strong>Already applied</strong><p>This job is already in your application tracker via ${escapeHtml(existing.mode)}.</p></div>`
        : `
          <div class="panel">
            <p class="eyebrow">Choose apply method</p>
            <div class="actions-row">
              <button class="button button--primary" type="button" data-action="apply-resume" data-job-id="${escapeHtml(job.id)}">
                Apply with Resume
              </button>
              <button class="button" type="button" data-action="apply-call" data-job-id="${escapeHtml(job.id)}">
                Apply with Call
              </button>
            </div>
            <p class="support-note">Resume apply auto-selects your saved resume. Call apply routes to consultancy official number only.</p>
          </div>
        `
    }

    <div class="notice">
      <p class="eyebrow">Official call route</p>
      <h3>${escapeHtml(state.settings.supportNumber)}</h3>
      <p>Jobseeker ko employer ka direct number nahi dikhega. Call request consultancy desk par hi routed hai.</p>
    </div>
  `;
}

function renderResumeModal() {
  const user = getUserById(ui.modal.userId);
  return `
    <div class="modal__head">
      <div>
        <p class="eyebrow">${ui.modal.masked ? "Masked resume view" : "Resume preview"}</p>
        <h3>${escapeHtml(user?.fullName || "Candidate")}</h3>
      </div>
      <button class="button button--subtle" type="button" data-action="close-modal">Close</button>
    </div>
    <div class="resume-sheet">
      ${user ? renderResumeSheet(user, ui.modal.masked) : "<p>Resume not available.</p>"}
    </div>
  `;
}

function renderToasts() {
  toastStack.innerHTML = ui.toasts
    .map(
      (toast) => `
        <div class="toast ${toast.tone ? `toast--${toast.tone}` : ""}">
          <strong>${escapeHtml(toast.message)}</strong>
        </div>
      `
    )
    .join("");
}

function showToast(message, tone = "success") {
  const id = makeId("toast");
  ui.toasts.push({ id, message, tone });
  renderToasts();
  window.setTimeout(() => {
    ui.toasts = ui.toasts.filter((toast) => toast.id !== id);
    renderToasts();
  }, 3200);
}

function closeModal() {
  ui.modal = null;
  renderModal();
}

function openApplyModal(jobId) {
  ui.modal = { type: "apply", jobId };
  renderModal();
}

function openResumeModal(userId, masked) {
  ui.modal = { type: "resume", userId, masked };
  renderModal();
}

function loginWithCredentials(email, password, silent = false) {
  const user = state.users.find(
    (entry) => normalize(entry.email) === normalize(email) && entry.password === password
  );

  if (!user) {
    if (!silent) {
      showToast("Email ya password incorrect hai.", "danger");
    }
    return false;
  }

  state.currentUserId = user.id;
  saveState();
  syncRouteToCurrentUser();
  render();

  if (!silent) {
    showToast(`${user.fullName} ke dashboard me login ho gaya.`, "success");
  }

  return true;
}

function createJobseekerAccount(formData) {
  const email = String(formData.get("email") || "");
  if (state.users.some((user) => normalize(user.email) === normalize(email))) {
    showToast("Is email se account already exists.", "danger");
    return;
  }

  const user = {
    id: makeId("js"),
    role: "jobseeker",
    email,
    password: String(formData.get("password") || ""),
    fullName: String(formData.get("fullName") || ""),
    phone: String(formData.get("phone") || ""),
    currentCity: String(formData.get("currentCity") || ""),
    permanentAddress: String(formData.get("permanentAddress") || ""),
    createdAt: new Date().toISOString(),
    profile: {
      desiredDesignation: String(formData.get("desiredDesignation") || ""),
      totalExperience: Number(formData.get("totalExperience") || 0),
      industry: String(formData.get("industry") || ""),
      currentSalary: Number(formData.get("currentSalary") || 0),
      expectedSalaryMin: Number(formData.get("expectedSalaryMin") || 0),
      expectedSalaryMax: Number(formData.get("expectedSalaryMax") || 0),
      preferredLocations: splitList(formData.get("preferredLocations")),
      preferredAreas: splitList(formData.get("preferredAreas")),
      availability: String(formData.get("availability") || ""),
      relocate: String(formData.get("relocate") || "") === "yes",
      shiftPreference: String(formData.get("shiftPreference") || ""),
      currentCompany: String(formData.get("currentCompany") || ""),
      currentTenure: Number(formData.get("currentTenure") || 0),
      skills: splitList(formData.get("skills")),
      summary: String(formData.get("summary") || ""),
      achievements: String(formData.get("achievements") || ""),
      avatar: String(formData.get("avatar") || ""),
      resumeTitle: `${String(formData.get("desiredDesignation") || "Profile")} Resume`,
    },
  };

  state.users.push(user);
  state.currentUserId = user.id;
  pushNotification({
    role: "jobseeker",
    userId: user.id,
    title: "Profile created successfully",
    message: "Your skill profile is ready and your private dashboard is active.",
    tone: "success",
  });
  saveState();
  syncRouteToCurrentUser();
  render();
  showToast("Jobseeker profile create ho gaya.", "success");
}

function createEmployerAccount(formData) {
  const email = String(formData.get("email") || "");
  if (state.users.some((user) => normalize(user.email) === normalize(email))) {
    showToast("Is email se account already exists.", "danger");
    return;
  }

  const user = {
    id: makeId("emp"),
    role: "employer",
    email,
    password: String(formData.get("password") || ""),
    fullName: String(formData.get("fullName") || ""),
    createdAt: new Date().toISOString(),
    verified: false,
    company: {
      companyName: String(formData.get("companyName") || ""),
      category: String(formData.get("category") || ""),
      size: String(formData.get("size") || ""),
      officeAddress: String(formData.get("officeAddress") || ""),
      website: String(formData.get("website") || ""),
      officialPhone: String(formData.get("officialPhone") || ""),
      registrationNumber: String(formData.get("registrationNumber") || ""),
      gstPan: String(formData.get("gstPan") || ""),
      signatory: String(formData.get("signatory") || ""),
      recruiterName: String(formData.get("recruiterName") || ""),
      recruiterRole: String(formData.get("recruiterRole") || ""),
      businessHours: String(formData.get("businessHours") || ""),
      legalAccepted: Boolean(formData.get("legalAccepted")),
    },
  };

  state.users.push(user);
  state.currentUserId = user.id;
  pushNotification({
    role: "consultancy",
    title: "New employer submitted for verification",
    message: `${user.company.companyName} is waiting for company verification.`,
    tone: "warning",
  });
  pushNotification({
    role: "employer",
    userId: user.id,
    title: "Company profile submitted",
    message: "Your company is now pending verification from consultancy operations.",
    tone: "warning",
  });
  saveState();
  syncRouteToCurrentUser();
  render();
  showToast("Employer profile submit ho gaya. Verification pending hai.", "success");
}

function createApplication(jobId, mode) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "jobseeker") {
    return;
  }

  if (getApplicationFor(currentUser.id, jobId)) {
    showToast("Is role ke liye aap pehle hi apply kar chuke ho.", "warning");
    return;
  }

  const job = state.jobs.find((entry) => entry.id === jobId);
  const employer = job ? getEmployerByJob(job) : null;
  state.applications.unshift({
    id: makeId("app"),
    jobId,
    jobseekerId: currentUser.id,
    mode,
    status: "new",
    createdAt: new Date().toISOString(),
  });

  pushNotification({
    role: "consultancy",
    title: `Jobseeker ${mode} request`,
    message: `${currentUser.fullName} triggered "${mode}" for ${job?.title || "a role"} in ${job?.location || "-"}.`,
    tone: mode === "call" ? "warning" : "success",
  });
  pushNotification({
    role: "jobseeker",
    userId: currentUser.id,
    title: "Action sent to consultancy",
    message: `${job?.title || "Selected role"} ke liye aapka ${mode} request consultancy dashboard me chala gaya.`,
    tone: "success",
  });
  pushNotification({
    role: "employer",
    userId: employer?.id || null,
    title: "New candidate signal",
    message: `${currentUser.fullName} showed interest in ${job?.title || "your role"}.`,
    tone: "success",
  });

  saveState();
  render();
  showToast(
    mode === "call"
      ? `Call request record ho gaya. Consultancy number par route kiya ja raha hai.`
      : `Application consultancy queue me chala gaya.`,
    "success"
  );
}

function createInterest(jobId) {
  createApplication(jobId, "interest");
}

function updateResume(formData) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "jobseeker") {
    return;
  }

  currentUser.profile.resumeTitle = String(formData.get("resumeTitle") || currentUser.profile.resumeTitle || "Resume");
  currentUser.profile.avatar = String(formData.get("avatar") || "");
  currentUser.profile.currentTenure = Number(formData.get("currentTenure") || 0);
  currentUser.profile.skills = splitList(formData.get("skills"));
  currentUser.profile.summary = String(formData.get("summary") || "");
  currentUser.profile.achievements = String(formData.get("achievements") || "");

  saveState();
  render();
  showToast("Resume update ho gaya.", "success");
}

function createJob(formData) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "employer" || !currentUser.verified) {
    showToast("Only verified employers can post jobs.", "danger");
    return;
  }

  const job = {
    id: makeId("job"),
    employerId: currentUser.id,
    title: String(formData.get("title") || ""),
    category: String(formData.get("category") || ""),
    experienceMin: Number(formData.get("experienceMin") || 0),
    experienceMax: Number(formData.get("experienceMax") || 0),
    salaryMin: Number(formData.get("salaryMin") || 0),
    salaryMax: Number(formData.get("salaryMax") || 0),
    location: String(formData.get("location") || ""),
    area: String(formData.get("area") || ""),
    availability: String(formData.get("availability") || ""),
    relocationAllowed: String(formData.get("relocationAllowed") || "") === "yes",
    openings: Number(formData.get("openings") || 1),
    skills: splitList(formData.get("skills")),
    description: String(formData.get("description") || ""),
    status: "active",
    createdAt: new Date().toISOString(),
  };

  state.jobs.unshift(job);
  ui.selectedEmployerJobId = job.id;
  ui.employerTab = "activeJobs";
  saveState();
  render();
  showToast("Job post ho gaya aur matched jobseekers dashboards me route ho jayega.", "success");
}

function toggleJobStatus(jobId) {
  const currentUser = getCurrentUser();
  const job = state.jobs.find((item) => item.id === jobId);
  if (!currentUser || !job || currentUser.role !== "employer" || job.employerId !== currentUser.id) {
    return;
  }

  job.status = job.status === "active" ? "closed" : "active";
  saveState();
  render();
  showToast(`Job status ${job.status} ho gaya.`, "success");
}

function toggleCandidateSelection(userId) {
  if (ui.selectedCandidates.has(userId)) {
    ui.selectedCandidates.delete(userId);
  } else {
    ui.selectedCandidates.add(userId);
  }
  render();
}

function recordEmployerAction(type, jobId, candidateId, openResumeAfter = false) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "employer") {
    return;
  }

  if (type !== "viewResume" && getEmployerActionFor(currentUser.id, jobId, candidateId, type)) {
    showToast("Yeh action pehle hi consultancy ko bheja ja chuka hai.", "warning");
    return;
  }

  state.employerActions.unshift({
    id: makeId("act"),
    employerId: currentUser.id,
    jobId,
    jobseekerId: candidateId,
    type,
    status: "new",
    createdAt: new Date().toISOString(),
  });

  const candidate = getUserById(candidateId);
  const job = state.jobs.find((item) => item.id === jobId);
  pushNotification({
    role: "consultancy",
    title: `Employer ${type} action`,
    message: `${currentUser.company.companyName} triggered "${type}" for ${candidate?.fullName || "candidate"} on ${job?.title || "a role"}.`,
    tone: type === "hire" ? "warning" : "success",
  });
  pushNotification({
    role: "employer",
    userId: currentUser.id,
    title: "Consultancy alerted",
    message: `${type} action for ${candidate?.fullName || "candidate"} has been routed to consultancy.`,
    tone: "success",
  });

  saveState();
  if (openResumeAfter) {
    openResumeModal(candidateId, true);
  }
  render();
  showToast(`${type} action consultancy ko notify kar diya gaya.`, "success");
}

function bulkShortlistSelected() {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "employer" || !ui.selectedEmployerJobId || !ui.selectedCandidates.size) {
    return;
  }

  [...ui.selectedCandidates].forEach((candidateId) => {
    if (!getEmployerActionFor(currentUser.id, ui.selectedEmployerJobId, candidateId, "shortlist")) {
      state.employerActions.unshift({
        id: makeId("act"),
        employerId: currentUser.id,
        jobId: ui.selectedEmployerJobId,
        jobseekerId: candidateId,
        type: "shortlist",
        status: "new",
        createdAt: new Date().toISOString(),
      });
    }
  });

  pushNotification({
    role: "consultancy",
    title: "Bulk shortlist request",
    message: `${currentUser.company.companyName} shortlisted ${ui.selectedCandidates.size} candidates together.`,
    tone: "warning",
  });

  ui.selectedCandidates = new Set();
  saveState();
  render();
  showToast("Selected candidates shortlist ho gaye aur consultancy ko notify kar diya gaya.", "success");
}

function approveEmployer(userId) {
  const employer = getUserById(userId);
  if (!employer || employer.role !== "employer") {
    return;
  }

  employer.verified = true;
  pushNotification({
    role: "employer",
    userId: employer.id,
    title: "Company approved",
    message: "Consultancy ne aapki company verify kar di. Employer dashboard ab fully active hai.",
    tone: "success",
  });
  saveState();
  render();
  showToast(`${employer.company.companyName} approve ho gayi.`, "success");
}

function resolveWorkflowItem(kind, itemId) {
  const collection = kind === "application" ? state.applications : state.employerActions;
  const item = collection.find((entry) => entry.id === itemId);
  if (!item) {
    return;
  }

  item.status = "handled";
  saveState();
  render();
  showToast("Workflow item marked as handled.", "success");
}

function updateSettings(formData) {
  state.settings.brandName = String(formData.get("brandName") || "");
  state.settings.cityFocus = String(formData.get("cityFocus") || "");
  state.settings.heroHeadline = String(formData.get("heroHeadline") || "");
  state.settings.heroSubhead = String(formData.get("heroSubhead") || "");
  state.settings.supportNumber = String(formData.get("supportNumber") || "");
  state.settings.supportEmail = String(formData.get("supportEmail") || "");
  state.settings.matchThreshold = Number(formData.get("matchThreshold") || 90);
  saveState();
  render();
  showToast("Admin settings save ho gayi.", "success");
}

document.addEventListener("click", (event) => {
  const actionElement = event.target.closest("[data-action]");
  if (!actionElement) {
    return;
  }

  const { action } = actionElement.dataset;
  if (action !== "apply-call-link") {
    event.preventDefault();
  }

  switch (action) {
    case "navigate":
      if (actionElement.dataset.role) {
        ui.signupRole = actionElement.dataset.role;
      }
      ui.route = actionElement.dataset.route;
      siteNav.classList.remove("site-nav--open");
      navToggle.setAttribute("aria-expanded", "false");
      render();
      break;
    case "open-dashboard":
      syncRouteToCurrentUser();
      render();
      break;
    case "logout":
      state.currentUserId = null;
      saveState();
      Object.assign(ui, createDefaultUi());
      render();
      showToast("Logout ho gaya.", "success");
      break;
    case "demo-login":
      loginWithCredentials(actionElement.dataset.email, actionElement.dataset.password);
      break;
    case "set-signup-role":
      ui.signupRole = actionElement.dataset.role;
      render();
      break;
    case "set-tab":
      if (actionElement.dataset.scope === "jobseeker") {
        ui.jobseekerTab = actionElement.dataset.tab;
      }
      if (actionElement.dataset.scope === "employer") {
        ui.employerTab = actionElement.dataset.tab;
      }
      if (actionElement.dataset.scope === "consultancy") {
        ui.consultancyTab = actionElement.dataset.tab;
      }
      if (actionElement.dataset.scope === "admin") {
        ui.adminTab = actionElement.dataset.tab;
      }
      render();
      break;
    case "open-apply-modal":
      openApplyModal(actionElement.dataset.jobId);
      break;
    case "close-modal":
      closeModal();
      break;
    case "apply-resume":
      createApplication(actionElement.dataset.jobId, "resume");
      closeModal();
      break;
    case "apply-call":
      createApplication(actionElement.dataset.jobId, "call");
      closeModal();
      window.location.href = telHref(state.settings.supportNumber);
      break;
    case "apply-interest":
      createInterest(actionElement.dataset.jobId);
      break;
    case "preview-own-resume": {
      const currentUser = getCurrentUser();
      if (currentUser) {
        openResumeModal(currentUser.id, false);
      }
      break;
    }
    case "preview-user-resume":
      openResumeModal(actionElement.dataset.userId, actionElement.dataset.masked === "true");
      break;
    case "select-employer-job":
      ui.selectedEmployerJobId = actionElement.dataset.jobId;
      ui.selectedCandidates = new Set();
      render();
      break;
    case "toggle-job-status":
      toggleJobStatus(actionElement.dataset.jobId);
      break;
    case "toggle-select-candidate":
      toggleCandidateSelection(actionElement.dataset.userId);
      break;
    case "bulk-shortlist":
      bulkShortlistSelected();
      break;
    case "employer-action":
      recordEmployerAction(
        actionElement.dataset.type,
        actionElement.dataset.jobId,
        actionElement.dataset.userId
      );
      break;
    case "employer-view-resume":
      recordEmployerAction("viewResume", actionElement.dataset.jobId, actionElement.dataset.userId, true);
      break;
    case "approve-employer":
      approveEmployer(actionElement.dataset.userId);
      break;
    case "resolve-application":
      resolveWorkflowItem("application", actionElement.dataset.applicationId);
      break;
    case "resolve-employer-action":
      resolveWorkflowItem("employerAction", actionElement.dataset.employerActionId);
      break;
    case "reset-demo":
      resetDemoData();
      break;
    default:
      break;
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  event.preventDefault();
  const formData = new FormData(form);

  if (form.id === "loginForm") {
    loginWithCredentials(formData.get("email"), formData.get("password"));
    return;
  }

  if (form.id === "signupForm") {
    if (ui.signupRole === "jobseeker") {
      createJobseekerAccount(formData);
    } else {
      createEmployerAccount(formData);
    }
    return;
  }

  if (form.id === "resumeForm") {
    updateResume(formData);
    return;
  }

  if (form.id === "jobForm") {
    createJob(formData);
    return;
  }

  if (form.id === "settingsForm") {
    updateSettings(formData);
  }
});

navToggle.addEventListener("click", () => {
  const expanded = siteNav.classList.toggle("site-nav--open");
  navToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
});

modalRoot.addEventListener("click", (event) => {
  if (event.target === modalRoot) {
    closeModal();
  }
});

syncRouteToCurrentUser();
render();
