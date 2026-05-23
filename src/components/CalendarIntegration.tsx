import { useState } from 'react'
import { X, Calendar, Clock, MapPin, Download } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  location: string
  description: string
}

interface CalendarIntegrationProps {
  isOpen: boolean
  onClose: () => void
  matchData?: {
    teamA: string
    teamB: string
    date: string
    time: string
    venue: string
    tournament: string
  }
}

export function CalendarIntegration({ isOpen, onClose, matchData }: CalendarIntegrationProps) {
  const [addedToCalendar, setAddedToCalendar] = useState(false)

  const addToGoogleCalendar = () => {
    if (!matchData) return

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: `${matchData.teamA} vs ${matchData.teamB} - ${matchData.tournament}`,
      start: new Date(`${matchData.date}T${matchData.time}`),
      end: new Date(`${matchData.date}T${matchData.time}`),
      location: matchData.venue,
      description: `Live match: ${matchData.teamA} vs ${matchData.teamB}\nTournament: ${matchData.tournament}\nVenue: ${matchData.venue}`,
    }

    const startTime = event.start.toISOString().replace(/-|:|\.\d\d\d/g, '')
    const endTime = event.end.toISOString().replace(/-|:|\.\d\d\d/g, '')

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`

    window.open(url, '_blank')
    setAddedToCalendar(true)
    setTimeout(() => setAddedToCalendar(false), 3000)
  }

  const addToOutlookCalendar = () => {
    if (!matchData) return

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: `${matchData.teamA} vs ${matchData.teamB} - ${matchData.tournament}`,
      start: new Date(`${matchData.date}T${matchData.time}`),
      end: new Date(`${matchData.date}T${matchData.time}`),
      location: matchData.venue,
      description: `Live match: ${matchData.teamA} vs ${matchData.teamB}\nTournament: ${matchData.tournament}\nVenue: ${matchData.venue}`,
    }

    const startTime = event.start.toISOString()
    const endTime = event.end.toISOString()

    const url = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${startTime}&enddt=${endTime}&location=${encodeURIComponent(event.location)}&body=${encodeURIComponent(event.description)}`

    window.open(url, '_blank')
    setAddedToCalendar(true)
    setTimeout(() => setAddedToCalendar(false), 3000)
  }

  const downloadICS = () => {
    if (!matchData) return

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: `${matchData.teamA} vs ${matchData.teamB} - ${matchData.tournament}`,
      start: new Date(`${matchData.date}T${matchData.time}`),
      end: new Date(`${matchData.date}T${matchData.time}`),
      location: matchData.venue,
      description: `Live match: ${matchData.teamA} vs ${matchData.teamB}\nTournament: ${matchData.tournament}\nVenue: ${matchData.venue}`,
    }

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Strider Live//Sports Calendar//EN
BEGIN:VEVENT
UID:${event.id}@strider.live
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(event.start)}
DTEND:${formatDate(event.end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'match-event.ics'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    setAddedToCalendar(true)
    setTimeout(() => setAddedToCalendar(false), 3000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-strong rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-white">Add to Calendar</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {matchData && (
          <div className="p-6">
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="text-lg font-bold text-white mb-2">
                {matchData.teamA} vs {matchData.teamB}
              </h4>
              <p className="text-sm text-slate-400 mb-3">{matchData.tournament}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  <span>{matchData.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>{matchData.time}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span>{matchData.venue}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={addToGoogleCalendar}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 transition-all group"
              >
                <div className="h-6 w-6 rounded bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span className="text-white font-medium">Google Calendar</span>
              </button>

              <button
                type="button"
                onClick={addToOutlookCalendar}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 transition-all"
              >
                <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">O</span>
                </div>
                <span className="text-white font-medium">Outlook Calendar</span>
              </button>

              <button
                type="button"
                onClick={downloadICS}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 transition-all"
              >
                <Download className="h-5 w-5 text-slate-400 group-hover:text-emerald-400" />
                <span className="text-white font-medium">Download .ICS File</span>
              </button>
            </div>

            {addedToCalendar && (
              <div className="mt-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-center">
                <p className="text-sm text-emerald-400">Added to calendar successfully!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
