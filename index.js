const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// === ১. তোমার বটের টোকেন ===
const token = '8340062727:AAFv5owhw2J_VHSC9aDfuOdcjXOdipyfcFM';

// পোলিং অন করা হলো
const bot = new TelegramBot(token, {polling: true});

// সার্ভার পোর্ট (Render বা Heroku তে রান করার জন্য জরুরি)
const PORT = process.env.PORT || 3000;

// ডামি সার্ভার (যাতে হোস্টিং স্লিপ মোডে না যায়)
app.get('/', (req, res) => {
  res.send('FF Bot is Running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// === ২. ইমোটের ডাটাবেস (তোমার ভিডিও লিংক এখানে বসাবে) ===
// নোট: ভালো স্পিডের জন্য টেলিগ্রাম ফাইলের file_id ব্যবহার করা সবচেয়ে ভালো।
// আপাতত আমি ডেমো লিংক দিয়েছি।
const emoteData = {
    'lol': {
        name: "😂 LOL Emote",
        url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtY2J6eHl5eHl5/giphy.gif" 
    },
    'cobra': {
        name: "🐍 Cobra Dance",
        url: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Z6cW9qMHZ6cW9qMHZ6cW9qMHZ6cW9qMHZ6cW9qMHZ6cW9qMC9naXBoeS5naWY" 
    },
    'rose': {
        name: "🌹 Propose",
        url: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGZ4cW9qMHZ6cW9qMHZ6cW9qMHZ6cW9qMHZ6cW9qMHZ6cW9qMC9naXBoeS5naWY" 
    },
    'throne': {
        name: "👑 Throne Emote",
        url: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGZ4cW9qMHZ6cW9qMHZ6cW9qMHZ6cW9qMHZ6cW9qMHZ6cW9qMC9naXBoeS5naWY" 
    }
};

// === ৩. বটের কমান্ড হ্যান্ডলিং ===

// /start কমান্ড দিলে কি হবে
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '😂 LOL', callback_data: 'lol' },
                    { text: '🐍 Cobra', callback_data: 'cobra' }
                ],
                [
                    { text: '🌹 Propose', callback_data: 'rose' },
                    { text: '👑 Throne', callback_data: 'throne' }
                ],
                [
                    { text: '💻 Developer', url: 'https://github.com/' } 
                ]
            ]
        }
    };

    bot.sendMessage(chatId, "🔥 **Free Fire Emote Bot** এ স্বাগতম!\nনিচের বাটন থেকে যেকোনো ইমোট সিলেক্ট করো:", options);
});

// বাটন ক্লিক হ্যান্ডল করা
bot.on('callback_query', async (callbackQuery) => {
    const message = callbackQuery.message;
    const emoteKey = callbackQuery.data;
    const chatId = message.chat.id;

    if (emoteData[emoteKey]) {
        const emote = emoteData[emoteKey];

        // লোডিং দেখানো
        bot.sendChatAction(chatId, 'upload_video');

        try {
            // অ্যানিমেশন বা ভিডিও পাঠানো
            await bot.sendAnimation(chatId, emote.url, {
                caption: `✨ **${emote.name}**`
            });
        } catch (error) {
            bot.sendMessage(chatId, "❌ ভিডিওটি লোড করা যাচ্ছে না। দয়া করে লিংক চেক করুন।");
            console.error(error);
        }
    }

    // পপ-আপ বন্ধ করা
    bot.answerCallbackQuery(callbackQuery.id);
});

console.log("🤖 Bot is running...");