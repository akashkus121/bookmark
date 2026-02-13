🐛 Production Challenges & Resolutions

During development and deployment, several real-world issues appeared in authentication, authorization, database access, and real-time communication.
Solving them helped strengthen the reliability, scalability, and security of the application.

🚪 Logout Not Clearing the Session
🚨 Problem

After clicking logout, the UI still behaved as if the user was logged in.

🔎 Why It Happened

The Supabase session was removed, but the frontend state and cached data were not refreshed.

🛠 What I Did

Called:

await supabase.auth.signOut();

Redirected the user to the login page.

Forced UI/state refresh after logout.

✅ Outcome

The session cleared correctly and protected routes became inaccessible.

🗄 SQL Syntax Error (42601)
🚨 Problem

While configuring the database, the editor returned:

ERROR: 42601: syntax error at or near "Realtime"

🔎 Why It Happened

Some non-SQL text from the dashboard interface was mistakenly pasted into the SQL editor.

🛠 What I Did

Ensured only valid SQL commands were executed.

Rechecked statements before running them.

✅ Outcome

Database scripts executed without errors.

⚡ Realtime Updates Not Triggering
🚨 Problem

UI did not update automatically when data changed.

🔎 Why It Happened

The table was not included in Supabase’s realtime publication and replication was disabled.

🛠 What I Did

Enabled realtime replication from
Supabase → Database.

Added the necessary table (e.g., bookmarks) to the publication.

✅ Outcome

Clients started receiving live updates instantly.

🔄 Data Not Syncing Across Tabs & Devices
🚨 Problem

Updates appeared in one tab but not in other browsers or devices.

🔎 Investigation Journey

Storage Event Listener

Works only for tabs inside the same browser.

Not suitable for multi-device scenarios.

Polling

Required frequent API hits.

Increased server load.

Inefficient if no changes occur.

🛠 Final Implementation – WebSockets (Supabase Realtime)

Subscribed to database change events.

Server pushed updates automatically.

Cleaned up subscriptions properly using React lifecycle (useEffect).

✅ Outcome

True real-time synchronization across browsers, devices, and user sessions with better performance.

🔒 RLS Preventing Insert/Select
🚨 Problem

Even logged-in users couldn’t read or write data.

🔎 Why It Happened

RLS was enabled but access policies were not defined.

🛠 What I Did

Created policies ensuring users can only access their own data:

auth.uid() = user_id


Also verified user_id is correctly saved during inserts.

✅ Outcome

Secure and correct per-user data isolation.

🔐 Unauthorized Error After Deployment
🚨 Problem

After deploying the application to production, authenticated API calls started failing with 401 Unauthorized errors.
The same flow worked perfectly in the local environment.

🔎 Why It Happened

After investigation using browser network logs and Supabase settings, the problems were:

Production environment variables were not configured.

The deployed domain was not whitelisted in authentication settings.

Row Level Security (RLS) policies prevented access.

🛠 What I Did

I fixed the issue by:

Adding
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
in the hosting provider’s environment configuration.

Registering the production domain in
Supabase → Authentication → URL Configuration.

Reviewing and correcting RLS rules.

✅ Outcome

APIs started returning valid responses and authenticated users could access their data normally.

📚 What This Experience Taught Me

Production setup is as important as development.

Auth systems fail if domains and keys are misconfigured.

RLS requires careful design.

Realtime systems need explicit enablement.

Network debugging tools are essential.

WebSockets provide a cleaner and scalable alternative to polling.

Proper session invalidation is critical for security.
