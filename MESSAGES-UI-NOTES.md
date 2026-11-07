# Messages UI refresh

The fourth supplied reference informed the layout: a compact conversation list, central chat, and a separate details rail. SilipMunti's existing blue/white/yellow colors remain. No sales counts, ratings, or other unprovided data were invented.

## Changes

- Added messages-design.css, scoped to the Messages page, and messages-presentation.js for layout/accessibility only.
- Existing user/conversation information appears in a right sidebar on screens wider than 1200px. The existing property summary element moves into that sidebar; it is not duplicated and keeps all original IDs and data bindings. Closing the sidebar returns the summary above the chat.
- On tablets and phones, details use the existing overlay panel, with an explicit Details button, Escape dismissal, and keyboard access to the existing profile-click action.
- Sidebar automatically opens for an initial desktop conversation or a desktop conversation selection. The user can still close it. Mobile keeps the original conversation-list/chat back-navigation behavior.
- Page height follows the actual shared navbar height so the composer stays in view.
- Refined conversation rows, filters, compact message bubbles, timestamps, reply quotes, and composer. Yellow highlights the existing property action and unread counts.
- Floating chat windows use matching styling. Conversation list now has a flex layout so its footer stays at the bottom and the list can scroll. Mobile widget selection still opens the full Messages page, matching the original behavior.
- Updated chat stylesheet cache versions on pages that include it.

## Preservation

All original application JavaScript files, including messages.js, chat-bubble.js, session.js, and the API integrations, remain unchanged. All existing message-page IDs and controls remain. The new script invokes the existing information-panel UI functions; it does not send requests or change authentication, message storage, polling, or inquiry status rules.

## Validation

Chromium with local mock API responses at 320, 390, 440, 768, 1024, 1440 and 1920px: initial chat, document width, visible composer, desktop three columns, sidebar toggle/Escape, reply/cancel, sending the original request payload, conversation search, closed inquiry notice and hidden composer, and mobile back navigation. Floating-widget checks at 390 and 1440px verified footer anchoring, desktop mini-chat and the existing mobile Messages-page navigation. No uncaught page errors were observed. New HTML/CSS resource references were inspected; messages-presentation.js passes node --check.

These are frontend tests with test-only data, not verification against real accounts or a production backend. Test the installed project with real renter and landlord accounts before deployment.

## Install

Merge frontend/ into the existing project and hard-refresh. Keep the existing backend and database. The essential changes are pages/messages/index.html, assets/css/messages-design.css, assets/js/messages-presentation.js and assets/css/chat-bubble.css. Other HTML changes only refresh the chat stylesheet version. All earlier UI/landlord fixes are retained in the repository ZIP.
