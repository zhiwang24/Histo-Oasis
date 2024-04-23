const submitIcon = document.querySelector("#submit-icon");
const benFranklinButton = document.querySelector(".button-container button:nth-child(1)");
const theColdWar = document.querySelector(".button-container button:nth-child(2)");
const wrightBrothers = document.querySelector(".button-container button:nth-child(3)");
const prohibitionEra = document.querySelector(".button-container button:nth-child(4)");
const inputElement = document.querySelector("input");
const imageSection = document.querySelector('.image-section');
const loadingSpinner = document.querySelector('#loading-spinner')


const apiKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDM3YzIyYjItNjRhYy00NGY5LTkyNmEtYjM3NmQwYTBmNDRhIiwidHlwZSI6ImZyb250X2FwaV90b2tlbiJ9.FmXIv7Yx0KaNCq_9elHxId4HpyVFjOjF2c970vcblK0";

function showLoadingSpinner() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoadingSpinner() {
    loadingSpinner.classList.add('hidden');
}

const getMessages = async (topic) => {
    try {
        consoleMessage("Generating Story")
        const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              authorization: apiKey,
            },
            body: JSON.stringify({
              response_as_dict: true,
              attributes_as_list: false,
              show_original_response: false,
              temperature: 1,
              max_tokens: 1000,
              providers: 'replicate',
              text: `Generate a historical story about ${topic}. Must Use ${topic} name in every sentence. Story must a 8 sentences long.`,
            })
          };
          
          return await fetch('https://api.edenai.run/v2/text/chat', options)
            .then(response => response.json())
            .then(response => {
                console.log(response.replicate.generated_text)
                return response.replicate.generated_text
            })
    } catch (error) {
        consoleMessage("Generation Failed")
    }
    }
    

const getImages = async () => {
    try {
        showLoadingSpinner(); // Show the loading spinner
        const topic = inputElement.value; // Assuming the topic is entered via input field
        const story = await getMessages(inputElement.value);
        if (!story) {
            consoleMessage("No Story Generated")
            hideLoadingSpinner();
            return;
        }
        consoleMessage("Generating Visuals")
        const storyArr = story.split(".");
        for (let i = 0; i < storyArr.length; i++) {
            const options = {
                method: 'POST',
                url: 'https://api.edenai.run/v2/image/generation',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    authorization: apiKey,
                },
                body: JSON.stringify({
                    show_original_response: false,
                    providers: 'replicate',
                    text: storyArr[i],
                    resolution: '512x512'
            })
        };
        
          consoleMessage("Generating visual " + (i+1) + " out of " + storyArr.length);
          await fetch('https://api.edenai.run/v2/image/generation', options)
          .then(response => response.json())
          .then(response => {
              if (response.replicate.status === "success") {
                const imageContainer = document.createElement('div')
                imageContainer.classList.add('image-container')
                const imageElement = document.createElement('img')
                imageElement.setAttribute('src', response.replicate.items[0].image_resource_url)
                const textElement = document.createElement('p');
                textElement.textContent = storyArr[i];
                imageContainer.appendChild(imageElement);
                imageContainer.appendChild(textElement);
                hideLoadingSpinner();
                imageSection.append(imageContainer)
              }
          })
          .catch(err => consoleMessage(err));
    
            // Wait for 10 seconds before processing the next sentence
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
        consoleMessage("Generation Complete")
        
    } catch (error) {
        consoleMessage(error)
        hideLoadingSpinner();
    }
} 

const genImages = async (story) => {
    try {
        showLoadingSpinner(); // Show the loading spinner
        consoleMessage("Generating Visuals")
        const storyArr = story.split(".");
        for (let i = 0; i < storyArr.length; i++) {
            const options = {
                method: 'POST',
                url: 'https://api.edenai.run/v2/image/generation',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    authorization: apiKey,
                },
                body: JSON.stringify({
                    show_original_response: false,
                    providers: 'replicate',
                    text: storyArr[i],
                    resolution: '512x512'
            })
        };
        
          consoleMessage("Generating visual " + (i+1) + " out of " + storyArr.length);
          await fetch('https://api.edenai.run/v2/image/generation', options)
          .then(response => response.json())
          .then(response => {
              if (response.replicate.status === "success") {
                const imageContainer = document.createElement('div')
                imageContainer.classList.add('image-container')
                const imageElement = document.createElement('img')
                imageElement.setAttribute('src', response.replicate.items[0].image_resource_url)
                const textElement = document.createElement('p');
                textElement.textContent = storyArr[i];
                imageContainer.appendChild(imageElement);
                imageContainer.appendChild(textElement);
                hideLoadingSpinner();
                imageSection.append(imageContainer)
              }
          })
          .catch(err => consoleMessage(err));
    
            // Wait for 10 seconds before processing the next sentence
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
        consoleMessage("Generation Complete")
        
    } catch (error) {
        consoleMessage(error)
        hideLoadingSpinner();
    }
} 

