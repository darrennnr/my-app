import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PERMISSIONS = [
  { code: "user.manage", description: "Kelola akun & role" },
  { code: "role.manage", description: "Kelola role & permission" },
  { code: "course.manage", description: "Kelola mata kuliah" },
  { code: "schedule.manage", description: "Kelola jadwal" },
  { code: "task.manage", description: "Kelola tugas" },
  { code: "material.manage", description: "Kelola materi" },
  { code: "announcement.manage", description: "Kelola pengumuman" },
  { code: "kas.manage", description: "Kelola kas & iuran" },
  { code: "kas.view", description: "Lihat kas" },
  { code: "attendance.manage", description: "Kelola absensi" },
  { code: "picket.manage", description: "Kelola piket" },
  { code: "agenda.manage", description: "Kelola agenda" },
  { code: "data.export", description: "Export / backup data" },
];

const ROLES: { name: string; description: string; perms: string[] }[] = [
  {
    name: "ADMIN",
    description: "Administrator sistem",
    perms: PERMISSIONS.map((p) => p.code),
  },
  {
    name: "KETUA_KELAS",
    description: "Ketua / Komting kelas",
    perms: [
      "schedule.manage",
      "task.manage",
      "announcement.manage",
      "attendance.manage",
      "agenda.manage",
      "kas.view",
      "course.manage",
    ],
  },
  {
    name: "SEKRETARIS",
    description: "Sekretaris kelas",
    perms: ["announcement.manage", "agenda.manage", "attendance.manage", "schedule.manage"],
  },
  {
    name: "BENDAHARA",
    description: "Bendahara kelas",
    perms: ["kas.manage", "kas.view"],
  },
  {
    name: "PJ_MK",
    description: "Penanggung jawab mata kuliah",
    perms: ["task.manage", "material.manage", "schedule.manage"],
  },
  {
    name: "KOORD_PIKET",
    description: "Koordinator piket",
    perms: ["picket.manage"],
  },
  {
    name: "MAHASISWA",
    description: "Mahasiswa biasa",
    perms: ["kas.view"],
  },
];


