"use client";

export default function PermissionModal({
  title,
  description,
  onAllow,
  onDeny,
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#020617] border border-white/10 rounded-xl p-8 w-[360px] text-center">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>

        <p className="text-gray-400 mb-6 text-sm">{description}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onAllow}
            className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Allow
          </button>

          <button
            onClick={onDeny}
            className="px-5 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
