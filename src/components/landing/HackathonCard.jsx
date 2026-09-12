// src/components/landing/HackathonCard.jsx

export default function HackathonCard({
  title,
  participants,
  prize,
  mode,
  status,
}) {
  return (
    <div
      className="
                rounded-3xl
                overflow-hidden
                border
                border-slate-800
                bg-slate-900/60
                hover:border-indigo-500/40
                transition-all
                duration-300
            "
    >
      {/* Banner */}
      <div
        className="
                    h-48
                    bg-gradient-to-br
                    from-indigo-500/30
                    to-cyan-500/20
                "
      />

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <span
            className="
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            bg-emerald-500/10
                            text-emerald-400
                            border
                            border-emerald-500/20
                        "
          >
            {status}
          </span>

          <span className="text-slate-400 text-sm">{mode}</span>
        </div>

        <h3 className="text-2xl font-bold mb-4">{title}</h3>

        <div className="space-y-3 text-slate-400">
          <div className="flex justify-between">
            <span>Participants</span>
            <span>{participants}+</span>
          </div>

          <div className="flex justify-between">
            <span>Prize Pool</span>
            <span>{prize}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
