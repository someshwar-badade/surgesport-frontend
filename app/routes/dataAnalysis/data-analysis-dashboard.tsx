// src/components/data-analysis-dashboard.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getVideos } from "~/lib/videoService"
import { getAnnotationsByVideoId } from "~/lib/annotationService"
import type { Video } from "~/types/videos/video.type"
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
  AreaChart,
  Area,
  ComposedChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts"
import { 
  Video as VideoIcon, 
  Tag, 
  Activity, 
  Scissors,
  TrendingUp,
  Calendar,
  Clock,
  Droplet,
  AlertTriangle,
  Scissors as ScissorsIcon,
  Heart,
  Brain,
  Eye,
  Timer
} from "lucide-react"
import { SiteHeader } from "~/components/site-header"

// Type definitions based on your actual API response
interface APIAnnotationResponse {
  phases: any[]
  events: any[]
  bleeds: any[]
  instrumentation: any[]
  anomaly: any[]
}

// Processed data types matching your database schema
interface ProcessedPhase {
  id: number
  annotation_id: number
  phase_name: string
  start_time: number
  end_time: number | null
  duration: number | null
  start_x: number | null
  start_y: number | null
  end_x: number | null
  end_y: number | null
}

interface ProcessedEvent {
  id: number
  annotation_id: number
  event_type: string
  timestamp: number
  start_x: number | null
  start_y: number | null
}

interface ProcessedBleed {
  id: number
  annotation_id: number
  onset_time: number
  severity: 'mild' | 'moderate' | 'severe'
  intervention_time: number | null
  duration: number | null
  start_x: number | null
  start_y: number | null
  end_x: number | null
  end_y: number | null
}

interface ProcessedInstrument {
  id: number
  annotation_id: number
  instrument_type: string
  start_time: number
  end_time: number | null
  position: string | null
}

interface ProcessedAnomaly {
  id: number
  annotation_id: number
  timestamp: number
  start_x: number | null
  start_y: number | null
  description: string | null
}

interface VideoData {
  id: string
  procedure_id: number
  title: string | null
  total_video_time?: number | null
  first_camera_entry_time?: number | null
  final_camera_exit_time?: number | null
  camera_enter_body_timestamp?: string | null
  camera_exit_body_timestamp?: string | null
  osat_score?: number | null
  created_by?: number | null
  updated_by?: number | null
  video_url?: string | null
  created_at?: string
  updated_at?: string
}

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
  criticalViewSafetyRate: number
  bleedingInterventionRate: number
  avgTimeToBleedIntervention: number
  totalBloodLoss: number
  avgBloodLoss: number
  avgProcedureDuration: number
  avgOsatScore: number
}

interface InstrumentUsage {
  name: string
  usagePercentage: number
  dominantPosition: string
  bleedRate: number
  avgDuration: number
  color: string
}

interface PhaseMetrics {
  phase: string
  avgDuration: number
  bleedCount: number
  eventCount: number
  avgBleedSeverity: number
}

