# Planning

## features

- [x] pan image
- [x] open a single door
- [x] create title state
- [x] open multiple doors
- [x] support yt videos
- [x] play-btn on the door content
- [x] implement content loading strategy
- [x] build the background completely before lifting
- [x] restrict door access
- [x] content image passepartout
- [x] remember which doors are open
- [x] blur out edges of calendar to white
- [x] snow animations
- [x] play door sounds
- [x] play wind background sound
- [x] reveal calendar via slide
- [x] add sound-toggle in the calendar corner
- [x] start versioning releases
- [x] toggle full-screen view
- [ ] support animations
- [ ] is there a way to reduce yt ads?
- [ ] remember last scroll position
- [ ] find more appropriate font
- [ ] put placeholder image in media player (w/shadow)
- [ ] fade master gain on cancel
- [ ] add navigation indicators to pan container
- [ ] add full ambient soundscape
- [ ] settings section with storage reset and sounds on/off
- [ ] move css for title state into html
- [ ] load different images depending on resolution
- [ ] estimate network connection speed
- [ ] HTTP 2
- [ ] loudness / speaker test
- [ ] strategy for contact / copyright / cookies
- [ ] error handling
- [ ] create a PWA
- [ ] js-disabled message
- [ ] audio: loudness adjustments
- [ ] optimize media for download
- [ ] hide snowflakes behind clouds layer
- [ ] glow behind active unopened doors
- [ ] feedback when trying to open future doors
- [ ] ensure timezone / day switch works

## production

- [ ] get a domain
- [ ] disable opening doors in november

## bugs

- [x] remove active flag after usage
- [x] allow progress bar an initial transition
- [x] provide fallback if thumnails not yet loaded
- [x] fix flickering before calendar rendering
- [x] reveal calendar without flickering even on re-focussing tab
- [x] show content thumbnails while curtain is lifting
- [ ] don't play obsolete sound effects after audio resume

## refactorings

- [ ] use calendar class to keep track of doors
- [ ] move css button:active styling into the toggles

## assets

```yml
- ui / ux:
    - title and loading screen
      - with loudness / speaker test ?
    - texts

- images:
    - calendar image
    - [doors]
    - title graphics
    - favicon
    - page background (?)
    - audio player icons/buttons

- audio:
    - doors
    - clicks
    - ambience

- packages:
    - music + images + info
```

## decisions

- [x] One canonical-size image, pixel-perfect interactions, no retina support
- [x] Once a door is open, it stays open
- [x] All items will be videos, streamed via youtube
- [x] Weirdly long screens see the calandar image at the top, not centered
- [ ] does a speaker test make sense?
