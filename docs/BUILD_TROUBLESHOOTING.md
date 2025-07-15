# Build Troubleshooting Guide

## Issue: Could not load /frontend/src/lib/utils

### Problem
The CI/CD build fails with `ENOENT: no such file or directory, open '/path/to/frontend/src/lib/utils'`

### Root Cause
1. **Module Resolution**: Different behavior between development and CI environments
2. **File Extension**: Missing `.js` extension in imports for strict environments
3. **Path Aliases**: Vite alias configuration differences across platforms

### Solutions Applied

#### 1. Explicit File Extensions ✅
Updated all UI component imports to use explicit `.js` extensions:
```javascript
// Before
import { cn } from "@/lib/utils"

// After  
import { cn } from "@/lib/utils.js"
```

#### 2. Enhanced Module Structure ✅
- **`src/lib/utils.js`**: Main utility file with cn function
- **`src/lib/index.js`**: Re-export for better module resolution

#### 3. Improved Vite Configuration ✅
```javascript
// Enhanced cross-platform compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

#### 4. CI/CD Workflow Improvements ✅
- **Working Directory**: Explicit `working-directory: ./frontend`
- **Structure Verification**: Added file structure checks
- **Dependency Validation**: Enhanced npm install process

### Verification Steps

#### Local Build Test:
```bash
cd frontend
npm run build
# Should complete successfully
```

#### File Structure Check:
```bash
ls -la src/lib/
# Should show: utils.js and index.js
```

#### Import Verification:
```bash
grep -r "@/lib/utils.js" src/components/ui/
# Should show explicit .js extensions
```

### Interview Talking Points

**Problem-Solving Process:**
1. **Diagnosis**: Identified module resolution differences between local and CI
2. **Root Cause**: Missing file extensions causing strict environment failures  
3. **Solution**: Systematic update of imports and build configuration
4. **Validation**: Comprehensive testing in both environments

**Technical Skills Demonstrated:**
- **Module System Understanding**: ES6 imports, path resolution
- **Build Tool Configuration**: Vite, path aliases, cross-platform compatibility
- **CI/CD Debugging**: Working directory management, file verification
- **Code Quality**: Consistent import patterns, explicit dependencies

**Best Practices Applied:**
- ✅ **Explicit Imports**: Clear file extensions for better compatibility
- ✅ **Robust Build Configuration**: Cross-platform path resolution  
- ✅ **CI/CD Verification**: Structure checks and validation steps
- ✅ **Documentation**: Clear troubleshooting guide for future issues

This demonstrates systematic debugging skills and understanding of modern JavaScript build toolchains.
