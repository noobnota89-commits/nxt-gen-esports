const WA="919045524457";
const MAX=18;
const TIMES=["1–3 PM","3–5 PM","5–7 PM","7–9 PM","9–11 PM","11 PM–1 AM"];
const KEY="nxtgen_counts";
let counts={...Object.fromEntries(TIMES.map(t=>[t,0]))};
try{const saved=JSON.parse(localStorage.getItem(KEY)||"null");if(saved)counts={...counts,...saved}}catch(e){}

const timing=document.querySelector('[name="timing"]');
timing.innerHTML='<option value="">Select timing</option>'+TIMES.map(t=>`<option>${t}</option>`).join("");

function updateAvailability(){
 const t=timing.value;
 const el=document.getElementById("availability");
 el.textContent=t?`${counts[t]} / ${MAX} teams filled • ${Math.max(0,MAX-counts[t])} remaining`:"Select a timing to see availability";
}
timing.addEventListener("change",updateAvailability);

document.getElementById("registrationForm").addEventListener("submit",e=>{
 e.preventDefault();
 const f=new FormData(e.target);
 const team=f.get("teamName").trim(), contact=f.get("contact").trim(), t=f.get("timing");
 const qty=Math.max(1,Math.min(MAX,Number(f.get("slots"))||1)), fee=Number(f.get("price"))||0;
 if(counts[t]+qty>MAX){alert(`Only ${MAX-counts[t]} slot(s) remain for ${t}.`);return}
 const msg=`NXT GEN ESPORTS SCRIM REGISTRATION

Team Name: ${team}
Contact Number: ${contact}
Slot Timing: ${t}
Number of Slots Needed: ${qty}
Price Category: ₹${fee}
Total Amount: ₹${qty*fee}

Please confirm my registration after payment verification.`;
 window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,"_blank");
 document.getElementById("message").textContent="WhatsApp opened with your registration details.";
});
updateAvailability();
