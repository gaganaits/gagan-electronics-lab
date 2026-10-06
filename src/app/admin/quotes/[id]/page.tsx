import QuoteDetailClient from "@/components/admin/quote-detail-client";

export function generateStaticParams() {
  return [
    { id: "QT-2026-782109" },
    { id: "QT-2026-441892" },
    { id: "QT-2026-119340" },
    { id: "preview" },
  ];
}

export default function QuoteDetailPage() {
  return <QuoteDetailClient />;
}
