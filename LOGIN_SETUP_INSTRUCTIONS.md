# Login System Setup Instructions

## ✅ Login System Installed!

Your dashboard now has a professional login page to keep it private and secure.

---

## Default Credentials

**Username:** `admin`  
**Password:** `Property2024!`

⚠️ **IMPORTANT:** Change these credentials before deploying!

---

## How to Change Username & Password

### Option 1: Edit the auth.js file (Recommended)

1. Open `frontend/auth.js`
2. Find this section at the top:

```javascript
const CREDENTIALS = {
  username: 'admin',
  password: 'Property2024!'
};
```

3. Change to your desired credentials:

```javascript
const CREDENTIALS = {
  username: 'your_username',
  password: 'YourStrongPassword123!'
};
```

4. Save the file
5. Done! New credentials are active immediately

### Password Recommendations:
- At least 12 characters
- Mix of uppercase and lowercase
- Include numbers and symbols
- Don't use common words
- Example: `48Prop$2024!Secure`

---

## How It Works

### For Users:
1. Visit the dashboard URL
2. See login page
3. Enter username and password
4. Click "Login"
5. Dashboard loads

### Session Management:
- **Default:** Session lasts 24 hours
- **Remember Me:** Session lasts 7 days
- **Auto-logout:** After session expires
- **Manual logout:** Click logout button in header

### Security Features:
✅ Password protected access
✅ Session expiration
✅ Remember me option
✅ Logout functionality
✅ Auto-redirect if not logged in
✅ Session validation

---

## Files Added

1. **frontend/login.html** - Login page
2. **frontend/auth.js** - Authentication logic

## Files Modified

1. **frontend/index.html** - Added auth check and logout button
2. **frontend/styles.css** - Added logout button styling

---

## Testing the Login

### Test Login:
1. Open `frontend/login.html` in browser
2. Enter: `admin` / `Property2024!`
3. Should redirect to dashboard

### Test Logout:
1. Click logout button in header (top right)
2. Should redirect to login page

### Test Session:
1. Login to dashboard
2. Close browser
3. Reopen and visit dashboard
4. Should still be logged in (if within 24 hours)

### Test Wrong Password:
1. Enter wrong password
2. Should show error message
3. Should not allow access

---

## Customization Options

### Change Session Duration

In `auth.js`, modify these values:

```javascript
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const REMEMBER_ME_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
```

Examples:
- 12 hours: `12 * 60 * 60 * 1000`
- 1 hour: `1 * 60 * 60 * 1000`
- 30 days: `30 * 24 * 60 * 60 * 1000`

### Customize Login Page

Edit `frontend/login.html`:
- Change colors
- Modify text
- Add company logo
- Adjust layout

### Add Multiple Users (Future)

Currently supports one username/password. To add multiple users:

1. Change CREDENTIALS to an array:
```javascript
const CREDENTIALS = [
  { username: 'admin', password: 'Password1!' },
  { username: 'manager', password: 'Password2!' },
  { username: 'viewer', password: 'Password3!' }
];
```

2. Update verifyCredentials function:
```javascript
function verifyCredentials(username, password) {
  return CREDENTIALS.some(cred => 
    cred.username === username && cred.password === password
  );
}
```

---

## Deployment Notes

### Before Deploying:
1. ✅ Change default username and password
2. ✅ Test login/logout functionality
3. ✅ Ensure HTTPS is enabled (for security)
4. ✅ Test on mobile devices

### Security Recommendations:
- Always use HTTPS in production
- Use strong passwords
- Change password regularly
- Don't share credentials publicly
- Consider adding rate limiting (prevent brute force)

---

## Troubleshooting

### "Can't login even with correct password"
- Clear browser cache and cookies
- Check browser console for errors
- Verify credentials in auth.js match exactly

### "Keeps redirecting to login"
- Check if localStorage is enabled in browser
- Try different browser
- Clear browser data

### "Session expires too quickly"
- Increase SESSION_DURATION in auth.js
- Check if "Remember me" is checked

### "Logout button not working"
- Check browser console for errors
- Verify auth.js is loaded
- Clear cache and reload

---

## Future Enhancements

Want to upgrade the login system? You can add:

1. **Password Reset via Email**
   - Requires backend service
   - Can use Firebase Auth

2. **Two-Factor Authentication**
   - Extra security layer
   - SMS or email codes

3. **User Management Panel**
   - Add/remove users
   - Change passwords
   - View login history

4. **Role-Based Access**
   - Admin vs Viewer roles
   - Different permissions

5. **Activity Logs**
   - Track who logged in when
   - Monitor access

Let me know if you want any of these features!

---

## Support

If you need help:
1. Check this documentation
2. Test with default credentials first
3. Check browser console for errors
4. Contact developer for assistance

---

## Quick Reference

**Login URL:** `your-domain.com/login.html`  
**Dashboard URL:** `your-domain.com/index.html`  
**Default Username:** `admin`  
**Default Password:** `Property2024!`  
**Session Duration:** 24 hours (or 7 days with "Remember me")  

**Change Credentials:** Edit `frontend/auth.js`  
**Logout:** Click button in header (top right)  

---

## Security Checklist

Before going live:
- [ ] Changed default username
- [ ] Changed default password to strong one
- [ ] Tested login/logout
- [ ] Enabled HTTPS
- [ ] Tested on mobile
- [ ] Shared credentials securely with team
- [ ] Set up password change schedule

Your dashboard is now secure and professional! 🎉
