import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ShoppingCart, MapPin, Phone, MessageCircle, Plus, Minus, Trash2, Store, X } from "lucide-react";
import "./styles.css";
import { createOrder } from "./firebase";
import Admin from "./Admin";

const WHATSAPP = "201281097471";

const branches = [
  "الإبراهيمية - بجوار توكيل MG",
  "شارع خليل حمادة - أمام المركز الثقافي",
];

const products = [
  { id: 1, category: "شاورما", name: "شاورما سوري", price: 65 },
  { id: 2, category: "شاورما", name: "شاورما عربي فراخ", price: 115 },
  { id: 3, category: "كريب", name: "كريب زنجر", price: 105 },
  { id: 4, category: "وجبات", name: "فتة شاورما", price: 125 },
  { id: 5, category: "وجبات", name: "وجبة كرسي", price: 120 },
  { id: 6, category: "وجبات", name: "وجبة شيش", price: 170 },
];

const offers = [
  { id: 101, name: "عرض شاورما حلب", price: 170, text: "عرض مميز من شاورما حلب" },
  { id: 102, name: "عرض XL", price: 220, text: "وجبة كبيرة ومشبعة" },
];

function App() {\n  if (window.location.hash === "#admin") return <Admin />;
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("الكل");
  const [showCart, setShowCart] = useState(false);
  const [branch, setBranch] = useState(branches[0]);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", notes: "" });

  const categories = ["الكل", ...new Set(products.map(p => p.category))];
  const visible = category === "الكل" ? products : products.filter(p => p.category === category);

  const total = useMemo(() => cart.reduce((sum, x) => sum + x.price * x.qty, 0), [cart]);

  function add(product) {
    setCart(c => {
      const found = c.find(x => x.id === product.id);
      return found ? c.map(x => x.id === product.id ? { ...x, qty: x.qty + 1 } : x) : [...c, { ...product, qty: 1 }];
    });
  }

  function change(id, delta) {
    setCart(c => c.map(x => x.id === id ? { ...x, qty: Math.max(0, x.qty + delta) } : x).filter(x => x.qty));
  }

  function remove(id) {
    setCart(c => c.filter(x => x.id !== id));
  }

  async function checkout() {
    if (!cart.length) return alert("السلة فارغة");
    if (!customer.name || !customer.phone || !customer.address) {
      return alert("من فضلك اكتب الاسم ورقم الهاتف والعنوان");
    }

    const orderId = "SH-" + Date.now().toString().slice(-7);
    const items = cart.map(x => `${x.name} × ${x.qty} = ${x.price * x.qty} جنيه`).join("\n");
    const message =
`طلب جديد - شاورما حلب
رقم الطلب: ${orderId}

الاسم: ${customer.name}
الهاتف: ${customer.phone}
الفرع: ${branch}
العنوان: ${customer.address}

الطلب:
${items}

الإجمالي: ${total} جنيه
ملاحظات: ${customer.notes || "لا يوجد"}`;

    try {
      const orderId = await createOrder({
        customer,
        branch,
        items: cart,
        total,
        channel: "whatsapp",
      });
      const finalMessage = message.replace(orderId, orderId);
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(finalMessage)}`, "_blank");
      alert(`تم حفظ الطلب برقم ${orderId.slice(-7)}`);
      setCart([]);
      setShowCart(false);
    } catch (e) {
      alert("تعذر حفظ الطلب. تأكد من إعداد Firebase.");
      console.error(e);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="brand">شاورما حلب</div>
          <div className="tag"># أصل_الشاورما</div>
        </div>
        <button className="cartBtn" onClick={() => setShowCart(true)}>
          <ShoppingCart size={22} />
          <span>{cart.reduce((n, x) => n + x.qty, 0)}</span>
        </button>
      </header>

      <main>
        <section className="hero">
          <div>
            <span className="badge">توصيل 24 ساعة</span>
            <h1>طعم الشاورما<br /><b>اللي يستاهل التجربة</b></h1>
            <p>اطلب أكلك المفضل من شاورما حلب بسهولة.</p>
            <button className="primary" onClick={() => document.getElementById("menu").scrollIntoView({ behavior: "smooth" })}>
              اطلب الآن
            </button>
          </div>
          <div className="heroIcon">🌯</div>
        </section>

        <section>
          <div className="sectionHead">
            <h2>العروض</h2>
            <span>اختياراتنا المميزة</span>
          </div>
          <div className="offerGrid">
            {offers.map(o => (
              <article className="offer" key={o.id}>
                <div className="offerPic">🌯</div>
                <div className="offerBody">
                  <h3>{o.name}</h3>
                  <p>{o.text}</p>
                  <div className="row">
                    <strong>{o.price} جنيه</strong>
                    <button className="add" onClick={() => add(o)}>أضف للسلة</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="menu">
          <div className="sectionHead">
            <h2>المنيو</h2>
            <span>{products.length} أصناف</span>
          </div>
          <div className="chips">
            {categories.map(c => <button key={c} className={category === c ? "chip active" : "chip"} onClick={() => setCategory(c)}>{c}</button>)}
          </div>
          <div className="productGrid">
            {visible.map(p => (
              <article className="product" key={p.id}>
                <div className="foodPic">🌯</div>
                <div className="productBody">
                  <span className="small">{p.category}</span>
                  <h3>{p.name}</h3>
                  <div className="row">
                    <strong>{p.price} جنيه</strong>
                    <button className="circle" onClick={() => add(p)}><Plus size={19} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="branchBox">
          <div className="sectionHead">
            <h2>اختر الفرع</h2>
            <Store size={24} />
          </div>
          {branches.map(b => (
            <label className="branch" key={b}>
              <input type="radio" checked={branch === b} onChange={() => setBranch(b)} />
              <MapPin size={19} />
              <span>{b}</span>
            </label>
          ))}
        </section>

        <section className="contact">
          <h2>اطلب مباشرة</h2>
          <p>01281097471</p>
          <div className="contactBtns">
            <a href={`tel:01281097471`}><Phone size={19}/> اتصال</a>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"><MessageCircle size={19}/> واتساب</a>
          </div>
        </section>
      </main>

      {showCart && (
        <div className="overlay" onClick={() => setShowCart(false)}>
          <aside className="drawer" onClick={e => e.stopPropagation()}>
            <div className="drawerHead">
              <h2>سلة الطلب</h2>
              <button className="iconBtn" onClick={() => setShowCart(false)}><X /></button>
            </div>

            {!cart.length ? <div className="empty">السلة فارغة 🛒</div> : <>
              <div className="cartItems">
                {cart.map(x => (
                  <div className="cartItem" key={x.id}>
                    <div>
                      <b>{x.name}</b>
                      <div>{x.price} جنيه</div>
                    </div>
                    <div className="qty">
                      <button onClick={() => change(x.id, 1)}><Plus size={15}/></button>
                      <span>{x.qty}</span>
                      <button onClick={() => change(x.id, -1)}><Minus size={15}/></button>
                      <button className="delete" onClick={() => remove(x.id)}><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout">
                <h3>بيانات التوصيل</h3>
                <input placeholder="الاسم" value={customer.name} onChange={e => setCustomer({...customer, name:e.target.value})}/>
                <input placeholder="رقم الهاتف" value={customer.phone} onChange={e => setCustomer({...customer, phone:e.target.value})}/>
                <input placeholder="العنوان بالتفصيل" value={customer.address} onChange={e => setCustomer({...customer, address:e.target.value})}/>
                <textarea placeholder="ملاحظات على الطلب" value={customer.notes} onChange={e => setCustomer({...customer, notes:e.target.value})}/>
                <div className="total"><span>الإجمالي</span><b>{total} جنيه</b></div>
                <button className="primary full" onClick={checkout}>تأكيد الطلب عبر واتساب</button>
              </div>
            </>}
          </aside>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);