# Usage Status Bar

Shows **Included/Free** and **On-Demand** usage for your Cursor account in the status bar (bottom-right). Works only on **Teams** or **Enterprise** plans.

![Usage Status Bar in the status bar](usagestatusbar.png)

- Displays spending for the current billing cycle in the status bar
- Hover to see the start date of the billing period
- Auto-refreshes on an interval; you can also run **Usage Status Bar: Refresh** from the Command Palette

## Requirements

- **Cursor** 2.4.22+
- **Teams** or **Enterprise** plan (Admin API is only available for these)
- A team admin API key from the Cursor dashboard

## Configuration

1. Press **Cmd + Shift + P**.
2. Type **Open Settings** or **Preferences: Open Settings (UI)**.
3. Select **Preferences: Open Settings (UI)** (or **Open Settings**).
4. The Settings window will open with a search field at the top. Type **usage status bar** into the search.
5. You should see a **usage status bar** section with the fields **Api Key**, **Search Email**, and **Refresh Interval Minutes**.

![Usage Status Bar settings](usagestatusbar_settings.png)

If **Cmd + ,** in Cursor opens **“Cursor Settings”** (account/plan), note that extension settings are **not** located there. You need to access them via **Command Palette → “Open Settings (UI)”**, not through Cursor Settings.

**Alternative — edit JSON directly:**

1. **Cmd + Shift + P → Preferences: Open User Settings (JSON)**
2. Add the parameters **`usageStatusBar.apiKey`** and **`usageStatusBar.searchEmail`** directly to the **User Settings JSON** like this:
```json
{
  "usageStatusBar.apiKey": "YOUR_API_KEY_HERE",
  "usageStatusBar.searchEmail": "your-email@example.com"
}
```

## Support me

If you like the extension, feel free to buy me a coffee via the link https://ko-fi.com/alexxxf