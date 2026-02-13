🐛 Problems Faced & Solutions
This project involved real-world deployment challenges around authentication, authorization, database security, and real-time synchronization. Below are the key issues encountered and how they were resolved.
🔐 Unauthorized Error After Deployment

Issue: Application showed Unauthorized error after hosting.

Cause:

Environment variables were not configured in production.

Production URL was not added in Supabase Authentication settings.

RLS policies were blocking access.

Solution:

Added NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in hosting dashboard.

Added production domain in:

Supabase → Authentication → URL Configuration


Verified and corrected Row Level Security (RLS) policies.

🚪 Logout Not Working Properly

Issue: User session was not clearing correctly.

Cause: Session state was not updating after sign out.

Solution:

Used:

await supabase.auth.signOut();


Redirected user after logout.

Ensured UI refresh after session removal.

🗄 SQL Syntax Error (42601)

Issue:

ERROR: 42601: syntax error at or near "Realtime"


Cause: Invalid/non-SQL text was executed in Supabase SQL editor.

Solution:

Executed only valid SQL queries.

Avoided copying dashboard text into SQL editor.

⚡ Realtime Not Working

Issue: Real-time updates were not triggering.

Cause:

Table was not added to Realtime publication.

Realtime replication was not enabled.

Solution:

Enabled Realtime in:

Supabase → Database 


Added bookmarks table to publication.

🔄 Cross-Tab Sync Issue

Issue: Bookmark data was not updating in real-time across multiple tabs and browsers.

Initial Approach (Storage Event Listener):

Implemented a storage event listener to sync updates.

This worked only for multiple tabs in the same browser.

Limitation: It does not sync across different browsers or devices.

Considered Approach (Polling):

Thought about using polling (sending periodic API requests).

Limitation:

Unnecessary repeated server requests.

Increased server load.

Inefficient when no data changes occur.

Final Solution (WebSockets / Supabase Realtime):

Implemented real-time updates using WebSockets.

Server pushes updates automatically when data changes.

No need for repeated API calls.

Works across browsers, devices, and sessions.

More scalable and efficient compared to polling.

Ensured proper event cleanup using useEffect.

🔒 RLS Blocking Data Access

Issue: Logged-in users could not insert/select data.

Cause: RLS enabled but policies were missing.

Solution:

Created proper policies using:

auth.uid() = user_id


Ensured user_id is correctly stored during insert.

📚 Key Learnings

Production environment variables must always be configured.

Supabase Auth requires correct URL configuration in production.

Row Level Security must be configured carefully.

Realtime requires manual table publication.

Browser DevTools (Network tab) helps debug 401 errors.

Proper session handling is essential for authentication flows.
