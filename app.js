const submitIcon = document.querySelector("#submit-icon");
const inputElement = document.querySelector("input");
const imageSection = document.querySelector('.image-section');
const loadingSpinner = document.querySelector('#loading-spinner');

function showLoadingSpinner() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoadingSpinner() {
    loadingSpinner.classList.add('hidden');
}

function displayImages(images) {
    imageSection.innerHTML = '';
    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image;
        imageSection.appendChild(imgElement);
    });
}

const getMessages = async (topic) => {
    try {
        const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2JhMzAxNjUtZWVhOC00NmRlLThhYzItZDA5ODMyMTg2YWJmIiwidHlwZSI6ImFwaV90b2tlbiJ9.OTEiA8C30I112gCXlmWSw912B02LGHgL8PW1gq7w_ss'
            },
            body: JSON.stringify({
              response_as_dict: true,
              attributes_as_list: false,
              show_original_response: false,
              temperature: 0.5,
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
       console.error(error);
    }
    }
    

const getImages = async () => {
    try {
        showLoadingSpinner(); // Show the loading spinner
        const topic = inputElement.value; // Assuming the topic is entered via input field
        const story = await getMessages(inputElement.value);
        if (!story) {
            console.error("Story is empty or undefined");
            hideLoadingSpinner();
            return;
        }
        const storyArr = story.split(".");
        for (let i = 0; i < storyArr.length; i++) {
            const options = {
                method: 'POST',
                url: 'https://api.edenai.run/v2/image/generation',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2JhMzAxNjUtZWVhOC00NmRlLThhYzItZDA5ODMyMTg2YWJmIiwidHlwZSI6ImFwaV90b2tlbiJ9.OTEiA8C30I112gCXlmWSw912B02LGHgL8PW1gq7w_ss",
                },
                body: JSON.stringify({
                    show_original_response: false,
                    providers: 'replicate',
                    text: storyArr[i],
                    resolution: '512x512'
            })
        };
        
          
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
          .catch(err => console.error(err));
    
            // Wait for 10 seconds before processing the next sentence
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
        
    } catch (error) {
        console.error(error)
        hideLoadingSpinner();
    }

} 

submitIcon.addEventListener('click', getImages);
