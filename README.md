# Simple Amazon Alexa counter skill

Skill, which can increment counter through the voice command `count` or by clicking the button (if device supports Alexa Presentation Language (APL)).

Project is built with Alexa Skills Kit SDK (ASK SDK) for Node.js


## Interface presentation

### Main screen
![Skill screenshot](https://i.gyazo.com/3278c8e826ed31ea8b4e1363a44f052d.png)

### All flow
![Screen casting](https://i.gyazo.com/b792a849ae94fb8050610f5313672c1a.gif)


## How to use

1. Clone repository
2. Run the next commands:  
   - `npm run build` - to build the project
   - `npm run pack` - to get an artifact (.zip archive) for deployment
3. Find the `./dist/to-deploy.zip` file which as an artifact for Amazon Lambda
4. [Create](https://developer.amazon.com/en-US/docs/alexa/alexa-skills-kit-sdk-for-nodejs/develop-your-first-skill.html#create-lambda) your own Amazon Lambda function and upload `./dist/to-deploy.zip` to it.
5. [Create and configure](https://developer.amazon.com/en-US/docs/alexa/alexa-skills-kit-sdk-for-nodejs/develop-your-first-skill.html#create-configure-skill) your skill.
6. [Configure](https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/apl-support-for-your-skill.html) your skill to support the Alexa.Presentation.APL interface
7. [Test](https://developer.amazon.com/en-US/docs/alexa/alexa-skills-kit-sdk-for-nodejs/develop-your-first-skill.html#test-skill) your skill.


## Potential steps to improvements

1. Move all Lambda fuction content to `lambda` subdirectory
2. Implement CI/CD
