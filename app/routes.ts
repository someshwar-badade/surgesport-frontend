import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("login", "routes/login/page.tsx"),
  layout("routes/layout.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
    route("videos", "routes/videos/index.tsx"),
    route("videos/create", "routes/videos/create.tsx"),
    route("videos/annotation", "routes/videos/annotation.tsx"),
    route("videos/$id", "routes/videos/$id.tsx"),
    route("videos/$id/edit", "routes/videos/$id.edit.tsx"),
  ]),
] satisfies RouteConfig