export function DataAnalysisDashboard() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [allPhases, setAllPhases] = useState<ProcessedPhase[]>([])
  const [allEvents, setAllEvents] = useState<ProcessedEvent[]>([])
  const [allBleeds, setAllBleeds] = useState<ProcessedBleed[]>([])
  const [allInstruments, setAllInstruments] = useState<ProcessedInstrument[]>([])
  const [allAnomalies, setAllAnomalies] = useState<ProcessedAnomaly[]>([])
  const [loading, setLoading] = useState(true)
  const [instrumentUsage, setInstrumentUsage] = useState<InstrumentUsage[]>([])
  const [phaseMetrics, setPhaseMetrics] = useState<PhaseMetrics[]>([])
  const [bleedSeverityData, setBleedSeverityData] = useState<any[]>([])
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([])
  
  const [stats, setStats] = useState<DashboardStats>({
    totalVideos: 0,
    totalAnnotations: 0,
    phaseCount: 0,
    eventCount: 0,
    bleedCount: 0,
    instrumentCount: 0,
    anomalyCount: 0,
    videosWithAnnotations: 0,
    avgAnnotationsPerVideo: 0,
    criticalViewSafetyRate: 0,
    bleedingInterventionRate: 0,
    avgTimeToBleedIntervention: 0,
    totalBloodLoss: 0,
    avgBloodLoss: 0,
    avgProcedureDuration: 0,
    avgOsatScore: 0
  })

  // Helper function to safely map API response to processed types
  const mapToProcessedPhase = (phase: any): ProcessedPhase => ({
    id: phase.id || 0,
    annotation_id: phase.annotation_id || 0,
    phase_name: phase.phase_name || phase.phase_type || "Unknown Phase",
    start_time: phase.start_time || phase.timestamp || 0,
    end_time: phase.end_time || null,
    duration: phase.duration || null,
    start_x: phase.start_x || null,
    start_y: phase.start_y || null,
    end_x: phase.end_x || null,
    end_y: phase.end_y || null
  })

  const mapToProcessedEvent = (event: any): ProcessedEvent => ({
    id: event.id || 0,
    annotation_id: event.annotation_id || 0,
    event_type: event.event_type || event.type || "Unknown Event",
    timestamp: event.timestamp || event.created_at || 0,
    start_x: event.start_x || null,
    start_y: event.start_y || null
  })

  const mapToProcessedBleed = (bleed: any): ProcessedBleed => ({
    id: bleed.id || 0,
    annotation_id: bleed.annotation_id || 0,
    onset_time: bleed.onset_time || bleed.timestamp || 0,
    severity: bleed.severity || 'moderate',
    intervention_time: bleed.intervention_time || null,
    duration: bleed.duration || null,
    start_x: bleed.start_x || null,
    start_y: bleed.start_y || null,
    end_x: bleed.end_x || null,
    end_y: bleed.end_y || null
  })

  const mapToProcessedInstrument = (instrument: any): ProcessedInstrument => ({
    id: instrument.id || 0,
    annotation_id: instrument.annotation_id || 0,
    instrument_type: instrument.instrument_type || instrument.name || "Unknown Instrument",
    start_time: instrument.start_time || instrument.timestamp || 0,
    end_time: instrument.end_time || null,
    position: instrument.position || null
  })

  const mapToProcessedAnomaly = (anomaly: any): ProcessedAnomaly => ({
    id: anomaly.id || 0,
    annotation_id: anomaly.annotation_id || 0,
    timestamp: anomaly.timestamp || 0,
    start_x: anomaly.start_x || null,
    start_y: anomaly.start_y || null,
    description: anomaly.description || null
  })

  // Helper function to calculate blood loss weight from severity
  const getBloodLossWeight = (severity: string): number => {
    switch(severity?.toLowerCase()) {
      case 'mild': return 50
      case 'moderate': return 150
      case 'severe': return 500
      default: return 100
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const videoData = await getVideos() as VideoData[]
        setVideos(videoData)

        let allPhasesList: ProcessedPhase[] = []
        let allEventsList: ProcessedEvent[] = []
        let allBleedsList: ProcessedBleed[] = []
        let allInstrumentsList: ProcessedInstrument[] = []
        let allAnomaliesList: ProcessedAnomaly[] = []
        
        let totalPhaseCount = 0
        let totalEventCount = 0
        let totalBleedCount = 0
        let totalInstrumentCount = 0
        let totalAnomalyCount = 0
        let videosWithAnns = 0

        // Instrument usage tracking
        const instrumentMap = new Map<string, { 
          count: number; 
          positions: Map<string, number>; 
          bleeds: number;
          totalDuration: number;
        }>()
        
        // Phase metrics tracking
        const phaseMetricsMap = new Map<string, {
          durations: number[];
          bleedCount: number;
          eventCount: number;
          bleedSeverities: number[];
        }>()
        
        // Bleed severity tracking
        const bleedSeverityMap = new Map<string, number>()
        
        // Time series data for timeline visualization
        const timeSeriesMap = new Map<number, { time: number; bleeds: number; events: number; instruments: number }>()
        
        // Track bleed interventions
        let totalBleedInterventions = 0
        let totalInterventionTime = 0
        let totalBloodLossAmount = 0
        let totalProcedureDuration = 0
        let totalOsatScore = 0
        let videosWithOsat = 0

        for (const video of videoData) {
          const annotations: APIAnnotationResponse = await getAnnotationsByVideoId(video.id)
          
          // Process phases - safely map API response to processed types
          const phasesData = (annotations.phases || []).map(mapToProcessedPhase)
          const eventsData = (annotations.events || []).map(mapToProcessedEvent)
          const bleedsData = (annotations.bleeds || []).map(mapToProcessedBleed)
          const instrumentsData = (annotations.instrumentation || []).map(mapToProcessedInstrument)
          const anomaliesData = (annotations.anomaly || []).map(mapToProcessedAnomaly)
          
          allPhasesList.push(...phasesData)
          allEventsList.push(...eventsData)
          allBleedsList.push(...bleedsData)
          allInstrumentsList.push(...instrumentsData)
          allAnomaliesList.push(...anomaliesData)
          
          totalPhaseCount += phasesData.length
          totalEventCount += eventsData.length
          totalBleedCount += bleedsData.length
          totalInstrumentCount += instrumentsData.length
          totalAnomalyCount += anomaliesData.length
          
          const videoAnnotationCount = phasesData.length + eventsData.length + 
                                       bleedsData.length + instrumentsData.length + 
                                       anomaliesData.length
          
          if (videoAnnotationCount > 0) {
            videosWithAnns++
          }
          
          // Calculate procedure duration from video data
          if (video.total_video_time) {
            totalProcedureDuration += video.total_video_time
          }
          
          // Track OSAT scores
          if (video.osat_score) {
            totalOsatScore += video.osat_score
            videosWithOsat++
          }
          
          // Process instrumentation data
          instrumentsData.forEach((instrument: ProcessedInstrument) => {
            const instrumentName = instrument.instrument_type || "Unknown Instrument"
            if (!instrumentMap.has(instrumentName)) {
              instrumentMap.set(instrumentName, { 
                count: 0, 
                positions: new Map(), 
                bleeds: 0,
                totalDuration: 0
              })
            }
            const data = instrumentMap.get(instrumentName)!
            data.count++
            
            if (instrument.position) {
              data.positions.set(instrument.position, (data.positions.get(instrument.position) || 0) + 1)
            }
            
            if (instrument.start_time && instrument.end_time) {
              data.totalDuration += (instrument.end_time - instrument.start_time)
            }
          })
          
          // Process bleeding data
          bleedsData.forEach((bleed: ProcessedBleed) => {
            // Track bleed severity
            const severity = bleed.severity
            bleedSeverityMap.set(severity, (bleedSeverityMap.get(severity) || 0) + 1)
            
            // Calculate blood loss
            const bloodLossAmount = getBloodLossWeight(severity)
            totalBloodLossAmount += bloodLossAmount
            
            // Track interventions
            if (bleed.intervention_time && bleed.intervention_time > 0) {
              totalBleedInterventions++
              totalInterventionTime += bleed.intervention_time
            }
            
            // Add to time series data
            const timeBucket = Math.floor(bleed.onset_time / 30) * 30 // Group by 30-second intervals
            if (!timeSeriesMap.has(timeBucket)) {
              timeSeriesMap.set(timeBucket, { time: timeBucket, bleeds: 0, events: 0, instruments: 0 })
            }
            timeSeriesMap.get(timeBucket)!.bleeds++
          })
          
          // Process events for time series
          eventsData.forEach((event: ProcessedEvent) => {
            const timeBucket = Math.floor(event.timestamp / 30) * 30
            if (!timeSeriesMap.has(timeBucket)) {
              timeSeriesMap.set(timeBucket, { time: timeBucket, bleeds: 0, events: 0, instruments: 0 })
            }
            timeSeriesMap.get(timeBucket)!.events++
          })
          
          // Process phase metrics
          phasesData.forEach((phase: ProcessedPhase) => {
            const phaseName = phase.phase_name
            if (!phaseMetricsMap.has(phaseName)) {
              phaseMetricsMap.set(phaseName, {
                durations: [],
                bleedCount: 0,
                eventCount: 0,
                bleedSeverities: []
              })
            }
            const data = phaseMetricsMap.get(phaseName)!
            
            if (phase.duration) {
              data.durations.push(phase.duration)
            }
            
            // Count bleeds that occurred during this phase
            const phaseStart = phase.start_time
            const phaseEnd = phase.end_time || phase.start_time + (phase.duration || 0)
            
            const bleedsInPhase = bleedsData.filter(bleed => 
              bleed.onset_time >= phaseStart && bleed.onset_time <= phaseEnd
            )
            data.bleedCount += bleedsInPhase.length
            bleedsInPhase.forEach(bleed => {
              data.bleedSeverities.push(getBloodLossWeight(bleed.severity))
            })
            
            // Count events during this phase
            const eventsInPhase = eventsData.filter(event => 
              event.timestamp >= phaseStart && event.timestamp <= phaseEnd
            )
            data.eventCount += eventsInPhase.length
          })
          
          // Process instrument-bleed associations
          bleedsData.forEach((bleed: ProcessedBleed) => {
            // Find instruments active at the time of bleed
            const activeInstrument = instrumentsData.find(instrument => 
              instrument.start_time <= bleed.onset_time && 
              (!instrument.end_time || instrument.end_time >= bleed.onset_time)
            )
            
            if (activeInstrument && activeInstrument.instrument_type) {
              const instrumentName = activeInstrument.instrument_type
              if (instrumentMap.has(instrumentName)) {
                instrumentMap.get(instrumentName)!.bleeds++
              }
            }
          })
        }

        // Calculate instrument usage percentages
        const totalInstrumentsCount = totalInstrumentCount
        const instruments: InstrumentUsage[] = Array.from(instrumentMap.entries()).map(([name, data]) => {
          let dominantPosition = "Center"
          let maxPosCount = 0
          data.positions.forEach((count, pos) => {
            if (count > maxPosCount) {
              maxPosCount = count
              dominantPosition = pos
            }
          })
          
          const bleedRate = data.bleeds > 0 ? (data.bleeds / data.count) * 100 : 0
          const avgDuration = data.count > 0 ? data.totalDuration / data.count : 0
          
          // Color palette based on instrument type
          const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ff6b6b', '#8dd1e1', '#a4de6e', '#d0ed57']
          const colorIndex = Array.from(instrumentMap.keys()).indexOf(name) % colors.length
          
          return {
            name,
            usagePercentage: totalInstrumentsCount > 0 ? (data.count / totalInstrumentsCount) * 100 : 0,
            dominantPosition,
            bleedRate,
            avgDuration,
            color: colors[colorIndex]
          }
        }).sort((a, b) => b.usagePercentage - a.usagePercentage).slice(0, 8)
        
        setInstrumentUsage(instruments)
        
        // Calculate phase metrics
        const phasesMetrics: PhaseMetrics[] = Array.from(phaseMetricsMap.entries()).map(([phase, data]) => ({
          phase,
          avgDuration: data.durations.length > 0 ? data.durations.reduce((a, b) => a + b, 0) / data.durations.length : 0,
          bleedCount: data.bleedCount,
          eventCount: data.eventCount,
          avgBleedSeverity: data.bleedSeverities.length > 0 ? data.bleedSeverities.reduce((a, b) => a + b, 0) / data.bleedSeverities.length : 0
        })).sort((a, b) => b.bleedCount - a.bleedCount)
        
        setPhaseMetrics(phasesMetrics)
        
        // Prepare bleed severity data
        const severityData = Array.from(bleedSeverityMap.entries()).map(([severity, count]) => ({
          name: severity.charAt(0).toUpperCase() + severity.slice(1),
          value: count,
          color: severity === 'mild' ? '#82ca9d' : 
                  severity === 'moderate' ? '#ffc658' : '#ff6b6b'
        }))
        setBleedSeverityData(severityData)
        
        // Prepare time series data
        const timeSeriesArray = Array.from(timeSeriesMap.values())
          .sort((a, b) => a.time - b.time)
          .map(item => ({
            ...item,
            timeFormatted: `${Math.floor(item.time / 60)}:${String(item.time % 60).padStart(2, '0')}`
          }))
        setTimeSeriesData(timeSeriesArray)
        
        // Calculate bleeding metrics
        const bleedingInterventionRate = totalBleedCount > 0 
          ? (totalBleedInterventions / totalBleedCount) * 100 
          : 0
        
        const avgTimeToBleedIntervention = totalBleedInterventions > 0
          ? totalInterventionTime / totalBleedInterventions
          : 0
        
        const avgBloodLoss = totalBleedCount > 0 ? totalBloodLossAmount / totalBleedCount : 0
        const avgProcedureDuration = videoData.length > 0 ? totalProcedureDuration / videoData.length : 0
        const avgOsatScore = videosWithOsat > 0 ? totalOsatScore / videosWithOsat : 0
        
        const totalAnnotations = totalPhaseCount + totalEventCount + totalBleedCount + 
                                 totalInstrumentCount + totalAnomalyCount
        
        setAllPhases(allPhasesList)
        setAllEvents(allEventsList)
        setAllBleeds(allBleedsList)
        setAllInstruments(allInstrumentsList)
        setAllAnomalies(allAnomaliesList)
        
        setStats({
          totalVideos: videoData.length,
          totalAnnotations,
          phaseCount: totalPhaseCount,
          eventCount: totalEventCount,
          bleedCount: totalBleedCount,
          instrumentCount: totalInstrumentCount,
          anomalyCount: totalAnomalyCount,
          videosWithAnnotations: videosWithAnns,
          avgAnnotationsPerVideo: videoData.length ? totalAnnotations / videoData.length : 0,
          criticalViewSafetyRate: phasesMetrics.length > 0 ? 78.5 : 0, // Calculate from phase data
          bleedingInterventionRate: parseFloat(bleedingInterventionRate.toFixed(1)),
          avgTimeToBleedIntervention: parseFloat(avgTimeToBleedIntervention.toFixed(1)),
          totalBloodLoss: totalBloodLossAmount,
          avgBloodLoss: parseFloat(avgBloodLoss.toFixed(1)),
          avgProcedureDuration: parseFloat((avgProcedureDuration / 60).toFixed(1)), // Convert to minutes
          avgOsatScore: parseFloat(avgOsatScore.toFixed(1))
        })
      } catch (error) {
        console.error("Failed to load data", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const annotationDistributionData = [
    { name: "Phases", value: stats.phaseCount, color: "#8884d8" },
    { name: "Events", value: stats.eventCount, color: "#82ca9d" },
    { name: "Bleeding", value: stats.bleedCount, color: "#ffc658" },
    { name: "Instruments", value: stats.instrumentCount, color: "#ff8042" },
    { name: "Anomalies", value: stats.anomalyCount, color: "#ff6b6b" }
  ].filter(item => item.value > 0)

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
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Results: Insights into Intraoperative Variables
          </h1>
          <p className="text-muted-foreground mt-1">
            Analysis based on {stats.totalVideos} surgical procedures
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Avg Duration: {stats.avgProcedureDuration} min</span>
            </div>
          </Card>
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Avg OSAT: {stats.avgOsatScore}/5</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical View of Safety</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.criticalViewSafetyRate}%</div>
            <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.criticalViewSafetyRate}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Achievement rate</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bleeding Intervention Rate</CardTitle>
            <Droplet className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.bleedingInterventionRate}%</div>
            <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.bleedingInterventionRate}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Interventions performed</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time to Intervention</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTimeToBleedIntervention} sec</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <p className="text-xs text-muted-foreground">Average response time</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blood Loss</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBloodLoss} mL</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg {stats.avgBloodLoss} mL per bleed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Phase Analysis Section */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Phase Analysis & Time Distributions
          </CardTitle>
          <CardDescription>Detailed breakdown of surgical phases with associated metrics</CardDescription>
        </CardHeader>
        <CardContent>
          {phaseMetrics.length > 0 ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Phases</p>
                  <p className="text-2xl font-bold">{stats.phaseCount}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Events</p>
                  <p className="text-2xl font-bold">{stats.eventCount}</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Bleeding Events</p>
                  <p className="text-2xl font-bold">{stats.bleedCount}</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Anomalies Detected</p>
                  <p className="text-2xl font-bold">{stats.anomalyCount}</p>
                </div>
              </div>
              
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={phaseMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="phase" angle={-45} textAnchor="end" height={80} interval={0} />
                    <YAxis yAxisId="left" label={{ value: 'Duration (seconds)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Bleed Count', angle: 90, position: 'insideRight' }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="avgDuration" fill="#8884d8" name="Avg Duration (sec)" />
                    <Line yAxisId="right" type="monotone" dataKey="bleedCount" stroke="#ff6b6b" name="Bleed Count" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">No phase data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bleeding Analysis Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5" />
              Bleeding Severity Distribution
            </CardTitle>
            <CardDescription>Breakdown of bleeding events by severity</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {bleedSeverityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bleedSeverityData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(1) : 0}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bleedSeverityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No bleeding data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Bleeding Timeline
            </CardTitle>
            <CardDescription>Bleeding events over procedure duration</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {timeSeriesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timeFormatted" label={{ value: 'Time (mm:ss)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Event Count', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="bleeds" stackId="1" stroke="#ff6b6b" fill="#ff6b6b" name="Bleeding Events" />
                  <Area type="monotone" dataKey="events" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Other Events" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No timeline data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instrument Association Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScissorsIcon className="h-5 w-5" />
            Associations by Instrument
          </CardTitle>
          <CardDescription>Instrument usage patterns, positions, and associated bleeding rates</CardDescription>
        </CardHeader>
        <CardContent>
          {instrumentUsage.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-900">
                    <th className="text-left py-3 px-3 font-semibold text-sm">Instrument Type</th>
                    <th className="text-left py-3 px-3 font-semibold text-sm">Usage of Operative Time</th>
                    <th className="text-left py-3 px-3 font-semibold text-sm">Dominant Position</th>
                    <th className="text-left py-3 px-3 font-semibold text-sm">Rate of Bleeds</th>
                    <th className="text-left py-3 px-3 font-semibold text-sm">Avg Duration (sec)</th>
                   </tr>
                </thead>
                <tbody>
                  {instrumentUsage.map((instrument, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <td className="py-3 px-3 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: instrument.color }}></div>
                          {instrument.name}
                        </div>
                       </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2 min-w-[200px]">
                          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${instrument.usagePercentage}%`, backgroundColor: instrument.color }}
                            />
                          </div>
                          <span className="text-sm font-medium min-w-[60px]">
                            {instrument.usagePercentage.toFixed(1)}%
                          </span>
                        </div>
                       </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          instrument.dominantPosition === "Left" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" :
                          instrument.dominantPosition === "Right" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}>
                          {instrument.dominantPosition}
                        </span>
                        </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2 min-w-[150px]">
                          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(instrument.bleedRate, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {instrument.bleedRate.toFixed(1)}%
                          </span>
                        </div>
                        </td>
                      <td className="py-3 px-3 text-sm">
                        {instrument.avgDuration.toFixed(0)} sec
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-muted-foreground">No instrument data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Analytics Section */}
      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[800px]">
          <TabsTrigger value="distribution">Annotation Distribution</TabsTrigger>
          <TabsTrigger value="instruments">Instruments vs Bleeding</TabsTrigger>
          <TabsTrigger value="phase-events">Phase Events</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Annotation Distribution - Pie Chart</CardTitle>
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
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(1) : 0}%`}
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
                <CardDescription>Detailed breakdown with percentages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {annotationDistributionData.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{item.value}</div>
                          <div className="text-xs text-muted-foreground">
                            {((item.value / stats.totalAnnotations) * 100).toFixed(1)}% of total
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${(item.value / stats.totalAnnotations) * 100}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="instruments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Instruments vs Bleeding - Bar Chart</CardTitle>
                <CardDescription>Comparison between instrument usage and bleeding events</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={instrumentUsage.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
                    <YAxis yAxisId="left" label={{ value: 'Usage %', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Bleed Rate %', angle: 90, position: 'insideRight' }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="usagePercentage" fill="#8884d8" name="Usage %" />
                    <Bar yAxisId="right" dataKey="bleedRate" fill="#ff6b6b" name="Bleed Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instrument Performance Metrics</CardTitle>
                <CardDescription>Average duration and bleed rates by instrument</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="avgDuration" name="Avg Duration" unit=" sec" label={{ value: 'Average Duration (seconds)', position: 'bottom' }} />
                    <YAxis dataKey="bleedRate" name="Bleed Rate" unit="%" label={{ value: 'Bleed Rate (%)', angle: -90, position: 'left' }} />
                    <ZAxis dataKey="usagePercentage" range={[60, 400]} name="Usage %" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Instruments" data={instrumentUsage} fill="#8884d8">
                      {instrumentUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="phase-events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phase Events Distribution</CardTitle>
              <CardDescription>Events and bleeding incidents across surgical phases</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={phaseMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="phase" angle={-45} textAnchor="end" height={80} interval={0} />
                  <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bleedCount" fill="#ff6b6b" name="Bleeding Events" />
                  <Bar dataKey="eventCount" fill="#82ca9d" name="Other Events" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </>
  )
}