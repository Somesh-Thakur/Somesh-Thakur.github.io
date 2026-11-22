# Turning on the guestbook and visitor counter

The guestbook page, the visitor count and the `/admin` page stay hidden until the site
is connected to a free Supabase project. About 5 minutes, once.

## 1. Create the project
1. Go to https://supabase.com/dashboard and choose **New project**.
2. Name it `sketchbook`, pick the **Mumbai (ap-south-1)** region, set any database password (you won't need it here).

## 2. Create the tables
1. In the project, open **SQL Editor → New query**.
2. Paste everything from [`supabase/schema.sql`](supabase/schema.sql) and press **Run**.

This creates the guestbook, the visitor counter, and rules that let visitors only read
visible notes and add new ones. Only `someshrthakur@gmail.com` can hide or delete notes.

## 3. Allow the admin sign-in link
1. **Authentication → URL Configuration**
   - Site URL: `https://someshthakur.tech`
   - Redirect URLs: add `https://someshthakur.tech/admin/` and `http://localhost:3000/admin/`
2. **Authentication → Sign In / Providers → Email**: leave it on, with **Confirm email** on.

## 4. Connect the site
From **Project Settings → API** copy the **Project URL** and the **anon public** key
(both are meant to be public; the rules from step 2 protect the data). Then either paste
them to Claude, or:

- **Local:** create `.env.local` in this folder:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  ```
- **Live site:** GitHub repo → **Settings → Secrets and variables → Actions → Variables**,
  add the same two names and values, then re-run the deploy.

## Removing notes
Go to **someshthakur.tech/admin**, enter your email, click the link you're sent.
Each note gets **Hide** (reversible) and **Delete** (permanent) buttons.
Tick **Approve new notes before they appear** if people start posting junk: new notes
then stay hidden until you press **Show on site**.

Built-in protection: a hidden bot trap field, a one-minute cooldown per browser,
length limits, and a cap of 15 new notes a minute for the whole site.
