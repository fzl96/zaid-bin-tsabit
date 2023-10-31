import { Breadcrumbs } from "@/components/breadcrumbs";
import { DashboardHeader } from "@/components/dashboard-header";
import { Suspense } from "react";
import { AddButton } from "@/components/pemasukan/add-button";
import { PemasukanTable } from "@/components/pemasukan/pemasukan-table";
import Pagination from "@/components/pagination";
import { fetchPemasukanPages } from "@/lib/data";
import { TableSkeleton } from "@/components/table-skeleton";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const currentPage = Number(searchParams?.page || 1);
  const totalPages = await fetchPemasukanPages();

  return (
    <>
      <DashboardHeader
        title="Pemasukan"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Keuangan", href: "", active: false },
          { label: "Pemasukan", href: "/dashboard/pemasukan" },
        ]}
      >
        <AddButton />
      </DashboardHeader>
      <div>
        <Suspense key={currentPage} fallback={<TableSkeleton />}>
          <PemasukanTable currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </>
  );
}
