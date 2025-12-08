
const geminiService = require('./services/geminiService');
const fs = require('fs');

// Mock environment
process.env.GEMINIGEN_API_KEY = 'test-key';

// Mock fs
fs.createReadStream = () => 'dummy-stream';
fs.existsSync = () => true;

// Mock console to capture output? Or just let it print to stdout which I read.

async function test() {
    console.log('--- STARTING ASPECT RATIO TEST ---');

    // Test 1: Preset that used to be 4:5
    try {
        console.log('Test 1: Testing instagram_aesthetic preset (was 4:5, should be 3:4)');
        await geminiService.generateImage('dummy.jpg', 'test prompt', { imageStyle: 'instagram_aesthetic' });
    } catch (e) {
        if (!e.message.includes('network') && !e.message.includes('failed')) {
            // unexpected error
        }
    }

    // Test 2: Explicitly passing unsupported aspect ratio 4:5
    try {
        console.log('\nTest 2: Explicitly passing aspectRatio: "4:5"');
        await geminiService.generateImage('dummy.jpg', 'test prompt', { aspectRatio: '4:5' });
    } catch (e) {
        // intended fail at api level
    }

    // Test 3: Explicitly passing unsupported aspect ratio 2:3
    try {
        console.log('\nTest 3: Explicitly passing aspectRatio: "2:3"');
        await geminiService.generateImage('dummy.jpg', 'test prompt', { aspectRatio: '2:3' });
    } catch (e) {
        // intended fail at api level
    }

    // Test 4: Passing valid 16:9
    try {
        console.log('\nTest 4: Passing valid 16:9');
        await geminiService.generateImage('dummy.jpg', 'test prompt', { aspectRatio: '16:9' });
    } catch (e) {
        // intended fail at api level
    }
}

test();
