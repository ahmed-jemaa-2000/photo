
const geminiService = require('./server/services/geminiService');
const fs = require('fs');
const axios = require('axios');

// Mock environment
process.env.GEMINIGEN_API_KEY = 'test-key';

// Mock fs
fs.createReadStream = () => 'dummy-stream';
fs.existsSync = () => true;

// Mock Axios to avoid actual network calls
// We just want to reach the point where aspect ratio is logged
// We can override the apiClient in the required module? 
// It's hard to mock internal axios instance without proxyquire or similar.
// But we can catch the error, as long as console.logs happen BEFORE the error.
// Looking at the code: console.log('[Image Gen] Aspect ratio:', aspectRatio); occurs BEFORE fs usage and API call.
// Wait, fs.createReadStream is called BEFORE buildImagePrompt.

async function test() {
    console.log('--- STARTING ASPECT RATIO TEST ---');

    // Test 1: Preset that used to be 4:5 (now should be 3:4 in code, but let's see if logic works if I pass explicit 4:5)
    // Actually I modified the preset object itself in the file.
    // So 'instagram_aesthetic' should now default to 3:4.

    try {
        console.log('Test 1: Testing instagram_aesthetic preset (was 4:5, should be 3:4)');
        await geminiService.generateImage('dummy.jpg', 'test prompt', { imageStyle: 'instagram_aesthetic' });
    } catch (e) {
        // We expect it to fail at network step, but we check logs before that
        if (e.message.includes('network') || e.message.includes('failed')) {
            // intended fail
        } else {
            //   console.log('Error:', e.message);
        }
    }

    // Test 2: Explicitly passing unsupported aspect ratio 4:5
    try {
        console.log('\nTest 2: Explicitly passing aspectRatio: "4:5"');
        await geminiService.generateImage('dummy.jpg', 'test prompt', { aspectRatio: '4:5' });
    } catch (e) {
        if (e.message.includes('network') || e.message.includes('failed')) {
            // intended fail
        }
    }

    // Test 3: Explicitly passing unsupported aspect ratio 2:3
    try {
        console.log('\nTest 3: Explicitly passing aspectRatio: "2:3"');
        await geminiService.generateImage('dummy.jpg', 'test prompt', { aspectRatio: '2:3' });
    } catch (e) {
        if (e.message.includes('network') || e.message.includes('failed')) {
            // intended fail
        }
    }

    // Test 4: Passing valid 16:9
    try {
        console.log('\nTest 4: Passing valid 16:9');
        await geminiService.generateImage('dummy.jpg', 'test prompt', { aspectRatio: '16:9' });
    } catch (e) {
        // intended fail
    }
}

test();
