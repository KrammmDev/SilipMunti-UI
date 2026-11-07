# Create-listing multiple photos

Copy these three files to the same paths in the existing project:
- frontend/pages/landlord/create-listing.html
- frontend/assets/js/landlord-create-listing.js
- frontend/assets/css/listing-image-picker.css (new)

Hard-refresh after copying.

The existing input already supported multiple selection, but each new picker selection replaced the previous queue. New selections now append to the queue, up to the existing 10-photo limit. Duplicate selections (same name, size, modification time and MIME type) are ignored. Cancelling the picker or rejecting an invalid/oversized batch preserves existing selections. Each preview has an accessible Remove photo button. Selection controls are disabled during submission to keep the upload queue stable. No new size restriction or backend changes were introduced.

Photos are still uploaded one at a time through the existing upload-listing-image.php endpoint after create-listing.php returns the new ID, within the same Create listing action. No API contracts, approval checks or listing payload fields change.

Local Chromium fixture test covered successive and batch selection, duplicate selection, cancellation, invalid MIME type, over-limit batches, removal and re-addition, mobile page overflow, and a complete submit producing exactly one create request plus the ten expected multipart uploads using the new listing ID. Live upload limits, disk storage and server validation require verification on the installed backend.
