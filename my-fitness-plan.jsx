import { useState, useRef, useEffect } from "react";

const PROFILE = {
  goals: ["Cardio / Endurance", "Strength", "Flexibility / Mobility"],
  daysPerWeek: 4,
  equipment: ["Peloton Bike", "Treadmill", "Weights", "Gratz Half Cadillac"],
  awayDays: ["Tuesday", "Wednesday", "Thursday"],
  homeDays: ["Monday", "Friday", "Saturday", "Sunday"],
};

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const HOME_SESSIONS = [
  { id:"h1", provider:"Peloton", type:"Cycling", title:"20 Min Low Impact Ride", instructor:"Emma Lovewell", duration:20, intensity:"Easy", location:"home", icon:"🚴", color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
  { id:"h2", provider:"Peloton", type:"Cycling", title:"30 Min Beginner Ride", instructor:"Jess King", duration:30, intensity:"Easy", location:"home", icon:"🚴", color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
  { id:"h3", provider:"Peloton", type:"Cycling", title:"30 Min Pop Ride", instructor:"Cody Rigsby", duration:30, intensity:"Medium", location:"home", icon:"🚴", color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
  { id:"h4", provider:"Peloton", type:"Treadmill Walk", title:"20 Min Walk + Run Intervals", instructor:"Becs Gentry", duration:20, intensity:"Easy", location:"home", icon:"🏃", color:"#7c3aed", bg:"#f5f3ff", border:"#ddd6fe" },
  { id:"h5", provider:"Peloton", type:"Strength", title:"20 Min Full Body Strength", instructor:"Adrian Williams", duration:20, intensity:"Medium", location:"home", icon:"💪", color:"#d97706", bg:"#fffbeb", border:"#fde68a" },
  { id:"h6", provider:"Peloton", type:"Strength", title:"15 Min Arms & Shoulders", instructor:"Andy Speer", duration:15, intensity:"Easy", location:"home", icon:"💪", color:"#d97706", bg:"#fffbeb", border:"#fde68a" },
  { id:"h7", provider:"Pilatesology", type:"Cadillac", title:"Cadillac Fundamentals — Beginners", instructor:"Niedra Gabriel", duration:40, intensity:"Easy", location:"home", icon:"🌿", color:"#059669", bg:"#ecfdf5", border:"#a7f3d0" },
  { id:"h8", provider:"Pilatesology", type:"Cadillac", title:"Cadillac Spring Work for Spine", instructor:"Kara Wily", duration:35, intensity:"Easy", location:"home", icon:"🌿", color:"#059669", bg:"#ecfdf5", border:"#a7f3d0" },
  { id:"h9", provider:"Pilatesology", type:"Cadillac", title:"Tower Work — Build Your Foundation", instructor:"Rael Isacowitz", duration:45, intensity:"Medium", location:"home", icon:"🌿", color:"#059669", bg:"#ecfdf5", border:"#a7f3d0" },
];

const TRAVEL_SESSIONS = [
  { id:"t1", provider:"Pilatesology", type:"Mat Pilates", title:"Classical Mat — True Beginner", instructor:"Niedra Gabriel", duration:30, intensity:"Easy", location:"travel", icon:"🌿", color:"#059669", bg:"#ecfdf5", border:"#a7f3d0" },
  { id:"t2", provider:"Pilatesology", type:"Mat Pilates", title:"10 Min Morning Spine Mobility", instructor:"Brooke Siler", duration:10, intensity:"Easy", location:"travel", icon:"🌿", color:"#059669", bg:"#ecfdf5", border:"#a7f3d0" },
  { id:"t3", provider:"Pilatesology", type:"Mat Pilates", title:"20 Min Mat Flow — Rebuild", instructor:"Blossom Leilani Crawford", duration:20, intensity:"Easy", location:"travel", icon:"🌿", color:"#059669", bg:"#ecfdf5", border:"#a7f3d0" },
  { id:"t4", provider:"Peloton", type:"Stretching", title:"15 Min Full Body Stretch", instructor:"Kristin McGee", duration:15, intensity:"Easy", location:"travel", icon:"🧘", color:"#db2777", bg:"#fdf2f8", border:"#fbcfe8" },
  { id:"t5", provider:"Peloton", type:"Bodyweight", title:"20 Min Bodyweight Strength", instructor:"Chase Tucker", duration:20, intensity:"Medium", location:"travel", icon:"💪", color:"#d97706", bg:"#fffbeb", border:"#fde68a" },
  { id:"t6", provider:"Peloton", type:"Meditation", title:"10 Min Breathing & Calm", instructor:"Anna Greenberg", duration:10, intensity:"Easy", location:"travel", icon:"🌙", color:"#4f46e5", bg:"#eef2ff", border:"#c7d2fe" },
];

const ALL_SESSIONS = [...HOME_SESSIONS, ...TRAVEL_SESSIONS];
const intensityColor = { Easy:"#16a34a", Medium:"#d97706", Hard:"#dc2626" };
const intensityBg = { Easy:"#dcfce7", Medium:"#fef9c3", Hard:"#fee2e2" };

function isAwayDay(day) { return PROFILE.awayDays.includes(day); }

function SessionPill({ s, onRemove }) {
  return (
    <div style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:8, padding:"7px 9px", marginBottom:5 }}>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ fontSize:13 }}>{s.icon}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:11, fontWeight:700, color:s.color, fontFamily:"'Outfit',sans-serif", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.type}</div>
          <div style={{ fontSize:10, color:"#6b7280", marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.title}</div>
          <div style={{ fontSize:9, color:"#9ca3af", marginTop:2 }}>{s.duration}min · <span style={{ color:intensityColor[s.intensity], fontWeight:600 }}>{s.intensity}</span></div>
        </div>
        <button onClick={onRemove} style={{ background:"none", border:"none", color:"#d1d5db", cursor:"pointer", fontSize:12, padding:"0 2px", lineHeight:1, flexShrink:0 }}
          onMouseEnter={e=>e.target.style.color="#ef4444"} onMouseLeave={e=>e.target.style.color="#d1d5db"}>✕</button>
      </div>
    </div>
  );
}

