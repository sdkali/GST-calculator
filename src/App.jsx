import { useState } from "react";

const GST_RATES = [
  { rate: 0, label: "0%", desc: "Essential items" },
  { rate: 0.25, label: "0.25%", desc: "Rough diamonds" },
  { rate: 3, label: "3%", desc: "Gold, silver" },
  { rate: 5, label: "5%", desc: "Household items, food" },
  { rate: 12, label: "12%", desc: "Processed food, medicines" },
  { rate: 18, label: "18%", desc: "Most goods & services" },
  { rate: 28, label: "28%", desc: "Luxury, automobiles" },
];

function formatINR(num) {
  if (isNaN(num) || num === 0) return "\u20b90.00";
  const parts = num.toFixed(2).split(".");
  let intPart = parts[0];
  const decPart = parts[1];
  // Indian numbering: last 3 digits, then groups of 2
  if (intPart.length > 3) {
    const last3 = intPart.slice(-3);
    let remaining = intPart.slice(0, -3);
    const groups = [];
    while (remaining.length > 2) {
      groups.unshift(remaining.slice(-2));
      remaining = remaining.slice(0, -2);
    }
    if (remaining) groups.unshift(remaining);
    intPart = groups.join(",") + "," + last3;
  }
  return "\u20b9" + intPart + "." + decPart;
}

