import DemoOne from "@/components/ui/demo";

export const metadata = {
  title: "Prisma Hero Demo | PeoplePay360",
  description: "Standalone demo of the integrated PrismaHero component",
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-black text-white p-4">
      <DemoOne />
    </main>
  );
}