function DayColumn({ day, sessions, onRemove, onDrop }) {
  const away = isAwayDay(day);
  const [hover, setHover] = useState(false);
  const totalMins = sessions.reduce((a,s)=>a+s.duration,0);
  return (
    <div
      onDragOver={e=>{ e.preventDefault(); setHover(true); }}
      onDragLeave={()=>setHover(false)}
      onDrop={e=>{ e.preventDefault(); setHover(false); const id=e.dataTransfer.getData("sessionId"); onDrop(id,day); }}
      style={{ background:hover?"#f0fdf4":away?"#fafafa":"#ffffff", border:`1.5px ${hover?"dashed":"solid"} ${hover?"#86efac":away?"#e5e7eb":"#f3f4f6"}`, borderRadius:12, padding:10, minHeight:160, transition:"all 0.15s" }}
    >
      <div style={{ marginBottom:8 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, fontWeight:700, color:away?"#9ca3af":"#374151", letterSpacing:1 }}>{day.slice(0,3).toUpperCase()}</span>
          {away && <span style={{ fontSize:8, background:"#f3f4f6", color:"#9ca3af", padding:"2px 6px", borderRadius:4, letterSpacing:1, fontWeight:600 }}>TRAVEL</span>}
        </div>
        {totalMins>0 && <div style={{ fontSize:9, color:"#10b981", fontWeight:600, marginTop:2 }}>{totalMins} min</div>}
      </div>
      {sessions.length===0
        ? <div style={{ color:"#d1d5db", fontSize:10, textAlign:"center", marginTop:24, fontStyle:"italic", lineHeight:1.6 }}>{away?"mat/body\nsessions":"drop here"}</div>
        : sessions.map(s=><SessionPill key={s.planId} s={s} onRemove={()=>onRemove(s.planId)}/>)
      }
    </div>
  );
}

