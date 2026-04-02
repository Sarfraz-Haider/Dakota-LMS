import { useState, useRef, useEffect } from "react";

const MANAGERS = ["Farhan Farrukh", "Sarfraz Haider", "Haad Khan", "Muhammad Maaz"];
const LEADS = ["Sarfraz Haider", "Faraz Anjum", "Haad Khan", "Nasir Ahmad", "Naveed Zafar", "Misbah Qureshi", "Farhan Farrukh", "Majid Zulfiqar"];
const EMPLOYEES = ["Farhan Farrukh","Haad Khan","Khizar Masood","Mahnoor Qureshi","Muhammad Maaz","Mubashar Hassan","Misbah Qureshi","Nasir Mehmood","Sarfraz Haider","Abdul Wasay Bin Zahid","Atif Ilyas","Fahad Shah","Faraz Anjum","Hamza Arshad","Ihtisham Khan","Jamal Khan","Majid Zulfiqar","Mehtab Shahid","Minal Haider","Muhammad Nabeel","Muhammad Umar Farooq","Naveed Zafar","Rafiq Ahmad","Rana Atif","Saad Sultan","Adil Khalid Abbasi","Faiq Lattifi","Hafsah Maqbool","Haseeb Tariq","Mansoor Ahmed","Muhammad Junaid","Muhammad Naseer","Nabeela Azhar","Nasir Ahmad","Yousaf Munir","Abdullah Zafar","Ahnan Ahmad","Ahsan Jamil","Asad Zarif Abbasi","Faheem Ullah","Faryal Zohaib","Haider Ali Shah","Hamza Rehman","Hassan Kiyani","Kanwal Talib","M Bilal Abbas","Muhammad Aamir Abbas","Muhammad Shahbaz","Muhammad Umer Nawaz","Muhammad Zubair Haider","Naima Iman","Qasim Umar","Rida Arshad","Zubair Khurshid","Sundas Arif","Syed Waqas","Adnan Ahmad"];
const LEAVE_TYPES = ["Annual", "Casual", "Sick", "Bereavement leave (Immediate Family)", "Maternity/Paternity Leave"];
const BAL = { Annual: 14, Casual: 10, Sick: 10 };
const MGR_PW = "dakota@mgr2026";
const LEAD_PW = "dakota@lead2026";

// Team mapping: employee name → default WorkStream Lead
const TEAM_MAP = {
  // Sarfraz Haider's team
  "Haseeb Tariq": "Sarfraz Haider",
  "Mahnoor Qureshi": "Sarfraz Haider",
  "Qasim Umar": "Sarfraz Haider",
  "Naima Iman": "Sarfraz Haider",
  "Nabeela Azhar": "Sarfraz Haider",
  "Muhammad Umer Nawaz": "Sarfraz Haider",
  "Adil Khalid Abbasi": "Sarfraz Haider",
  "Atif Ilyas": "Sarfraz Haider",
  "Muhammad Zubair Haider": "Sarfraz Haider",
  "Muhammad Naseer": "Sarfraz Haider",
  "Nasir Mehmood": "Sarfraz Haider",
  "Rafiq Ahmad": "Sarfraz Haider",
  "Yousaf Munir": "Sarfraz Haider",

  // Haad Khan's team
  "Mubashar Hassan": "Haad Khan",
  "Rida Arshad": "Haad Khan",
  "Mehtab Shahid": "Haad Khan",
  "Muhammad Junaid": "Haad Khan",
  "Mansoor Ahmed": "Haad Khan",
  "Zubair Khurshid": "Haad Khan",
  "Syed Waqas": "Haad Khan",

  // Majid Zulfiqar's team
  "Khizar Masood": "Majid Zulfiqar",
  "Saad Sultan": "Majid Zulfiqar",

  // Faraz Anjum's team
  "Faheem Ullah": "Faraz Anjum",
  "Ahsan Jamil": "Faraz Anjum",
  "Kanwal Talib": "Faraz Anjum",
  "Rana Atif": "Faraz Anjum",

  // Misbah Qureshi's team
  "Abdul Wasay Bin Zahid": "Misbah Qureshi",
  "Fahad Shah": "Misbah Qureshi",
  "Muhammad Shahbaz": "Misbah Qureshi",
  "Sundas Arif": "Misbah Qureshi",
  "Muhammad Umar Farooq": "Misbah Qureshi",
  "Muhammad Aamir Abbas": "Misbah Qureshi",
  "Adnan Ahmad": "Misbah Qureshi",
  "Asad Zarif Abbasi": "Misbah Qureshi",
  "Abdullah Zafar": "Misbah Qureshi",
  "Hamza Rehman": "Misbah Qureshi",
  "M Bilal Abbas": "Misbah Qureshi",
  "Faryal Zohaib": "Misbah Qureshi",
  "Haider Ali Shah": "Misbah Qureshi",
  "Hassan Kiyani": "Misbah Qureshi",
  "Ahnan Ahmad": "Misbah Qureshi",

  // Nasir Ahmad's team
  "Minal Haider": "Nasir Ahmad",
  "Faiq Lattifi": "Nasir Ahmad",
  "Ihtisham Khan": "Nasir Ahmad",

  // Naveed Zafar's team
  "Hamza Arshad": "Naveed Zafar",
  "Muhammad Nabeel": "Naveed Zafar",

  // Leads & Managers report to Farhan
  "Sarfraz Haider": "Farhan Farrukh",
  "Haad Khan": "Farhan Farrukh",
  "Misbah Qureshi": "Farhan Farrukh",
  "Nasir Ahmad": "Farhan Farrukh",
  "Naveed Zafar": "Farhan Farrukh",
  "Faraz Anjum": "Farhan Farrukh",
  "Majid Zulfiqar": "Farhan Farrukh",
  "Muhammad Maaz": "Farhan Farrukh",
  "Farhan Farrukh": "Farhan Farrukh",

  // Farhan's direct team
  "Jamal Khan": "Farhan Farrukh",
  "Hafsah Maqbool": "Farhan Farrukh",
};

function getRole(n) {
  if (MANAGERS.includes(n)) return "manager";
  if (LEADS.includes(n)) return "lead";
  return "employee";
}

function getUsed(recs, name) {
  const u = { Annual: 0, Casual: 0, Sick: 0 };
  recs.filter(r => r.name === name && r.status !== "Rejected").forEach(r => {
    if (u[r.type] !== undefined) u[r.type] += Number(r.days) || 0;
  });
  return u;
}

function fromISO(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return String(m).padStart(2, "0") + "/" + String(d).padStart(2, "0") + "/" + y;
}

// Parse ANY date format into MM/DD/YYYY for display
function dispDate(ds) {
  if (!ds) return "";
  // Already MM/DD/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(ds)) {
    const iso = toISO(ds); if (!iso) return ds;
    const [y, m, d] = iso.split("-").map(Number);
    return String(m).padStart(2, "0") + "/" + String(d).padStart(2, "0") + "/" + y;
  }
  // ISO format
  if (/^\d{4}-\d{2}-\d{2}/.test(ds)) {
    const [y, m, d] = ds.substring(0, 10).split("-").map(Number);
    return String(m).padStart(2, "0") + "/" + String(d).padStart(2, "0") + "/" + y;
  }
  // Long date string from Google ("Thu Jan 08 2026 00:00:00 GMT+0500...")
  try {
    const dt = new Date(ds);
    if (!isNaN(dt)) {
      return String(dt.getMonth() + 1).padStart(2, "0") + "/"
           + String(dt.getDate()).padStart(2, "0") + "/"
           + dt.getFullYear();
    }
  } catch (e) {}
  return ds;
}

// Parse any date into ISO YYYY-MM-DD (for date inputs and calculations)
function toISO(ds) {
  if (!ds) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(ds)) return ds;
  // MM/DD/YYYY or M/D/YY
  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(ds)) {
    const p = ds.split("/"); if (p.length !== 3) return "";
    let [m, d, y] = p.map(Number); if (y < 100) y += 2000;
    return y + "-" + String(m).padStart(2, "0") + "-" + String(d).padStart(2, "0");
  }
  // Long date string from Google
  try {
    const dt = new Date(ds);
    if (!isNaN(dt)) {
      return dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0");
    }
  } catch (e) {}
  return "";
}

function calcWorkDays(s, e) {
  if (!s || !e) return 0;
  const si = toISO(s), ei = toISO(e);
  if (!si || !ei) return 0;
  const sd = new Date(si + "T00:00:00"), ed = new Date(ei + "T00:00:00");
  if (isNaN(sd) || isNaN(ed) || ed < sd) return 0;
  let c = 0; const cur = new Date(sd);
  while (cur <= ed) { const day = cur.getDay(); if (day !== 0 && day !== 6) c++; cur.setDate(cur.getDate() + 1); }
  return c;
}

