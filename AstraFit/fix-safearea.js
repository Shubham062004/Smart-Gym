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
    let modified = false;
    
    // Replace <SafeAreaView className="flex-1 bg-black">
    if (content.includes('<SafeAreaView className="flex-1 bg-black">')) {
        content = content.replace(/<SafeAreaView className="flex-1 bg-black">/g, '<SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>');
        modified = true;
    }
    
    // Replace <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
    if (content.includes('<SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">')) {
        // Technically dark mode isn't purely translatable to inline styles without hooks, but this is a structural container
        // We will just use gray-50 for now, or transparent, as the parent flex-1 usually handles it.
        // Actually, let's just use flex: 1
        content = content.replace(/<SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">/g, '<SafeAreaView style={{ flex: 1 }}>');
        modified = true;
    }

    // Replace <SafeAreaView className="flex-1 bg-[#0a0f0a]">
    if (content.includes('<SafeAreaView className="flex-1 bg-[#0a0f0a]">')) {
        content = content.replace(/<SafeAreaView className="flex-1 bg-\[\#0a0f0a\]">/g, '<SafeAreaView style={{ flex: 1, backgroundColor: "#0a0f0a" }}>');
        modified = true;
    }

    if (content.includes('<SafeAreaView className="flex-1 bg-black items-center justify-center">')) {
        content = content.replace(/<SafeAreaView className="flex-1 bg-black items-center justify-center">/g, '<SafeAreaView style={{ flex: 1, backgroundColor: "black", alignItems: "center", justifyContent: "center" }}>');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log('Fixed className in:', file);
    }
}
console.log('Fixed', count, 'files.');
