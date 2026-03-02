# Quick Test: Enable Live Presenter

To test the live presenter feature, uncomment this example in [src/data/live-sessions.ts](src/data/live-sessions.ts):

```typescript
"1": {
  enabled: true,  // ← Uncomment and set to true
  platform: "openmeeting",
  meetingUrl: "https://openmeeting.space/medicare-basics",
  presenterName: "Debbie Thompson",
  autoOpen: false,
},
```

Then visit: http://localhost:3000/certification/1

You'll see a "Live Session" button in the bottom-right corner!

---

## Quick Platform URLs for Testing

**openmeeting.space (Recommended for testing):**
```
https://openmeeting.space/test-room
```

**Zoom (if you have a test meeting):**
```
https://zoom.us/j/YOUR_MEETING_ID
```

**Test with a demo video:**
You can temporarily use any embed-friendly video URL to test the UI:
```typescript
meetingUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
```