function Badge({ status }) {
  const m = { Approved: { bg: "#d1fae5", c: "#065f46" }, Rejected: { bg: "#fee2e2", c: "#991b1b" }, Pending: { bg: "#fef3c7", c: "#92400e" } };
  const s = m[status] || m.Pending;
  return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: s.bg, color: s.c }}>{status || "Pending"}</span>;
}

// ═══ FAQ Policy Bot (offline, no API) ═══
const FAQ = [
  { keys: ["hospital", "inpatient", "hospitalization", "admitted", "admission"], title: "Hospital Care", ans: "Hospital Care limit: PKR 550,000 per insured family member. Room & Board: PKR 25,000/day. Accidental injuries get an additional PKR 550,000. Pre/post hospitalization covered for 30 days. Mental wellbeing covered up to Rs. 50,000. Free GP tele-consultation included." },
  { keys: ["opd", "outpatient", "out-patient", "daily", "everyday"], title: "OPD Coverage", ans: "OPD limits by family status:\n• Single only: PKR 60,000\n• Single + Parents: PKR 80,000\n• Married (no kids/parents): PKR 80,000\n• Married + Kids: PKR 90,000\n• Married + Parents: PKR 100,000\n• Married + Parents + Kids: PKR 120,000" },
  { keys: ["dental", "teeth", "tooth", "filling", "root canal", "scaling"], title: "Dental", ans: "Dental covered under OPD:\n• Capping, Bridging, Extraction, Filling, Scaling: up to 10% of OPD limit\n• Crowning & Root Canal: up to 50% of OPD limit" },
  { keys: ["optical", "glasses", "spectacles", "eyes", "vision", "frames"], title: "Optical", ans: "Optical covered under OPD: One pair of Glasses/Frames/Spectacles per insured per year, OR up to 10% of OPD limit for the whole family." },
  { keys: ["maternity", "pregnancy", "delivery", "caesarean", "baby", "birth"], title: "Maternity", ans: "Maternity Care:\n• Normal Delivery: PKR 180,000\n• Caesarean Section / Multiple Birth: PKR 330,000\n• Pre & Post Natal outpatient charges covered\n• Baby boy circumcision: up to Rs. 10,000\n• Coverage up to 45 years of age" },
  { keys: ["major medical", "exhausted", "overflow"], title: "Major Medical", ans: "Major Medical Care: PKR 500,000 per member. Activates AFTER Hospital Care limit is exhausted. Covers Employee, Spouse, Children only — Parents NOT covered under Major Medical." },
  { keys: ["emergency", "accident", "hotline", "phone", "contact", "number", "call"], title: "Emergency Contacts", ans: "Emergency Hotlines:\n• Karachi: 0300 8207000\n• Lahore: 0300 8483818\n• Islamabad: 0300 8508550\n• EFU 24/7 Call Centre: (021) 111-4357-00\n• Email: MyHealthapp@efulife.com\n• EFU MyHealth App: Google Play & iOS" },
  { keys: ["claim", "reimbursement", "reimburse", "submit", "documents", "receipt"], title: "Claims Process", ans: "For Non-Network Hospital claims, submit via HR:\n• Duly filled Claim Form\n• Itemized Hospital Bill\n• Discharge Summary\n• Lab/Radiology reports + doctor's prescription\n• All Original Receipts\n• Doctor's Prescriptions\nProcessing: ~15 working days." },
  { keys: ["network", "hospital", "card", "credit", "cashless", "pa", "pre-auth"], title: "Network Hospitals", ans: "Emergency: Go to Network Hospital, show Health Card — no payment needed.\nPlanned: Get Pre-Authorization (PA) form from hospital/HR, submit 3 days before admission.\nNon-Network: Pay yourself, then claim reimbursement.\nNote: AKUH, OMI, Hameed Latif, Evercare, Doctor's, Shifa, South City require room limit ≥ General Ward rate." },
  { keys: ["covered", "who", "family", "spouse", "children", "parents", "dependent", "eligible"], title: "Who Is Covered", ans: "Covered under EFU Health Plan A:\n• Full-time employees & spouses (up to age 65)\n• Sons up to age 25\n• Unmarried daughters till marriage\n• Parents till 80 years\n\nIMPORTANT: Enroll dependents within 30 days of eligibility (marriage/birth)." },
  { keys: ["pre-existing", "existing", "condition", "hepatitis", "congenital"], title: "Pre-Existing Conditions", ans: "ALL pre-existing conditions covered:\n• Hospital, Major Medical & OPD: up to 65 years\n• Parents: Hospital & OPD up to 80 years\n• Maternity: up to 45 years\n• Hepatitis B & C: covered under Hospital & Major Medical\n• Congenital disorders: covered for all members" },
  { keys: ["excluded", "exclusion", "not covered", "excluded", "cosmetic", "weight"], title: "Exclusions", ans: "NOT covered: Cosmetic surgery, weight management, organ donor charges, experimental treatments, robotic surgery, self-inflicted injury, dangerous sports, war/terrorism, HIV/AIDS, air ambulance. IOL in cataract > Rs.40,000 excluded. Assistant surgeon charges excluded." },
  { keys: ["annual", "leave", "balance", "how many", "entitlement"], title: "Leave Balances", ans: "Annual leave entitlements:\n• Annual Leave: 14 days/year\n• Casual Leave: 10 days/year\n• Sick Leave: 10 days/year\n• Bereavement (Immediate Family) and Maternity/Paternity also available." },
  { keys: ["psychiatric", "mental", "therapy", "psychologist", "depression", "anxiety"], title: "Mental Health", ans: "Mental health coverage:\n• Hospital Care: up to Rs. 50,000 for mental wellbeing\n• OPD: Psychiatric/psychologist consultation, investigations, medicines, antidepressants covered\n• Rehabilitation covered under OPD" },
  { keys: ["vaccine", "vaccination", "flu", "covid"], title: "Vaccinations", ans: "Non-EPI vaccinations (flu, Covid etc.) covered for employees & all dependents including parents under OPD." },
];

function searchFAQ(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const scored = FAQ.map(f => {
    let score = 0;
    f.keys.forEach(k => { if (q.includes(k)) score += 3; });
    const words = q.split(/\s+/);
    words.forEach(w => { if (w.length > 2) f.keys.forEach(k => { if (k.includes(w)) score += 1; }); });
    return { ...f, score };
  }).filter(f => f.score > 0).sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}

// ═══ EDIT MODAL ═══
function EditModal({ record, onSave, onClose }) {
  const [f, setF] = useState({ ...record, _s: toISO(record.startDate), _e: toISO(record.endDate) });
  const S = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13, fontFamily: "inherit" };

  const chDate = (field, v) => {
    const nf = { ...f }; if (field === "s") { nf._s = v; nf.startDate = fromISO(v); } else { nf._e = v; nf.endDate = fromISO(v); }
    const wd = calcWorkDays(nf._s, nf._e); if (wd > 0) nf.days = nf.halfDay === "Yes" && wd === 1 ? 0.5 : wd;
    setF(nf);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 16, padding: 24, width: 430, border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>Edit Request</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, color: "var(--muted)" }}>✕</button>
        </div>
        <div style={{ fontSize: 13, color: "var(--accent)", marginBottom: 12, fontWeight: 600 }}>{f.name}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div><div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>Start Date</div><input type="date" value={f._s} onChange={e => chDate("s", e.target.value)} style={S} /></div>
          <div><div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>End Date</div><input type="date" value={f._e} onChange={e => chDate("e", e.target.value)} style={S} /></div>
        </div>
        <div style={{ marginBottom: 10 }}><div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>Type</div>
          <select value={f.type} onChange={e => setF({ ...f, type: e.target.value })} style={{ ...S, appearance: "auto" }}>{LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div><div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>Days</div><input type="number" step="0.5" value={f.days} onChange={e => setF({ ...f, days: parseFloat(e.target.value) || 0 })} style={{ ...S, background: "var(--accent-bg)", fontWeight: 700 }} /></div>
          <div><div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>Half Day</div><select value={f.halfDay || ""} onChange={e => setF({ ...f, halfDay: e.target.value })} style={{ ...S, appearance: "auto" }}><option value="">No</option><option value="Yes">Yes</option></select></div>
          <div><div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>Status</div><select value={f.status} onChange={e => setF({ ...f, status: e.target.value })} style={{ ...S, appearance: "auto" }}><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select></div>
        </div>
        <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>Comments</div><input value={f.comments || ""} onChange={e => setF({ ...f, comments: e.target.value })} style={S} placeholder="Note..." /></div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { const { _s, _e, ...clean } = f; onSave(clean); }} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", background: "var(--accent)", color: "#fff", fontWeight: 700, fontSize: 14 }}>Save</button>
          <button onClick={onClose} style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: 14 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ═══ REQUEST LEAVE FORM ═══
