# Setting Up Client Access to Sanity Studio

This guide is for **developers** to set up client access to Sanity Studio.

---

## Prerequisites

- ✅ Sanity project is set up
- ✅ Sanity Studio is deployed (or ready to deploy)
- ✅ You have admin access to the Sanity project

---

## Step 1: Deploy Sanity Studio (If Not Already Deployed)

1. **Navigate to project directory:**
   ```bash
   cd /path/to/VendettaRoasting
   ```

2. **Deploy Studio:**
   ```bash
   npm run studio:deploy
   ```

3. **Follow prompts:**
   - Choose a hostname (e.g., `vendetta-roasting`)
   - Studio will be available at: `https://vendetta-roasting.sanity.studio`

4. **Note the URL:**
   - You'll need to share this URL with your client
   - Example: `https://vendetta-roasting.sanity.studio`

---

## Step 2: Add Client to Sanity Project

### Option A: Invite via Sanity Dashboard (Recommended)

1. **Go to Sanity Manage:**
   - Visit [sanity.io/manage](https://sanity.io/manage)
   - Log in with your account

2. **Select Your Project:**
   - Find "Vendetta Roasting" project (or project ID: `pyoyob4y`)
   - Click on it

3. **Go to Members:**
   - Click on **"Members"** in the left sidebar
   - Or go to: `https://sanity.io/manage/personal/projects/pyoyob4y/members`

4. **Invite Client:**
   - Click **"Invite member"** button
   - Enter client's email address
   - Select role: **"Editor"** (recommended) or **"Administrator"**
   - Click **"Send invitation"**

5. **Client Receives Email:**
   - Client will receive an invitation email
   - They click "Accept Invitation"
   - They're automatically added to the project

### Option B: Client Creates Account First

1. **Client creates Sanity account:**
   - Client goes to [sanity.io](https://www.sanity.io)
   - Signs up with email/Google/GitHub
   - Gets their email address

2. **You invite them:**
   - Follow steps in Option A above
   - Use the email address they provided

---

## Step 3: Set Up Client Permissions

### Recommended Role: Editor

**Editor permissions allow:**
- ✅ Create, edit, and delete content
- ✅ Upload images
- ✅ Publish content
- ❌ Cannot modify project settings
- ❌ Cannot add/remove members
- ❌ Cannot access API tokens

**This is perfect for clients** - they can manage all content but can't break the project.

### If Client Needs More Access: Administrator

**Administrator permissions allow:**
- ✅ Everything Editor can do
- ✅ Modify project settings
- ✅ Manage members
- ✅ Access API tokens

**Only use if client needs full control.**

---

## Step 4: Share Access Information with Client

Send your client an email with:

### Email Template:

```
Subject: Access to Your Website Content Management System

Hi [Client Name],

I've set up your access to edit your website content. Here's everything you need to get started:

🔗 Access Your Content Editor:
[Studio URL - e.g., https://vendetta-roasting.sanity.studio]

📧 Your Login:
- Email: [client's email]
- You'll use your Sanity account to log in

📚 Getting Started Guide:
I've created a comprehensive guide for you. Please read through it:
[Link to CLIENT_SANITY_GUIDE.md or share the file]

🎯 Quick Start:
1. Visit the Studio URL above
2. Log in with your Sanity account (or create one if you haven't)
3. Start with "Homepage Content" to see how it works
4. Remember: Always click "Publish" (not just "Save") to make changes live

❓ Need Help?
- Check the guide first
- Contact me if you have questions
- Changes appear on your website within 1-2 minutes after publishing

Let me know if you have any questions!

Best,
[Your Name]
```

---

## Step 5: Verify Client Access

1. **Ask client to test:**
   - Can they log in?
   - Can they see all content types?
   - Can they edit and publish?

2. **Troubleshoot if needed:**
   - If they can't log in: Check invitation was accepted
   - If they can't see content: Check permissions
   - If they can't publish: Check role has publish permissions

---

## Step 6: Optional: Create Initial Content

Before handing over to client, you might want to:

1. **Create initial content:**
   - Set up Homepage Content
   - Add a few products
   - Configure Site Settings
   - Add some FAQs

2. **This helps client:**
   - See examples of how content looks
   - Understand the structure
   - Have something to start with

---

## Security Best Practices

### ✅ Do's

- Use **Editor** role for clients (not Administrator)
- Only invite trusted email addresses
- Keep your admin account secure
- Monitor who has access regularly

### ❌ Don'ts

- Don't share your admin credentials
- Don't give Administrator role unless necessary
- Don't forget to remove access when needed
- Don't share API tokens with clients

---

## Troubleshooting Client Access

### Client Can't Log In

**Problem:** Client says they can't access the Studio

**Solutions:**
1. **Check invitation status:**
   - Go to Sanity Manage → Members
   - See if invitation is "Pending" or "Accepted"
   - Resend invitation if needed

2. **Check email:**
   - Make sure client checked the correct email
   - Check spam folder
   - Verify email address is correct

3. **Client needs to create account:**
   - If they don't have a Sanity account, they need to create one first
   - Then accept the invitation

### Client Can't See Content

**Problem:** Client can log in but can't see/edit content

**Solutions:**
1. **Check permissions:**
   - Go to Members → Check their role
   - Editor role should have access to all content

2. **Check dataset:**
   - Make sure they're looking at the correct dataset
   - Should be "production" dataset

3. **Refresh browser:**
   - Sometimes interface needs refresh
   - Clear browser cache if needed

### Client Can't Publish

**Problem:** Client can edit but can't publish changes

**Solutions:**
1. **Check role permissions:**
   - Editor role should allow publishing
   - If not, upgrade to Editor role

2. **Check for validation errors:**
   - Red error messages mean required fields are missing
   - Fix errors before publishing

---

## Quick Reference

### Sanity Project Info
- **Project ID:** `pyoyob4y`
- **Dataset:** `production`
- **Studio URL:** `https://vendetta-roasting.sanity.studio` (or your deployed URL)

### Useful Links
- **Sanity Manage:** [sanity.io/manage](https://sanity.io/manage)
- **Project Members:** `https://sanity.io/manage/personal/projects/pyoyob4y/members`
- **Sanity Support:** [sanity.io/support](https://www.sanity.io/support)

### Commands
```bash
# Deploy Studio
npm run studio:deploy

# Run Studio locally (for testing)
npm run studio
```

---

## Checklist

Before client starts using Sanity:

- [ ] Studio is deployed and accessible
- [ ] Client has Sanity account (or invitation sent)
- [ ] Client is added to project as Editor
- [ ] Client can log into Studio
- [ ] Client can see all content types
- [ ] Client can edit and publish content
- [ ] Client has received the guide (CLIENT_SANITY_GUIDE.md)
- [ ] Initial content is set up (optional but recommended)

---

**That's it!** Your client should now be able to manage their website content independently. 🎉