function LibraryCard({ s }) {
  const [dragging, setDragging] = useState(false);
  return (
    <div
      draggable
      onDragStart={e=>{ e.dataTransfer.setData("sessionId",s.id); setDragging(true); }}
      onDragEnd={()=>setDragging(false)}
      style={{ background:dragging?s.bg:"#ffffff", border:`1.5px solid ${dragging?s.border:"#f3f4f6"}`, borderRadius:10, padding:"11px 13px", cursor:"grab", display:"flex", alignItems:"center", gap:10, transition:"all 0.15s", opacity:dragging?0.6:1, userSelect:"none", boxShadow:dragging?"none":"0 1px 3px rgba(0,0,0,0.06)" }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=s.border; e.currentTarget.style.background=s.bg; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e=>{ if(!dragging){ e.currentTarget.style.borderColor="#f3f4f6"; e.currentTarget.style.background="#ffffff"; e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.06)"; }}}
    >
      <span style={{ fontSize:22, flexShrink:0 }}>{s.icon}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:11, fontWeight:700, color:s.color, fontFamily:"'Outfit',sans-serif" }}>{s.provider} · {s.type}</div>
        <div style={{ fontSize:12, color:"#374151", marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", fontWeight:500 }}>{s.title}</div>
        <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>{s.instructor} · {s.duration}min</div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
        <span style={{ fontSize:9, fontWeight:700, color:intensityColor[s.intensity], background:intensityBg[s.intensity], padding:"2px 7px", borderRadius:4 }}>{s.intensity.toUpperCase()}</span>
        <span style={{ fontSize:9, color:"#9ca3af" }}>{s.location==="travel"?"✈ travel":"🏠 home"}</span>
      </div>
    </div>
  );
}

export default function FitnessPlan() {
  const [plan, setPlan] = useState({});
  const [tab, setTab] = useState("home");
  const [aiMessages, setAiMessages] = useState([{ role:"assistant", content:`Hi! I'm your personal coach 👋\n\nI've got your profile loaded — returning to fitness after 2 years, 4 days/week, home Mon/Fri/Sat/Sun and travelling Tue–Thu.\n\nYour equipment at home: Peloton bike, treadmill, weights and your Gratz Half Cadillac.\n\nTap "Build my week 🗓" to get a personalised plan, or drag any class from the library below onto a day.` }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => { if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; }, [aiMessages, loading]);

  function dropSession(sessionId, day) {
    const s = ALL_SESSIONS.find(x=>x.id===sessionId);
    if(!s) return;
    setPlan(prev=>{ const existing=prev[day]||[]; if(existing.some(x=>x.id===s.id)) return prev; return {...prev,[day]:[...existing,{...s,planId:Date.now()+Math.random()}]}; });
  }

  function removeSession(day, planId) { setPlan(prev=>({...prev,[day]:(prev[day]||[]).filter(s=>s.planId!==planId)})); }
  function clearPlan() { setPlan({}); }

  const totalMins = Object.values(plan).flat().reduce((a,s)=>a+s.duration,0);
  const totalSessions = Object.values(plan).flat().length;

  async function sendMessage(overrideText) {
    const text = overrideText||input;
    if(!text.trim()||loading) return;
    setInput("");
    const userMsg = {role:"user",content:text};
    const newMsgs = [...aiMessages,userMsg];
    setAiMessages(newMsgs);
    setLoading(true);

    const planSummary = Object.entries(plan).map(([day,sessions])=>`${day}: ${sessions.map(s=>`${s.title} (${s.duration}min, ${s.intensity})`).join(", ")}`).join("\n")||"Empty — nothing planned yet.";

    const system = `You are a warm, encouraging personal fitness coach. The user is returning to exercise after a 2-year break.

USER PROFILE:
- Goals: Cardio/Endurance, Strength, Flexibility/Mobility
- Target: 4 workout days per week
- Home days (Mon, Fri, Sat, Sun): Peloton bike, treadmill, weights, Gratz Half Cadillac Pilates machine
- Travel days (Tue, Wed, Thu): mat/bodyweight only in hotel room
- Fitness level: Rebuilding gently — avoid overloading

AVAILABLE HOME SESSIONS:
${HOME_SESSIONS.map(s=>`- "${s.title}" by ${s.instructor} (${s.provider}, ${s.type}, ${s.duration}min, ${s.intensity})`).join("\n")}

AVAILABLE TRAVEL SESSIONS:
${TRAVEL_SESSIONS.map(s=>`- "${s.title}" by ${s.instructor} (${s.provider}, ${s.type}, ${s.duration}min, ${s.intensity})`).join("\n")}

CURRENT PLAN:
${planSummary}

RULES:
- Only recommend sessions from the lists above — use exact titles
- Home sessions only on Mon/Fri/Sat/Sun; travel sessions only on Tue/Wed/Thu
- Since they're returning after 2 years, start easy — mostly Easy intensity, max 1 Medium per week for now
- 4 workout days, 3 rest days
- Keep responses friendly, brief, and specific. When building a plan, list: Day → Session title (duration).
- Mention they can also drag-and-drop sessions manually.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,system,messages:newMsgs.map(m=>({role:m.role,content:m.content}))})});
      const data = await res.json();
      const reply = data.content?.map(b=>b.text||"").join("")||"Sorry, something went wrong.";
      setAiMessages(prev=>[...prev,{role:"assistant",content:reply}]);

      const sessionMatches = ALL_SESSIONS.filter(s=>reply.toLowerCase().includes(s.title.toLowerCase().substring(0,22).toLowerCase()));
      if(sessionMatches.length>=2){
        const newPlan={};
        let homeIdx=0,travelIdx=0;
        const homeDays=["Monday","Friday","Saturday","Sunday"];
        const travelDays=["Tuesday","Wednesday","Thursday"];
        sessionMatches.slice(0,5).forEach(s=>{
          if(s.location==="travel"&&travelIdx<travelDays.length){ const day=travelDays[travelIdx++]; newPlan[day]=[{...s,planId:Date.now()+Math.random()}]; }
          else if(s.location==="home"&&homeIdx<homeDays.length){ const day=homeDays[homeIdx++]; newPlan[day]=[{...s,planId:Date.now()+Math.random()}]; }
        });
        if(Object.keys(newPlan).length>0) setPlan(prev=>({...prev,...newPlan}));
      }
    } catch { setAiMessages(prev=>[...prev,{role:"assistant",content:"Connection error — please try again."}]); }
    setLoading(false);
  }

  const librarySessions = tab==="home"?HOME_SESSIONS:TRAVEL_SESSIONS;

  return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", color:"#111827", fontFamily:"'Outfit',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Mono&display=swap" rel="stylesheet"/>

      {/* TOP BAR */}
      <div style={{ background:"#ffffff", borderBottom:"1px solid #f3f4f6", padding:"16px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
        <div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:4, color:"#9ca3af", marginBottom:4 }}>PERSONAL FITNESS PLAN</div>
          <h1 style={{ margin:0, fontSize:22, fontWeight:800, letterSpacing:-0.5, color:"#111827" }}>My Weekly Training</h1>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {[["Sessions",totalSessions,"#111827"],["Minutes",totalMins,"#059669"]].map(([label,val,col])=>(
            <div key={label} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:10, padding:"8px 18px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:20, fontWeight:700, color:col }}>{val}</div>
              <div style={{ fontSize:9, color:"#9ca3af", letterSpacing:2 }}>{label.toUpperCase()}</div>
            </div>
          ))}
          <button onClick={clearPlan} style={{ background:"transparent", border:"1px solid #e5e7eb", color:"#9ca3af", borderRadius:8, padding:"8px 14px", fontSize:11, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all 0.15s" }}
            onMouseEnter={e=>{e.currentTarget.style.color="#ef4444";e.currentTarget.style.borderColor="#fca5a5";}}
            onMouseLeave={e=>{e.currentTarget.style.color="#9ca3af";e.currentTarget.style.borderColor="#e5e7eb";}}>
            Clear week
          </button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:0, height:"calc(100vh - 73px)" }}>

        {/* LEFT */}
        <div style={{ overflowY:"auto", padding:"24px 24px 24px 28px", borderRight:"1px solid #f3f4f6" }}>
          <div style={{ display:"flex", gap:16, marginBottom:14, alignItems:"center" }}>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:"#9ca3af", letterSpacing:3 }}>THIS WEEK</span>
            <span style={{ fontSize:10, color:"#6b7280" }}>🏠 Home: Mon, Fri, Sat, Sun</span>
            <span style={{ fontSize:10, color:"#9ca3af" }}>✈ Travel: Tue, Wed, Thu</span>
            <span style={{ fontSize:10, color:"#d1d5db", fontStyle:"italic" }}>← drag sessions onto days</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8, marginBottom:32 }}>
            {DAYS.map(day=><DayColumn key={day} day={day} sessions={plan[day]||[]} onRemove={planId=>removeSession(day,planId)} onDrop={dropSession}/>)}
          </div>
          <div style={{ borderTop:"1px solid #f3f4f6", paddingTop:24 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:3, color:"#9ca3af" }}>SESSION LIBRARY</div>
                <div style={{ fontSize:11, color:"#6b7280", marginTop:3 }}>Drag any session onto a day above</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {[["home","🏠 Home"],["travel","✈ Travel"]].map(([id,label])=>(
                  <button key={id} onClick={()=>setTab(id)} style={{ background:tab===id?"#f0fdf4":"transparent", border:`1px solid ${tab===id?"#86efac":"#e5e7eb"}`, color:tab===id?"#15803d":"#9ca3af", borderRadius:8, padding:"6px 14px", fontSize:11, cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontWeight:600, transition:"all 0.15s" }}>{label}</button>
                ))}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:8 }}>
              {librarySessions.map(s=><LibraryCard key={s.id} s={s}/>)}
            </div>
          </div>
        </div>

        {/* RIGHT: AI Coach */}
        <div style={{ display:"flex", flexDirection:"column", background:"#ffffff" }}>
          <div style={{ padding:"16px 18px", borderBottom:"1px solid #f3f4f6" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>✦ Your AI Coach</div>
            <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>Powered by Claude · knows your equipment & schedule</div>
          </div>
          <div style={{ padding:"12px 16px", borderBottom:"1px solid #f9fafb", display:"flex", flexWrap:"wrap", gap:6 }}>
            {["Build my week 🗓","Start easy this week","What should I do today?","How long should sessions be?"].map(q=>(
              <button key={q} onClick={()=>sendMessage(q)} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", color:"#6b7280", borderRadius:20, padding:"5px 11px", fontSize:10, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all 0.15s" }}
                onMouseEnter={e=>{e.currentTarget.style.color="#059669";e.currentTarget.style.borderColor="#a7f3d0";e.currentTarget.style.background="#f0fdf4";}}
                onMouseLeave={e=>{e.currentTarget.style.color="#6b7280";e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.background="#f9fafb";}}>
                {q}
              </button>
            ))}
          </div>
          <div ref={chatRef} style={{ flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:10 }}>
            {aiMessages.map((m,i)=>(
              <div key={i} style={{ alignSelf:m.role==="user"?"flex-end":"flex-start", maxWidth:"92%", background:m.role==="user"?"#f0fdf4":"#f9fafb", border:`1px solid ${m.role==="user"?"#bbf7d0":"#f3f4f6"}`, borderRadius:m.role==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px", padding:"10px 13px", fontSize:12, lineHeight:1.6, color:m.role==="user"?"#166534":"#374151", whiteSpace:"pre-wrap" }}>{m.content}</div>
            ))}
            {loading && <div style={{ alignSelf:"flex-start", color:"#9ca3af", fontSize:12, fontStyle:"italic", padding:"4px 0" }}>thinking…</div>}
          </div>
          <div style={{ padding:"12px 14px", borderTop:"1px solid #f3f4f6", display:"flex", gap:8 }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()} placeholder="Ask anything about your plan…"
              style={{ flex:1, background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:10, padding:"9px 13px", color:"#111827", fontSize:12, outline:"none", fontFamily:"'Outfit',sans-serif" }}/>
            <button onClick={()=>sendMessage()} disabled={loading} style={{ background:loading?"#f9fafb":"#059669", border:"none", color:loading?"#d1d5db":"#ffffff", borderRadius:10, padding:"9px 16px", cursor:loading?"default":"pointer", fontSize:16, transition:"all 0.15s", fontWeight:700 }}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
