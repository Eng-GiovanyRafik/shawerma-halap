import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, subscribeToOrders, updateOrderStatus } from "./firebase";

const statuses = [
  ["new", "جديد"],
  ["accepted", "مقبول"],
  ["preparing", "جاري التحضير"],
  ["delivery", "خرج للتوصيل"],
  ["done", "تم التسليم"],
  ["cancelled", "ملغي"],
];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => user ? subscribeToOrders(setOrders) : undefined, [user]);

  if (!user) return (
    <div className="adminPage">
      <div className="adminCard">
        <h1>لوحة شاورما حلب</h1>
        <p>تسجيل دخول الإدارة</p>
        <input placeholder="البريد الإلكتروني" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="كلمة المرور" value={password} onChange={e=>setPassword(e.target.value)} />
        <button onClick={async()=>{try{await signInWithEmailAndPassword(auth,email,password)}catch(e){alert("بيانات الدخول غير صحيحة")}}}>دخول</button>
      </div>
    </div>
  );

  return (
    <div className="adminPage">
      <div className="adminHeader">
        <h1>لوحة الطلبات</h1>
        <button onClick={()=>signOut(auth)}>خروج</button>
      </div>
      <div className="stats">
        <div>كل الطلبات <b>{orders.length}</b></div>
        <div>الجديدة <b>{orders.filter(o=>o.status==="new").length}</b></div>
        <div>قيد التحضير <b>{orders.filter(o=>o.status==="preparing").length}</b></div>
      </div>
      <div className="orders">
        {orders.map(o => (
          <article className="orderCard" key={o.id}>
            <div className="orderTop">
              <b>#{o.id.slice(-7)}</b>
              <select value={o.status} onChange={e=>updateOrderStatus(o.id,e.target.value)}>
                {statuses.map(([v,l])=><option value={v} key={v}>{l}</option>)}
              </select>
            </div>
            <p><b>العميل:</b> {o.customer?.name}</p>
            <p><b>الهاتف:</b> {o.customer?.phone}</p>
            <p><b>الفرع:</b> {o.branch}</p>
            <p><b>العنوان:</b> {o.customer?.address}</p>
            <div className="items">{(o.items||[]).map((i,n)=><div key={n}>{i.name} × {i.qty} — {i.price*i.qty} جنيه</div>)}</div>
            <strong className="orderTotal">{o.total} جنيه</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
