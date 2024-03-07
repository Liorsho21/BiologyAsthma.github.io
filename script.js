const intro = document.getElementById('intro');
    const nameInput = document.getElementById('name-input');
    const aiButtons = document.querySelectorAll('.ai-button');
    const chat = document.getElementById('chat');
    const questionSelection = document.getElementById('question-selection');

    const knowledgeBase = {
        ליאור: [
            {
                question: 'מהי אסטמה?',
                answer: 'אסטמה היא מחלת ריאות כרונית שבה דרכי האוויר של האדם מתכווצות ונהיות דלקתיות, מה שגורם לקושי בנשימה.'
            },
            {
                question: 'מהם הגורמים להתקף אסטמה?',
                answer: 'גורמים כמו אלרגנים, עשן, זיהום אוויר, פעילות פיזית ולחץ נפשי יכולים לגרום להתקף אסטמה.'
            },
            {
                question: 'איך ניתן לנהל את האסטמה?',
                answer: 'ניהול אסטמה כולל שימוש בתרופות להקלה ולמניעה, חינוך בריאותי, והימנעות מהגורמים המזיקים.'
            }
        ],
        סהר: [
            {
                question: 'מהם סימפטומים של אסטמה?',
                answer: 'סימפטומים כוללים שיעול, קושי בנשימה, חרחורים בחזה ונשימה שורקת.'
            },
            {
                question: 'איך מאבחנים אסטמה?',
                answer: 'אסטמה מאובחנת בדרך כלל על ידי בדיקת נשימה, היסטוריה רפואית ובדיקות נוספות.'
            },
            {
                question: 'האם אסטמה יכולה להשתפר או להחמיר עם הזמן?',
                answer: 'מצב האסטמה של אדם יכול להשתנות במהלך החיים, והיא יכולה להשתפר או להחמיר תלוי בגורמים שונים.'
            }
        ]
    };
const body = document.querySelector('body');
const container = document.querySelector('.container');








function addMessage(text, user = false) {
    const message = document.createElement('div');
    message.className = 'message';

    if (user) {
        message.innerHTML = `<span class="user">${nameInput.value}:</span> ${text}`;
        message.classList.add('user');
    } else {
        message.innerText = text;
        message.classList.add('ai-message');
    }

    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;

    // Play the message sound
    const messageSound = document.getElementById('message-sound');
    messageSound.currentTime = 0;
    messageSound.oncanplaythrough = function() {
        messageSound.play();
    }

    return message; // Return the created message element
}


function showThinking(aiName) {
    const thinking = document.createElement('div');
    thinking.className = 'message thinking';
    thinking.innerText = `${aiName} חושב...`;
    chat.appendChild(thinking);
    chat.scrollTop = chat.scrollHeight;

    return thinking;
}

function askQuestion(aiName, question) {
    addMessage(question, true);

    const thinking = showThinking(aiName);
    setQuestionButtonsEnabled(false); // Disable question buttons

    setTimeout(() => {
        chat.removeChild(thinking);

        const answer = knowledgeBase[aiName].find(
            (entry) => entry.question === question
        ).answer;
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message ai-message';
        aiMessage.innerText = `${aiName}: ${answer}`;
        chat.appendChild(aiMessage);
        chat.scrollTop = chat.scrollHeight;
        setQuestionButtonsEnabled(true); // Enable question buttons
    }, 5000);
}
  function setQuestionButtonsEnabled(enabled) {
    const questionButtons = document.querySelectorAll('.question-button');
    questionButtons.forEach((button) => {
        button.disabled = !enabled;
    });
}




const askedQuestions = {
    "ליאור": [],
    "סהר": [],
};

function startChat(aiName) {
    chat.innerHTML = '';
    questionSelection.innerHTML = '';
    chat.hidden = false;
    questionSelection.hidden = false;

    addMessage(`${aiName}: תבחרו שאלה על אסטמה`);

    knowledgeBase[aiName].forEach(({ question }) => {
        const questionButton = document.createElement('button');
        questionButton.className = 'question-button';
        questionButton.innerText = question;
        questionButton.addEventListener('click', () => {
            askQuestion(aiName, question);
            if (!askedQuestions[aiName].includes(question)) {
                askedQuestions[aiName].push(question);
            }
        });
        questionSelection.appendChild(questionButton);
    });

    askedQuestions[aiName].forEach((question) => {
        const { answer } = knowledgeBase[aiName].find(
            (entry) => entry.question === question
        );
        addMessage(question, true);
        addMessage(`${aiName}: ${answer}`);
    });
}

function switchChat(aiName) {
    aiButtons.forEach((button) => {
        button.disabled = false;
    });
    startChat(aiName);
}


aiButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (!nameInput.value.trim()) {
            alert('אנא הכניסו את שמכם לפני שתתחילו לשוחח.');
            return;
        }

        intro.hidden = true;
        button.disabled = true;
        switchChat(button.dataset.ai);
    });
});