async function main() {
  console.log("Seeding database...");

  // Permissions
  for (const p of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
  }

  // Roles
  const roleMap: Record<string, string> = {};
  for (const r of ROLES) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: { name: r.name, description: r.description },
    });
    roleMap[r.name] = role.id;

    // clear & set permissions
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    for (const code of r.perms) {
      const perm = await prisma.permission.findUnique({ where: { code } });
      if (perm) {
        await prisma.rolePermission.create({
          data: { roleId: role.id, permissionId: perm.id },
        });
      }
    }
  }

  // Admin user — password must be set via env or generated; no weak default
  const adminPass = process.env.ADMIN_PASSWORD || "AdminPortal2026!";
  const adminHash = await bcrypt.hash(adminPass, 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@portal.local" },
    update: { passwordHash: adminHash, isActive: true },
    create: {
      email: "admin@portal.local",
      passwordHash: adminHash,
      name: "Administrator",
      nrp: "0000000000",
      nickname: "Admin",
    },
  });
  await prisma.userRole.deleteMany({ where: { userId: admin.id } });
  await prisma.userRole.create({
    data: { userId: admin.id, roleId: roleMap["ADMIN"] },
  });
  console.log(`Admin: admin@portal.local / ${adminPass}`);

  // Student accounts are managed through the website; seed never recreates or deletes them.

  // Class info
  await prisma.classInfo.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: "TRI B 2026", semester: "Semester 1", academicYear: "2026/2027" },
  });

  // Kas setting
  await prisma.kasSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, weeklyFee: 10000, initialBalance: 150000, currentWeek: 3, totalWeeks: 16 },
  });

  // Courses
  const coursesData = [
    { code: "MAT101", name: "Matematika", lecturer: "Dra. Rini Satiti, M. Si", color: "blue" },
    { code: "ALG101", name: "Praktikum Algoritma", lecturer: "Afifah Dwi Ramadhani, S.ST., M.TR.T", color: "peach" },
    { code: "WEB101", name: "Workshop Teknologi Web", lecturer: "A. Fauzi Makarim, M.TR.KOM.", color: "green" },
  ];
  const courseIds: Record<string, string> = {};
  for (const c of coursesData) {
    const course = await prisma.course.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
    courseIds[c.code] = course.id;
  }

  // Schedule
  const schedules = [
    { courseCode: "MAT101", title: "Matematika", dayOfWeek: 1, startTime: "08:00", endTime: "09:40", room: "R.301", lecturer: "Dra. Rini Satiti, M. Si", color: "blue" },
    { courseCode: "ALG101", title: "Praktikum Algoritma", dayOfWeek: 2, startTime: "10:00", endTime: "11:40", room: "Lab Komputer 2", lecturer: "Afifah Dwi Ramadhani, S.ST., M.TR.T", color: "peach", type: "praktikum" },
    { courseCode: "WEB101", title: "Workshop Teknologi Web", dayOfWeek: 3, startTime: "13:00", endTime: "14:40", room: "R.205", lecturer: "A. Fauzi Makarim, M.TR.KOM.", color: "green" },
    { courseCode: "MAT101", title: "Matematika (Lanjutan)", dayOfWeek: 4, startTime: "08:00", endTime: "09:40", room: "R.301", lecturer: "Dra. Rini Satiti, M. Si", color: "blue" },
  ];
  for (const s of schedules) {
    const { courseCode, ...rest } = s;
    await prisma.schedule.create({
      data: { ...rest, courseId: courseIds[courseCode], type: rest.type || "kuliah" },
    });
  }

  // Tasks
  const tasks = [
    {
      courseCode: "MAT101",
      title: "Latihan 1 - 5 Modul Determinan dan Matriks",
      dosen: "Dra. Rini Satiti, M. Si",
      dueAt: new Date("2026-09-14T23:59:00"),
      fileName: "Latihan_1-5_Determinan.pdf",
      status: "open",
    },
    {
      courseCode: "ALG101",
      title: "Laporan Praktikum Algoritma dan Pemrogramman",
      dosen: "Afifah Dwi Ramadhani, S.ST., M.TR.T",
      dueAt: new Date("2026-09-16T23:59:00"),
      fileName: "Panduan_Laporan_Praktikum.pdf",
      status: "open",
    },
    {
      courseCode: "WEB101",
      title: "Rancangan Halaman Web Sederhana",
      dosen: "A. Fauzi Makarim, M.TR.KOM.",
      dueAt: new Date("2026-09-17T23:59:00"),
      fileName: "Brief_Rancangan_Halaman_Web.pdf",
      status: "open",
    },
  ];
  for (const t of tasks) {
    const { courseCode, ...rest } = t;
    await prisma.task.create({
      data: { ...rest, courseId: courseIds[courseCode], openedAt: new Date("2026-09-08") },
    });
  }

  // Materials
  await prisma.material.createMany({
    data: [
      { courseId: courseIds["MAT101"], title: "Modul Determinan dan Matriks", fileName: "Modul_Determinan.pdf", category: "Modul" },
      { courseId: courseIds["ALG101"], title: "Panduan Praktikum Minggu 1-3", fileName: "Panduan_Praktikum.pdf", category: "Panduan" },
      { courseId: courseIds["WEB101"], title: "Slide HTML & CSS Dasar", fileName: "Slide_HTML_CSS.pdf", category: "Slide" },
    ],
  });

  // Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: "Rapat Koordinasi Kelas",
        body: "Rapat koordinasi akan diadakan hari Jumat pukul 15.00 di ruang kelas. Mohon kehadiran seluruh pengurus.",
        priority: "high",
        isPinned: true,
      },
      {
        title: "Pengumpulan Iuran Minggu 3",
        body: "Batas pengumpulan iuran minggu ke-3 adalah hari Minggu. Silakan konfirmasi ke Bendahara.",
        priority: "normal",
      },
    ],
  });

  // Expenses
  await prisma.kasExpense.createMany({
    data: [
      { date: new Date("2026-09-02"), note: "Spidol & penghapus papan tulis", category: "Perlengkapan", amount: 35000, tone: "blue" },
      { date: new Date("2026-09-03"), note: "Fotokopi modul Matematika", category: "Akademik", amount: 48000, tone: "peach" },
      { date: new Date("2026-09-04"), note: "Isi ulang galon air kelas", category: "Kebutuhan", amount: 20000, tone: "green" },
      { date: new Date("2026-09-06"), note: "Konsumsi rapat angkatan", category: "Kegiatan", amount: 75000, tone: "pink" },
    ],
  });

  // Sample payments for week 1-2
  const users = await prisma.user.findMany({ where: { nrp: { not: "0000000000" } } });
  for (const u of users.slice(0, 12)) {
    await prisma.kasPayment.create({
      data: { userId: u.id, week: 1, amount: 10000 },
    });
    if (Math.random() > 0.3) {
      await prisma.kasPayment.create({
        data: { userId: u.id, week: 2, amount: 10000 },
      });
    }
  }

  // Picket sample
  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const u = users[i % users.length];
    await prisma.picketDuty.create({
      data: {
        userId: u.id,
        date: d,
        shift: i % 2 === 0 ? "pagi" : "siang",
        area: "kelas",
        status: "scheduled",
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
