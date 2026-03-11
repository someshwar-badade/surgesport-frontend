import * as React from "react";
import { useNavigate } from "react-router";
import { createVideo } from "~/lib/videoService";
import { VideoForm } from "~/components/videos/VideoForm";
import { useToast } from "~/components/ui/toast";

export default function CreateVideo() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (data: any) => {
    await createVideo(data);
    toast.addToast({ title: "Created", description: "Video added successfully", variant: "success" });
    navigate("/videos");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Create Video</h1>
      <VideoForm onSubmit={handleSubmit} onCancel={() => navigate("/videos")} />
    </div>
  );
}