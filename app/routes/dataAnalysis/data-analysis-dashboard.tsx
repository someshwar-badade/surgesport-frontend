// src/components/data-analysis-dashboard.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getVideos } from "~/lib/videoService"
import { getAnnotationsByVideoId } from "~/lib/annotationService"
import type { Video } from "~/types/videos/video.type"
import type { Annotation } from "~/types/annotation.type"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { 
  Video as VideoIcon, 
  Tag, 
  Activity, 
  Scissors,
  TrendingUp,
  Calendar
} from "lucide-react"
import { SiteHeader } from "~/components/site-header"

interface DashboardStats {
  totalVideos: number
  totalAnnotations: number
  phaseCount: number
  eventCount: number
  bleedCount: number
  instrumentCount: number
  anomalyCount: number
  videosWithAnnotations: number
  avgAnnotationsPerVideo: number
}

interface ExtendedAnnotation {
  id: string
  video_id: string
  category: string
  time?: number
  [key: string]: any
}

export function DataAnalysisDashboard() {
  const [videos, setVideos] = useState<Video[]>([])
  const [allAnnotations, setAllAnnotations] = useState<ExtendedAnnotation[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalVideos: 0,
    totalAnnotations: 0,
    phaseCount: 0,
    eventCount: 0,
    bleedCount: 0,
    instrumentCount: 0,
    anomalyCount: 0,
    videosWithAnnotations: 0,
    avgAnnotationsPerVideo: 0
  })

  // Load all videos and their annotations
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Get all videos
        const videoData = await getVideos()
        setVideos(videoData)

        // Load annotations for each video
        let allAnns: ExtendedAnnotation[] = []
        let totalPhases = 0
        let totalEvents = 0
        let totalBleeds = 0
        let totalInstruments = 0
        let totalAnomalies = 0
        let videosWithAnns = 0

        for (const video of videoData) {
          const annotations = await getAnnotationsByVideoId(video.id)
          
          // Count annotations by category
          const phases = annotations.phases.length
          const events = annotations.events.length
          const bleeds = annotations.bleeds.length
          const instruments = annotations.instrumentation.length
          const anomalies = annotations.anomaly?.length || 0
          
          const videoAnnotationCount = phases + events + bleeds + instruments + anomalies
          
          if (videoAnnotationCount > 0) {
            videosWithAnns++
          }
          
          totalPhases += phases
          totalEvents += events
          totalBleeds += bleeds
          totalInstruments += instruments
          totalAnomalies += anomalies
          
          // Flatten annotations with proper mapping to ExtendedAnnotation
          const flatAnnotations: ExtendedAnnotation[] = [
            ...annotations.phases.map(p => ({ 
              ...p, 
              category: 'phases', 
              id: `phase-${p.id}`,
              video_id: video.id,
              time: p.start_time
            })),
            ...annotations.events.map(e => ({ 
              ...e, 
              category: 'events', 
              id: `event-${e.id}`,
              video_id: video.id,
              time: e.created_at ? new Date(e.created_at).getTime() / 1000 : undefined
            })),
            ...annotations.bleeds.map(b => ({ 
              ...b, 
              category: 'bleeds', 
              id: `bleed-${b.id}`,
              video_id: video.id,
              time: b.onset_time
            })),
            ...annotations.instrumentation.map(i => ({ 
              ...i, 
              category: 'instrumentation', 
              id: `instrument-${i.id}`,
              video_id: video.id,
              time: i.start_time
            })),
            ...(annotations.anomaly?.map(a => ({ 
              ...a, 
              category: 'anomaly', 
              id: `anomaly-${a.id}`,
              video_id: video.id,
              time: a.timestamp
            })) || [])
          ]
          
          allAnns = [...allAnns, ...flatAnnotations]
        }

        const totalAnnotations = totalPhases + totalEvents + totalBleeds + totalInstruments + totalAnomalies
        
        setAllAnnotations(allAnns)
        setStats({
          totalVideos: videoData.length,
          totalAnnotations,
          phaseCount: totalPhases,
          eventCount: totalEvents,
          bleedCount: totalBleeds,
          instrumentCount: totalInstruments,
          anomalyCount: totalAnomalies,
          videosWithAnnotations: videosWithAnns,
          avgAnnotationsPerVideo: videoData.length ? totalAnnotations / videoData.length : 0
        })
      } catch (error) {
        console.error("Failed to load data", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Prepare data for annotation distribution chart
  const annotationDistributionData = [
    { name: "Phases", value: stats.phaseCount, color: "#8884d8" },
    { name: "Events", value: stats.eventCount, color: "#82ca9d" },
    { name: "Bleeding", value: stats.bleedCount, color: "#ffc658" },
    { name: "Instruments", value: stats.instrumentCount, color: "#ff8042" },
    { name: "Anomalies", value: stats.anomalyCount, color: "#ff6b6b" }
  ].filter(item => item.value > 0)

  // Prepare data for video annotation comparison
  const videoAnnotationData = videos.map(video => ({
    name: video.title || `Video ${video.id.slice(0, 8)}`,
    annotations: allAnnotations.filter(a => a.video_id === video.id).length
  })).sort((a, b) => b.annotations - a.annotations).slice(0, 10)

  // Calculate percentages for instrument annotations vs bleeding
  const instrumentPercentage = stats.totalAnnotations > 0 
    ? ((stats.instrumentCount / stats.totalAnnotations) * 100).toFixed(1)
    : "0"
  
  const bleedPercentage = stats.totalAnnotations > 0
    ? ((stats.bleedCount / stats.totalAnnotations) * 100).toFixed(1)
    : "0"

  const instrumentVsBleedData = [
    { name: "Instrument Annotations", value: stats.instrumentCount, color: "#8884d8" },
    { name: "Bleeding Annotations", value: stats.bleedCount, color: "#ff6b6b" }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <>
    <SiteHeader breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]} />
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Annotation Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of all videos and their annotations
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <VideoIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVideos}</div>
            <p className="text-xs text-muted-foreground">
              {stats.videosWithAnnotations} videos have annotations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Annotations</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnnotations}</div>
            <p className="text-xs text-muted-foreground">
              Avg {stats.avgAnnotationsPerVideo.toFixed(1)} per video
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phases & Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.phaseCount + stats.eventCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.phaseCount} phases, {stats.eventCount} events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instruments & Bleeding</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.instrumentCount + stats.bleedCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.instrumentCount} instruments, {stats.bleedCount} bleeding
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="distribution">Annotation Distribution</TabsTrigger>
          <TabsTrigger value="comparison">Video Comparison</TabsTrigger>
          <TabsTrigger value="instruments">Instruments vs Bleeding</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Annotation Distribution</CardTitle>
                <CardDescription>Breakdown by annotation type</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {annotationDistributionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={annotationDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {annotationDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No annotations available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Annotation Statistics</CardTitle>
                <CardDescription>Detailed breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#8884d8]"></div>
                      <span className="text-sm">Phases</span>
                    </div>
                    <div className="font-semibold">{stats.phaseCount}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#82ca9d]"></div>
                      <span className="text-sm">Events</span>
                    </div>
                    <div className="font-semibold">{stats.eventCount}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ffc658]"></div>
                      <span className="text-sm">Bleeding</span>
                    </div>
                    <div className="font-semibold">{stats.bleedCount}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff8042]"></div>
                      <span className="text-sm">Instruments</span>
                    </div>
                    <div className="font-semibold">{stats.instrumentCount}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff6b6b]"></div>
                      <span className="text-sm">Anomalies</span>
                    </div>
                    <div className="font-semibold">{stats.anomalyCount}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Annotations per Video</CardTitle>
              <CardDescription>Top 10 videos by annotation count</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {videoAnnotationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={videoAnnotationData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="annotations" fill="#8884d8" name="Number of Annotations" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No video data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instruments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Instruments vs Bleeding</CardTitle>
                <CardDescription>Comparison between instrument and bleeding annotations</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {instrumentVsBleedData.filter(d => d.value > 0).length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={instrumentVsBleedData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#8884d8" />
                        <Cell fill="#ff6b6b" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Percentage Comparison</CardTitle>
                <CardDescription>Instrument vs Bleeding of total annotations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Instrument Annotations</span>
                    <span className="font-semibold">{instrumentPercentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#8884d8] rounded-full transition-all duration-500"
                      style={{ width: `${instrumentPercentage}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bleeding Annotations</span>
                    <span className="font-semibold">{bleedPercentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#ff6b6b] rounded-full transition-all duration-500"
                      style={{ width: `${bleedPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>
                      {stats.instrumentCount > stats.bleedCount 
                        ? `Instrument annotations are ${((stats.instrumentCount / stats.bleedCount) * 100).toFixed(0)}% more than bleeding annotations`
                        : stats.bleedCount > stats.instrumentCount
                        ? `Bleeding annotations are ${((stats.bleedCount / stats.instrumentCount) * 100).toFixed(0)}% more than instrument annotations`
                        : "Equal number of instrument and bleeding annotations"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </>
  )
}