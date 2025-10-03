 document.addEventListener('DOMContentLoaded', () => {
            // --- DOM Elements ---
            const passwordEl = document.getElementById('password');
            const copyBtn = document.getElementById('copy-btn');
            const copyTooltip = document.getElementById('copy-tooltip');
            const lengthEl = document.getElementById('length');
            const lengthValue = document.getElementById('length-value');
            const uppercaseEl = document.getElementById('uppercase');
            const lowercaseEl = document.getElementById('lowercase');
            const numbersEl = document.getElementById('numbers');
            const symbolsEl = document.getElementById('symbols');
            const generateBtn = document.getElementById('generate-btn');
            const strengthBar = document.getElementById('strength-bar');
            const strengthLabel = document.getElementById('strength-label');

            const charSets = {
                uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                lowercase: 'abcdefghijklmnopqrstuvwxyz',
                numbers: '0123456789',
                symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
            };

            lengthEl.addEventListener('input', (e) => {
                lengthValue.textContent = e.target.value;
                updateStrength();
            });

            copyBtn.addEventListener('click', () => {
                const password = passwordEl.value;
                if (!password) return;

                const textarea = document.createElement('textarea');
                textarea.value = password;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                copyTooltip.classList.add('show');
                setTimeout(() => {
                    copyTooltip.classList.remove('show');
                }, 1500);
            });
            
            generateBtn.addEventListener('click', generatePassword);

            [uppercaseEl, lowercaseEl, numbersEl, symbolsEl].forEach(el => {
                el.addEventListener('change', updateStrength);
            });

            // --- Functions ---

            /**
             * Generates a random character from a given string (character set)
             * @param {string} charSet - The string of characters to choose from.
             * @returns {string} A single random character.
             */
            function getRandomChar(charSet) {
                return charSet[Math.floor(Math.random() * charSet.length)];
            }

            /**
             * Shuffles the characters in a string.
             * @param {string} string - The string to shuffle.
             * @returns {string} The shuffled string.
             */
            function shuffleString(string) {
                const arr = string.split('');
                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]]; // ES6 swap
                }
                return arr.join('');
            }

            function generatePassword() {
                const length = +lengthEl.value;
                const includeUppercase = uppercaseEl.checked;
                const includeLowercase = lowercaseEl.checked;
                const includeNumbers = numbersEl.checked;
                const includeSymbols = symbolsEl.checked;

                let password = '';
                let charPool = '';
                let guaranteedChars = [];

                if (includeUppercase) {
                    charPool += charSets.uppercase;
                    guaranteedChars.push(getRandomChar(charSets.uppercase));
                }
                if (includeLowercase) {
                    charPool += charSets.lowercase;
                    guaranteedChars.push(getRandomChar(charSets.lowercase));
                }
                if (includeNumbers) {
                    charPool += charSets.numbers;
                    guaranteedChars.push(getRandomChar(charSets.numbers));
                }
                if (includeSymbols) {
                    charPool += charSets.symbols;
                    guaranteedChars.push(getRandomChar(charSets.symbols));
                }

                if (charPool === '') {
                    passwordEl.value = '';
                    updateStrength();
                    return;
                }

                const remainingLength = length - guaranteedChars.length;
                for (let i = 0; i < remainingLength; i++) {
                    password += getRandomChar(charPool);
                }

                password += guaranteedChars.join('');
                passwordEl.value = shuffleString(password);
                updateStrength();
            }

            function updateStrength() {
                let score = 0;
                const length = +lengthEl.value;
                const selectedTypes = [uppercaseEl, lowercaseEl, numbersEl, symbolsEl].filter(el => el.checked).length;
                
                generateBtn.disabled = selectedTypes === 0;

                if (length >= 8) score += 25;
                if (length >= 12) score += 25;
                if (length >= 16) score += 25;

                score += selectedTypes * 15;
                
                score = Math.min(score, 100);

                strengthBar.style.width = score + '%';
                
                if (score > 80) {
                    strengthBar.style.backgroundColor = 'var(--strong-color)';
                    strengthLabel.textContent = 'Strong';
                    strengthLabel.style.color = 'var(--strong-color)';
                } else if (score > 50) {
                    strengthBar.style.backgroundColor = 'var(--medium-color)';
                    strengthLabel.textContent = 'Medium';
                    strengthLabel.style.color = 'var(--medium-color)';
                } else {
                    strengthBar.style.backgroundColor = 'var(--weak-color)';
                    strengthLabel.textContent = 'Weak';
                    strengthLabel.style.color = 'var(--weak-color)';
                }
                
                if (selectedTypes === 0) {
                    strengthBar.style.width = '0%';
                    strengthLabel.textContent = '';
                }
            }
            generatePassword();
        });
