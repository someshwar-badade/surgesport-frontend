import * as React from "react";
import { Link, useNavigate } from "react-router";
import { getVideos, deleteVideo } from "~/lib/videoService";
import type { Video } from "~/lib/videoService";
import { VideoTable } from "~/components/videos/VideoTable";
import { useToast } from "~/components/ui/toast";

export default function VideoList() {
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [loading, setLoading] = React.useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    getVideos().then((data) => {
      setVideos(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    const ok = globalThis.confirm("Are you sure you want to delete this video?");
    if (!ok) return;
    await deleteVideo(id);
    setVideos((v) => v.filter((x) => x.id !== id));
    toast.addToast({ title: "Deleted", description: "Video was removed", variant: "success" });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Videos</h1>
        <Link
          to="/videos/create"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Create Video
        </Link>
      </div>
      <VideoTable
        videos={videos}
        onView={(id) => navigate(`/videos/${id}`)}
        onEdit={(id) => navigate(`/videos/${id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}