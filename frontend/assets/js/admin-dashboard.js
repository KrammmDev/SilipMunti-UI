(function () {
  "use strict";

  if (window.SilipMuntiAdminDashboardInitialized) return;
  window.SilipMuntiAdminDashboardInitialized = true;

  const API_ROOT = "/SilipMunti/backend";
  const FRONTEND_ROOT = "/SilipMunti/frontend";

  const endpoints = {
    documents: `${API_ROOT}/admin/get-all-documents.php`,
    listings: `${API_ROOT}/admin/get-all-listings.php`,
    users: `${API_ROOT}/admin/get-users.php`,
  };

  const messageBox = document.querySelector("#admin-message");
  const recentDocumentsBody = document.querySelector("#recent-documents-body");
  const topbarSearch = document.querySelector("#topbar-search");
  const actionEmptyState = document.querySelector("#admin-action-empty");

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showMessage(message, type = "error") {
    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.className = `admin-message ${type}`;
  }

  function hideMessage() {
    if (!messageBox) return;
    messageBox.textContent = "";
    messageBox.className = "admin-message hidden";
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  }

  function formatDate(value) {
    if (!value) return "Not available";

    const date = new Date(String(value).replace(" ", "T"));
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatDocumentType(type) {
    const labels = {
      valid_id: "Valid ID",
      barangay_clearance: "Barangay Clearance",
      land_title: "Land Title",
    };

    return labels[type] || "Document";
  }

  function getInitials(firstName, lastName) {
    const initials = `${String(firstName ?? "").charAt(0)}${String(
      lastName ?? "",
    ).charAt(0)}`.toUpperCase();

    return initials || "A";
  }

  function resolveProfileUrl(profilePicture) {
    const value = String(profilePicture ?? "").trim();
    if (!value) return null;

    if (/^(https?:|data:|blob:)/i.test(value) || value.startsWith("/")) {
      return value;
    }

    if (value.startsWith("SilipMunti/")) return `/${value}`;
    if (value.startsWith("backend/")) return `/SilipMunti/${value}`;

    return `${API_ROOT}/${value.replace(/^\/+/, "")}`;
  }

  function setProfilePicture(profilePicture, initials) {
    const avatar = document.querySelector("#admin-profile-avatar");
    const picture = document.querySelector("#admin-profile-picture");
    const initialsElement = document.querySelector("#admin-profile-initials");

    if (!avatar || !picture || !initialsElement) return;

    initialsElement.textContent = initials;
    avatar.classList.remove("has-image");
    picture.hidden = true;
    picture.removeAttribute("src");

    const profileUrl = resolveProfileUrl(profilePicture);
    if (!profileUrl) return;

    picture.onload = () => {
      picture.hidden = false;
      avatar.classList.add("has-image");
    };

    picture.onerror = () => {
      picture.hidden = true;
      picture.removeAttribute("src");
      avatar.classList.remove("has-image");
    };

    picture.src = profileUrl;
  }

  function hydrateAdmin(user) {
    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
    const displayName = fullName || "Admin";

    setText("#admin-name", displayName);
    setText("#admin-heading-name", displayName.split(" ")[0] || "Admin");
    setProfilePicture(
      user.profile_picture,
      getInitials(user.first_name, user.last_name),
    );
  }

  async function requireAdmin() {
    const user = await window.SilipMuntiSession?.getCurrentUser();

    if (!user) {
      window.location.href = `${FRONTEND_ROOT}/pages/auth/login.html`;
      return null;
    }

    if (user.role !== "admin") {
      window.location.href = `${FRONTEND_ROOT}/index.html`;
      return null;
    }

    hydrateAdmin(user);
    return user;
  }

  async function fetchJson(url) {
    const response = await fetch(url, {
      credentials: "include",
      cache: "no-store",
    });
    let result;

    try {
      result = await response.json();
    } catch (error) {
      throw new Error("The server returned an invalid response.");
    }

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to load admin data.");
    }

    return result;
  }

  function extractArray(result, keys) {
    for (const key of keys) {
      const value = result.data?.[key];
      if (Array.isArray(value)) return value;
    }

    if (Array.isArray(result.data)) return result.data;
    return [];
  }

  function renderRecentDocuments(documents) {
    if (!recentDocumentsBody) return;

    const recent = documents.slice(0, 5);

    if (recent.length < 1) {
      recentDocumentsBody.innerHTML = `
        <tr>
          <td colspan="4" class="admin-table-message">
            No recent verification requests.
          </td>
        </tr>
      `;
      return;
    }

    recentDocumentsBody.innerHTML = recent
      .map(
        (document) => `
          <tr>
            <td data-label="Landlord">
              <div class="admin-user-cell">
                <strong>${escapeHtml(document.landlord_name)}</strong>
                <span>${escapeHtml(document.landlord_email)}</span>
              </div>
            </td>
            <td data-label="Document">${escapeHtml(formatDocumentType(document.document_type))}</td>
            <td data-label="Status">
              <span class="admin-status ${escapeHtml(document.verification_status)}">
                ${escapeHtml(document.verification_status)}
              </span>
            </td>
            <td data-label="Submitted">${escapeHtml(formatDate(document.created_at))}</td>
          </tr>
        `,
      )
      .join("");
  }

  function renderDocumentsError(message) {
    if (!recentDocumentsBody) return;

    recentDocumentsBody.innerHTML = `
      <tr>
        <td colspan="4" class="admin-table-message">
          ${escapeHtml(message || "Unable to load verification requests.")}
        </td>
      </tr>
    `;
  }

  // Present the existing responses without additional requests or data mutations.
  function renderStatusChart(selector, records, field, categories) {
    const container = document.querySelector(selector);
    if (!container) return;
    if (!records.length) {
      container.innerHTML = '<p class="admin-chart-state">No records available yet.</p>';
      return;
    }
    const counts = categories.map((category) => ({ ...category, count: 0 }));
    const other = { key: "other", label: "Other / unspecified", color: "#8993a5", count: 0 };
    records.forEach((record) => {
      const key = String(record[field] || "").trim().toLowerCase();
      const category = counts.find((item) => item.key === key) || other;
      category.count += 1;
    });
    if (other.count) counts.push(other);
    let position = 0;
    const segments = counts.map((item) => {
      const start = position;
      position += item.count / records.length * 100;
      return `${item.color} ${start}% ${position}%`;
    }).join(", ");
    const summary = counts.map((item) => `${item.label}: ${item.count}`).join("; ");
    container.innerHTML = `
      <div class="admin-status-donut" role="img" aria-label="${escapeHtml(summary)}" style="--status-segments: conic-gradient(${segments})">
        <div><strong>${records.length.toLocaleString("en-PH")}</strong><span>Total records</span></div>
      </div>
      <ul class="admin-chart-legend">${counts.map((item) => `
        <li><span class="admin-chart-dot" style="background:${item.color}" aria-hidden="true"></span>
          <span>${escapeHtml(item.label)}</span><strong>${item.count.toLocaleString("en-PH")}</strong>
          <small>${Math.round(item.count / records.length * 100)}%</small></li>`).join("")}</ul>`;
  }

  function renderChartError(selector) {
    const container = document.querySelector(selector);
    if (container) container.innerHTML = '<p class="admin-chart-state">Unable to load chart. Please refresh the page.</p>';
  }

  async function loadDocuments() {
    const result = await fetchJson(endpoints.documents);
    const documents = extractArray(result, ["documents"]);

    const pending = documents.filter(
      (document) => document.verification_status === "pending",
    ).length;
    const approved = documents.filter(
      (document) => document.verification_status === "approved",
    ).length;
    const rejected = documents.filter(
      (document) => document.verification_status === "rejected",
    ).length;

    setText("#total-documents", documents.length);
    setText("#pending-documents", pending);

    window.SilipMuntiAdminShell?.setPendingCount(pending);

    renderRecentDocuments(documents);
    renderStatusChart("#document-status-chart", documents, "verification_status", [
      { key: "pending", label: "Pending review", color: "#f7d447" },
      { key: "approved", label: "Approved", color: "#1734c7" },
      { key: "rejected", label: "Rejected", color: "#d94a63" },
    ]);

    return { documents, pending, approved, rejected };
  }

  async function loadListings() {
    const result = await fetchJson(endpoints.listings);
    const listings = extractArray(result, ["listings"]);
    setText("#total-listings", listings.length);
    renderStatusChart("#listing-status-chart", listings, "availability_status", [
      { key: "available", label: "Available", color: "#1734c7" },
      { key: "occupied", label: "Occupied", color: "#f7d447" },
    ]);
  }

  async function loadUsers() {
    const result = await fetchJson(endpoints.users);
    const users = extractArray(result, ["users"]);
    setText("#total-users", users.length);
  }

  function setupSearch() {
    topbarSearch?.addEventListener("input", () => {
      const keyword = topbarSearch.value.trim().toLowerCase();
      let visibleCards = 0;

      document.querySelectorAll(".admin-action-card").forEach((card) => {
        const searchable = card.dataset.searchText || card.textContent || "";
        const isHidden =
          keyword !== "" && !searchable.toLowerCase().includes(keyword);

        card.classList.toggle("hidden", isHidden);
        if (!isHidden) visibleCards += 1;
      });

      actionEmptyState?.classList.toggle("hidden", visibleCards > 0);
    });
  }

  async function initialize() {
    const admin = await requireAdmin();
    if (!admin) return;

    hideMessage();
    setupSearch();

    const results = await Promise.allSettled([
      loadDocuments(),
      loadListings(),
      loadUsers(),
    ]);

    const [documentsResult, listingsResult, usersResult] = results;

    if (documentsResult.status === "rejected") {
      setText("#total-documents", "0");
      setText("#pending-documents", "0");
      renderDocumentsError(documentsResult.reason?.message);
      renderChartError("#document-status-chart");
    }

    if (listingsResult.status === "rejected") {
      renderChartError("#listing-status-chart");
      setText("#total-listings", "0");
    }

    if (usersResult.status === "rejected") {
      setText("#total-users", "0");
    }

    const failedRequests = results.filter(
      (result) => result.status === "rejected",
    ).length;

    if (failedRequests > 0) {
      showMessage(
        `${failedRequests} dashboard data source${failedRequests > 1 ? "s" : ""} could not be loaded. Please refresh the page.`,
        "error",
      );
    }
  }

  initialize();
})();
