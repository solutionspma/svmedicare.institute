# Live Presenter/Facilitator Window Setup

This feature allows you to add live video conferencing to any certification module, enabling real-time instruction via Zoom, Microsoft Teams, Cisco WebEx, or openmeeting.space.

## Overview

When enabled, a "Live Session" button appears on the module page. Students can click to join the live presentation in a floating window that overlays the content, or open it in the native app.

## Supported Platforms

- **Zoom** - Full embed support
- **Microsoft Teams** - Full embed support  
- **Cisco WebEx** - Full embed support
- **openmeeting.space** - Full embed support (your platform!)

## Quick Start

### 1. Enable a Live Session

Open [src/data/live-sessions.ts](src/data/live-sessions.ts) and find the module you want:

```typescript
export const LIVE_SESSIONS: Record<string, LiveSession> = {
  "1": {
    enabled: true,  // ← Set to true
    platform: "openmeeting",  // Choose: zoom | teams | cisco | openmeeting
    meetingUrl: "https://openmeeting.space/medicare-basics",
    presenterName: "Debbie Thompson",
    autoOpen: false,  // Set true to auto-open the presenter window
  },
  // ... other modules
};
```

### 2. Configure Your Meeting URL

Each platform has different URL formats:

**Zoom:**
```typescript
meetingUrl: "https://zoom.us/j/123456789?pwd=abc123"
// Will auto-convert to embed format
```

**Microsoft Teams:**
```typescript
meetingUrl: "https://teams.microsoft.com/l/meetup-join/..."
// Use the Teams meeting link
```

**Cisco WebEx:**
```typescript
meetingUrl: "https://yourcompany.webex.com/meet/instructor"
// Will auto-convert to embed format
```

**openmeeting.space:**
```typescript
meetingUrl: "https://openmeeting.space/your-room-name"
// Will auto-add embed parameter
```

### 3. Test Your Session

1. Start your dev server: `npm run dev`
2. Navigate to the module page (e.g., `/certification/1`)
3. You should see a floating "Live Session" button in the bottom-right
4. Click to join the live session

## Advanced Features

### Scheduled Sessions

You can schedule sessions to only appear during specific times:

```typescript
"1": {
  enabled: true,
  platform: "openmeeting",
  meetingUrl: "https://openmeeting.space/medicare-basics",
  presenterName: "Debbie Thompson",
  scheduledTime: "2026-03-15T10:00:00",  // Session start (ISO 8601)
  scheduledEnd: "2026-03-15T11:30:00",   // Session end
  autoOpen: false,
}
```

**Benefits:**
- Session only shows 15 minutes before start time
- Automatically hides after end time
- No manual enable/disable needed

### Auto-Open Mode

Set `autoOpen: true` to automatically open the presenter window when students land on the module page:

```typescript
autoOpen: true,  // Opens immediately (great for scheduled class times)
```

## Presenter Window Features

### For Students:

- **Minimize** - Click the minimize button to shrink the window to a corner badge
- **Maximize** - Click the minimized badge to restore full window
- **Leave** - Click X to close and return to self-paced learning
- **Open in App** - Footer link to open in native app (Zoom, Teams, etc.)

### Visual States:

- 🔴 **Live indicator** - Red pulsing dot shows session is active
- **Platform badge** - Shows which platform (Zoom, Teams, etc.)
- **Presenter name** - Displays who's teaching
- **Responsive design** - Works on desktop, tablet, mobile

## Platform-Specific Setup

### Zoom

1. Start or schedule a Zoom meeting
2. Copy the meeting URL: `https://zoom.us/j/123456789?pwd=...`
3. Paste into `meetingUrl` field
4. Enable the meeting embed option in Zoom settings (if not already enabled)

**Note:** Some Zoom accounts may restrict embedding. Check your Zoom account settings under "In Meeting (Advanced)" → "Allow participants to join from web browser"

### Microsoft Teams

1. Schedule a Teams meeting
2. Copy the meeting join link
3. Paste into `meetingUrl` field
4. Teams will embed directly

**Note:** External participants may need to download Teams app depending on your org settings

### Cisco WebEx

1. Start or schedule a WebEx meeting
2. Copy your personal room URL or meeting URL
3. Paste into `meetingUrl` field
4. Component will auto-convert to embed format

### openmeeting.space

1. Create a room on openmeeting.space
2. Copy the room URL
3. Paste into `meetingUrl` field
4. Component will auto-add embed parameter

**Pro tip:** openmeeting.space offers the best embed experience with no permission restrictions!

## Example Configurations

### Weekly Office Hours

```typescript
"1": {
  enabled: true,
  platform: "openmeeting",
  meetingUrl: "https://openmeeting.space/weekly-office-hours",
  presenterName: "Medicare Advisor Team",
  scheduledTime: "2026-03-15T14:00:00",  // Every Friday 2pm
  scheduledEnd: "2026-03-15T15:00:00",
  autoOpen: false,
}
```

### Live Certification Workshop

```typescript
"2": {
  enabled: true,
  platform: "zoom",
  meetingUrl: "https://zoom.us/j/987654321?pwd=xyz",
  presenterName: "Dr. Sarah Medicare",
  scheduledTime: "2026-03-20T09:00:00",  // Full-day workshop
  scheduledEnd: "2026-03-20T17:00:00",
  autoOpen: true,  // Auto-opens for workshop attendees
}
```

### Always-Available Drop-In

```typescript
"3": {
  enabled: true,
  platform: "openmeeting",
  meetingUrl: "https://openmeeting.space/compliance-help-desk",
  presenterName: "Compliance Team",
  autoOpen: false,
  // No schedule - always available
}
```

## Disabling Live Sessions

To disable a live session:

```typescript
"1": {
  enabled: false,  // ← Set to false
  // ... rest of config
}
```

The live session button will not appear on the module page.

## Styling & Customization

The presenter window automatically matches your site's dark cinematic theme with gold accents. It uses:

- Platform-specific color gradients
- Animated live indicators
- Smooth transitions
- Responsive breakpoints

To customize, edit [src/components/PresenterWindow.tsx](src/components/PresenterWindow.tsx)

## Troubleshooting

**"Cannot embed this meeting"**
- Check platform embed permissions in account settings
- Some enterprise accounts restrict embedding
- Try opening in native app instead

**Video not loading**
- Check meeting URL is correct and active
- Verify meeting hasn't expired
- Check browser console for errors
- Some platforms require authentication

**Button doesn't appear**
- Verify `enabled: true` in live-sessions.ts
- Check if session is within scheduled time window
- Refresh the page

**Window appears but is blank**
- Meeting may not have started yet
- Check meeting URL in new tab to verify it works
- Some platforms require host to start first

## Security Considerations

- Meeting URLs in code are visible to users (view source)
- Use password-protected meetings for sensitive content
- Consider using scheduled sessions with limited time windows
- openmeeting.space allows room-level access control

## Production Deployment

The live-sessions.ts configuration file is committed to your repo, so:

1. Update URLs before deployment
2. Use production meeting rooms (not test rooms)
3. Test on staging first
4. Consider environment variables for meeting URLs if needed

## Future Enhancements

Potential additions:
- Admin UI to enable/disable sessions without code changes
- Supabase integration for dynamic session management
- Recording availability after live session
- Attendance tracking
- Chat integration outside the video window

---

**Questions?** Check the component implementation in [PresenterWindow.tsx](src/components/PresenterWindow.tsx)
