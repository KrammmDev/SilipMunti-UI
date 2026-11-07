# Chat profile-picture fix

This update restores the messaging design from before the last redesign and fixes profile-picture data/selection. Earlier general UI and landlord-profile fixes remain.

## Root cause

The repository's backend/inquiries/get-inquiries.php returned the other user's ID, name and role without their profile picture. The conversation list used that response, and the full Messages header continued to read its picture from the older inquiry object even when get-messages.php returned a photo. This explains why individual message avatars could work while the list and header showed a default avatar.

## Changes

- get-inquiries.php selects the existing renter/landlord profile_picture columns and includes the counterpart's profile_picture and profile_picture_url in other_user. The authenticated renter still receives only their landlord counterpart; the landlord receives only their renter counterpart. Authentication, account filtering, database schema and inquiry/message operations are unchanged.
- messages.js and chat-bubble.js prefer the provided profile_picture_url, support the existing relative profile_picture format, and use the fresh message response for the header/mini-chat. Message avatars also accept profile_picture_url.
- Missing or broken profile images use the default profile avatar, rather than a listing photograph.
- HTML script versions are bumped for the two fixed scripts. The last messaging-design CSS/script and its notes are removed from this delivery; the previous messages markup/chat styling is restored.

## Install (important)

Back up the current files. This repository contains the updated frontend plus ONE backend endpoint, not a complete backend.

Copy these into the existing SilipMunti project:

1. backend/inquiries/get-inquiries.php
2. frontend/assets/js/messages.js
3. frontend/assets/js/chat-bubble.js
4. frontend/pages/messages/index.html (restores the previous design and updates its script version)
5. frontend/assets/css/chat-bubble.css (restores the previous floating-chat design)

Merge the other HTML files if you want their updated chat script version links, then hard-refresh the browser. Do not replace/delete your whole backend folder. If you already installed the last redesign, restoring the Messages HTML removes its extra stylesheet/script references; unused messages-design.css and messages-presentation.js files may remain locally but are no longer loaded.

## Verification and limits

JavaScript syntax checks run with node --check. Local browser tests use fixture API responses and test avatar image URLs for renter/landlord accounts, raw relative/root-relative/URL-only paths, fresh message responses, and missing/broken-image fallbacks. No real accounts or production messages are used.

The PHP change was inspected against the repository endpoint, but PHP/MySQL are not available in this workspace, so the live endpoint and actual stored image files must be checked in the installed project. An image file deleted from the server cannot be recovered by this fix; the default avatar remains appropriate in that case.
