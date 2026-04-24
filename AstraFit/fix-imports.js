const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const appDir = path.join(__dirname, 'app');
const files = walk(appDir);
let count = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('SafeAreaView') && content.includes("'react-native'")) {
        if (/import.*SafeAreaView.*from ['"]react-native['"]/.test(content)) {
            // Remove SafeAreaView from react-native imports
            content = content.replace(/SafeAreaView,\s*/g, '');
            content = content.replace(/,\s*SafeAreaView/g, '');
            
            // If react-native import is empty now, we shouldn't strictly care but it's cleaner
            
            // Add safe area context import
            if (!content.includes('react-native-safe-area-context')) {
                content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]react-native['"];/, (match, p1) => {
                    return match + '\nimport { SafeAreaView } from \'react-native-safe-area-context\';';
                });
            }
            fs.writeFileSync(file, content, 'utf8');
            count++;
            console.log('Fixed:', file);
        }
    }
}
console.log('Fixed', count, 'files.');
