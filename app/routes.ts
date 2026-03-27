import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes"

export default [
  // Public routes
  index("routes/home.tsx"),
  route("login", "routes/login/page.tsx"),
  route("forgot-password", "routes/forgot-password/page.tsx"),
  route("register", "routes/register/page.tsx"),
  // Protected routes with their own layout
  layout("routes/protectedLayout.tsx", [
    layout("routes/layout.tsx", [
      route("dashboard", "routes/dashboard.tsx"),
       route("data-analysis", "routes/data-analysis.tsx"),
      route("procedures", "routes/procedures/index.tsx"),
      route("videos", "routes/videos/index.tsx"),
      route("videos/create", "routes/videos/create.tsx"),
      route("videos/annotation", "routes/videos/annotation.tsx"),
      route("videos/annotation/view", "routes/videos/view.tsx"),
      route("videos/:id", "routes/videos/$id/index.tsx"),
      route("videos/:id/edit", "routes/videos/$id/edit.tsx"),

      route("annotator/annotations", "routes/annotator/annotations/index.tsx"),
       route("users/all", "routes/users/index.tsx"),
      route("users/create", "routes/users/create.tsx"),
      route("users/:id/edit", "routes/users/$id/edit.tsx"),


    ]),
  ]),
] satisfies RouteConfig
