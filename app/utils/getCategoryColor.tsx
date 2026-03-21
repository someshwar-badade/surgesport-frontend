export const getCategoryColor = (category: string) => {
  switch (category) {
    case "phases":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "events":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "bleeds":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "instrumentation":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    case "anomaly":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    default:
      return "bg-gray-400 text-white"
  }
}