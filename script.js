const WA="919045524457";
const MAX=18;
const TIMES=["1–3 PM","3–5 PM","5–7 PM","7–9 PM","9–11 PM","11 PM–1 AM"];
const KEY="nxtgen_ubr_frontend_counts";
let counts={...Object.fromEntries(TIMES.map(t=>[t,0]))};

try{const x=JSON.parse(localStorage.getItem(KEY)||"null");if(x)counts={...counts,...x}}catch(e){}

const select=document.querySelector('[name="timing"]');
select.innerHTML='<option value="">Select timing</option>'+TIMES.map(t=>`<option>${t}</option>`).join("");

function render(filter="all"){
  const grid=document.getElementById("scrimGrid");
  grid.innerHTML=TIMES.map((t,i)=>{
    const full=counts[t]>=MAX;
    if(filter==="open"&&full)return "";
    if(filter==="full"&&!full)return "";
    const prize=i===0||i===1||i===2||i===3||i===4||i===5 ? 1000 : 1000;
    return `<article class="scrim">
      <div class="scrim-top"><h3>NXT GEN ${t} SCRIMS</h3><span class="status ${full?"full":""}">${full?"SOLD OUT":"OPEN"}</span></div>
      <div class="meta">
        <div><small>Prize Pool</small><b>₹${prize}</b></div>
        <div><small>Slots Booked</small><b>${counts[t]} / ${MAX}</b></div>
        <div><small>Entry Fee</small><b>Choose category</b></div>
        <div><small>Timing</small><b>${t}</b></div>
      </div>
      <div class="maps">MAPS &nbsp; ERANGEL</div>
      <a class="book ${full?"disabled":""}" href="${full?"#scrims":"#register"}" data-time="${t}">${full?"SLOTS FULL":"BOOK SLOT"}</a>
    </article>`;
  }).join("") || '<p style="grid-column:1/-1;text-align:center;color:#8794a7">No scrims in this filter.</p>';
}
render();

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active"); render(btn.dataset.filter);
}));

document.getElementById("scrimGrid").addEventListener("click",e=>{
  const a=e.target.closest("[data-time]"); if(!a)return;
  select.value=a.dataset.time;
});

const price=document.querySelector('[name="price"]');
const slots=document.querySelector('[name="slots"]');
function updateTotal(){document.getElementById("total").textContent="₹"+((Number(price.value)||0)*(Number(slots.value)||0))}
price.addEventListener("change",updateTotal);slots.addEventListener("input",updateTotal);

document.getElementById("registrationForm").addEventListener("submit",e=>{
  e.preventDefault();
  const f=new FormData(e.target);
  const team=String(f.get("teamName")).trim();
  const contact=String(f.get("contact")).trim();
  const timing=String(f.get("timing"));
  const qty=Math.max(1,Math.min(MAX,Number(f.get("slots"))||1));
  const fee=Number(f.get("price"))||0;
  if(!team||!contact||!timing||!fee)return;
  if(counts[timing]+qty>MAX){alert(`Only ${MAX-counts[timing]} team slot(s) remain for ${timing}.`);return}
  const total=qty*fee;
  const msg=`NXT GEN ESPORTS SCRIM REGISTRATION

Team Name: ${team}
Contact Number: ${contact}
Slot Timing: ${timing}
Number of Slots Needed: ${qty}
Price Category: ₹${fee}
Total Amount: ₹${total}

Please confirm my slot after payment verification.`;
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,"_blank");
  document.getElementById("formMessage").textContent="WhatsApp opened. Send the message to complete your request.";
});
