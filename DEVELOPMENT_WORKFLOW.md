# Development Workflow - Preventing Git Lock Issues

## **Common Causes of `.git/index.lock` Issues:**
1. **Multiple git processes** running simultaneously
2. **IDE/Editor git integration** conflicting with terminal git
3. **Crashed git processes** leaving lock files
4. **Network issues** during git operations
5. **File system issues** on macOS

## **Prevention Strategy:**

### **1. Always Check Git Status Before Operations**
```bash
# Before any git operation, always run:
git status
```

### **2. Use Single Git Interface**
- **Choose ONE method:** Either use terminal git OR IDE git, not both
- **Recommended:** Use terminal git for our development workflow
- **Disable IDE git integration** if possible to avoid conflicts

### **3. Safe Git Operations**
```bash
# Always follow this sequence:
git status                    # Check current state
git add <specific-files>      # Add specific files (not git add .)
git status                    # Verify what's staged
git commit -m "message"      # Commit with clear message
```

### **4. Emergency Lock File Removal**
If you encounter the lock file again:
```bash
# Remove the lock file
rm -f .git/index.lock

# Verify git is working
git status
```

### **5. Development Workflow**
1. **Make small changes** (one feature at a time)
2. **Test changes** with `npm run dev`
3. **Check git status** with `git status`
4. **Add specific files** with `git add <filename>`
5. **Commit with clear message** with `git commit -m "message"`
6. **Test again** to ensure everything works

### **6. File-Specific Adding (Recommended)**
Instead of `git add .`, use specific file paths:
```bash
# Good - specific files
git add src/components/NewComponent.tsx
git add src/pages/new-page.tsx

# Avoid - adds everything
git add .
```

### **7. IDE Configuration**
If using VS Code or similar:
- **Disable auto-save** during git operations
- **Close git integration** in IDE
- **Use terminal for all git operations**

### **8. Pre-Commit Checklist**
Before every commit:
- [ ] Run `npm run dev` and test functionality
- [ ] Check `git status` for clean state
- [ ] Add only necessary files
- [ ] Write clear commit message
- [ ] Test after commit

### **9. Emergency Recovery**
If git gets stuck:
```bash
# Kill any git processes
pkill -f git

# Remove lock files
rm -f .git/index.lock
rm -f .git/refs/heads/main.lock

# Reset to clean state
git status
```

### **10. Commit Message Format**
Use clear, descriptive commit messages:
```
feat: add user authentication
fix: resolve cart state issue
docs: update README
style: improve button styling
```

## **Our Development Process:**

1. **Make Change** → 2. **Test Change** → 3. **Git Add** → 4. **Git Commit** → 5. **Test Again**

This prevents the lock file issue by:
- Using single git interface (terminal)
- Adding files specifically
- Testing before and after commits
- Avoiding bulk operations
- Clear communication about what's being committed
