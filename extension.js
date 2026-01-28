"use strict";

const vscode = require("vscode");

const API_BASE = "https://api.cursor.com";
const SPEND_ENDPOINT = "/teams/spend";

/**
 * Request spending for the current billing cycle (Cursor Admin API).
 * @param {string} apiKey - Admin API key (key_...)
 * @param {string} searchEmail - team member email to search for
 * @param {boolean} useBearer - use Bearer or Basic auth
 * @returns {Promise<{ teamMemberSpend: Array, subscriptionCycleStart?: number }>}
 */
async function getSpending(apiKey, searchEmail, useBearer = true) {
  const url = `${API_BASE}${SPEND_ENDPOINT}`;
  const auth = useBearer ? `Bearer ${apiKey}` : `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    body: JSON.stringify({
      searchTerm: searchEmail,
      page: 1,
      pageSize: 25,
    }),
  });

  if (!res.ok) {
    let msg = res.statusText;
    try {
      const body = await res.json();
      msg = body.message || body.error || msg;
    } catch (_) {}
    const err = new Error(`API error ${res.status}: ${msg}`);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

/**
 * Updates the status bar with usage data (single item: Included/Free and On-Demand side by side).
 * @param {vscode.StatusBarItem} statusBarItem
 * @param {{ current: NodeJS.Timeout | null }} refreshTimerRef
 */
async function updateStatusBar(statusBarItem, refreshTimerRef) {
  const config = vscode.workspace.getConfiguration("usageStatusBar");
  const apiKey = config.get("apiKey") || process.env.CURSOR_ADMIN_TOKEN || "";
  const searchEmail = config.get("searchEmail") || "";

  if (!apiKey || !searchEmail) {
    statusBarItem.text = "Usage: configure apiKey and searchEmail";
    statusBarItem.tooltip = new vscode.MarkdownString(
      "Open settings and set **usageStatusBar.apiKey** and **usageStatusBar.searchEmail**"
    );
    statusBarItem.show();
    return;
  }

  statusBarItem.text = "$(loading~spin) Included/Free: …  On-Demand: …";
  statusBarItem.tooltip = new vscode.MarkdownString("Loading usage…");
  statusBarItem.show();

  try {
    let result;
    try {
      result = await getSpending(apiKey, searchEmail, true);
    } catch (e) {
      if (e.status === 401) {
        result = await getSpending(apiKey, searchEmail, false);
      } else {
        throw e;
      }
    }

    const members = result.teamMemberSpend || [];
    const cycleStart = result.subscriptionCycleStart;
    const match = members.find(
      (m) => (m.email || "").toLowerCase() === searchEmail.toLowerCase()
    );

    let spendCents = 0;
    let includedSpendCents = 0;
    let tooltipLines = [];

    if (match) {
      spendCents = match.spendCents || 0;
      includedSpendCents = match.includedSpendCents || 0;
    } else {
      if (members.length > 0) {
        spendCents = members.reduce((s, m) => s + (m.spendCents || 0), 0);
        includedSpendCents = members.reduce((s, m) => s + (m.includedSpendCents || 0), 0);
      }
    }

    if (cycleStart) {
      const d = new Date(cycleStart);
      tooltipLines.push(`Start: ${d.toISOString().slice(0, 10)}`);
    }

    statusBarItem.text = `Included/Free: $${(includedSpendCents / 100).toFixed(2)}  On-Demand: $${(spendCents / 100).toFixed(2)}`;
    statusBarItem.tooltip = new vscode.MarkdownString(tooltipLines.join("\n"));
    statusBarItem.show();
  } catch (e) {
    const msg = e.message || String(e);
    statusBarItem.text = "$(warning) Usage: error";
    statusBarItem.tooltip = new vscode.MarkdownString(`Failed to load usage:\n\n${msg}`);
    statusBarItem.show();
  }

  const intervalMinutes = Math.max(1, Math.min(60, config.get("refreshIntervalMinutes") || 5));
  if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
  refreshTimerRef.current = setTimeout(() => {
    refreshTimerRef.current = null;
    updateStatusBar(statusBarItem, refreshTimerRef);
  }, intervalMinutes * 60 * 1000);
}

function activate(context) {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  const refreshTimerRef = { current: null };

  updateStatusBar(statusBarItem, refreshTimerRef);

  const refreshCmd = vscode.commands.registerCommand("usageStatusBar.refresh", () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    updateStatusBar(statusBarItem, refreshTimerRef);
  });

  const timerDisposable = {
    dispose() {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    },
  };

  context.subscriptions.push(statusBarItem, refreshCmd, timerDisposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
