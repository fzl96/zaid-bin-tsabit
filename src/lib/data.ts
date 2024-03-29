import { db } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { DateTime } from "luxon";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import { months } from "@/config/dashboard";
import { FinanceMonth, Monthly } from "./definitions";

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredPemasukan(currentPage: number) {
  noStore();

  try {
    const data = await db.pemasukan.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    });

    return data;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil data pemasukan");
  }
}

export async function fetchPemasukanPages() {
  try {
    const totalItems = await db.pemasukan.count();
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil jumlah halaman pemasukan");
  }
}

export async function fetchPengeluaran(month: number, year: number) {
  noStore();

  try {
    const data = await db.pengeluaran.findMany({
      where: {
        createdAt: {
          gte: new Date(year, month - 1, 1),
          lte: new Date(year, month, 1),
        },
      },
    });

    return data;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil data pengeluaran");
  }
}

export async function fetchPemasukan(month: number, year: number) {
  noStore();

  try {
    const data = await db.pemasukan.findMany({
      where: {
        createdAt: {
          gte: new Date(year, month - 1, 1),
          lte: new Date(year, month, 1),
        },
      },
    });

    return data;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil data pemasukan");
  }
}

export async function fetchFilteredPengeluaran(currentPage: number) {
  noStore();

  try {
    const data = await db.pengeluaran.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    });

    return data;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil data pengeluaran");
  }
}

export async function fetchPengeluaranPages() {
  noStore();
  try {
    const totalItems = await db.pengeluaran.count();
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil jumlah halaman pengeluaran");
  }
}

export async function fetchFilteredInventaris(
  currentPage: number,
  query: string
) {
  noStore();

  try {
    const data = await db.inventaris.findMany({
      where: {
        nama: {
          contains: query,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    });

    return data;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil data inventaris");
  }
}

export async function fetchInventaris() {
  noStore();

  try {
    const data = await db.inventaris.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return data;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil data inventaris");
  }
}

export async function fetchInventarisPages(query: string) {
  noStore();
  try {
    const totalItems = await db.inventaris.count({
      where: {
        nama: {
          contains: query,
        },
      },
    });
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil jumlah halaman inventaris");
  }
}

export async function fetchFilteredJamaah(currentPage: number, query: string) {
  noStore();

  try {
    const data = await db.jamaah.findMany({
      where: {
        nama: {
          contains: query,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    });

    return data;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil data jamaah");
  }
}

export async function fetchJamaahById(id: string) {
  noStore();
  try {
    const data = await db.jamaah.findUnique({
      where: {
        id: id,
      },
    });

    return data;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil data jamaah");
  }
}

export async function fetchJamaahPages(query: string) {
  noStore();
  try {
    const totalItems = await db.jamaah.count({
      where: {
        nama: {
          contains: query,
        },
      },
    });
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil jumlah halaman jamaah");
  }
}

export async function fetchCardData(year: number) {
  noStore();

  const timeZone = "Asia/Jakarta";
  const dt = DateTime.now().setZone(timeZone);
  const today = new Date(
    dt.year,
    dt.month - 1,
    dt.day,
    dt.hour,
    dt.minute,
    dt.second
  );

  try {
    const pemasukanThisMonth = db.pemasukan.aggregate({
      _sum: {
        jumlah: true,
      },
      where: {
        createdAt: {
          gte: startOfMonth(today),
          lte: endOfMonth(today),
        },
      },
    });

    const pengeluaranThisMonth = db.pengeluaran.aggregate({
      _sum: {
        jumlah: true,
      },
      where: {
        createdAt: {
          gte: startOfMonth(today),
          lte: endOfMonth(today),
        },
      },
    });

    const pemasukanToday = db.pemasukan.aggregate({
      _sum: {
        jumlah: true,
      },
      where: {
        createdAt: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    });

    const pengeluaranToday = db.pengeluaran.aggregate({
      _sum: {
        jumlah: true,
      },
      where: {
        createdAt: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    });

    const [
      pemasukanThisMonthData,
      pengeluaranThisMonthData,
      pemasukanTodayData,
      pengeluaranTodayData,
    ] = await Promise.all([
      pemasukanThisMonth,
      pengeluaranThisMonth,
      pemasukanToday,
      pengeluaranToday,
    ]);

    return {
      pemasukanThisMonth: pemasukanThisMonthData,
      pengeluaranThisMonth: pengeluaranThisMonthData,
      pemasukanToday: pemasukanTodayData,
      pengeluaranToday: pengeluaranTodayData,
    };
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error("Gagal mengambil data card");
  }
}

export async function fetchChartData(year: number) {
  noStore();

  try {
    const pemasukanQuery = db.$queryRaw`
    SELECT
      EXTRACT(MONTH FROM "createdAt") as month,
      SUM(jumlah) as total
    FROM "Pemasukan"
    WHERE "createdAt" >= ${new Date(year, 0, 1)}
    AND "createdAt" <= ${new Date(year + 1, 0, 1)}
    GROUP BY month;
    `;

    const pengeluaranQuery = db.$queryRaw`
    SELECT
      EXTRACT(MONTH FROM "createdAt") as month,
      SUM(jumlah) as total
    FROM "Pengeluaran"
    WHERE "createdAt" >= ${new Date(year, 0, 1)}
    AND "createdAt" <= ${new Date(year + 1, 0, 1)}
    GROUP BY month;
  `;

    const [pemasukan, pengeluaran] = await db.$transaction([
      pemasukanQuery,
      pengeluaranQuery,
    ]);

    const data = months.map((month) => {
      // @ts-ignore
      const pemasukanData = pemasukan.find(
        (item: FinanceMonth) => Number(item.month) === month.value
      );
      // @ts-ignore
      const pengeluaranData = pengeluaran.find(
        (item: FinanceMonth) => Number(item.month) === month.value
      );

      return {
        month: month.short,
        totalPemasukan: pemasukanData ? Number(pemasukanData.total) : 0,
        totalPengeluaran: pengeluaranData ? Number(pengeluaranData.total) : 0,
      };
    });

    console.log(data);

    return data;

    // const data: Monthly[] = await db.$queryRaw`
    //   SELECT
    //     month,
    //     SUM(totalPemasukan) AS totalPemasukan,
    //     SUM(totalPengeluaran) AS totalPengeluaran
    //   FROM (
    //     SELECT
    //       EXTRACT(MONTH FROM pm."createdAt") AS month,
    //       pm.jumlah AS totalPemasukan,
    //       NULL AS totalPengeluaran
    //     FROM "Pemasukan" as pm
    //     WHERE createdAt >= ${new Date(year, 0, 1)}
    //     AND createdAt <= ${new Date(year + 1, 0, 1)}
    //     UNION ALL
    //     SELECT
    //       EXTRACT(MONTH FROM pg.createdAt) AS month,
    //       NULL AS totalPemasukan,
    //       pg.jumlah AS totalPengeluaran
    //     FROM "Pengeluaran" as "pg"
    //     WHERE createdAt >= ${new Date(year, 0, 1)}
    //     AND createdAt <= ${new Date(year + 1, 0, 1)}
    //   ) as subquery
    //   GROUP BY month;
    // `;

    // const monthly = months.map((month) => {
    //   const monthData = data.find((item) => Number(item.month) === month.value);
    //   return {
    //     month: month.short,
    //     totalPemasukan: monthData ? Number(monthData.totalPemasukan) : 0,
    //     totalPengeluaran: monthData ? Number(monthData.totalPengeluaran) : 0,
    //   };
    // });

    // return monthly;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error("Gagal mengambil data chart");
  }
}

export async function fetchUserData(id: string) {
  noStore();

  try {
    const data = await db.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        username: true,
      },
    });

    return data;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil data user");
  }
}

export async function fetchFilteredUsers(currentPage: number, query: string) {
  noStore();

  try {
    const data = await db.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            username: {
              contains: query,
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    });

    return data;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil data users");
  }
}

export async function fetchUsersPages(query: string) {
  noStore();
  try {
    const totalItems = await db.user.count({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            username: {
              contains: query,
            },
          },
        ],
      },
    });
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil jumlah halaman users");
  }
}

