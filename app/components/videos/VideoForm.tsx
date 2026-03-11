import * as React from "react";
import type { Video } from "~/lib/videoService";

interface VideoFormProps {
  initialData?: Partial<Video>;
  onSubmit: (data: Omit<Video, "id" | "createdAt">) => void;
  onCancel?: () => void;
}

const PROCEDURE_OPTIONS = [
  "Type A",
  "Type B",
  "Type C",
  "Other",
];

export function VideoForm({ initialData = {}, onSubmit, onCancel }: VideoFormProps) {
  const [videoId, setVideoId] = React.useState(initialData.video_id || "");
  const [procedureType, setProcedureType] = React.useState(
    initialData.procedure_type || PROCEDURE_OPTIONS[0]
  );
  const [totalVideoTime, setTotalVideoTime] = React.useState(
    initialData.total_video_time || ""
  );
  const [firstEntry, setFirstEntry] = React.useState(
    initialData.first_camera_entry_time || ""
  );
  const [finalExit, setFinalExit] = React.useState(
    initialData.final_camera_exit_time || ""
  );
  const [exitBodyTime, setExitBodyTime] = React.useState(
    initialData.camera_exit_body_time || ""
  );
  const [enterBodyTime, setEnterBodyTime] = React.useState(
    initialData.camera_enter_body_timestamp || ""
  );
  const [exitBodyTimestamp, setExitBodyTimestamp] = React.useState(
    initialData.camera_exit_body_timestamp || ""
  );
  const [osatScore, setOsatScore] = React.useState(
    initialData.osat_score?.toString() || ""
  );

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!videoId) errs.video_id = "Video ID is required";
    if (!totalVideoTime) errs.total_video_time = "Total video time is required";
    if (!osatScore) errs.osat_score = "OSAT score is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      video_id: videoId,
      procedure_type: procedureType,
      total_video_time: totalVideoTime,
      first_camera_entry_time: firstEntry,
      final_camera_exit_time: finalExit,
      camera_exit_body_time: exitBodyTime,
      camera_enter_body_timestamp: enterBodyTime,
      camera_exit_body_timestamp: exitBodyTimestamp,
      osat_score: Number(osatScore),
    });
  };

  const inputClass =
    "border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Video ID</label>
        <input
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          className={inputClass}
        />
        {errors.video_id && (
          <p className="text-red-500 text-xs mt-1">{errors.video_id}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Procedure Type
        </label>
        <select
          value={procedureType}
          onChange={(e) => setProcedureType(e.target.value)}
          className={inputClass}
        >
          {PROCEDURE_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Total Video Time
        </label>
        <input
          type="text"
          placeholder="e.g. 00:05:30"
          value={totalVideoTime}
          onChange={(e) => setTotalVideoTime(e.target.value)}
          className={inputClass}
        />
        {errors.total_video_time && (
          <p className="text-red-500 text-xs mt-1">
            {errors.total_video_time}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          First Camera Entry Time
        </label>
        <input
          type="datetime-local"
          value={firstEntry}
          onChange={(e) => setFirstEntry(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Final Camera Exit Time
        </label>
        <input
          type="datetime-local"
          value={finalExit}
          onChange={(e) => setFinalExit(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Camera Exit Body Time
        </label>
        <input
          type="datetime-local"
          value={exitBodyTime}
          onChange={(e) => setExitBodyTime(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Camera Enter Body Timestamp
        </label>
        <input
          type="datetime-local"
          value={enterBodyTime}
          onChange={(e) => setEnterBodyTime(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Camera Exit Body Timestamp
        </label>
        <input
          type="datetime-local"
          value={exitBodyTimestamp}
          onChange={(e) => setExitBodyTimestamp(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">OSAT Score</label>
        <input
          type="number"
          min={0}
          max={100}
          value={osatScore}
          onChange={(e) => setOsatScore(e.target.value)}
          className={inputClass}
        />
        {errors.osat_score && (
          <p className="text-red-500 text-xs mt-1">
            {errors.osat_score}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
