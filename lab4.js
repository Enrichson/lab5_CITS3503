document.addEventListener("DOMContentLoaded", function () {
    const rows = document.querySelectorAll('.input-container'); // Get all rows
    let currentRowIndex = 0; // Track the current row index
    const targetWord = "craze"; // Target word for the game

    function initializeRow(row) {
        const inputs = row.querySelectorAll('.str');

        // Auto-focus to the next input on typing
        inputs.forEach((input, index) => {
            input.addEventListener('input', function () {
                if (input.value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus(); // Move focus to the next input
                }
            });

            input.addEventListener("keydown", function (event) {
                if (event.key === "Backspace" && input.value.length === 0 && index > 0) {
                    inputs[index - 1].focus(); // Move focus back on Backspace
                }
            });

            input.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    handleRowSubmission(); // Call the submission logic
                }
            });
        });
    }

    function handleRowSubmission() {
        const currentRow = rows[currentRowIndex];
        const inputs = currentRow.querySelectorAll('.str');
        let str = '';

        // Gather the guess from the current row
        inputs.forEach(input => {
            str += input.value.toLowerCase(); // Collect the input as lowercase
        });

        // Validate input length
        if (str.length !== 5) {
            document.getElementById("print").innerHTML = "Error: Word must be 5 letters!";
            return;
        }

        // Process the guess and apply colors
        let targetLetters = targetWord.split('');
        let guessedLetters = str.split('');

        // Keep track of letters that are already matched for yellows
        let matchedPositions = Array(5).fill(false);

        // Step 1: Check for greens
        guessedLetters.forEach((letter, index) => {
            if (letter === targetLetters[index]) {
                inputs[index].style.backgroundColor = 'green'; // Correct position
                targetLetters[index] = null; // Mark this letter as used
                matchedPositions[index] = true;
            }
        });

        // Step 2: Check for yellows
        guessedLetters.forEach((letter, index) => {
            if (!matchedPositions[index] && targetLetters.includes(letter)) {
                inputs[index].style.backgroundColor = 'yellow'; // Correct letter, wrong position
                targetLetters[targetLetters.indexOf(letter)] = null; // Mark this letter as used
            } else if (!matchedPositions[index]) {
                inputs[index].style.backgroundColor = 'gray'; // Incorrect letter
            }
        });

        document.getElementById("print").innerHTML = "Row submitted!";
        console.log(`Guess: ${str}`);

        // Disable the current row's inputs
        inputs.forEach(input => {
            input.disabled = true;
        });

        // Move to the next row if available
        currentRowIndex++;
        if (currentRowIndex < rows.length) {
            const nextRow = rows[currentRowIndex];
            const firstInput = nextRow.querySelector('.str');
            firstInput.focus(); // Focus on the first input of the next row
        } else {
            document.getElementById("print").innerHTML = "Game Over!";
        }
    }

    // Initialize all rows
    rows.forEach(row => initializeRow(row));
});