export async function fetchAkunById(id: string) {
  noStore();
  try {
    const data = await db.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const akun = {
      id: data?.id,
      nama: data?.name,
      username: data?.username,
      role: data?.role,
      createdAt: data?.createdAt,
      updatedAt: data?.updatedAt,
    };

    return akun;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil data akun");
  }
}

export async function fetchFilteredPost(currentPage: number, query: string) {
  noStore();

  try {
    const data = await db.post.findMany({
      where: {
        OR: [
          {
            judul: {
              contains: query,
            },
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    });

    return data;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil data post");
  }
}

export async function fetchPostById(id: string) {
  noStore();
  try {
    const data = await db.post.findUnique({
      where: {
        id: id,
      },
    });

    return data;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil data post");
  }
}

export async function fetchPostPages(query: string) {
  noStore();
  try {
    const totalItems = await db.post.count({
      where: {
        OR: [
          {
            judul: {
              contains: query,
            },
          },
        ],
      },
    });
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil jumlah halaman post");
  }
}

export async function fetchFilteredPengurus(
  currentPage: number,
  query: string
) {
  noStore();

  try {
    const data = await db.pengurus.findMany({
      where: {
        OR: [
          {
            nama: {
              contains: query,
            },
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    });

    return data;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil data pengurus");
  }
}

export async function fetchPengurusById(id: string) {
  noStore();
  try {
    const data = await db.pengurus.findUnique({
      where: {
        id: id,
      },
    });

    return data;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil data pengurus");
  }
}

export async function fetchPengurusPages(query: string) {
  noStore();
  try {
    const totalItems = await db.pengurus.count({
      where: {
        OR: [
          {
            nama: {
              contains: query,
            },
          },
        ],
      },
    });
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Gagal mengambil jumlah halaman pengurus");
  }
}