export default function GSTCalculator() {
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState("exclusive"); // exclusive = add GST, inclusive = extract GST
  const [result, setResult] = useState(null);

  const calculate = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;

    let baseAmount, gstAmount, totalAmount, cgst, sgst, igst;

    if (mode === "exclusive") {
      // Add GST to amount
      baseAmount = amt;
      gstAmount = (amt * gstRate) / 100;
      totalAmount = amt + gstAmount;
    } else {
      // Extract GST from amount
      totalAmount = amt;
      baseAmount = (amt * 100) / (100 + gstRate);
      gstAmount = totalAmount - baseAmount;
    }

    cgst = gstAmount / 2;
    sgst = gstAmount / 2;
    igst = gstAmount;

    setResult({ baseAmount, gstAmount, totalAmount, cgst, sgst, igst, rate: gstRate });
  };

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(val);
    setResult(null);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") calculate(); };

  const inputStyle = {
    width: "100%", padding: "14px 16px 14px 32px",
    background: "#fff", border: "2px solid #e8e6e1",
    color: "#1a1a1a", fontSize: 18, fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    outline: "none", transition: "border-color 0.2s", borderRadius: 6,
    fontWeight: 600,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f6", color: "#1a1a1a", fontFamily: "'Segoe UI', system-ui, sans-serif", position: "relative" }}>
      {/* Top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", zIndex: 10, background: "linear-gradient(90deg, #ff9933, #ffffff, #138808)" }} />

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 20px", position: "relative" }}>
        {/* Header */}
        <header style={{ paddingTop: 48, paddingBottom: 32 }}>
          <div style={{ display: "inline-block", padding: "3px 10px", marginBottom: 12, background: "#ff993315", border: "1px solid #ff993344", color: "#ff9933", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", borderRadius: 4 }}>Free Tool</div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: -0.5, margin: 0, color: "#1a1a1a" }}>
            GST <span style={{ color: "#ff9933" }}>Calculator</span>
          </h1>
          <p style={{ marginTop: 10, fontSize: 14, color: "#888", lineHeight: 1.5, fontFamily: "monospace" }}>
            Calculate GST instantly. Add or extract GST with CGST/SGST & IGST breakdown.
          </p>
        </header>

        {/* Mode Toggle */}
        <div style={{ display: "flex", background: "#f0eeea", borderRadius: 8, padding: 3, marginBottom: 20 }}>
          {[
            { id: "exclusive", label: "Add GST", sub: "GST exclusive" },
            { id: "inclusive", label: "Extract GST", sub: "GST inclusive" },
          ].map((m) => (
            <button key={m.id} onClick={() => { setMode(m.id); setResult(null); }}
              style={{
                flex: 1, padding: "10px 12px", cursor: "pointer", border: "none",
                background: mode === m.id ? "#fff" : "transparent",
                color: mode === m.id ? "#1a1a1a" : "#999",
                borderRadius: 6, fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                boxShadow: mode === m.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}>
              <div>{m.label}</div>
              <div style={{ fontSize: 10, fontWeight: 400, color: mode === m.id ? "#ff9933" : "#bbb", marginTop: 2 }}>{m.sub}</div>
            </button>
          ))}
        </div>

        {/* Amount Input */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", fontFamily: "monospace" }}>
            {mode === "exclusive" ? "Amount (without GST)" : "Amount (with GST)"}
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "#ccc", fontWeight: 600 }}>{"\u20b9"}</span>
            <input
              type="text" value={amount} onChange={handleAmountChange} onKeyDown={handleKeyDown}
              placeholder="Enter amount"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#ff9933"}
              onBlur={(e) => e.target.style.borderColor = "#e8e6e1"}
            />
          </div>
        </div>

        {/* GST Rate Selector */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 8, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", fontFamily: "monospace" }}>GST Rate</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {GST_RATES.map((g) => (
              <button key={g.rate} onClick={() => { setGstRate(g.rate); setResult(null); }}
                style={{
                  padding: "10px 4px", cursor: "pointer", border: "none", borderRadius: 6,
                  background: gstRate === g.rate ? "#ff9933" : "#fff",
                  color: gstRate === g.rate ? "#fff" : "#666",
                  fontSize: 14, fontWeight: 700, transition: "all 0.15s",
                  boxShadow: gstRate === g.rate ? "0 2px 8px #ff993344" : "0 1px 3px rgba(0,0,0,0.06)",
                }}>
                {g.label}
              </button>
            ))}
          </div>
          <p style={{ marginTop: 6, fontSize: 11, color: "#bbb", fontFamily: "monospace" }}>
            {GST_RATES.find(g => g.rate === gstRate)?.desc}
          </p>
        </div>

        {/* Calculate Button */}
        <button onClick={calculate}
          style={{
            width: "100%", padding: "15px", background: "#ff9933", color: "#fff",
            border: "none", fontSize: 14, fontWeight: 700, letterSpacing: 1.5,
            textTransform: "uppercase", cursor: "pointer", borderRadius: 6,
            transition: "all 0.2s", boxShadow: "0 2px 12px #ff993344",
          }}>
          Calculate GST
        </button>

        {/* Results */}
        {result && (
          <div style={{ marginTop: 24, animation: "fadeUp 0.3s ease" }}>
            <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            {/* Main result card */}
            <div style={{
              background: "linear-gradient(135deg, #1a1a2e, #2d2d44)", borderRadius: 10,
              padding: "24px", color: "#fff", marginBottom: 12,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#888", letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace" }}>Base Amount</div>
                  <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>{formatINR(result.baseAmount)}</div>
                </div>
                <div style={{ fontSize: 28, color: "#ff9933" }}>+</div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#888", letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace" }}>GST ({result.rate}%)</div>
                  <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4, color: "#ff9933", fontFamily: "'JetBrains Mono', monospace" }}>{formatINR(result.gstAmount)}</div>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #ffffff15", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 11, color: "#888", letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace" }}>Total Amount</div>
                <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>{formatINR(result.totalAmount)}</div>
              </div>
            </div>

            {/* Tax breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              <div style={{ background: "#fff", borderRadius: 8, padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 10, color: "#999", letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>CGST ({result.rate / 2}%)</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#138808", fontFamily: "'JetBrains Mono', monospace" }}>{formatINR(result.cgst)}</div>
                <div style={{ fontSize: 10, color: "#bbb", marginTop: 2 }}>Central GST</div>
              </div>
              <div style={{ background: "#fff", borderRadius: 8, padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 10, color: "#999", letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>SGST ({result.rate / 2}%)</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#138808", fontFamily: "'JetBrains Mono', monospace" }}>{formatINR(result.sgst)}</div>
                <div style={{ fontSize: 10, color: "#bbb", marginTop: 2 }}>State GST</div>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 8, padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: "#999", letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>IGST ({result.rate}%)</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#ff9933", fontFamily: "'JetBrains Mono', monospace" }}>{formatINR(result.igst)}</div>
              <div style={{ fontSize: 10, color: "#bbb", marginTop: 2 }}>Integrated GST (interstate)</div>
            </div>

            {/* Quick summary */}
            <div style={{ background: "#ff993310", border: "1px solid #ff993322", borderRadius: 8, padding: "14px 16px", fontSize: 13, color: "#666", lineHeight: 1.6 }}>
              <strong style={{ color: "#ff9933" }}>Summary:</strong>{" "}
              {mode === "exclusive"
                ? `On ${formatINR(result.baseAmount)}, GST at ${result.rate}% = ${formatINR(result.gstAmount)}. Total payable: ${formatINR(result.totalAmount)}`
                : `From ${formatINR(result.totalAmount)} (inclusive), base price = ${formatINR(result.baseAmount)}. GST component: ${formatINR(result.gstAmount)}`
              }
            </div>
          </div>
        )}

        {/* GST Rate Reference Table */}
        <section style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid #eee" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 14 }}>GST Rate Reference</h2>
          <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #eee" }}>
            {[
              { rate: "0%", items: "Milk, fruits, vegetables, grains, salt, fresh meat, bread" },
              { rate: "0.25%", items: "Rough precious & semi-precious stones" },
              { rate: "3%", items: "Gold, silver, platinum, processed diamonds" },
              { rate: "5%", items: "Sugar, tea, packed food, footwear under 500, transport" },
              { rate: "12%", items: "Butter, ghee, mobiles, processed food, business class tickets" },
              { rate: "18%", items: "Most items: electronics, steel, cameras, IT services, restaurants" },
              { rate: "28%", items: "Cars, AC, aerated drinks, cement, luxury items, tobacco" },
            ].map((row, i) => (
              <div key={i} style={{
                display: "flex", padding: "10px 14px", fontSize: 12,
                background: i % 2 === 0 ? "#faf9f6" : "#fff",
                borderBottom: i < 6 ? "1px solid #f0f0f0" : "none",
              }}>
                <span style={{ fontWeight: 700, color: "#ff9933", minWidth: 50, fontFamily: "monospace" }}>{row.rate}</span>
                <span style={{ color: "#666" }}>{row.items}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section style={{ padding: "32px 0", marginTop: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>What is GST?</h2>
          <div style={{ fontSize: 13, color: "#888", lineHeight: 1.8, fontFamily: "monospace" }}>
            <p style={{ marginBottom: 10 }}>GST (Goods and Services Tax) is India's unified indirect tax, replacing multiple taxes like VAT, service tax, and excise duty. It was introduced on July 1, 2017.</p>
            <p style={{ marginBottom: 10 }}>For intra-state transactions, GST splits equally into CGST (Central) and SGST (State). For interstate transactions, IGST (Integrated GST) applies at the full rate.</p>
            <p>Use this free calculator for invoicing, billing, or checking how much GST applies to any product or service in India.</p>
          </div>
        </section>

        <footer style={{ padding: "24px 0", borderTop: "1px solid #eee", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#ccc", letterSpacing: 1, fontFamily: "monospace" }}>Free GST Calculator India — No signup required</p>
        </footer>
      </div>
    </div>
  );
}