function RequestForm({ user, records, onSubmit, loading }) {
  const defaultLead = TEAM_MAP[user] || "";
  const [f, setF] = useState({ startDate: "", endDate: "", type: "", days: "", halfDay: "", lead: defaultLead, comments: "" });
  const [err, setErr] = useState("");
  const [balAlert, setBalAlert] = useState(null);
  const used = getUsed(records, user);
  const S = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 14, fontFamily: "inherit" };

  const chDate = (k, v) => { const nf = { ...f, [k]: v }; const wd = calcWorkDays(nf.startDate, nf.endDate); if (wd > 0) nf.days = nf.halfDay === "Yes" && wd === 1 ? 0.5 : wd; setF(nf); };

  const submit = () => {
    setErr("");
    if (!f.startDate || !f.endDate || !f.type || !f.days || !f.lead) { setErr("Fill all required fields"); return; }
    const days = Number(f.days);
    const lim = BAL[f.type];
    if (lim !== undefined) {
      const remaining = lim - used[f.type];
      if (remaining <= 0) {
        setBalAlert({ type: f.type, remaining: 0, requested: days });
        return;
      }
      if (days > remaining) {
        setBalAlert({ type: f.type, remaining: remaining, requested: days });
        return;
      }
    }
    onSubmit({ ...f, startDate: fromISO(f.startDate), endDate: fromISO(f.endDate) });
  };

  const totalUsed = used.Annual + used.Casual + used.Sick;
  const totalBal = BAL.Annual + BAL.Casual + BAL.Sick;
  const totalLeft = totalBal - totalUsed;

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Request Leave</h2>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Submitted directly to your Google Sheet. Lead will be notified.</p>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {Object.entries(BAL).map(([t, total]) => {
          const left = total - used[t];
          return (
            <div key={t} style={{ padding: "8px 16px", borderRadius: 10, background: left <= 2 ? "rgba(239,68,68,0.1)" : "var(--accent-bg)", fontSize: 13, fontWeight: 600, color: left <= 2 ? "#ef4444" : "var(--accent)" }}>
              {t}: {left} left of {total}
            </div>
          );
        })}
        <div style={{ padding: "8px 16px", borderRadius: 10, background: totalLeft < 5 ? "rgba(239,68,68,0.1)" : "var(--hover)", fontSize: 13, fontWeight: 700, color: totalLeft < 5 ? "#ef4444" : "var(--text)", border: "1px solid var(--border)" }}>
          Total Left: {totalLeft} of {totalBal}
        </div>
      </div>

      {/* Balance exceeded popup */}
      {balAlert && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 28, width: 380, border: "1px solid #fca5a5", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#ef4444", marginBottom: 8 }}>Insufficient Leave Balance</div>
            <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 6, lineHeight: 1.6 }}>
              You requested <strong>{balAlert.requested} day{balAlert.requested !== 1 ? "s" : ""}</strong> of <strong>{balAlert.type}</strong> leave
            </div>
            <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16, lineHeight: 1.6 }}>
              {balAlert.remaining <= 0
                ? <span>You have <strong style={{ color: "#ef4444" }}>0 days</strong> remaining in your {balAlert.type} balance.</span>
                : <span>You only have <strong style={{ color: "#ef4444" }}>{balAlert.remaining} day{balAlert.remaining !== 1 ? "s" : ""}</strong> remaining in your {balAlert.type} balance.</span>
              }
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16, padding: "8px 12px", borderRadius: 8, background: "var(--hover)" }}>
              Your {balAlert.type} balance: {BAL[balAlert.type]} total − {used[balAlert.type]} used = <strong>{balAlert.remaining} left</strong>
            </div>
            <button onClick={() => setBalAlert(null)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Got it
            </button>
          </div>
        </div>
      )}
      <div style={{ background: "var(--card)", borderRadius: 14, padding: 24, border: "1px solid var(--border)", maxWidth: 560 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div><div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>Start Date *</div><input type="date" value={f.startDate} onChange={e => chDate("startDate", e.target.value)} style={S} /></div>
          <div><div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>End Date *</div><input type="date" value={f.endDate} onChange={e => chDate("endDate", e.target.value)} style={S} /></div>
        </div>
        <div style={{ marginBottom: 14 }}><div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>Leave Type *</div><select value={f.type} onChange={e => setF({ ...f, type: e.target.value })} style={{ ...S, appearance: "auto" }}><option value="">Choose...</option>{LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div><div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>Days (auto-calculated) *</div><input type="number" step="0.5" min="0.5" value={f.days} onChange={e => setF({ ...f, days: e.target.value })} style={{ ...S, background: "rgba(0,155,141,0.08)", fontWeight: 700 }} /></div>
          <div><div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>Half Day?</div><select value={f.halfDay} onChange={e => { const v = e.target.value; const wd = calcWorkDays(f.startDate, f.endDate); setF({ ...f, halfDay: v, days: v === "Yes" && wd === 1 ? 0.5 : wd || f.days }); }} style={{ ...S, appearance: "auto" }}><option value="">No</option><option value="Yes">Yes</option></select></div>
        </div>
        <div style={{ marginBottom: 14 }}><div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>WorkStream Lead *</div><select value={f.lead} onChange={e => setF({ ...f, lead: e.target.value })} style={{ ...S, appearance: "auto" }}><option value="">Choose...</option>{LEADS.map(l => <option key={l} value={l}>{l}</option>)}</select></div>
        <div style={{ marginBottom: 14 }}><div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>Comments</div><textarea value={f.comments} onChange={e => setF({ ...f, comments: e.target.value })} rows={2} style={{ ...S, resize: "vertical" }} placeholder="Reason..." /></div>
        {err && <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: 13, marginBottom: 12 }}>{err}</div>}
        <button onClick={submit} disabled={loading} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: loading ? "var(--border)" : "var(--accent)", color: "#fff", fontSize: 15, fontWeight: 700 }}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </div>
  );
}