const consoleMessage = (message) => {
    try {
        document.getElementById("console-message").textContent = `Console Message: ${message}`;
    } catch (error) {
        console.log(error)
    }
}


submitIcon.addEventListener('click', () => {
    imageSection.innerHTML = '';
    getImages(false);
});

benFranklinButton.addEventListener('click', () => {
    imageSection.innerHTML = '';
    genImages(pastStoryBoard[0]);
});

theColdWar.addEventListener('click', () => {
    imageSection.innerHTML = '';
    genImages(pastStoryBoard[1]);
});

wrightBrothers.addEventListener('click', () => {
    imageSection.innerHTML = '';
    genImages(pastStoryBoard[2]);
});
prohibitionEra.addEventListener('click', () => {
    imageSection.innerHTML = '';
    genImages(pastStoryBoard[3]);
});

const pastStoryBoard = ["In the heart of colonial Philadelphia, Benjamin Franklin strolled along the cobblestone streets, his keen mind ever at work. Benjamin Franklin paused outside the printing press, his pride evident in his every step. Inside the shop, Benjamin Franklin meticulously set the type for his latest publication, his dedication unwavering. As the ink flowed onto the paper, Benjamin Franklin smiled, knowing his words would spark thought and change. Benjamin Franklin's wisdom echoed through the city as his almanac became a staple in every household. Amidst political turmoil, Benjamin Franklin's diplomatic skills shone, guiding the colonies toward unity. With each stroke of his pen, Benjamin Franklin shaped the future, leaving an indelible mark on history. And as the years passed, Benjamin Franklin's legacy endured, his name synonymous with innovation and enlightenment.",
"During the Cold War, tensions between the East and West were palpable. In the midst of this political turmoil, Cold War people found themselves caught in a precarious dance of espionage and ideology. In Berlin, Cold War people risked their lives attempting daring escapes across the infamous Wall. Cold War people in Moscow lived under constant surveillance, their every move scrutinized by the KGB. Meanwhile, in Washington, Cold War people navigated the intricate web of government secrecy and diplomatic negotiations. The Cuban Missile Crisis sent shivers down the spines of Cold War people worldwide, fearing nuclear annihilation. Cold War people in Vietnam faced the brutal realities of proxy wars and ideological conflict. Despite the tension, Cold War people also found moments of unity, such as during the détente period of the 1970s. Ultimately, the fall of the Berlin Wall in 1989 marked the end of an era for Cold War people, ushering in a new chapter in global history.",
"In the quaint town of Kitty Hawk, North Carolina, the Wright brothers, Orville and Wilbur, dreamed of defying gravity. Determined to conquer the skies, the Wright brothers meticulously crafted their first airplane, which they named the Wright Flyer. On a blustery December day in 1903, amidst the cries of seagulls, the Wright brothers made history as they piloted the Wright Flyer into the air for the first time. With unwavering resolve, Orville and Wilbur continued to refine their creation, improving upon the original design of the Wright Flyer. In 1905, soaring alongside the birds, the Wright brothers achieved another milestone by flying the improved aircraft for over 39 minutes. The world marveled at the ingenuity of the Wright brothers as they soared through the heavens, sharing the airspace with their feathered counterparts. As aviation enthusiasts worldwide celebrate their legacy, the name Wright brothers remains synonymous with the birth of modern flight.",
"In the heart of Chicago during the Prohibition era, the streets buzzed with the illicit activities of the era. The Prohibition era people, clad in fedoras and trench coats, navigated the shadowy alleys with caution. In smoky speakeasies like The Bootlegger's Den, these Prohibition era people gathered to sip forbidden liquor and dance to jazz tunes. Among them was Frankie The Moonshine Maven, known for his smooth dealings and charm. Meanwhile, across town, Detective Sullivan trailed the Prohibition era people, determined to uphold the law. Despite his efforts, the allure of the underground world was too strong for many. Eventually, the Prohibition era people's defiance led to the rise of organized crime, shaping the city's history for years to come."
];
