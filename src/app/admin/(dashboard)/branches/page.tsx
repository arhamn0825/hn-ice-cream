import { prisma } from "@/lib/prisma";
import BranchesManager from "./BranchesManager";

export default async function AdminBranchesPage() {
  let branches: any[] = [];
  try {
    branches = await prisma.branch.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    branches = [];
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Branches</h1>
      <p className="text-ink/50 text-sm mb-8">
        Add each shop location here. Every branch shows on your homepage with its own name and map.
      </p>
      <BranchesManager initialBranches={branches} />
    </div>
  );
}
