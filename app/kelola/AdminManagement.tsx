"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";

type User = { id:string; name:string; email:string; nrp:string|null; isActive:boolean; roles:string[] };
type Agenda = { id:string; title:string; description:string|null; startAt:string; endAt:string|null; location:string|null; type:string };
const roles = ["MAHASISWA","KETUA_KELAS","SEKRETARIS","BENDAHARA","PJ_MK","KOORD_PIKET","ADMIN"];
async function request<T>(url:string, method="GET", body?:unknown):Promise<T>{
 const r=await fetch(url,{method,credentials:"include",headers:{"Content-Type":"application/json"},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const j=await r.json().catch(()=>({error:"Respons server tidak valid"}));
 if(!r.ok||!j.ok) throw new Error(r.status===401?"Sesi login tidak valid/kedaluwarsa. Silakan login ulang.":r.status===403?"Akun tidak memiliki izin untuk mengelola data.":j.error||"Permintaan gagal");
 return j.data as T;
}
const dateInput=(v:string)=>{const d=new Date(v);return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16)};
export default function AdminManagement(){
 const [tab,setTab]=useState<"users"|"agenda">("users"); const [users,setUsers]=useState<User[]>([]); const [agendas,setAgendas]=useState<Agenda[]>([]); const [err,setErr]=useState(""); const [busy,setBusy]=useState(false);
 const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [nrp,setNrp]=useState(""); const [password,setPassword]=useState(""); const [role,setRole]=useState("MAHASISWA");
 const [title,setTitle]=useState(""); const [startAt,setStartAt]=useState(""); const [location,setLocation]=useState(""); const [description,setDescription]=useState("");
 const load=useCallback(async()=>{setErr("");try{const [u,a]=await Promise.all([request<User[]>("/api/users"),request<Agenda[]>("/api/agenda")]);setUsers(u);setAgendas(a);}catch(e){setErr(e instanceof Error?e.message:"Gagal memuat data");}},[]);
 useEffect(()=>{void load()},[load]);
 const run=async(fn:()=>Promise<unknown>)=>{setBusy(true);setErr("");try{await fn();await load()}catch(e){setErr(e instanceof Error?e.message:"Operasi gagal")}finally{setBusy(false)}};
 const addUser=(e:FormEvent)=>{e.preventDefault();void run(async()=>{await request("/api/users","POST",{name,email,nrp:nrp||undefined,password,roles:[role]});setName("");setEmail("");setNrp("");setPassword("")})};
 const addAgenda=(e:FormEvent)=>{e.preventDefault();void run(async()=>{await request("/api/agenda","POST",{title,startAt:new Date(startAt).toISOString(),location:location||null,description:description||null});setTitle("");setStartAt("");setLocation("");setDescription("")})};
 const editUser=(u:User)=>{const n=window.prompt("Nama",u.name);if(n===null)return;const r=window.prompt(`Role (pisahkan koma): ${roles.join(", ")}`,u.roles.join(","));if(r===null)return;void run(()=>request(`/api/users?id=${encodeURIComponent(u.id)}`,"PATCH",{name:n,roles:r.split(",").map(x=>x.trim()).filter(Boolean)}))};
 const editAgenda=(a:Agenda)=>{const t=window.prompt("Judul agenda",a.title);if(t===null)return;const loc=window.prompt("Lokasi",a.location||"");if(loc===null)return;void run(()=>request(`/api/agenda?id=${encodeURIComponent(a.id)}`,"PATCH",{title:t,location:loc||null}))};
 return <section className="card" style={{marginTop:24,padding:20}}>
  <h2 style={{marginTop:0}}>Kelola akun & agenda</h2><p className="hint">Perubahan tersimpan di database aplikasi.</p>
  <div className="tabs"><button className={`tab ${tab==="users"?"on":""}`} onClick={()=>setTab("users")}>Akun pengguna ({users.length})</button><button className={`tab ${tab==="agenda"?"on":""}`} onClick={()=>setTab("agenda")}>Agenda ({agendas.length})</button></div>
  {err&&<p role="alert" style={{color:"#b42318"}}>{err}</p>}
  {tab==="users"?<>
   <form onSubmit={addUser} className="form-grid two" style={{margin:"16px 0"}}>
    <label className="form-field">Nama<input className="input" required minLength={2} value={name} onChange={e=>setName(e.target.value)}/></label>
    <label className="form-field">Email<input className="input" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
    <label className="form-field">NRP (opsional)<input className="input" value={nrp} onChange={e=>setNrp(e.target.value)}/></label>
    <label className="form-field">Password awal<input className="input" type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)}/></label>
    <label className="form-field">Role<select className="input" value={role} onChange={e=>setRole(e.target.value)}>{roles.map(r=><option key={r}>{r}</option>)}</select></label>
    <div className="form-field" style={{justifyContent:"end"}}><button className="btn btn-solid" disabled={busy}>Tambah akun</button></div>
   </form>
   {users.map(u=><div key={u.id} className="mg-row" style={{display:"flex",gap:12,alignItems:"center",padding:"12px 0",borderTop:"1px solid var(--line,#ddd)"}}><div style={{flex:1}}><strong>{u.name}</strong><div className="mg-meta">{u.email}{u.nrp?` · ${u.nrp}`:""} · {u.roles.join(", ")||"Tanpa role"}{!u.isActive?" · Nonaktif":""}</div></div><button className="btn btn-outline" onClick={()=>editUser(u)}>Edit</button><button className="btn btn-outline" disabled={busy} onClick={()=>{if(confirm(`Hapus akun ${u.name}?`))void run(()=>request(`/api/users?id=${encodeURIComponent(u.id)}`,"DELETE"))}}>Hapus</button></div>)}
  </>:<>
   <form onSubmit={addAgenda} className="form-grid two" style={{margin:"16px 0"}}>
    <label className="form-field">Judul agenda<input className="input" required value={title} onChange={e=>setTitle(e.target.value)}/></label>
    <label className="form-field">Tanggal & waktu<input className="input" type="datetime-local" required value={startAt} onChange={e=>setStartAt(e.target.value)}/></label>
    <label className="form-field">Lokasi<input className="input" value={location} onChange={e=>setLocation(e.target.value)}/></label>
    <label className="form-field">Keterangan<input className="input" value={description} onChange={e=>setDescription(e.target.value)}/></label>
    <div className="form-field"><button className="btn btn-solid" disabled={busy}>Tambah agenda</button></div>
   </form>
   {agendas.map(a=><div key={a.id} className="mg-row" style={{display:"flex",gap:12,alignItems:"center",padding:"12px 0",borderTop:"1px solid var(--line,#ddd)"}}><div style={{flex:1}}><strong>{a.title}</strong><div className="mg-meta">{new Date(a.startAt).toLocaleString("id-ID")} · {a.location||"Lokasi belum diisi"}</div></div><button className="btn btn-outline" onClick={()=>editAgenda(a)}>Edit</button><button className="btn btn-outline" disabled={busy} onClick={()=>{if(confirm(`Hapus agenda ${a.title}?`))void run(()=>request(`/api/agenda?id=${encodeURIComponent(a.id)}`,"DELETE"))}}>Hapus</button></div>)}
  </>}
 </section>
}
