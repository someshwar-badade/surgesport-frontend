import ReactPlayer from "react-player"

export default function VideoPlayer() {
  return (
    <div className="w-full max-w-3xl">
      <ReactPlayer
        src="https://www.youtube.com/watch?v=LXb3EKWsInQ"
        controls
        width="100%"
        height="400px"
      />
    </div>
  )
}