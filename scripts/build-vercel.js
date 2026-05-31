const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ? copyDir(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
    }
}

console.log('Building Citizen App...');
execSync('cd frontend/citizen-app && npm run build', { stdio: 'inherit' });

console.log('Building Admin Dashboard...');
execSync('cd frontend/admin-dashboard && npm run build', { stdio: 'inherit' });

console.log('Consolidating builds into public/ folder...');
if (fs.existsSync('public')) {
    fs.rmSync('public', { recursive: true, force: true });
}

copyDir('frontend/citizen-app/dist', 'public');
copyDir('frontend/admin-dashboard/dist', 'public/admin');

console.log('Build complete! Ready for Vercel.');