// ═══ ANALYTICS (Managers/Leads) ═══
function Analytics({ records, user }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [drill, setDrill] = useState(null); // { type, title, records }

  const parseToISO = (ds) => toISO(ds);

  const isOnLeave = (record, dateISO) => {
    if (record.status === "Rejected") return false;
    const s = parseToISO(record.startDate);
    const e = parseToISO(record.endDate);
    if (!s || !e) return false;
    return dateISO >= s && dateISO <= e;
  };

  const offOnDate = records.filter(r => isOnLeave(r, selectedDate));

  const monthRecords = records.filter(r => {
    if (r.status === "Rejected") return false;
    const s = parseToISO(r.startDate);
    return s && s.startsWith(selectedMonth);
  });

  const daysInMonth = new Date(parseInt(selectedMonth.split("-")[0]), parseInt(selectedMonth.split("-")[1]), 0).getDate();
  const dailyCounts = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = selectedMonth + "-" + String(d).padStart(2, "0");
    const dt = new Date(iso + "T00:00:00");
    const dayOfWeek = dt.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    const offList = records.filter(r => isOnLeave(r, iso));
    dailyCounts.push({ date: iso, day: d, dayName: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dayOfWeek], count: offList.length, records: offList });
  }
  const peakDay = dailyCounts.reduce((max, d) => d.count > max.count ? d : max, { count: 0, records: [] });
  const totalMonthDays = monthRecords.reduce((sum, r) => sum + (Number(r.days) || 0), 0);
  const uniqueNames = [...new Set(monthRecords.map(r => r.name))];
  const uniqueEmployeesOff = uniqueNames.length;

  const typeBreakdown = {};
  monthRecords.forEach(r => {
    if (!typeBreakdown[r.type]) typeBreakdown[r.type] = { days: 0, records: [] };
    typeBreakdown[r.type].days += (Number(r.days) || 0);
    typeBreakdown[r.type].records.push(r);
  });

  const extendedLeaves = records.filter(r => r.status !== "Rejected" && Number(r.days) >= 3).sort((a, b) => {
    const da = toISO(a.startDate) || "", db = toISO(b.startDate) || "";
    return db.localeCompare(da);
  });

  const cardStyle = { background: "var(--card)", borderRadius: 12, padding: "16px 20px", border: "1px solid var(--border)" };

  // Drill-down detail table
  const DrillPanel = ({ title, data, onClose }) => (
    <div style={{ ...cardStyle, marginTop: 12, border: "1px solid var(--accent)", background: "var(--hover)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>{title}</div>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 16, color: "var(--muted)", cursor: "pointer" }}>✕</button>
      </div>
      {data.length === 0 ? (
        <div style={{ padding: 10, color: "var(--muted)", fontSize: 13, textAlign: "center" }}>No records</div>
      ) : (
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "var(--card)" }}>
                {["Employee", "Type", "Days", "Period", "Lead", "Status"].map(h => (
                  <th key={h} style={{ padding: "7px 10px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "7px 10px", fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: "7px 10px" }}>{r.type}</td>
                  <td style={{ padding: "7px 10px" }}>{r.days}{r.halfDay === "Yes" ? " (½)" : ""}</td>
                  <td style={{ padding: "7px 10px", fontSize: 11, color: "var(--muted)" }}>{dispDate(r.startDate)} → {dispDate(r.endDate)}</td>
                  <td style={{ padding: "7px 10px", fontSize: 11 }}>{r.lead}</td>
                  <td style={{ padding: "7px 10px" }}><Badge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 11, color: "var(--muted)", padding: "8px 10px 0" }}>{data.length} record{data.length !== 1 ? "s" : ""} · {data.reduce((s, r) => s + (Number(r.days) || 0), 0)} total days</div>
        </div>
      )}
    </div>
  );

  const clickableCard = (icon, label, value, sub, drillType, drillTitle, drillData) => (
    <div
      onClick={() => setDrill(drill?.type === drillType ? null : { type: drillType, title: drillTitle, records: drillData })}
      style={{
        flex: "1 1 120px", padding: "12px 16px", borderRadius: 10,
        background: drill?.type === drillType ? "var(--accent-bg)" : "var(--hover)",
        border: drill?.type === drillType ? "1px solid var(--accent)" : "1px solid var(--border)",
        cursor: "pointer", transition: "all 0.2s",
      }}
    >
      <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{sub}</div>}
      <div style={{ fontSize: 10, color: "var(--accent)", marginTop: 4 }}>{drill?.type === drillType ? "▲ Click to close" : "▼ Click for details"}</div>
    </div>
  );

  // Build employee-level summary for "Employees Off" drill
  const employeeSummary = uniqueNames.map(name => {
    const empRecs = monthRecords.filter(r => r.name === name);
    const totalDays = empRecs.reduce((s, r) => s + (Number(r.days) || 0), 0);
    return { name, totalDays, count: empRecs.length, records: empRecs };
  }).sort((a, b) => b.totalDays - a.totalDays);

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Leave Analytics</h2>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Click any card or day for drill-down details.</p>

      {/* ── Daily Check ── */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>🗓️ Daily Absence Check</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>See who's off on any date</div>
          </div>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13, fontFamily: "inherit" }} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: offOnDate.length > 0 ? "#d97706" : "var(--accent)", marginBottom: 10 }}>
          {offOnDate.length} employee{offOnDate.length !== 1 ? "s" : ""} off on {dispDate(selectedDate)}
        </div>
        {offOnDate.length === 0 ? (
          <div style={{ padding: "12px", borderRadius: 8, background: "var(--hover)", color: "var(--muted)", fontSize: 13, textAlign: "center" }}>No one is on leave this day ✅</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--hover)" }}>
                {["Employee", "Type", "Days", "Full Period", "Lead", "Status"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {offOnDate.map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "8px 12px", fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: "8px 12px" }}>{r.type}</td>
                  <td style={{ padding: "8px 12px" }}>{r.days}{r.halfDay === "Yes" ? " (½)" : ""}</td>
                  <td style={{ padding: "8px 12px", fontSize: 12, color: "var(--muted)" }}>{dispDate(r.startDate)} → {dispDate(r.endDate)}</td>
                  <td style={{ padding: "8px 12px", fontSize: 12 }}>{r.lead}</td>
                  <td style={{ padding: "8px 12px" }}><Badge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Monthly Overview ── */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>📊 Monthly Overview</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Click any card or day for breakdown</div>
          </div>
          <input type="month" value={selectedMonth} onChange={e => { setSelectedMonth(e.target.value); setDrill(null); }}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13, fontFamily: "inherit" }} />
        </div>

        {/* Clickable summary cards */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          {clickableCard("📅", "TOTAL DAYS OFF", totalMonthDays, null, "total", "All Leave Requests — " + dispDate(selectedMonth + "-01").slice(0, 2) + "/2026", monthRecords)}
          {clickableCard("👥", "EMPLOYEES OFF", uniqueEmployeesOff, null, "employees", "Employees Off This Month", monthRecords)}
          {clickableCard("🔺", "PEAK DAY", peakDay.count > 0 ? peakDay.count : "—", peakDay.count > 0 ? (peakDay.dayName + ", " + dispDate(peakDay.date)) : null, "peak", "Peak Day — " + (peakDay.count > 0 ? dispDate(peakDay.date) : "N/A"), peakDay.records || [])}
          {clickableCard("📝", "LEAVE REQUESTS", monthRecords.length, null, "requests", "All Requests This Month", monthRecords)}
        </div>

        {/* Drill-down panel for cards */}
        {drill && drill.type === "employees" && (
          <div style={{ ...cardStyle, marginBottom: 12, border: "1px solid var(--accent)", background: "var(--hover)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>👥 Employee Breakdown — {uniqueEmployeesOff} employees</div>
              <button onClick={() => setDrill(null)} style={{ background: "none", border: "none", fontSize: 16, color: "var(--muted)", cursor: "pointer" }}>✕</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ background: "var(--card)" }}>
                {["Employee", "Requests", "Total Days", ""].map(h => <th key={h} style={{ padding: "7px 10px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 10 }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {employeeSummary.map((emp, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)", cursor: "pointer" }}
                    onClick={() => setDrill({ type: "emp-detail", title: emp.name + " — Leave Details", records: emp.records })}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--accent-bg)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "7px 10px", fontWeight: 600 }}>{emp.name}</td>
                    <td style={{ padding: "7px 10px" }}>{emp.count}</td>
                    <td style={{ padding: "7px 10px", fontWeight: 700, color: emp.totalDays >= 5 ? "#ef4444" : emp.totalDays >= 3 ? "#d97706" : "var(--accent)" }}>{emp.totalDays}d</td>
                    <td style={{ padding: "7px 10px", fontSize: 10, color: "var(--accent)" }}>View details →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {drill && (drill.type === "total" || drill.type === "peak" || drill.type === "requests" || drill.type === "emp-detail" || drill.type === "type-detail" || drill.type === "day-detail") && (
          <DrillPanel title={drill.title} data={drill.records} onClose={() => setDrill(null)} />
        )}

        {/* Type breakdown - clickable */}
        {Object.keys(typeBreakdown).length > 0 && (
          <div style={{ marginTop: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>By Leave Type <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 400 }}>— click for details</span></div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(typeBreakdown).sort((a, b) => b[1].days - a[1].days).map(([type, data]) => (
                <div key={type}
                  onClick={() => setDrill(drill?.type === "type-" + type ? null : { type: "type-detail", title: type + " Leaves — " + data.days + " days", records: data.records })}
                  style={{
                    padding: "6px 14px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
                    background: drill?.title?.startsWith(type) ? "var(--accent)" : "var(--accent-bg)",
                    fontSize: 12, border: "1px solid transparent",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
                >
                  <span style={{ fontWeight: 600, color: drill?.title?.startsWith(type) ? "#fff" : "var(--accent)" }}>{type}:</span>
                  <span style={{ marginLeft: 4, color: drill?.title?.startsWith(type) ? "#fff" : "var(--text)" }}>{data.days} days ({data.records.length})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily heatmap - clickable */}
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Daily Absence Count <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 400 }}>— click any day</span></div>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 4 }}>
          {dailyCounts.map((d, i) => {
            const isActive = drill?.type === "day-detail" && drill?.title?.includes(dispDate(d.date));
            const bg = d.count === 0 ? "var(--hover)" : d.count >= 5 ? "#ef4444" : d.count >= 3 ? "#f59e0b" : "var(--accent)";
            return (
              <div key={i}
                title={d.dayName + " " + d.day + ": " + d.count + " off"}
                onClick={() => {
                  if (d.count > 0) {
                    setDrill({ type: "day-detail", title: d.dayName + " " + dispDate(d.date) + " — " + d.count + " employee(s) off", records: d.records });
                  }
                  setSelectedDate(d.date);
                }}
                style={{
                  width: 30, height: 30, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 600, cursor: d.count > 0 ? "pointer" : "default",
                  background: bg, color: d.count > 0 ? "#fff" : "var(--muted)",
                  opacity: d.count === 0 ? 0.4 : 1,
                  border: isActive ? "2px solid var(--text)" : selectedDate === d.date ? "2px solid var(--accent)" : "1px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {d.day}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 10, color: "var(--muted)", marginTop: 4 }}>
          <span>🟩 1-2 off</span> <span>🟨 3-4 off</span> <span>🟥 5+ off</span>
        </div>
      </div>

      {/* ── Extended Leaves ── */}
      <div style={{ ...cardStyle }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>⚠️ Extended Leaves (3+ Days)</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>Sorted by most recent. Click a row to see full period.</div>
        {extendedLeaves.length === 0 ? (
          <div style={{ padding: "12px", borderRadius: 8, background: "var(--hover)", color: "var(--muted)", fontSize: 13, textAlign: "center" }}>No extended leaves found</div>
        ) : (
          <div style={{ overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--hover)" }}>
                  {["Employee", "Type", "Days", "Period", "Lead", "Status"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {extendedLeaves.map((r, i) => (
                  <tr key={i} style={{
                    borderTop: "1px solid var(--border)",
                    background: Number(r.days) >= 10 ? "rgba(239,68,68,0.05)" : Number(r.days) >= 5 ? "rgba(245,158,11,0.05)" : "transparent",
                    cursor: "pointer",
                  }}
                    onClick={() => setSelectedDate(toISO(r.startDate) || selectedDate)}
                  >
                    <td style={{ padding: "8px 12px", fontWeight: 600 }}>{r.name}</td>
                    <td style={{ padding: "8px 12px" }}>{r.type}</td>
                    <td style={{ padding: "8px 12px" }}>
                      <span style={{
                        fontWeight: 700, padding: "2px 8px", borderRadius: 6, fontSize: 12,
                        background: Number(r.days) >= 10 ? "rgba(239,68,68,0.15)" : Number(r.days) >= 5 ? "rgba(245,158,11,0.15)" : "var(--accent-bg)",
                        color: Number(r.days) >= 10 ? "#ef4444" : Number(r.days) >= 5 ? "#d97706" : "var(--accent)",
                      }}>{r.days}d</span>
                    </td>
                    <td style={{ padding: "8px 12px", fontSize: 12, color: "var(--muted)" }}>{dispDate(r.startDate)} → {dispDate(r.endDate)}</td>
                    <td style={{ padding: "8px 12px", fontSize: 12 }}>{r.lead}</td>
                    <td style={{ padding: "8px 12px" }}><Badge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ FAQ CHATBOT (offline) ═══
function FAQChat() {
  const [q, setQ] = useState("");
  const [history, setHistory] = useState([]);
  const ref = useRef(null);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);

  const ask = (query) => {
    if (!query.trim()) return;
    const results = searchFAQ(query);
    const answer = results.length > 0
      ? results.map(r => "📌 " + r.title + "\n" + r.ans).join("\n\n")
      : "I couldn't find a specific policy for that. Try keywords like: hospital, opd, dental, maternity, claim, emergency, leave, excluded, or mental health.";
    setHistory(p => [...p, { q: query, a: answer }]);
    setQ("");
  };

  const chips = ["Hospital care limit?", "OPD coverage?", "How to claim?", "Emergency numbers?", "Dental coverage?", "Maternity benefits?", "Who is covered?", "Leave balance?"];

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Policy FAQ</h2>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Search EFU Health Plan A & leave policies instantly — no internet needed.</p>
      <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)", height: "calc(100vh - 180px)", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
          {history.length === 0 && (
            <div style={{ textAlign: "center", padding: "30px 0", color: "var(--muted)" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Ask about any company policy</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                {chips.map((c, i) => (
                  <button key={i} onClick={() => ask(c)} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: 12, fontFamily: "inherit", cursor: "pointer" }}>{c}</button>
                ))}
              </div>
            </div>
          )}
          {history.map((h, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                <div style={{ padding: "8px 14px", borderRadius: "14px 14px 4px 14px", background: "var(--accent)", color: "#fff", fontSize: 13, maxWidth: "70%" }}>{h.q}</div>
              </div>
              <div style={{ padding: "12px 16px", borderRadius: "14px 14px 14px 4px", background: "var(--hover)", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", border: "1px solid var(--border)" }}>{h.a}</div>
            </div>
          ))}
          <div ref={ref} />
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
          <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && ask(q)}
            placeholder="Search policies (e.g. dental, maternity, claim)..."
            style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13, fontFamily: "inherit" }} />
          <button onClick={() => ask(q)} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: q.trim() ? "var(--accent)" : "var(--border)", color: q.trim() ? "#fff" : "var(--muted)", fontWeight: 600, fontSize: 13 }}>Search</button>
        </div>
      </div>
    </div>
  );
}

// ═══ SETUP SCREEN ═══
function SetupScreen({ onSave }) {
  const [url, setUrl] = useState("");
  const [testing, setTesting] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [detail, setDetail] = useState("");

  const test = async () => {
    if (!url.trim()) return;
    let cleanUrl = url.trim();
    if (!cleanUrl.endsWith("/exec")) {
      if (!cleanUrl.endsWith("/")) cleanUrl += "/";
      if (!cleanUrl.endsWith("exec")) cleanUrl += "exec";
    }
    setTesting(true); setErr(""); setOk(false); setDetail("Connecting to Google Apps Script...");
    try {
      const r = await fetch(cleanUrl, { redirect: "follow" });
      setDetail("Got response, parsing...");
      const text = await r.text();
      let d;
      try { d = JSON.parse(text); } catch {
        setErr("Got a response but it wasn't valid JSON. Make sure you pasted the ENTIRE Apps Script code and redeployed.");
        setDetail("Response: " + text.substring(0, 100));
        return;
      }
      if (d.success && d.records) {
        setOk(true);
        setDetail("Found " + d.records.length + " records!");
        setTimeout(() => onSave(cleanUrl), 1000);
      } else if (d.error) {
        setErr("Apps Script error: " + d.error);
      } else {
        setErr("Unexpected response. Check sheet tab is named 'Form_Responses'.");
        setDetail(JSON.stringify(d).substring(0, 100));
      }
    } catch (e) {
      setErr("Connection failed. This can happen inside Claude's sandbox. Try these fixes:");
      setDetail(e.message || "Network error");
    }
    finally { setTesting(false); }
  };

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", background: "linear-gradient(135deg,#0f172a,#1e293b)" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');`}</style>
      <div style={{ background: "#1e293b", borderRadius: 20, padding: "36px", width: 480, border: "1px solid #334155" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⚙️</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9" }}>Dakota LMS Setup</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Connect to your Google Sheet</div>
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>PASTE YOUR APPS SCRIPT WEB APP URL</div>
        <input value={url} onChange={e => { setUrl(e.target.value); setErr(""); setOk(false); setDetail(""); }}
          placeholder="https://script.google.com/macros/s/.../exec"
          style={{ width: "100%", padding: "12px", borderRadius: 10, border: err ? "1px solid #ef4444" : "1px solid #475569", background: "#0f172a", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit", marginBottom: 12 }} />
        {detail && <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>{detail}</div>}
        {err && (
          <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 10, lineHeight: 1.5 }}>
            ⚠️ {err}
            {err.includes("sandbox") && (
              <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 11, lineHeight: 1.6 }}>
                1. The URL will work when deployed on Vercel (free)<br />
                2. Or use "Demo Mode" below to try the app with local data
              </div>
            )}
          </div>
        )}
        {ok && <div style={{ fontSize: 12, color: "#22c55e", marginBottom: 10 }}>✅ Connected! Loading Dakota LMS...</div>}
        <button onClick={test} disabled={!url.trim() || testing} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: url.trim() ? "#009b8d" : "#334155", color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
          {testing ? "Testing..." : "Connect & Launch"}
        </button>
        <button onClick={() => onSave("DEMO")} style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #475569", background: "transparent", color: "#94a3b8", fontSize: 13 }}>
          Skip → Use Demo Mode (local storage)
        </button>
        <div style={{ fontSize: 11, color: "#475569", marginTop: 12, lineHeight: 1.6, textAlign: "center" }}>
          Demo mode uses browser storage. Google Sheet mode syncs across all users.
        </div>
      </div>
    </div>
  );
}

// ═══ LOGIN SCREEN ═══
function LoginScreen({ onLogin }) {
  const [sel, setSel] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [dropOpen, setDropOpen] = useState(false);
  const searchRef = useRef(null);
  const needsPw = sel && (MANAGERS.includes(sel) || LEADS.includes(sel));
  const isSelMgr = MANAGERS.includes(sel);

  const sorted = [...EMPLOYEES].sort();
  const filtered = search.trim()
    ? sorted.filter(n => n.toLowerCase().includes(search.toLowerCase()))
    : sorted;

  const handlePick = (n) => {
    setSel(n);
    setSearch(n);
    setDropOpen(false);
    setPw("");
    setErr("");
    if (n && !MANAGERS.includes(n) && !LEADS.includes(n)) onLogin(n);
  };

  const handleLogin = () => {
    const correctPw = isSelMgr ? MGR_PW : LEAD_PW;
    if (pw === correctPw) onLogin(sel);
    else { setErr("Incorrect password"); setPw(""); }
  };

  const roleTag = (n) => MANAGERS.includes(n) ? " (Mgr)" : LEADS.includes(n) ? " (Lead)" : "";

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", background: "linear-gradient(135deg,#0f172a,#1e293b)" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');`}</style>
      <div style={{ background: "#1e293b", borderRadius: 20, padding: "40px 36px", width: 400, border: "1px solid #334155" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🏢</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>Dakota LMS</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Leave Management System</div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>TYPE YOUR NAME TO SEARCH</div>
        <div style={{ position: "relative", marginBottom: needsPw ? 16 : 0 }}>
          <input
            ref={searchRef}
            value={search}
            onChange={e => { setSearch(e.target.value); setDropOpen(true); setSel(""); }}
            onFocus={() => setDropOpen(true)}
            placeholder="Start typing your name..."
            style={{
              width: "100%", padding: "12px 40px 12px 14px", borderRadius: 10,
              border: sel ? "1px solid #009b8d" : "1px solid #475569",
              background: "#0f172a", color: "#e2e8f0", fontSize: 14, fontFamily: "inherit",
            }}
          />
          <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 14 }}>
            {sel ? "✅" : "🔍"}
          </span>

          {dropOpen && !sel && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
              maxHeight: 220, overflow: "auto", borderRadius: 10,
              background: "#0f172a", border: "1px solid #475569",
              zIndex: 100, boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            }}>
              {filtered.length === 0 && (
                <div style={{ padding: "12px 14px", color: "#64748b", fontSize: 13 }}>No match found</div>
              )}
              {filtered.map(n => (
                <div
                  key={n}
                  onClick={() => handlePick(n)}
                  style={{
                    padding: "10px 14px", cursor: "pointer", fontSize: 14,
                    color: "#e2e8f0", borderBottom: "1px solid #1e293b",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1e293b"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span>{n}</span>
                  {roleTag(n) && (
                    <span style={{
                      fontSize: 10, padding: "2px 8px", borderRadius: 4,
                      background: MANAGERS.includes(n) ? "rgba(245,158,11,0.15)" : "rgba(0,155,141,0.15)",
                      color: MANAGERS.includes(n) ? "#f59e0b" : "#00c9a7",
                      fontWeight: 600,
                    }}>
                      {MANAGERS.includes(n) ? "MGR" : "LEAD"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {needsPw && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600 }}>{MANAGERS.includes(sel) ? "Manager" : "Lead"} — password required</div>
            </div>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <input type={show ? "text" : "password"} value={pw} onChange={e => { setPw(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Enter password..." autoFocus
                style={{ width: "100%", padding: "12px 44px 12px 14px", borderRadius: 10, border: err ? "1px solid #ef4444" : "1px solid #475569", background: "#0f172a", color: "#e2e8f0", fontSize: 14, fontFamily: "inherit" }} />
              <button onClick={() => setShow(!show)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", fontSize: 16 }}>{show ? "🙈" : "👁️"}</button>
            </div>
            {err && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 10 }}>⚠️ {err}</div>}
            <button onClick={handleLogin} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: pw ? "#009b8d" : "#334155", color: pw ? "#fff" : "#64748b", fontSize: 15, fontWeight: 700 }}>Sign In</button>
          </div>
        )}

        {!needsPw && !sel && (
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 10, textAlign: "center" }}>
            Managers & Leads require password
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function DakotaLMS() {
  const API_URL = "https://script.google.com/macros/s/AKfycbzPG8jOlDtsbsL842owsuwT0Vje8EYNvCzOg9WiGvpq8LI7xB07nzp9LV9NYzRGmI23xw/exec";

  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [editing, setEditing] = useState(null);
  const [delRec, setDelRec] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [ready, setReady] = useState(false);
  const [fetchErr, setFetchErr] = useState("");
  const [filters, setFilters] = useState({ name: "", type: "", lead: "", status: "" });
  const [dashFilters, setDashFilters] = useState({ name: "", type: "", lead: "", status: "" });
  const [teamFilter, setTeamFilter] = useState("");
  const [teamLowBal, setTeamLowBal] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeDashFilter, setActiveDashFilter] = useState(null);

  // Fetch records from Google Sheet
  const fetchData = async () => {
    setSyncing(true); setFetchErr("");
    try {
      const r = await fetch(API_URL, { redirect: "follow" });
      const text = await r.text();
      const d = JSON.parse(text);
      if (d.success && d.records) { setRecords(d.records); setFetchErr(""); }
      else { setFetchErr("API returned: " + (d.error || "unexpected response")); }
    } catch (e) {
      setFetchErr("Could not connect to Google Sheet: " + e.message);
    }
    finally { setSyncing(false); setReady(true); }
  };

  useEffect(() => { fetchData(); }, []);

  // API calls to Google Sheet
  const apiPost = async (body) => {
    setLoading(true);
    try {
      await fetch(API_URL, { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "text/plain" } });
      await fetchData();
    } catch (e) { console.error("Post error:", e); }
    finally { setLoading(false); }
  };

  if (!ready) return (
    <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", background: "linear-gradient(135deg,#0f172a,#1e293b)" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');`}</style>
      <div style={{ textAlign: "center", color: "#94a3b8" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🏢</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Dakota LMS</div>
        <div style={{ fontSize: 14 }}>Connecting to Google Sheet...</div>
      </div>
    </div>
  );

  if (!user) return (
    <div>
      {fetchErr && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, padding: "12px 20px", background: "#fef2f2", color: "#991b1b", fontSize: 13, textAlign: "center", zIndex: 1000, borderBottom: "1px solid #fca5a5" }}>
          ⚠️ {fetchErr} — Data may not be up to date. <button onClick={fetchData} style={{ marginLeft: 8, padding: "2px 10px", borderRadius: 6, border: "1px solid #fca5a5", background: "#fff", color: "#991b1b", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Retry</button>
        </div>
      )}
      <LoginScreen onLogin={setUser} />
    </div>
  );

  const role = getRole(user);
  const isApprover = role === "manager" || role === "lead";
  const myRecs = records.filter(r => r.name === user);
  const used = getUsed(records, user);
  const pending = isApprover ? records.filter(r => r.lead === user && (r.status === "Pending" || r.status === "")) : [];
  const showAllTeam = (user === "Farhan Farrukh" || user === "Muhammad Maaz");
  const teamRecs = isApprover ? (showAllTeam ? records : records.filter(r => r.lead === user)) : [];
  const canManage = (r) => isApprover && (r.lead === user || MANAGERS.includes(user));

  // Filter helper
  const applyFilters = (recs, f) => {
    return recs.filter(r => {
      if (f.name && r.name !== f.name) return false;
      if (f.type && r.type !== f.type) return false;
      if (f.lead && r.lead !== f.lead) return false;
      if (f.status) {
        const rs = r.status || "Pending";
        if (rs !== f.status) return false;
      }
      return true;
    });
  };

  // Filter dropdown component
  const FilterHeader = ({ label, col, options, filterState, setFilterState, activeFilterState, setActiveFilterState }) => {
    const isOpen = activeFilterState === col;
    const isFiltered = filterState[col] !== "";
    return (
      <th style={{ padding: "8px 14px", textAlign: "left", fontSize: 11, position: "relative", fontWeight: 600 }}>
        <div onClick={() => setActiveFilterState(isOpen ? null : col)}
          style={{ cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center", gap: 4, color: isFiltered ? "var(--accent)" : "var(--muted)" }}>
          {label} {isFiltered ? "✕" : "▼"}
        </div>
        {isOpen && (
          <div style={{
            position: "absolute", top: "100%", left: 0, zIndex: 50, minWidth: 180, maxHeight: 250, overflow: "auto",
            background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", marginTop: 2,
          }}>
            <div onClick={() => { setFilterState(p => ({ ...p, [col]: "" })); setActiveFilterState(null); }}
              style={{ padding: "8px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600, color: "var(--accent)", borderBottom: "1px solid var(--border)" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--hover)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >Show All</div>
            {options.map(opt => (
              <div key={opt} onClick={() => { setFilterState(p => ({ ...p, [col]: opt })); setActiveFilterState(null); }}
                style={{
                  padding: "8px 12px", fontSize: 12, cursor: "pointer",
                  background: filterState[col] === opt ? "var(--accent-bg)" : "transparent",
                  fontWeight: filterState[col] === opt ? 600 : 400,
                  color: filterState[col] === opt ? "var(--accent)" : "var(--text)",
                }}
                onMouseEnter={e => e.currentTarget.style.background = filterState[col] === opt ? "var(--accent-bg)" : "var(--hover)"}
                onMouseLeave={e => e.currentTarget.style.background = filterState[col] === opt ? "var(--accent-bg)" : "transparent"}
              >{opt}</div>
            ))}
          </div>
        )}
      </th>
    );
  };

  const activeFilterCount = (f) => Object.values(f).filter(v => v !== "").length;

  const allTabs = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "request", icon: "✍️", label: "Request Leave" },
    { id: "my-leaves", icon: "📋", label: "My Leaves" },
  ];
  if (isApprover) {
    allTabs.push({ id: "approvals", icon: "✅", label: "Approvals" + (pending.length ? " (" + pending.length + ")" : "") });
    allTabs.push({ id: "team", icon: "👥", label: "Team" });
    allTabs.push({ id: "analytics", icon: "📈", label: "Analytics" });
    allTabs.push({ id: "manage", icon: "⚙️", label: "Manage" });
  }
  allTabs.push({ id: "faq", icon: "📋", label: "Policy FAQ" });

  const dashRecs = records.filter(r => {
    if (role === "manager") return true;
    if (role === "lead") return r.lead === user || r.name === user;
    return r.name === user;
  });

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", fontFamily: "'DM Sans',sans-serif", background: "var(--bg)", color: "var(--text)", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        :root { --bg:#f1f5f9; --card:#fff; --text:#0f172a; --muted:#64748b; --border:#e2e8f0; --accent:#009b8d; --accent-bg:rgba(0,155,141,0.1); --hover:#f8fafc; --sidebar:#0f172a; --sidebar-t:#94a3b8; --sidebar-a:#1e293b; }
        @media(prefers-color-scheme:dark) { :root { --bg:#0f172a; --card:#1e293b; --text:#e2e8f0; --muted:#94a3b8; --border:#334155; --accent:#00c9a7; --accent-bg:rgba(0,201,167,0.1); --hover:#1e293b; --sidebar:#020617; --sidebar-t:#64748b; --sidebar-a:#0f172a; } }
        * { box-sizing:border-box; margin:0; padding:0; } ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-thumb { background:var(--border); border-radius:10px; }
        select,input,textarea { font-family:inherit; } button { font-family:inherit; cursor:pointer; }
      `}</style>

      {editing && <EditModal record={editing} onSave={async (u) => { await apiPost({ action: "update", rowNum: u.rowNum, startDate: u.startDate, endDate: u.endDate, type: u.type, days: u.days, halfDay: u.halfDay, status: u.status, comments: u.comments }); setEditing(null); }} onClose={() => setEditing(null)} />}

      {delRec && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, width: 360, border: "1px solid var(--border)", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>⚠️</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Delete Request?</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>{delRec.name} — {delRec.type} ({delRec.days}d, {dispDate(delRec.startDate)})</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={async () => { await apiPost({ action: "delete", rowNum: delRec.rowNum }); setDelRec(null); }} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700 }}>Delete</button>
              <button onClick={() => setDelRec(null)} style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div style={{ width: 210, minWidth: 210, background: "var(--sidebar)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 22 }}>🏢</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>Dakota LMS</div>
              <div style={{ fontSize: 10, color: "#64748b" }}>{role === "manager" ? "Manager" : role === "lead" ? "Lead" : "Employee"}</div>
            </div>
          </div>
          <div style={{ padding: "7px 10px", borderRadius: 8, background: "var(--sidebar-a)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{user}</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "0 6px", overflow: "auto" }}>
          {allTabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 8, border: "none", background: tab === t.id ? "var(--sidebar-a)" : "transparent", color: tab === t.id ? "#e2e8f0" : "var(--sidebar-t)", fontSize: 13, fontWeight: tab === t.id ? 600 : 400, textAlign: "left", marginBottom: 2 }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
        <div style={{ padding: "8px 14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            <button onClick={fetchData} disabled={syncing} style={{ flex: 1, padding: 6, borderRadius: 6, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 11 }}>{syncing ? "Syncing..." : "🔄 Sync"}</button>
            <button onClick={() => setUser(null)} style={{ flex: 1, padding: 6, borderRadius: 6, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 11 }}>Sign Out</button>
          </div>
          {syncing && <div style={{ fontSize: 10, color: "#22c55e", textAlign: "center" }}>Syncing with Google Sheet...</div>}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>

        {tab === "dashboard" && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Welcome, {user.split(" ")[0]} 👋</h2>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              {Object.entries(BAL).map(([t, total]) => (
                <div key={t} style={{ background: "var(--card)", borderRadius: 12, padding: "16px 20px", border: "1px solid var(--border)", flex: "1 1 160px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 8 }}>{t} Leave</div>
                  <div style={{ fontSize: 26, fontWeight: 800 }}>{used[t]}<span style={{ fontSize: 14, color: "var(--muted)" }}>/{total}</span></div>
                  <div style={{ fontSize: 12, color: total - used[t] <= 2 ? "#ef4444" : "var(--accent)", fontWeight: 600, marginTop: 4 }}>{total - used[t]} remaining</div>
                </div>
              ))}
              {isApprover && (
                <div style={{ background: "var(--card)", borderRadius: 12, padding: "16px 20px", border: "1px solid var(--border)", flex: "1 1 160px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 8 }}>Pending</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: pending.length > 0 ? "#d97706" : "var(--text)" }}>{pending.length}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Awaiting action</div>
                </div>
              )}
            </div>
            <div style={{ background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)", overflow: "auto" }}>
              <div style={{ padding: "12px 16px", fontWeight: 700, fontSize: 14, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Recent Activity {role === "employee" ? "(Your Requests)" : role === "lead" ? "(Your Team)" : "(All)"}</span>
                {activeFilterCount(dashFilters) > 0 && (
                  <button onClick={() => setDashFilters({ name: "", type: "", lead: "", status: "" })} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid var(--accent)", background: "var(--accent-bg)", color: "var(--accent)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                    Clear {activeFilterCount(dashFilters)} filter{activeFilterCount(dashFilters) > 1 ? "s" : ""}
                  </button>
                )}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ background: "var(--hover)" }}>
                  <FilterHeader label="Name" col="name" options={[...new Set(dashRecs.map(r => r.name))].sort()} filterState={dashFilters} setFilterState={setDashFilters} activeFilterState={activeDashFilter} setActiveFilterState={setActiveDashFilter} />
                  <FilterHeader label="Type" col="type" options={[...new Set(dashRecs.map(r => r.type))].sort()} filterState={dashFilters} setFilterState={setDashFilters} activeFilterState={activeDashFilter} setActiveFilterState={setActiveDashFilter} />
                  <th style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>Days</th>
                  <th style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>Period</th>
                  <FilterHeader label="Lead" col="lead" options={[...new Set(dashRecs.map(r => r.lead).filter(Boolean))].sort()} filterState={dashFilters} setFilterState={setDashFilters} activeFilterState={activeDashFilter} setActiveFilterState={setActiveDashFilter} />
                  <FilterHeader label="Status" col="status" options={["Approved", "Pending", "Rejected"]} filterState={dashFilters} setFilterState={setDashFilters} activeFilterState={activeDashFilter} setActiveFilterState={setActiveDashFilter} />
                </tr></thead>
                <tbody>{applyFilters(dashRecs, dashFilters).slice(-15).reverse().map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 14px", fontWeight: 600 }}>{r.name}</td>
                    <td style={{ padding: "8px 14px" }}>{r.type}</td>
                    <td style={{ padding: "8px 14px" }}>{r.days}</td>
                    <td style={{ padding: "8px 14px", fontSize: 12, color: "var(--muted)" }}>{dispDate(r.startDate)} → {dispDate(r.endDate)}</td>
                    <td style={{ padding: "8px 14px", fontSize: 12 }}>{r.lead}</td>
                    <td style={{ padding: "8px 14px" }}><Badge status={r.status} /></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "request" && <RequestForm user={user} records={records} loading={loading} onSubmit={async (f) => { await apiPost({ action: "add", name: user, ...f }); setTab("my-leaves"); }} />}

        {tab === "my-leaves" && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>My Leaves</h2>
            <div style={{ background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)", overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ background: "var(--hover)" }}>{["Type", "Period", "Days", "Lead", "Status", "Note"].map(h => <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>{h}</th>)}</tr></thead>
                <tbody>{myRecs.slice().reverse().map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 14px", fontWeight: 600 }}>{r.type}</td>
                    <td style={{ padding: "8px 14px", fontSize: 12 }}>{dispDate(r.startDate)} → {dispDate(r.endDate)}</td>
                    <td style={{ padding: "8px 14px" }}>{r.days}{r.halfDay === "Yes" ? " (½)" : ""}</td>
                    <td style={{ padding: "8px 14px", fontSize: 12 }}>{r.lead}</td>
                    <td style={{ padding: "8px 14px" }}><Badge status={r.status} /></td>
                    <td style={{ padding: "8px 14px", fontSize: 12, color: "var(--muted)" }}>{r.comments}</td>
                  </tr>
                ))}</tbody>
              </table>
              {myRecs.length === 0 && <div style={{ padding: 30, textAlign: "center", color: "var(--muted)" }}>No records</div>}
            </div>
          </div>
        )}

        {tab === "approvals" && isApprover && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Pending ({pending.length})</h2>
            {pending.length === 0 && <div style={{ background: "var(--card)", borderRadius: 12, padding: 30, textAlign: "center", color: "var(--muted)", border: "1px solid var(--border)" }}>All caught up ✅</div>}
            {pending.map((r, i) => { const eu = getUsed(records, r.name); return (
              <div key={i} style={{ background: "var(--card)", borderRadius: 12, padding: "16px 18px", border: "1px solid var(--border)", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
                    <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{r.type} · {r.days}d · {dispDate(r.startDate)} → {dispDate(r.endDate)}</div>
                    {r.comments && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3, fontStyle: "italic" }}>{r.comments}</div>}
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Bal: A{eu.Annual}/{BAL.Annual} C{eu.Casual}/{BAL.Casual} S{eu.Sick}/{BAL.Sick}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                    <button onClick={() => apiPost({ action: "update", rowNum: r.rowNum, status: "Approved" })} style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: "#059669", color: "#fff", fontWeight: 600, fontSize: 13 }}>Approve</button>
                    <button onClick={() => apiPost({ action: "update", rowNum: r.rowNum, status: "Rejected" })} style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid #fca5a5", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontWeight: 600, fontSize: 13 }}>Reject</button>
                    <button onClick={() => setEditing(r)} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--accent)", fontWeight: 600, fontSize: 13 }}>Edit</button>
                  </div>
                </div>
              </div>
            ); })}
          </div>
        )}

        {tab === "team" && isApprover && (() => {
          const teamNames = [...new Set(teamRecs.map(r => r.name))].sort();
          const teamData = teamNames.map(name => ({ name, ...getUsed(records, name) }));
          const filtered = teamData.filter(d => {
            if (teamFilter && d.name !== teamFilter) return false;
            if (teamLowBal && (BAL.Annual - d.Annual > 3) && (BAL.Casual - d.Casual > 3) && (BAL.Sick - d.Sick > 3)) return false;
            return true;
          });
          return (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>Team Balances</h2>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <select value={teamFilter} onChange={e => setTeamFilter(e.target.value)}
                  style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 12, fontFamily: "inherit" }}>
                  <option value="">All Employees ({teamNames.length})</option>
                  {teamNames.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <button onClick={() => setTeamLowBal(!teamLowBal)}
                  style={{
                    padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    border: teamLowBal ? "1px solid #ef4444" : "1px solid var(--border)",
                    background: teamLowBal ? "rgba(239,68,68,0.1)" : "transparent",
                    color: teamLowBal ? "#ef4444" : "var(--muted)",
                  }}>
                  {teamLowBal ? "⚠️ Low Balance ON" : "⚠️ Low Balance"}
                </button>
                {(teamFilter || teamLowBal) && (
                  <button onClick={() => { setTeamFilter(""); setTeamLowBal(false); }}
                    style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--accent)", background: "var(--accent-bg)", color: "var(--accent)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
              Showing {filtered.length} of {teamNames.length} employees
              {teamLowBal && " · Filtered to employees with ≤3 days left in any category"}
            </div>
            <div style={{ background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)", overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ background: "var(--hover)" }}>
                  <th style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>Employee</th>
                  <th style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>Annual</th>
                  <th style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>Left</th>
                  <th style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>Casual</th>
                  <th style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>Left</th>
                  <th style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>Sick</th>
                  <th style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>Left</th>
                  <th style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11, borderLeft: "2px solid var(--border)" }}>Total Leaves</th>
                  <th style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>Total Left</th>
                </tr></thead>
                <tbody>{filtered.map(d => {
                  const totalTaken = d.Annual + d.Casual + d.Sick;
                  const totalBal = (BAL.Annual + BAL.Casual + BAL.Sick);
                  const totalLeft = totalBal - totalTaken;
                  return (
                  <tr key={d.name} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 14px", fontWeight: 600 }}>{d.name}</td>
                    <td style={{ padding: "8px 14px" }}>{d.Annual}</td>
                    <td style={{ padding: "8px 14px", fontWeight: 600, color: BAL.Annual - d.Annual <= 2 ? "#ef4444" : BAL.Annual - d.Annual <= 5 ? "#d97706" : "var(--accent)" }}>{BAL.Annual - d.Annual}</td>
                    <td style={{ padding: "8px 14px" }}>{d.Casual}</td>
                    <td style={{ padding: "8px 14px", fontWeight: 600, color: BAL.Casual - d.Casual <= 2 ? "#ef4444" : BAL.Casual - d.Casual <= 4 ? "#d97706" : "var(--accent)" }}>{BAL.Casual - d.Casual}</td>
                    <td style={{ padding: "8px 14px" }}>{d.Sick}</td>
                    <td style={{ padding: "8px 14px", fontWeight: 600, color: BAL.Sick - d.Sick <= 2 ? "#ef4444" : BAL.Sick - d.Sick <= 4 ? "#d97706" : "var(--accent)" }}>{BAL.Sick - d.Sick}</td>
                    <td style={{ padding: "8px 14px", fontWeight: 700, borderLeft: "2px solid var(--border)" }}>{totalTaken}</td>
                    <td style={{ padding: "8px 14px", fontWeight: 700, color: totalLeft < 5 ? "#ef4444" : totalLeft < 10 ? "#d97706" : "var(--accent)" }}>{totalLeft}</td>
                  </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </div>
          );
        })()}

        {tab === "analytics" && isApprover && <Analytics records={records} user={user} />}

        {tab === "manage" && isApprover && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Manage Requests</h2>
                <p style={{ fontSize: 13, color: "var(--muted)" }}>Filter by column headers. Changes sync to Google Sheet.</p>
              </div>
              {activeFilterCount(filters) > 0 && (
                <button onClick={() => setFilters({ name: "", type: "", lead: "", status: "" })} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, border: "1px solid var(--accent)", background: "var(--accent-bg)", color: "var(--accent)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                  Clear {activeFilterCount(filters)} filter{activeFilterCount(filters) > 1 ? "s" : ""}
                </button>
              )}
            </div>
            <div style={{ background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)", overflow: "visible" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ background: "var(--hover)" }}>
                  <FilterHeader label="Employee" col="name" options={[...new Set(records.filter(r => canManage(r)).map(r => r.name))].sort()} filterState={filters} setFilterState={setFilters} activeFilterState={activeFilter} setActiveFilterState={setActiveFilter} />
                  <FilterHeader label="Type" col="type" options={[...new Set(records.filter(r => canManage(r)).map(r => r.type))].sort()} filterState={filters} setFilterState={setFilters} activeFilterState={activeFilter} setActiveFilterState={setActiveFilter} />
                  <th style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>Period</th>
                  <th style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>Days</th>
                  <FilterHeader label="Lead" col="lead" options={[...new Set(records.filter(r => canManage(r)).map(r => r.lead).filter(Boolean))].sort()} filterState={filters} setFilterState={setFilters} activeFilterState={activeFilter} setActiveFilterState={setActiveFilter} />
                  <FilterHeader label="Status" col="status" options={["Approved", "Pending", "Rejected"]} filterState={filters} setFilterState={setFilters} activeFilterState={activeFilter} setActiveFilterState={setActiveFilter} />
                  <th style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted)", fontSize: 11 }}>Actions</th>
                </tr></thead>
                <tbody>{applyFilters(records.filter(r => canManage(r)), filters).slice().reverse().slice(0, 50).map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 14px", fontWeight: 600 }}>{r.name}</td>
                    <td style={{ padding: "8px 14px" }}>{r.type}</td>
                    <td style={{ padding: "8px 14px", fontSize: 12 }}>{dispDate(r.startDate)} → {dispDate(r.endDate)}</td>
                    <td style={{ padding: "8px 14px" }}>{r.days}</td>
                    <td style={{ padding: "8px 14px", fontSize: 12 }}>{r.lead}</td>
                    <td style={{ padding: "8px 14px" }}><Badge status={r.status} /></td>
                    <td style={{ padding: "8px 14px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setEditing(r)} style={{ padding: "3px 10px", borderRadius: 6, border: "1px solid var(--accent)", background: "var(--accent-bg)", color: "var(--accent)", fontSize: 11, fontWeight: 600 }}>Edit</button>
                        <button onClick={() => setDelRec(r)} style={{ padding: "3px 10px", borderRadius: 6, border: "1px solid #fca5a5", background: "rgba(239,68,68,0.08)", color: "#ef4444", fontSize: 11, fontWeight: 600 }}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "faq" && <FAQChat />}
      </div>
    </div>
  );
}
