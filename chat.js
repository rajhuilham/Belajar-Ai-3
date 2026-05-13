// Chat Widget Functionality
const chatButton = document.getElementById('chatButton');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const typingIndicator = document.getElementById('typingIndicator');

// Toggle chat window
chatButton.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
        chatInput.focus();
    }
});

closeChat.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
});

// Add message to chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${isUser ? 'message-user ml-auto' : 'message-bot'} rounded-2xl ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'} p-3 max-w-[80%] fade-in`;
    
    const messageText = document.createElement('p');
    messageText.className = 'text-sm whitespace-pre-wrap';
    messageText.textContent = message;
    
    messageDiv.appendChild(messageText);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTyping() {
    typingIndicator.classList.remove('hidden');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTyping() {
    typingIndicator.classList.add('hidden');
}

// Send message to AI backend
async function sendMessageToAI(message) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error('Error:', error);
        return 'Maaf, terjadi kesalahan. Pastikan backend API sudah berjalan.';
    }
}

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    chatInput.value = '';
    
    // Show typing indicator
    showTyping();
    
    // Send to AI and get response
    const aiResponse = await sendMessageToAI(message);
    
    // Hide typing indicator
    hideTyping();
    
    // Add AI response
    addMessage(aiResponse, false);
});

// Allow Enter to send, Shift+Enter for new line
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
});
