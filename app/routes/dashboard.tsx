import { useContext } from "react"
import { SiteHeader } from "~/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { AuthContext } from "~/context/authContext"
import { isAdmin, isStudent, isResearcher } from "~/lib/roles"

const AdminAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">19</div>
            <p className="text-xs text-muted-foreground">2 Admins, 5 Researchers, 12 Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Across all procedures</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Annotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">255</div>
            <p className="text-xs text-muted-foreground">Phases, Events, Bleeds, etc.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Admins</span>
                <span>2</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "11%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Researchers</span>
                <span>5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "26%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Students</span>
                <span>12</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "63%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 border-b pb-3">
              <div className="text-sm text-muted-foreground">January</div>
              <div className="text-lg font-semibold">8 videos, 45 annotations</div>
            </div>
            <div className="space-y-2 border-b pb-3">
              <div className="text-sm text-muted-foreground">February</div>
              <div className="text-lg font-semibold">12 videos, 67 annotations</div>
            </div>
            <div className="space-y-2 border-b pb-3">
              <div className="text-sm text-muted-foreground">March</div>
              <div className="text-lg font-semibold">15 videos, 89 annotations</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">April (Current)</div>
              <div className="text-lg font-semibold">10 videos, 54 annotations</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const ResearcherAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">My Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">13</div>
            <p className="text-xs text-muted-foreground">8 Completed, 3 In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Annotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">147</div>
            <p className="text-xs text-muted-foreground">Across all my videos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Annotations/Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">11.3</div>
            <p className="text-xs text-muted-foreground">Quality metric</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Video Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Completed</span>
                <span className="text-lg font-semibold">8</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "62%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">In Progress</span>
                <span className="text-lg font-semibold">3</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "23%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Pending Review</span>
                <span className="text-lg font-semibold">2</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: "15%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Annotation Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Phases</span>
                <span className="font-semibold">45</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "36%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Events</span>
                <span className="font-semibold">32</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "26%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Bleeds</span>
                <span className="font-semibold">18</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: "14%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Instruments</span>
                <span className="font-semibold">52</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "42%" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const StudentAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Annotations This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+4 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Annotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">52</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Videos Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">With annotations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Annotation Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 border-b pb-3">
              <div className="text-sm text-muted-foreground">This Week</div>
              <div className="text-lg font-semibold">12 annotations</div>
            </div>
            <div className="space-y-2 border-b pb-3">
              <div className="text-sm text-muted-foreground">Last Week</div>
              <div className="text-lg font-semibold">8 annotations</div>
            </div>
            <div className="space-y-2 border-b pb-3">
              <div className="text-sm text-muted-foreground">2 Weeks Ago</div>
              <div className="text-lg font-semibold">15 annotations</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">3 Weeks Ago</div>
              <div className="text-lg font-semibold">10 annotations</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Annotation Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Phases</span>
                <span className="text-muted-foreground">18 (35%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "35%" }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Events</span>
                <span className="text-muted-foreground">15 (29%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "29%" }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Bleeds</span>
                <span className="text-muted-foreground">12 (23%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: "23%" }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Anomalies</span>
                <span className="text-muted-foreground">7 (13%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "13%" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const authContext = useContext(AuthContext)
  const user = authContext?.user

  if (!user) {
    return (
      <>
        <SiteHeader breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]} />
        <div className="w-full flex-1 p-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Please log in to view analytics</p>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  const roleId = user.role_id
  const roleName = isAdmin(roleId) ? "Admin" : isResearcher(roleId) ? "Researcher" : isStudent(roleId) ? "Student" : "User"

  return (
    <>
      <SiteHeader breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]} />

      <div className="w-full flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}! ({roleName})
            </p>
          </div>
        </div>

        {isAdmin(roleId) && <AdminAnalytics />}
        {isResearcher(roleId) && <ResearcherAnalytics />}
        {isStudent(roleId) && <StudentAnalytics />}
      </div>
    </>
  )
}
