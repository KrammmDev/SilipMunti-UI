# Reports and corporate exports

## Installation
Copy these six files to the same paths in the existing installation, keeping all other files and the backend:

- frontend/pages/admin/reports.html
- frontend/assets/css/admin-enterprise.css
- frontend/assets/css/admin-reports-print.css
- frontend/assets/js/admin-reports.js
- frontend/assets/js/admin-report-workbook.js
- frontend/assets/js/admin-report-document.js

Hard-refresh the browser after copying. Existing Dashboard styling is retained in the shared stylesheet.

## Reports presentation
Retained all existing filters, sections, tables, destinations and data sources. Added a period activity comparison bar chart, subtle area fills on the existing multi-series trend, an exact activity timeline table, and a wider listing-health panel. Comparison totals sum the returned trend points; current supply metrics remain separate. The activity export scope includes the new detail table. No fake data, new API requests, backend edits or dependencies.

## Export presentation
Excel: retains the six native XLSX sheets, numeric cells, date/currency formats, filters and frozen headers. Added explicit print areas, repeating table header rows, running worksheet/page headers and footers, and more room for metadata.

Word: native DOCX remains editable, with all existing scope options. A4 page dimensions now match the fixed table width. Repeating table headers and non-splitting rows improve pagination. Added reporting basis, page X of Y fields and a structured activity timeline table in place of timeline bullets. Office updates page fields when opened/printed.

PDF: uses the existing browser Print / Save as PDF flow. Includes the charts, scoped sections, exact activity data, branded summary and page numbers in modern Chromium. Screen-only skip navigation is excluded. Use Save as PDF and enable background graphics; avoid additional browser headers/footers if they duplicate the report's footer. Print output can vary across browsers.

## Verification
Chromium checks at 320, 390, 768, 1024, 1440 and 1920px: no page overflow or uncaught JS exceptions. Actual XLSX/DOCX download buttons exercised. Office ZIP/XML parts parsed; workbook opened with openpyxl; Word opened with python-docx; all eight Word scopes validated. Populated fixtures included fifteen listings, a landlord, demand data, customer feedback and escaped text. Final listing retained in XLSX, DOCX and PDF. PDF generated and inspected, including selected figures, activity table, page numbering and exclusion of screen navigation. Empty and API-error layout checks also passed.

These are fixture-based tests, not a live backend certification. Microsoft Office visual rendering and production database workflows should be checked in the installed project. No backend files are required for applying this presentation/export update.
