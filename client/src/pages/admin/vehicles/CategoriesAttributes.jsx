import React, { useMemo, useState } from "react";
import {
  Layers3,
  Car,
  Bike,
  Truck,
  Plus,
  Pencil,
  Ban,
  GripVertical,
  ChevronRight,
  Search,
  MoreHorizontal,
  Filter,
  Globe,
  Tags,
  Boxes,
  CheckCircle2,
  X,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   DUMMY DATA
========================================================= */
const DUMMY_CATEGORY_TREE = [
  {
    id: 1,
    name: "Cars",
    icon: Car,
    slug: "cars",
    active: true,
    order: 1,
    defaultAttributes: ["Fuel Type", "Transmission", "Ownership"],
    children: [
      { id: 11, name: "Hatchback", slug: "hatchback", active: true, order: 1 },
      { id: 12, name: "Sedan", slug: "sedan", active: true, order: 2 },
      { id: 13, name: "SUV", slug: "suv", active: true, order: 3 },
      { id: 14, name: "MUV", slug: "muv", active: true, order: 4 },
      { id: 15, name: "Coupe", slug: "coupe", active: false, order: 5 },
    ],
  },
  {
    id: 2,
    name: "Bikes",
    icon: Bike,
    slug: "bikes",
    active: true,
    order: 2,
    defaultAttributes: ["Engine Capacity", "Fuel Type"],
    children: [
      { id: 21, name: "Commuter", slug: "commuter", active: true, order: 1 },
      { id: 22, name: "Sports", slug: "sports", active: true, order: 2 },
      { id: 23, name: "Cruiser", slug: "cruiser", active: true, order: 3 },
    ],
  },
  {
    id: 3,
    name: "Commercial",
    icon: Truck,
    slug: "commercial",
    active: true,
    order: 3,
    defaultAttributes: ["Payload", "Fuel Type", "Body Type"],
    children: [
      { id: 31, name: "Pickup", slug: "pickup", active: true, order: 1 },
      { id: 32, name: "Truck", slug: "truck", active: true, order: 2 },
      { id: 33, name: "Van", slug: "van", active: true, order: 3 },
    ],
  },
];

const DUMMY_BRANDS = [
  {
    id: 1,
    brand: "Maruti",
    category: "Cars",
    modelsCount: 12,
    activeListings: 340,
    status: "Active",
  },
  {
    id: 2,
    brand: "Hyundai",
    category: "Cars",
    modelsCount: 9,
    activeListings: 280,
    status: "Active",
  },
  {
    id: 3,
    brand: "Honda",
    category: "Cars",
    modelsCount: 6,
    activeListings: 110,
    status: "Active",
  },
];

const DUMMY_MODELS = [
  {
    id: 1,
    model: "Swift",
    variants: 5,
    yearRange: "2018 - Present",
    activeListings: 102,
    status: "Active",
  },
  {
    id: 2,
    model: "Baleno",
    variants: 4,
    yearRange: "2019 - Present",
    activeListings: 74,
    status: "Active",
  },
  {
    id: 3,
    model: "Dzire",
    variants: 3,
    yearRange: "2017 - Present",
    activeListings: 61,
    status: "Active",
  },
];

const DUMMY_ATTRIBUTES = [
  {
    id: 1,
    attribute: "Engine Capacity",
    type: "Number",
    required: "Yes",
    filterable: "Yes",
    searchable: "No",
    weight: 7,
    status: "Active",
  },
  {
    id: 2,
    attribute: "Mileage",
    type: "Number",
    required: "No",
    filterable: "Yes",
    searchable: "Yes",
    weight: 6,
    status: "Active",
  },
  {
    id: 3,
    attribute: "Airbags",
    type: "Dropdown",
    required: "No",
    filterable: "Yes",
    searchable: "No",
    weight: 5,
    status: "Active",
  },
  {
    id: 4,
    attribute: "ABS",
    type: "Boolean",
    required: "No",
    filterable: "Yes",
    searchable: "No",
    weight: 4,
    status: "Active",
  },
];

const DUMMY_FILTER_MAPPING = [
  {
    id: 1,
    filterName: "Price",
    category: "All",
    type: "Range",
    position: 1,
    active: "Yes",
    sourceAttribute: "Price",
  },
  {
    id: 2,
    filterName: "Fuel Type",
    category: "Cars",
    type: "Checkbox",
    position: 2,
    active: "Yes",
    sourceAttribute: "Fuel",
  },
  {
    id: 3,
    filterName: "Ownership",
    category: "Cars",
    type: "Dropdown",
    position: 4,
    active: "Yes",
    sourceAttribute: "Ownership",
  },
];

const DUMMY_SEO = [
  {
    id: 1,
    seoPage: "Used SUVs Under 10 Lakhs",
    filterCombination: "Body Type = SUV + Price < 10L",
    metaTitle: "Best Used SUVs Under 10 Lakhs",
    status: "Active",
  },
  {
    id: 2,
    seoPage: "Best City Bikes in Ahmedabad",
    filterCombination: "Category = Bike + City = Ahmedabad",
    metaTitle: "Best City Bikes in Ahmedabad",
    status: "Draft",
  },
];

/* =========================================================
   HELPERS
========================================================= */
const statusBadge = (status) => {
  const map = {
    Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Draft: "bg-amber-50 text-amber-700 ring-amber-200",
    Disabled: "bg-rose-50 text-rose-700 ring-rose-200",
    Inactive: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  };
  return map[status] || "bg-zinc-100 text-zinc-700 ring-zinc-200";
};

const yesNoBadge = (value) =>
  value === "Yes"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-zinc-100 text-zinc-700 ring-zinc-200";

/* =========================================================
   MAIN
========================================================= */
const CategoriesAttributes = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Maruti");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [modal, setModal] = useState(null);

  const tabs = [
    { key: "categories", label: "Categories", icon: Layers3 },
    { key: "brands", label: "Brands & Models", icon: Car },
    { key: "attributes", label: "Attributes", icon: Tags },
    { key: "filters", label: "Filter Mapping", icon: Filter },
    { key: "seo", label: "SEO Mapping", icon: Globe },
  ];

  const activeCount = useMemo(() => {
    if (activeTab === "categories") {
      return DUMMY_CATEGORY_TREE.length;
    }
    if (activeTab === "brands") return DUMMY_BRANDS.length;
    if (activeTab === "attributes") return DUMMY_ATTRIBUTES.length;
    if (activeTab === "filters") return DUMMY_FILTER_MAPPING.length;
    return DUMMY_SEO.length;
  }, [activeTab]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-zinc-50 via-slate-50 to-gray-100">
      <div className="mx-auto flex flex-1 flex-col w-full max-w-[1800px] space-y-4 overflow-hidden p-6">
        {/* HEADER */}
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="mb-1 text-[32px] font-extrabold tracking-tight text-slate-900">
              Categories & Attributes
            </h1>
          </div>


        </section>

        {/* TABS */}
        <section className="rounded-[28px] border border-zinc-200 bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cls(
                    "inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* SEARCH BAR */}
        <section className="rounded-[28px] border border-zinc-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories, brands, attributes, filters..."
                className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 pl-11 pr-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:bg-white focus:ring-4 focus:ring-zinc-900/5"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {activeTab === "categories" && (
                <>
                  <TopActionBtn icon={Plus} label="Add Category" onClick={() => setModal("category")} />
                  <TopActionBtn icon={Plus} label="Add Subcategory" onClick={() => setModal("subcategory")} />
                </>
              )}
              {activeTab === "brands" && (
                <>
                  <TopActionBtn icon={Plus} label="Add Brand" onClick={() => setModal("brand")} />
                  <TopActionBtn icon={Plus} label="Add Model" onClick={() => setModal("model")} />
                </>
              )}
              {activeTab === "attributes" && (
                <TopActionBtn icon={Plus} label="Add Attribute" onClick={() => setModal("attribute")} />
              )}
              {activeTab === "filters" && (
                <TopActionBtn icon={Plus} label="Add Filter" onClick={() => setModal("filter")} />
              )}
              {activeTab === "seo" && (
                <TopActionBtn icon={Plus} label="Add SEO Page" onClick={() => setModal("seo")} />
              )}
            </div>
          </div>
        </section>

        {/* CONTENT */}
        {activeTab === "categories" && (
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[30px] border border-zinc-200 bg-white shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
              <div className="border-b border-zinc-200 px-6 py-5">
                <h2 className="text-[24px] font-bold tracking-[-0.03em] text-zinc-900">
                  Category Tree View
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Vehicles taxonomy with categories and subcategories
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <div className="text-sm font-bold text-zinc-900">Vehicles</div>
                </div>

                {DUMMY_CATEGORY_TREE.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.id} className="rounded-[24px] border border-zinc-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-zinc-100 p-3 text-zinc-700">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-base font-bold text-zinc-900">{cat.name}</div>
                            <div className="mt-1 text-sm text-zinc-500">/{cat.slug}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={cls(
                              "inline-flex rounded-full px-3 py-1.5 text-xs font-bold ring-1",
                              cat.active
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                : "bg-zinc-100 text-zinc-700 ring-zinc-200"
                            )}
                          >
                            {cat.active ? "Active" : "Disabled"}
                          </span>

                          <button className="rounded-2xl border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-50">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button className="rounded-2xl border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-50">
                            <Ban className="h-4 w-4" />
                          </button>
                          <button className="rounded-2xl border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-50">
                            <GripVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 pl-3">
                        {cat.children.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-3 py-3"
                          >
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                              <ChevronRight className="h-4 w-4 text-zinc-400" />
                              {sub.name}
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={cls(
                                  "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ring-1",
                                  sub.active
                                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                    : "bg-zinc-100 text-zinc-700 ring-zinc-200"
                                )}
                              >
                                {sub.active ? "Active" : "Disabled"}
                              </span>

                              <button className="rounded-xl border border-zinc-200 p-2 text-zinc-600 hover:bg-white">
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button className="rounded-xl border border-zinc-200 p-2 text-zinc-600 hover:bg-white">
                                <Ban className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[30px] border border-zinc-200 bg-white shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
              <div className="border-b border-zinc-200 px-6 py-5">
                <h2 className="text-[24px] font-bold tracking-[-0.03em] text-zinc-900">
                  Category Details
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Assign defaults and check metadata
                </p>
              </div>

              <div className="p-6 space-y-4">
                <InfoCard label="Slug Usage" value="Used for SEO URLs" />
                <InfoCard label="Delete Rule" value="Cannot delete live-used categories" />
                <InfoCard label="Disable Rule" value="Hides category in filters but preserves data" />

                <div className="rounded-[24px] border border-zinc-200 p-4">
                  <div className="text-sm font-bold uppercase tracking-[0.12em] text-zinc-500">
                    Default Attributes
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Fuel Type", "Transmission", "Ownership", "Body Type"].map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-zinc-200 p-4">
                  <div className="text-sm font-bold uppercase tracking-[0.12em] text-zinc-500">
                    Actions
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <ActionBtn icon={Plus} label="Add Category" onClick={() => setModal("category")} />
                    <ActionBtn icon={Plus} label="Add Subcategory" onClick={() => setModal("subcategory")} />
                    <ActionBtn icon={Pencil} label="Edit Category" onClick={() => { }} />
                    <ActionBtn icon={Ban} label="Disable" danger onClick={() => { }} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "brands" && (
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <TableCard
              title="Brand Table"
              subtitle="Manage brands and view model counts"
              headers={["Brand", "Category", "Models Count", "Active Listings", "Status", "Actions"]}
            >
              {DUMMY_BRANDS.map((row) => (
                <tr key={row.id} className="border-t border-zinc-100 hover:bg-zinc-50/60">
                  <td className="px-5 py-4 text-sm font-bold text-zinc-900">{row.brand}</td>
                  <td className="px-4 py-4 text-sm text-zinc-700">{row.category}</td>
                  <td className="px-4 py-4 text-sm text-zinc-700">{row.modelsCount}</td>
                  <td className="px-4 py-4 text-sm text-zinc-700">{row.activeListings}</td>
                  <td className="px-4 py-4">
                    <Badge text={row.status} className={statusBadge(row.status)} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedBrand(row.brand)}
                      className="rounded-2xl border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                    >
                      View Models
                    </button>
                  </td>
                </tr>
              ))}
            </TableCard>

            <TableCard
              title={`${selectedBrand} Models`}
              subtitle="Click a brand to view model management"
              headers={["Model", "Variants", "Year Range", "Active Listings", "Status"]}
            >
              {DUMMY_MODELS.map((row) => (
                <tr key={row.id} className="border-t border-zinc-100 hover:bg-zinc-50/60">
                  <td className="px-5 py-4 text-sm font-bold text-zinc-900">{row.model}</td>
                  <td className="px-4 py-4 text-sm text-zinc-700">{row.variants}</td>
                  <td className="px-4 py-4 text-sm text-zinc-700">{row.yearRange}</td>
                  <td className="px-4 py-4 text-sm text-zinc-700">{row.activeListings}</td>
                  <td className="px-4 py-4">
                    <Badge text={row.status} className={statusBadge(row.status)} />
                  </td>
                </tr>
              ))}
            </TableCard>
          </section>
        )}

        {activeTab === "attributes" && (
          <TableCard
            title="Attribute Table"
            subtitle="Manage searchable and ranking-impacting attributes"
            headers={[
              "Attribute",
              "Type",
              "Required",
              "Filterable",
              "Searchable",
              "Weight in Ranking",
              "Status",
              "Actions",
            ]}
          >
            {DUMMY_ATTRIBUTES.map((row) => (
              <tr key={row.id} className="border-t border-zinc-100 hover:bg-zinc-50/60">
                <td className="px-5 py-4 text-sm font-bold text-zinc-900">{row.attribute}</td>
                <td className="px-4 py-4 text-sm text-zinc-700">{row.type}</td>
                <td className="px-4 py-4">
                  <Badge text={row.required} className={yesNoBadge(row.required)} />
                </td>
                <td className="px-4 py-4">
                  <Badge text={row.filterable} className={yesNoBadge(row.filterable)} />
                </td>
                <td className="px-4 py-4">
                  <Badge text={row.searchable} className={yesNoBadge(row.searchable)} />
                </td>
                <td className="px-4 py-4 text-sm text-zinc-700">{row.weight}</td>
                <td className="px-4 py-4">
                  <Badge text={row.status} className={statusBadge(row.status)} />
                </td>
                <td className="px-5 py-4 text-right">
                  <RowMenu
                    isOpen={menuOpenId === row.id}
                    onToggle={() => setMenuOpenId(menuOpenId === row.id ? null : row.id)}
                    items={[
                      { label: "Edit", icon: Pencil },
                      { label: "Disable", icon: Ban, danger: true },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </TableCard>
        )}

        {activeTab === "filters" && (
          <TableCard
            title="Filter Control Panel"
            subtitle="Control what appears in search filter UI"
            headers={["Filter Name", "Category", "Type", "Position", "Active", "Source Attribute", "Actions"]}
          >
            {DUMMY_FILTER_MAPPING.map((row) => (
              <tr key={row.id} className="border-t border-zinc-100 hover:bg-zinc-50/60">
                <td className="px-5 py-4 text-sm font-bold text-zinc-900">{row.filterName}</td>
                <td className="px-4 py-4 text-sm text-zinc-700">{row.category}</td>
                <td className="px-4 py-4 text-sm text-zinc-700">{row.type}</td>
                <td className="px-4 py-4 text-sm text-zinc-700">{row.position}</td>
                <td className="px-4 py-4">
                  <Badge text={row.active} className={yesNoBadge(row.active)} />
                </td>
                <td className="px-4 py-4 text-sm text-zinc-700">{row.sourceAttribute}</td>
                <td className="px-5 py-4 text-right">
                  <RowMenu
                    isOpen={menuOpenId === row.id}
                    onToggle={() => setMenuOpenId(menuOpenId === row.id ? null : row.id)}
                    items={[
                      { label: "Edit", icon: Pencil },
                      { label: "Disable", icon: Ban, danger: true },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </TableCard>
        )}

        {activeTab === "seo" && (
          <TableCard
            title="SEO Category Table"
            subtitle="Control dynamic landing pages and filter combinations"
            headers={["SEO Page", "Filter Combination", "Meta Title", "Status", "Actions"]}
          >
            {DUMMY_SEO.map((row) => (
              <tr key={row.id} className="border-t border-zinc-100 hover:bg-zinc-50/60">
                <td className="px-5 py-4 text-sm font-bold text-zinc-900">{row.seoPage}</td>
                <td className="px-4 py-4 text-sm text-zinc-700">{row.filterCombination}</td>
                <td className="px-4 py-4 text-sm text-zinc-700">{row.metaTitle}</td>
                <td className="px-4 py-4">
                  <Badge text={row.status} className={statusBadge(row.status)} />
                </td>
                <td className="px-5 py-4 text-right">
                  <RowMenu
                    isOpen={menuOpenId === row.id}
                    onToggle={() => setMenuOpenId(menuOpenId === row.id ? null : row.id)}
                    items={[
                      { label: "Edit", icon: Pencil },
                      { label: "Disable", icon: Ban, danger: true },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </TableCard>
        )}
      </div>

      {modal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setModal(null)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-zinc-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">
                  Add {modal === "seo" ? "SEO Page" : modal.charAt(0).toUpperCase() + modal.slice(1)}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Create a new record for this marketplace structure.
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-2xl border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <Field label="Name / Title" placeholder="Enter name..." />
              <Field label="Slug" placeholder="auto-generated-slug" />
              <Field label="Display Order" placeholder="1" />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setModal(null)}
                className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setModal(null)}
                className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoriesAttributes;

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function MetricCard({ label, value }) {
  return (
    <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-base font-bold text-zinc-900">{value}</div>
    </div>
  );
}

function TopActionBtn({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function TableCard({ title, subtitle, headers, children }) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
      <div className="border-b border-zinc-200 px-5 py-5 md:px-6">
        <h2 className="text-[24px] font-bold tracking-[-0.03em] text-zinc-900">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[1200px] w-full table-auto">
          <thead className="border-b border-zinc-200 bg-zinc-50/90">
            <tr className="text-left text-[11px] font-extrabold uppercase tracking-[0.12em] text-zinc-500">
              {headers.map((h) => (
                <th key={h} className="px-4 py-4 whitespace-nowrap first:px-5 last:px-5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </section>
  );
}

function Badge({ text, className }) {
  return (
    <span className={cls("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 whitespace-nowrap", className)}>
      {text}
    </span>
  );
}

function RowMenu({ isOpen, onToggle, items }) {
  return (
    <div className="relative inline-flex">
      <button
        onClick={onToggle}
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 text-zinc-700 transition hover:bg-zinc-50"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-30 w-52 overflow-hidden rounded-2xl border border-zinc-200 bg-white py-2 shadow-[0_20px_50px_rgba(15,23,42,0.16)]">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={cls(
                  "flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition",
                  item.danger ? "text-rose-700 hover:bg-rose-50" : "text-zinc-700 hover:bg-zinc-50"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-[24px] border border-zinc-200 p-4">
      <div className="text-sm font-bold uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

function Field({ label, placeholder }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-bold uppercase tracking-[0.08em] text-zinc-500">
        {label}
      </div>
      <input
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 shadow-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
      />
    </label>
  );
}

function ActionBtn({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
        danger
          ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
          : "border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}