# Admin enterprise UI

Design-only update for all seven admin pages: Dashboard, Listings, Users, Rental Types, Verifications, Verification Details, and Reports.

Install `frontend/assets/css/admin-enterprise.css` and the seven updated files under `frontend/pages/admin/` into the same locations in your existing SilipMunti project. Keep all existing assets and backend files. Hard-refresh after copying.

The new scoped stylesheet retains existing colors and improves sidebar navigation, typography, KPI cards, tables, filters, forms, modals, charts, focus indicators, touch targets and responsive spacing. HTML changes only add the stylesheet, a body styling class, and a focus target for the existing Reports skip link. The stylesheet is screen-only to preserve report printing.

No JavaScript, PHP, SQL, API endpoints, routes, input names, validation rules, authentication, permissions or dependencies were changed.

Validation: Chromium checked seven pages at 320, 390, 768, 960, 1024, 1440 and 1920px using local API fixtures: no page overflow or uncaught JavaScript exceptions. Empty/error layouts were checked for Listings, Users, Rental Types and Verifications. Existing create-rental-type submission was exercised against a local mock endpoint. Existing HTML bindings were compared against originals and all JavaScript hashes remained identical. Additional checks covered mobile sidebar/Escape, listing pagination/search, delete-modal cancellation and report print styling.

Fixtures are only used by local verification scripts, not application files. These checks do not establish live backend correctness. Verify real CRUD, document approvals, authentication, exports and database-backed workflows in your running installation before deployment. Backend source is not required for this design update.

## Dashboard charts update

The subsequent charts update adds two accessible donut charts to Dashboard: listing availability and document verification status. This update additionally changes `frontend/assets/js/admin-dashboard.js` solely to render charts from the responses already fetched by Dashboard. No new API calls or backend changes. Unknown statuses are shown as Other / unspecified; empty and failed data sources have explicit messages. Counts refer to all records returned by each existing endpoint, with no added filtering. Copy the updated dashboard HTML, admin-dashboard.js and admin-enterprise.css for this charts update. The original design-only statement above describes the preceding commit.
