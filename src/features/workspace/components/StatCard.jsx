export default function StatCard({ label, value, helper, icon: Icon }) {
  return (
    <div className="rounded-lg border border-[#788585]/30 bg-white/60 p-5">
      {" "}
      <div className="flex items-start justify-between gap-4">
        {" "}
        <div>
          {" "}
          <p className="text-sm text-[#6F6866]">{label}</p>{" "}
          <p className="mt-2 text-3xl font-bold text-[#38302E]">{value}</p>{" "}
        </div>{" "}
        {Icon && (
          <div className="rounded-lg border border-[#788585]/30 bg-white p-3 text-sky-300">
            {" "}
            <Icon />{" "}
          </div>
        )}{" "}
      </div>{" "}
      {helper && <p className="mt-3 text-sm text-[#6F6866]">{helper}</p>}{" "}
    </div>
  );
}
