import { prisma } from "@/lib/prisma";
import { FiMapPin } from "react-icons/fi";

export default async function StoreMap() {
  let branches: { id: string; name: string; address: string | null; mapEmbedUrl: string }[] = [];
  try {
    branches = await prisma.branch.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    branches = [];
  }

  if (branches.length === 0) {
    // Nothing added in Admin → Branches yet — quietly skip this section
    // rather than showing an empty/broken map.
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-16">
      <p className="section-eyebrow text-center">Visit Us</p>
      <h2 className="section-title text-center mb-10">Find Our Stores</h2>

      <div className={`grid gap-8 ${branches.length > 1 ? "md:grid-cols-2" : ""}`}>
        {branches.map((branch) => (
          <div key={branch.id}>
            <div className="flex items-center gap-2 mb-3">
              <FiMapPin className="text-grape-500 shrink-0" />
              <div>
                <h3 className="font-display text-xl font-medium">{branch.name}</h3>
                {branch.address && <p className="text-sm text-ink/50">{branch.address}</p>}
              </div>
            </div>
            <div className="rounded-4xl overflow-hidden glass h-[350px]">
              <iframe
                src={branch.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title={branch.name}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
