const WHATSAPP="919045524457";
const MAX_TEAMS=18;
const TIMES=["1–3 PM","3–5 PM","5–7 PM","7–9 PM","9–11 PM","11 PM–1 AM"];
const STORAGE_KEY="nxtgen_slot_counts_v3";
const PAUSE_KEY="nxtgen_pause_v3";

function initialState(){
  return Object.fromEntries(TIMES.map(t=>[t,0]));
}
function loadCounts(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
    if(!saved)return initialState();
    return Object.fromEntries(TIMES.map(t=>[
      t,Math.max(0,Math.min(MAX_TEAMS,Number(saved[t])||0))
    ]));
  }catch{return initialState();}
}
function paused(){return localStorage.getItem(PAUSE_KEY)==="1";}

function fillTimingSelect(){
  const select=document.querySelector('[name="timing"]');
  select.innerHTML='<option value="">Select timing</option>'+
    TIMES.map(t=>`<option>${t}</option>`).join("");
}
function renderSlots(){
  const counts=loadCounts();
  document.getElementById("slots").innerHTML=TIMES.map(t=>{
    const n=counts[t];
    let status="AVAILABLE",cls="";
    if(paused()){status="PAUSED";cls="paused";}
    else if(n>=MAX_TEAMS){status="SOLD OUT";cls="sold";}
    return `<div class="slot">
      <div><strong>${t}</strong><small>${n}/${MAX_TEAMS} teams filled</small></div>
      <span class="badge ${cls}">${status}</span>
    </div>`;
  }).join("");
}

document.getElementById("registrationForm").addEventListener("submit",function(e){
  e.preventDefault();

  if(paused()){
    alert("Registrations are currently paused.");
    return;
  }

  const f=new FormData(e.target);
  const team=String(f.get("teamName")).trim();
  const contact=String(f.get("contact")).trim();
  const timing=String(f.get("timing"));
  const slots=Math.max(1,Math.min(18,Number(f.get("slots"))||1));
  const price=Number(f.get("price"))||0;
  const counts=loadCounts();

  if(!team||!contact||!timing||!price)return;

  if(counts[timing]+slots>MAX_TEAMS){
    alert(`Only ${MAX_TEAMS-counts[timing]} slot(s) remain for ${timing}.`);
    return;
  }

  const total=price*slots;
  const message=`NXT GEN ESPORTS SCRIM REGISTRATION

Team Name: ${team}
Contact: ${contact}
Slot Timing: ${timing}
Number of Slots: ${slots}
Price Category: ₹${price} / slot
Total: ₹${total}`;

  const url=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(url,"_blank","noopener");

  document.getElementById("formMessage").textContent=
    "WhatsApp opened with your registration details.";
  e.target.reset();
  fillTimingSelect();
});

fillTimingSelect();
renderSlots();
